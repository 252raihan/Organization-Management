import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/constants";
import { Target, Users, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 font-bengali space-y-8">
      <PageHeader
        heading="আমাদের সম্পর্কে"
        subheading={`${APP_CONFIG.name} — সমাজ বিনির্মাণে একনিষ্ঠ স্বেচ্ছাসেবী প্ল্যাটফর্ম`}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">সংগঠনের লক্ষ্য ও মিশন</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              সমাজের প্রতিটি মানুষের মৌলিক অধিকার রক্ষা এবং এলাকার সার্বিক সামাজিক উন্নয়নে ভূমিকা রাখা। বিশেষ করে জরুরি স্বাস্থ্যসেবা, রক্তদান কার্যক্রম, এবং সামাজিক সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানো আমাদের প্রধান মিশন।
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">কার্যনির্বাহী ও সদস্যবৃন্দ</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              আমাদের সংগঠনের মূল চালিকাশক্তি হলো আমাদের নিবেদিতপ্রাণ সদস্য ও শুভাকাঙ্ক্ষীরা। প্রতি মাসে সদস্যদের নিয়মিত ক্ষুদ্র সঞ্চয়ের মাধ্যমে একটি স্থায়ী তহবিল গঠন করা হয় যা জরুরি মানবকল্যাণমূলক কাজে ব্যবহৃত হয়।
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-foreground font-semibold">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <span>আমাদের ঠিকানা ও অবস্থান</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {APP_CONFIG.address}
          </p>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
            * সংগঠনের স্থায়ী কার্যালয় এবং বিস্তারিত তথ্যাদি পরবর্তীতে হালনাগাদ করা হবে।
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
