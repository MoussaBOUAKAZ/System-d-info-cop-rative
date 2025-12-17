import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions as any);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        // 1. Get messages for specific session
        if (sessionId) {
            const messages = await prisma.aIChatMessage.findMany({
                where: {
                    sessionId: sessionId,
                    session: { userId: session.user.id } // Security check
                },
                orderBy: { createdAt: 'asc' },
            });
            return NextResponse.json({ messages });
        }

        // 2. Get all sessions for user
        const sessions = await prisma.aIChatSession.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        return NextResponse.json({ sessions });

    } catch (error) {
        console.error("Chat History Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions as any);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
        }

        await prisma.aIChatSession.delete({
            where: {
                id: sessionId,
                userId: session.user.id // Security check
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Chat Deletion Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
