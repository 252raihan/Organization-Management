"use client";

import React from "react";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  userName?: string;
  userRole?: string;
}

export function DashboardHeader({
  title = "ড্যাশবোর্ড",
  onMenuClick,
  userName = "ব্যবহারকারী",
  userRole = "MEMBER",
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6 font-bengali">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-bold text-foreground sm:text-xl line-clamp-1">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-background" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Info Placeholder */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-xs">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold leading-tight text-foreground">
              {userName}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">
              {userRole === "ADMIN" ? "অ্যাডমিন" : "সদস্য"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
