import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BLOOD_GROUPS } from "@/lib/constants";
import { Droplets, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BloodSearchPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 font-bengali space-y-8">
      <PageHeader
        heading="জরুরি রক্তের সন্ধান"
        subheading="এনায়েতপুর, ফুলবাড়িয়া ও আশেপাশের এলাকার জন্য রক্তদাতা অনুসন্ধান প্ল্যাটফর্ম (ফেজ ১ প্রিভিউ)"
      />

      {/* Blood Group Quick Selection Placeholders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {BLOOD_GROUPS.map((bg) => (
          <div
            key={bg.value}
            className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card p-4 text-center transition-all hover:border-rose-500 hover:shadow-sm"
          >
            <Droplets className="h-6 w-6 text-rose-500 mb-1" />
            <span className="text-lg font-bold text-foreground">{bg.label}</span>
          </div>
        ))}
      </div>

      {/* Search Input Placeholder */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>এলাকা বা ইউনিয়ন লিখে খুঁজুন (ফেজ ২-এ সচল হবে)...</span>
            </div>
            <Button disabled className="bg-emerald-600 text-white">
              অনুসন্ধান করুন
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notice info */}
      <EmptyState
        icon={Droplets}
        title="রক্তদাতা অনুসন্ধান ও ফিল্টারিং সিস্টেম (ফেজ ২)"
        description="ফেজ ১-এ ডাটাবেজ মডেল এবং আর্কিটেকচার তৈরি সম্পন্ন হয়েছে। ফেজ ২-এ পূর্ণাঙ্গ লাইভ সার্চ এবং ফিল্টারিং সংযুক্ত হবে।"
      />
    </div>
  );
}
