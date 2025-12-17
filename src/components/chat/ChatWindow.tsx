"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Loader2, Send, Trash2, X, MessageSquare } from "lucide-react";
import { ChatMode } from "@/lib/chat-prompts";

interface ChatWindowProps {
    onClose: () => void;
}

interface Message {
    id?: string;
    role: "user" | "assistant" | "system";
    content: string;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [mode, setMode] = useState<ChatMode>("general");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load history on mount
    useEffect(() => {
        fetchHistory();
    }, []);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const fetchHistory = async () => {
        try {
            // First try to get the most recent session
            const res = await fetch("/api/chat/history");
            const data = await res.json();

            if (data.sessions && data.sessions.length > 0) {
                const lastSession = data.sessions[0];
                setSessionId(lastSession.id);
                setMode((lastSession.mode as ChatMode) || "general");

                // Fetch messages for this session
                const msgRes = await fetch(`/api/chat/history?sessionId=${lastSession.id}`);
                const msgData = await msgRes.json();
                if (msgData.messages) {
                    setMessages(msgData.messages);
                }
            }
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.content,
                    mode: mode,
                    sessionId: sessionId,
                }),
            });

            const data = await res.json();

            if (data.sessionId) {
                setSessionId(data.sessionId);
            }

            if (data.response) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
            } else if (data.error) {
                setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
            }

        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        setMessages([]);
        setSessionId(null);
        setInput("");
        // Optionally delete the session from DB if needed, but for now just clear local state for new session
    };

    return (
        <Card className="w-[380px] h-[600px] flex flex-col shadow-xl border-primary/20 bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-bold">AI Assistant</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleReset} title="New Chat">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>

            {/* Mode Selector */}
            <div className="px-4 py-2 border-b bg-muted/30">
                <Select value={mode} onValueChange={(val) => setMode(val as ChatMode)}>
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="faq">FAQ Assistant</SelectItem>
                        <SelectItem value="tutor">Tutor / Guide</SelectItem>
                        <SelectItem value="support">Customer Support</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <CardContent className="flex-1 p-0 overflow-hidden relative">
                <ScrollArea className="h-full p-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm mt-10">
                            <p>How can I help you today?</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`flex flex-col max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground ml-2"
                                        : "bg-muted text-foreground mr-2"
                                        }`}
                                >
                                    <span className="whitespace-pre-wrap">{msg.content}</span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-3 border-t bg-muted/10">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex w-full gap-2"
                >
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
