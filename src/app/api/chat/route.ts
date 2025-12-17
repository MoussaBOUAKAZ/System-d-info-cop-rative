import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import { CHAT_PROMPTS, ChatMode } from "../../../lib/chat-prompts";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions as any);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { message, mode = 'general', sessionId } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        let currentSessionId = sessionId;

        // 1. Create session if not exists
        if (!currentSessionId) {
            const newSession = await prisma.aIChatSession.create({
                data: {
                    userId: session.user.id,
                    mode: mode,
                    title: message.substring(0, 50) + "...",
                },
            });
            currentSessionId = newSession.id;
        }

        // 2. Save User Message
        await prisma.aIChatMessage.create({
            data: {
                sessionId: currentSessionId,
                role: 'user',
                content: message,
            },
        });

        // 3. Fetch History (Last 10 messages for context)
        const history = await prisma.aIChatMessage.findMany({
            where: { sessionId: currentSessionId },
            orderBy: { createdAt: 'asc' },
            take: 10,
        });

        const messagesForLLM = history.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // 4. Add System Prompt
        const systemPrompt = CHAT_PROMPTS[mode as ChatMode] || CHAT_PROMPTS['general'];
        messagesForLLM.unshift({ role: 'system', content: systemPrompt });

        // 5. Call LM Studio
        try {
            const lmResponse = await fetch('http://192.168.56.1:1234/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messagesForLLM,
                    temperature: 0.7,
                    max_tokens: -1,
                    stream: false // For MVP, no streaming yet to ensure easier DB sync
                }),
            });

            if (!lmResponse.ok) {
                throw new Error(`LM Studio error: ${lmResponse.statusText}`);
            }

            const lmData = await lmResponse.json();
            const assistantMessage = lmData.choices[0].message.content;

            // 6. Save Assistant Response
            const savedAssistantMsg = await prisma.aIChatMessage.create({
                data: {
                    sessionId: currentSessionId,
                    role: 'assistant',
                    content: assistantMessage,
                },
            });

            return NextResponse.json({
                response: assistantMessage,
                sessionId: currentSessionId,
                messageId: savedAssistantMsg.id
            });

        } catch (llmError) {
            console.error("LM Studio Error:", llmError);
            // Fallback
            const fallbackMsg = "I'm having trouble connecting to my brain (LM Studio). Please ensure the local server is running.";
            await prisma.aIChatMessage.create({
                data: {
                    sessionId: currentSessionId,
                    role: 'assistant',
                    content: fallbackMsg,
                },
            });
            return NextResponse.json({
                response: fallbackMsg,
                sessionId: currentSessionId,
                error: "LLM_CONNECTION_FAILED"
            });
        }

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
