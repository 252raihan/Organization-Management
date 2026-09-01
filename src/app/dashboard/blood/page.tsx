import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Droplets } from "lucide-react";

export default function MemberBloodPage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="রক্তদাতা প্রোফাইল ও ইতিহাস"
        subheading="আপনার রক্তদান সংক্রান্ত তথ্য ও প্রাপ্যতা স্ট্যাটাস"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="h-5 w-5 text-rose-500" />
              <span>রক্তদাতা স্ট্যাটাস</span>
            </CardTitle>
            <CardDescription className="text-xs">জরুরি প্রয়োজনে প্রাপ্যতা</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                ✓ রক্তদানের জন্য প্রস্তুত
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1.5 pt-2">
              <div className="flex justify-between">
                <span>রক্তের গ্রুপ:</span>
                <span className="font-bold text-rose-600">O+ (পজিটিভ)</span>
              </div>
              <div className="flex justify-between">
                <span>সর্বশেষ রক্তদান:</span>
                <span className="text-foreground">১৫ অক্টোবর, ২০২৪</span>
              </div>
              <div className="flex justify-between">
                <span>মোট রক্তদান:</span>
                <span className="font-bold text-foreground">৩ বার</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">রক্তদানের ইতিহাস</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/50 text-sm">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল</div>
                  <div className="text-xs text-muted-foreground">রোগী: থ্যালাসেমিয়া সহায়তা</div>
                </div>
                <div className="text-xs text-muted-foreground">১৫ অক্টোবর, ২০২৪</div>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">ফুলবাড়িয়া উপজেলা স্বাস্থ্য কমপ্লেক্স</div>
                  <div className="text-xs text-muted-foreground">জরুরি প্রসূতি সেবা</div>
                </div>
                <div className="text-xs text-muted-foreground">০২ জুন, ২০২৪</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
