import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ShieldCheck, AlertCircle } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/constants";

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 font-bengali space-y-8">
      <PageHeader
        heading="অনুদানের মাধ্যমে পাশে থাকুন"
        subheading="আপনার ক্ষুদ্র অনুদান অসহায় ও দুস্থ মানুষের মুখে হাসি ফোটাতে সাহায্য করবে।"
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                <span>অফিসিয়াল পেমেন্ট মাধ্যমসমূহ (প্লেসহোল্ডার)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_METHODS.map((pm) => (
                  <div key={pm.value} className="rounded-lg border border-border/70 p-4 bg-muted/20 space-y-1">
                    <div className="text-sm font-semibold text-foreground">{pm.label}</div>
                    <div className="text-xs text-muted-foreground font-mono">০১৭১২-XXXXXX (ব্যক্তিগত/মার্চেন্ট)</div>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      সেন্ড মানি / ক্যাশ ইন
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-4 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <p className="font-semibold">ফেজ ১ নিরাপত্তা ও স্বচ্ছতা বিজ্ঞপ্তি:</p>
                  <p>এটি প্রাথমিক ডিজাইন কাঠামো। স্বয়ংক্রিয় পেমেন্ট ভেরিফিকেশন ও ট্রানজেকশন জমাদান ফর্ম ফেজ ২-এ চালু করা হবে।</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>স্বচ্ছতার অঙ্গীকার</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>• প্রতিটি অনুদানের ডিজিটাল রশিদ প্রদান করা হবে।</p>
              <p>• তহবিলের সার্বিক আয়-ব্যয়ের হিসাব নিয়মিত ওয়েবসাইটে প্রকাশ করা হবে।</p>
              <p>• যেকোনো আর্থিক অসঙ্গতির বিরুদ্ধে সংগঠনের জিরো টলারেন্স নীতি বিদ্যমান।</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
