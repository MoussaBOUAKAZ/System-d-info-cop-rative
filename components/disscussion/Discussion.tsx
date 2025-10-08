"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  User2,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  X,
} from "lucide-react";

type Conversation = {
  id: string;
  isGroup: boolean;
  name: string | null;
  participants: Array<{
    user: { id: string; name: string | null; email: string | null };
  }>;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string | null; email: string | null };
};

const MOCK_USER_ID = "user-1";

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    isGroup: false,
    name: null,
    participants: [
      { user: { id: "user-1", name: "Vous", email: "vous@example.com" } },
      {
        user: {
          id: "user-2",
          name: "Marie Dubois",
          email: "marie@example.com",
        },
      },
    ],
  },
  {
    id: "conv-2",
    isGroup: true,
    name: "Équipe Marketing",
    participants: [
      { user: { id: "user-1", name: "Vous", email: "vous@example.com" } },
      {
        user: { id: "user-3", name: "Jean Martin", email: "jean@example.com" },
      },
      {
        user: {
          id: "user-4",
          name: "Sophie Laurent",
          email: "sophie@example.com",
        },
      },
    ],
  },
  {
    id: "conv-3",
    isGroup: false,
    name: null,
    participants: [
      { user: { id: "user-1", name: "Vous", email: "vous@example.com" } },
      {
        user: {
          id: "user-5",
          name: "Pierre Durand",
          email: "pierre@example.com",
        },
      },
    ],
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      content: "Bonjour, comment allez-vous ?",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      senderId: "user-2",
      sender: {
        id: "user-2",
        name: "Marie Dubois",
        email: "marie@example.com",
      },
    },
    {
      id: "msg-2",
      content: "Très bien merci ! Et vous ?",
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      senderId: "user-1",
      sender: { id: "user-1", name: "Vous", email: "vous@example.com" },
    },
    {
      id: "msg-3",
      content: "Parfait ! Je voulais discuter du projet avec vous.",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      senderId: "user-2",
      sender: {
        id: "user-2",
        name: "Marie Dubois",
        email: "marie@example.com",
      },
    },
  ],
  "conv-2": [
    {
      id: "msg-4",
      content: "Bonjour à tous ! Réunion demain à 10h.",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      senderId: "user-3",
      sender: { id: "user-3", name: "Jean Martin", email: "jean@example.com" },
    },
    {
      id: "msg-5",
      content: "Parfait, je serai là !",
      createdAt: new Date(Date.now() - 6000000).toISOString(),
      senderId: "user-1",
      sender: { id: "user-1", name: "Vous", email: "vous@example.com" },
    },
  ],
  "conv-3": [
    {
      id: "msg-6",
      content: "Salut ! Tu as reçu mon email ?",
      createdAt: new Date(Date.now() - 900000).toISOString(),
      senderId: "user-5",
      sender: {
        id: "user-5",
        name: "Pierre Durand",
        email: "pierre@example.com",
      },
    },
  ],
};
const { useSession } = require("next-auth/react");
export default function Discussion() {
  const [showSearch, setShowSearch] = useState(false);
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "group" | "friend">("all");
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messagesCache, setMessagesCache] =
    useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMessege, setSearchMessege] = useState("");
  const { data: session } = useSession();
  const pollRef = useRef<number | null>(null);
  const currentUserId = (session?.user as any)?.id;

  async function loadConversations() {
    const res = await fetch("/api/messages/conversations", {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await res.json();
    setConversations(Array.isArray(data) ? data : []);
  }

  async function loadMessages(id: string) {
    setLoadingMessages(true);
    const res = await fetch(`/api/messages/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    setMessages(list);
    setMessagesCache((prev) => ({ ...prev, [id]: list }));
    setLoadingMessages(false);
  }

  useEffect(() => {
    if (!activeId) return;
    if (messagesCache[activeId]) {
      setMessages(messagesCache[activeId]);
    } else {
      loadMessages(activeId);
    }
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(() => loadMessages(activeId), 3000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [activeId]);
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // function send() {
  //   if (!activeId || input.trim().length === 0) return;

  //   const newMessage: Message = {
  //     id: `msg-${Date.now()}`,
  //     content: input.trim(),
  //     createdAt: new Date().toISOString(),
  //     senderId: currentUserId,
  //     sender: { id: currentUserId, name: "Vous", email: "vous@example.com" },
  //   };

  //   const updatedMessages = [...(messagesCache[activeId] || []), newMessage];
  //   setMessagesCache((prev) => ({ ...prev, [activeId]: updatedMessages }));
  //   setMessages(updatedMessages);
  //   setInput("");
  // }
  async function send() {
    if (!activeId || input.trim().length === 0) return;
    const res = await fetch(`/api/messages/${activeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.ok) {
      setInput("");
      await loadMessages(activeId);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  function getConversationName(conversation: Conversation) {
    if (conversation.isGroup) {
      return conversation.name ?? "Groupe";
    }
    const otherParticipant = conversation.participants.find(
      (p) => p.user.id !== currentUserId
    );
    return (
      otherParticipant?.user?.name ??
      otherParticipant?.user?.email ??
      "Utilisateur"
    );
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const filteredConversations = conversations
    .filter((c) =>
      filter === "all" ? true : filter === "group" ? c.isGroup : !c.isGroup
    )
    .filter((c) =>
      getConversationName(c).toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredMessages = searchMessege
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchMessege.toLowerCase())
      )
    : messages;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[22rem_1fr] h-[calc(100vh-12rem)]  border border-border rounded-lg overflow-hidden bg-card">
      <div className="border-r border-border/50 flex flex-col bg-card">
        <div className="p-4 border-b border-border/50 space-y-3">
          <div className="flex items-center gap-2">
            {["all", "group", "friend"].map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "ghost"}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setFilter(type as any)}
              >
                {type === "all"
                  ? "Tout"
                  : type === "group"
                  ? "Groupes"
                  : "Directs"}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <User2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Aucune conversation trouvée
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1 overflow-y-auto">
              {filteredConversations.map((c) => {
                const name = getConversationName(c);
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-3 py-3 rounded-lg hover:bg-accent/50 transition-all ${
                      activeId === c.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{name}</p>
                          {c.isGroup && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              Groupe
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {c.isGroup
                            ? `${c.participants.length} membres`
                            : "Cliquez pour ouvrir"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col bg-background overflow-hidden">
        {activeId ? (
          (() => {
            const activeConversation = conversations.find(
              (c) => c.id === activeId
            );
            const conversationName = activeConversation
              ? getConversationName(activeConversation)
              : "";

            return (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveId(null)}
                      className="lg:hidden"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(conversationName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-sm">
                        {conversationName}
                      </h2>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {activeConversation?.isGroup ? (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/50" />
                            {activeConversation.participants.length} membres
                          </>
                        ) : (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                            En ligne
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSearch(!showSearch)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {showSearch && (
                  <div className="px-6 py-3 border-b bg-muted/30">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans la conversation..."
                        value={searchMessege}
                        onChange={(e) => setSearchMessege(e.target.value)}
                        className="pl-9 text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => {
                          setSearchMessege("");
                          setShowSearch(false);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {loadingMessages && !messages.length ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Chargement des messages...
                        </p>
                      </div>
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <User2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {searchMessege
                            ? "Aucun message trouvé"
                            : "Aucun message pour le moment"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {!searchMessege && "Envoyez le premier message"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    filteredMessages.map((m, index) => {
                      const isCurrentUser = m.senderId === currentUserId;
                      const prevMessage = filteredMessages[index - 1];
                      const showAvatar =
                        !prevMessage || prevMessage.senderId !== m.senderId;

                      return (
                        <div
                          key={m.id}
                          className={`flex gap-3 ${
                            isCurrentUser ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          {!isCurrentUser && (
                            <Avatar
                              className={`h-8 w-8 ${
                                !showAvatar && "invisible"
                              }`}
                            >
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(
                                  m.sender.name ??
                                    m.sender.email ??
                                    "Utilisateur"
                                )}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`flex flex-col max-w-[70%] ${
                              isCurrentUser ? "items-end" : "items-start"
                            }`}
                          >
                            {showAvatar && !isCurrentUser && (
                              <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="text-xs font-medium text-foreground">
                                  {m.sender.name ??
                                    m.sender.email ??
                                    "Utilisateur"}
                                </span>
                              </div>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-2.5 ${
                                isCurrentUser
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-muted text-foreground rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words w-auto max-w-[500px]">
                                {m.content}
                              </p>
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-1 px-1">
                              {formatDate(m.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-6 py-4 border-t border-border/50 bg-card">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Écrivez votre message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send();
                          }
                        }}
                        className="pr-10 resize-none"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={send}
                      disabled={input.trim().length === 0}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 px-1">
                    Appuyez sur Entrée pour envoyer, Maj+Entrée pour une
                    nouvelle ligne
                  </p>
                </div>
              </>
            );
          })()
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <User2 className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez une conversation dans la liste pour commencer à
                discuter avec votre équipe ou vos clients
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
