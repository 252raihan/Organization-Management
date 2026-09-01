import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function MemberSettingsPage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="অ্যাকাউন্ট সেটিংস"
        subheading="পাসওয়ার্ড ও অ্যাকাউন্ট সেটিংস পরিবর্তন করুন"
      />

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>পাসওয়ার্ড পরিবর্তন</span>
            </CardTitle>
            <CardDescription className="text-xs">
              নিয়মিত পাসওয়ার্ড পরিবর্তন করে অ্যাকাউন্ট সুরক্ষিত রাখুন
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">বর্তমান পাসওয়ার্ড</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">নতুন পাসওয়ার্ড</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button disabled className="bg-emerald-600 text-white">
              পাসওয়ার্ড আপডেট করুন (ফেজ ২)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
