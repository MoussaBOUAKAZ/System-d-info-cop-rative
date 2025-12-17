"use client";


import { Button } from "../../../components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { useChatStore } from "../../hooks/use-chat-store";

export function ChatWidget() {
    const { isOpen, open, close } = useChatStore();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {isOpen && (
                <div className="mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <ChatWindow onClose={close} />
                </div>
            )}

            {!isOpen && (
                <Button
                    onClick={open}
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                    <MessageCircle className="h-7 w-7" />
                </Button>
            )}
        </div>
    );
}
