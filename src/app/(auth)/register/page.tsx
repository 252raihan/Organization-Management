"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Phone, MapPin, Lock, UserPlus, Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants";
import { registerMember } from "@/app/actions/register";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    presentAddress: "",
    permanentAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (formData.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।");
      return;
    }

    if (!formData.bloodGroup) {
      setError("রক্তের গ্রুপ নির্বাচন করুন।");
      return;
    }

    startTransition(async () => {
      try {
        const result = await registerMember({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          bloodGroup: formData.bloodGroup,
          presentAddress: formData.presentAddress.trim(),
          permanentAddress: formData.permanentAddress.trim() || undefined,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        if (!result.success) {
          setError(result.error || "নিবন্ধন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
          return;
        }

        setSuccessMsg(
          result.message || "নিবন্ধন সম্পন্ন হয়েছে! আপনাকে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে..."
        );
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      } catch {
        setError("একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে পুনরায় চেষ্টা করুন।");
      }
    });
  };

  return (
    <Card className="shadow-lg border-border/80">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 mb-2">
          <UserPlus className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">সদস্য আবেদন ফর্ম</CardTitle>
        <CardDescription className="text-xs">
          সংগঠনের সদস্য হতে আপনার সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-900/60">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-900/60">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              পূর্ণ নাম (বাংলায়/ইংরেজিতে) *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="আপনার নাম লিখুন"
                className="pl-9"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="017XXXXXXXX"
                  className="pl-9 font-mono"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                ইমেইল এড্রেস (ঐচ্ছিক)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className="pl-9"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              রক্তের গ্রুপ *
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">নির্বাচন করুন</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              বর্তমান ঠিকানা / গ্রাম *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleChange}
                placeholder="গ্রাম/এলাকা, এনায়েতপুর, ফুলবাড়িয়া"
                className="pl-9"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                পাসওয়ার্ড * (কমপক্ষে ৬ অক্ষর)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-9 font-mono"
                  required
                  minLength={6}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                পাসওয়ার্ড নিশ্চিত করুন *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-9 font-mono"
                  required
                  minLength={6}
                  disabled={isPending}
                />
              </div>
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
                  <span>আবেদন জমা হচ্ছে...</span>
                </>
              ) : (
                <span>আবেদন জমা দিন</span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/40 py-4 text-xs text-muted-foreground">
        <span>ইতোমধ্যে নিবন্ধিত? </span>
        <Link href="/login" className="ml-1 font-semibold text-emerald-600 hover:underline">
          লগইন করুন
        </Link>
      </CardFooter>
    </Card>
  );
}
