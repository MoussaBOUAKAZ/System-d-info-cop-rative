"use client"

import { useState } from "react"
import { LayoutDashboard, Users, Package, TrendingUp, Calendar, FileText, Settings, ChevronLeft, MessageSquare, Activity, Bot } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"

const navigation = [
  { name: "Tableau de bord", icon: LayoutDashboard, current: true },
  { name: "Clients", icon: Users, current: false },
  { name: "Produits & Services", icon: Package, current: false },
  { name: "Calendrier", icon: Calendar, current: false },
  { name: "Rapportes", icon: FileText, current: false },
  { name: "Discussion", icon: MessageSquare, current: false },
  { name: "interaction", icon: Activity, current: false },
  { name: "Chat IA Assistant", icon: Bot, current: false },
  { name: "Paramètres", icon: Settings, current: false },
]

type DashboardSidebarProps = {
  onButtonClick: (value: string) => void;
};

import { useChatStore } from "../src/hooks/use-chat-store";

export function DashboardSidebar({ onButtonClick }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { open: openChat } = useChatStore();

  return (
    <aside className={cn("border-r bg-sidebar transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CRM</span>
            </div>
            <span className="font-semibold text-lg">Toho Pro</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="p-3 space-y-1">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={item.current ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}
            onClick={() => {
              item.current = true;
              navigation.forEach(navItem => {
                if (navItem !== item) navItem.current = false;
              });
              if (item.name === "Chat IA Assistant") {
                openChat();
              }
              onButtonClick(item.name)
            }
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
