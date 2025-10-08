"use client";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { signOut } from "next-auth/react" // <-- Ajoute cet import
import { useSession } from "next-auth/react";

type DashboardHeaderProps = {
  onButtonClick: (value:string) => void;
};

export function DashboardHeader({ onButtonClick }: DashboardHeaderProps) {
   const { data: session, status } = useSession(); 
  const user = session?.user; 

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des clients, deals..."
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user?.name
                      ? user.name
                      : "?"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onButtonClick("monCompte") } >Mon compte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onButtonClick('parametres')}>Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Déconnexion
              </DropdownMenuItem>{" "}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
