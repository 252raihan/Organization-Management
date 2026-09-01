import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function MemberDonationsPage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="আমার অনুদান তালিকা"
        subheading="সংগঠনের বিভিন্ন ত্রাণ, চিকিৎসা ও শিক্ষা তহবিলে আপনার জমাকৃত অনুদান"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs text-muted-foreground">সর্বমোট অনুদান</div>
          <div className="text-2xl font-bold text-foreground mt-1">৳ ১,২০০</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs text-muted-foreground">অনুদানের সংখ্যা</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">২ বার</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span>অনুদানের বিবরণ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Heart}
            title="কোনো নতুন অনুদান নেই"
            description="ফেজ ১-এ অনুদান মডেল প্রস্তুত রয়েছে। বিস্তারিত অনুদান ট্র্যাকিং ফেজ ২-এ যুক্ত হবে।"
          />
        </CardContent>
      </Card>
    </div>
  );
}
