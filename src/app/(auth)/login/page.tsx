"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { loginUser } from "@/app/actions/login";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("মোবাইল নম্বর বা ইমেইল এড্রেস লিখুন।");
      return;
    }

    if (!password) {
      setError("পাসওয়ার্ড দিন।");
      return;
    }

    startTransition(async () => {
      try {
        const result = await loginUser({
          identifier: identifier.trim(),
          password,
        });

        if (!result.success) {
          setError(result.error || "লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করে আবার চেষ্টা করুন।");
          return;
        }

        const target = callbackUrl || result.redirectTo || "/dashboard";
        router.push(target);
        router.refresh();
      } catch {
        setError("একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।");
      }
    });
  };

  return (
    <Card className="shadow-lg border-border/80">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 mb-2">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">লগইন করুন</CardTitle>
        <CardDescription className="text-xs">
          আপনার মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে প্রবেশ করুন
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-900/60">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              মোবাইল নম্বর বা ইমেইল
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="017XXXXXXXX বা user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isPending}
                className="pl-9 font-mono text-sm"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">পাসওয়ার্ড</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="pl-9 font-mono text-sm"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>প্রবেশ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>প্রবেশ করুন</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/40 py-4 text-xs text-muted-foreground">
        <span>নতুন সদস্য? </span>
        <Link href="/register" className="ml-1 font-semibold text-emerald-600 hover:underline">
          রেজিস্ট্রেশন করুন
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">লোড হচ্ছে...</div>}>
      <LoginForm />
    </Suspense>
  );
}
