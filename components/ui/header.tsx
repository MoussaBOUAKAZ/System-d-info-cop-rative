"use client";

import { Button } from "./button";
import { Search, Bell, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className=" flex justify-between  items-center ">
      {(title || description) && (
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex  items-center gap-3">
                    {action && (
            <Button onClick={action.onClick} className="gap-2">
              <Plus className="h-4 w-4" />
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
