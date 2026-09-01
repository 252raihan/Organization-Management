"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Wallet,
  Receipt,
  Heart,
  Droplets,
  Settings,
  HeartHandshake,
  LogOut,
  X,
} from "lucide-react";
import { MEMBER_NAV_ITEMS, APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/app/actions/login";

const iconMap = {
  LayoutDashboard,
  User,
  Wallet,
  Receipt,
  Heart,
  Droplets,
  Settings,
};

interface DashboardSidebarProps {
  onClose?: () => void;
  className?: string;
}

export function DashboardSidebar({ onClose, className }: DashboardSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between border-r border-border/60 bg-card p-4 font-bengali",
        className
      )}
    >
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight text-foreground line-clamp-1">
                {APP_CONFIG.shortName} সদস্য প্যানেল
              </span>
              <span className="text-[11px] text-muted-foreground">সদস্য ড্যাশবোর্ড</span>
            </div>
          </Link>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {MEMBER_NAV_ITEMS.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <IconComponent className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout Button */}
      <div className="border-t border-border/60 pt-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
        >
          <LogOut className="h-4 w-4" />
          <span>লগআউট</span>
        </Button>
      </div>
    </aside>
  );
}
