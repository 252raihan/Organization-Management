import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ShieldCheck } from "lucide-react";

export default function MemberProfilePage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="আমার প্রোফাইল"
        subheading="আপনার ব্যক্তিগত ও সাংগঠনিক তথ্যাবলী"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="text-center md:col-span-1">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-3xl shadow-inner">
              তা
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">তানভীর হাসান</h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">GSWO-M042</p>
              <Badge variant="success" className="mt-2 text-xs">
                সক্রিয় সদস্য
              </Badge>
            </div>
            <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>যোগদান: ০১ জানুয়ারি, ২০২৪</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>ভূমিকা: সাধারণ সদস্য</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">ব্যক্তিগত তথ্য</CardTitle>
              <CardDescription className="text-xs">
                আপনার ডাটাবেজে সংরক্ষিত বিস্তারিত তথ্য
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                  <div className="text-xs text-muted-foreground">পিতার নাম</div>
                  <div className="font-semibold text-foreground mt-0.5">মোঃ রফিকুল ইসলাম</div>
                </div>
                <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                  <div className="text-xs text-muted-foreground">মাতার নাম</div>
                  <div className="font-semibold text-foreground mt-0.5">মোছাঃ ফাতেমা বেগম</div>
                </div>
                <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                  <div className="text-xs text-muted-foreground">মোবাইল নম্বর</div>
                  <div className="font-semibold text-foreground mt-0.5 font-mono">01812-345678</div>
                </div>
                <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                  <div className="text-xs text-muted-foreground">রক্তের গ্রুপ</div>
                  <div className="font-semibold text-rose-600 dark:text-rose-400 mt-0.5">O+ (পজিটিভ)</div>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-xs text-muted-foreground">বর্তমান ঠিকানা</div>
                <div className="font-semibold text-foreground mt-0.5">
                  গ্রাম: এনায়েতপুর, ডাকঘর: এনায়েতপুর, উপজেলা: ফুলবাড়িয়া, জেলা: ময়মনসিংহ
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
