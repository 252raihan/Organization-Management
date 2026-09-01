import React from "react";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_CONFIG } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-muted/20 font-bengali">
      {/* Top Header */}
      <div className="container mx-auto flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <span className="font-bold text-foreground sm:text-base text-sm">
            {APP_CONFIG.name}
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Content Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Bottom Footer */}
      <div className="py-4 text-center text-xs text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} {APP_CONFIG.name}। {APP_CONFIG.address}
      </div>
    </div>
  );
}
