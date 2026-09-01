"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  Heart,
  Droplets,
  Image as ImageIcon,
  BarChart3,
  Settings,
  FileText,
  ShieldAlert,
  LogOut,
  X,
} from "lucide-react";
import { ADMIN_NAV_ITEMS, APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logoutUser } from "@/app/actions/login";

const adminIconMap = {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  Heart,
  Droplets,
  Image: ImageIcon,
  BarChart3,
  Settings,
  FileText,
};

interface AdminSidebarProps {
  onClose?: () => void;
  className?: string;
}

export function AdminSidebar({ onClose, className }: AdminSidebarProps) {
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
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-emerald-600 shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight text-foreground line-clamp-1">
                {APP_CONFIG.shortName} অ্যাডমিন
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                  ম্যানেজমেন্ট
                </Badge>
              </div>
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
          {ADMIN_NAV_ITEMS.map((item) => {
            const IconComponent = adminIconMap[item.icon as keyof typeof adminIconMap] || LayoutDashboard;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-emerald-600 shadow-sm"
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

      {/* Footer / Logout */}
      <div className="border-t border-border/60 pt-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full justify-start gap-2 text-xs"
        >
          <Link href="/dashboard">
            <span>সদস্য ভিউতে যান</span>
          </Link>
        </Button>
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
