import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function MemberDepositsPage() {
  const currentYear = 2025;
  const depositRecords = [
    { month: "মার্চ", amount: 500, status: "PAID", date: "০১ মার্চ, ২০২৫" },
    { month: "ফেব্রুয়ারি", amount: 500, status: "PAID", date: "২৮ ফেব্রুয়ারি, ২০২৫" },
    { month: "জানুয়ারি", amount: 500, status: "PAID", date: "০২ জানুয়ারি, ২০২৫" },
  ];

  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="মাসিক জমা বিবরণী"
        subheading="আপনার মাসিক কিস্তি ও সঞ্চয় জমাদানের ইতিহাস"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs text-muted-foreground">মোট প্রদেয় জমা (২০২৫)</div>
          <div className="text-2xl font-bold text-foreground mt-1">৳ ১,৫০০</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs text-muted-foreground">বকেয়া কিস্তি</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">৳ ০ (পরিশোধিত)</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs text-muted-foreground">ধার্যকৃত মাসিক কিস্তি</div>
          <div className="text-2xl font-bold text-foreground mt-1">৳ ৫০০ / মাস</div>
        </div>
      </div>

      {/* Table view */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>মাসিক জমার তালিকা ({currentYear})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">মাস</th>
                  <th className="pb-3 font-semibold">নির্ধারিত পরিমাণ</th>
                  <th className="pb-3 font-semibold">জমাকৃত পরিমাণ</th>
                  <th className="pb-3 font-semibold">তারিখ</th>
                  <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                {depositRecords.map((rec, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{rec.month} ২০২৫</td>
                    <td className="py-3">৳ ৫০০</td>
                    <td className="py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      ৳ {rec.amount}
                    </td>
                    <td className="py-3 text-muted-foreground">{rec.date}</td>
                    <td className="py-3">
                      <Badge variant="success" className="text-[10px]">
                        পরিশোধিত
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
