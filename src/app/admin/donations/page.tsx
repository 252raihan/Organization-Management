import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDonationsPage() {
  const dummyDonations = [
    { donor: "ডা. শামীম আহমেদ", type: "চিকিৎসা সহায়তা", amount: 15000, date: "২৪ ফেব্রুয়ারি, ২০২৫" },
    { donor: "ইঞ্জি. মোস্তফা কামাল", type: "শিক্ষা তহবিল", amount: 10000, date: "২০ ফেব্রুয়ারি, ২০২৫" },
    { donor: "নাম প্রকাশে অনিচ্ছুক", type: "সাধারণ অনুদান", amount: 5000, date: "১৫ ফেব্রুয়ারি, ২০২৫" },
  ];

  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="অনুদান ও কল্যাণ তহবিল"
        subheading="সংগঠনের বিশেষ ও সাধারণ অনুদানের তালিকা এবং রেকর্ড"
      >
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
          <Plus className="h-4 w-4" />
          <span>নতুন অনুদান যোগ করুন</span>
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span>সংগৃহীত অনুদানের তালিকা</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">দাতার নাম</th>
                  <th className="pb-3 font-semibold">অনুদানের খাত</th>
                  <th className="pb-3 font-semibold">পরিমাণ</th>
                  <th className="pb-3 font-semibold">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                {dummyDonations.map((d, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{d.donor}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">
                        {d.type}
                      </Badge>
                    </td>
                    <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      ৳ {d.amount.toLocaleString("bn-BD")}
                    </td>
                    <td className="py-3 text-muted-foreground">{d.date}</td>
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
