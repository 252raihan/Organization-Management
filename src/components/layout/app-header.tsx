"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HeartHandshake, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "হোম" },
    { href: "/about", label: "আমাদের সম্পর্কে" },
    { href: "/blood-search", label: "রক্ত খুঁজুন" },
    { href: "/donate", label: "অনুদান" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bengali font-bold text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight sm:text-lg text-emerald-950 dark:text-emerald-300">
              {APP_CONFIG.name}
            </span>
            <span className="text-xs font-normal text-muted-foreground hidden sm:inline-block">
              {APP_CONFIG.address}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 font-bengali">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5 font-bengali">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="gap-1.5 font-medium">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              <span>লগইন</span>
            </Link>
          </Button>
          <Button size="sm" asChild className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            <Link href="/register">
              <UserPlus className="h-4 w-4" />
              <span>সদস্য হোন</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-md px-4 py-4 font-bengali shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
            <Button
              variant="outline"
              asChild
              className="w-full justify-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span>লগইন</span>
              </Link>
            </Button>
            <Button
              asChild
              className="w-full justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/register">
                <UserPlus className="h-4 w-4" />
                <span>সদস্য হোন</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
