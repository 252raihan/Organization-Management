import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, UserPlus } from "lucide-react";

export default function AdminBloodDonorsPage() {
  const dummyDonors = [
    { name: "মুহাম্মদ আল-আমিন", blood: "O+", phone: "01712-345678", union: "এনায়েতপুর", total: 4, available: true },
    { name: "তানভীর হাসান", blood: "A+", phone: "01812-345678", union: "এনায়েতপুর", total: 3, available: true },
    { name: "রাশেদুল ইসলাম", blood: "B+", phone: "01912-345678", union: "ফুলবাড়িয়া সদর", total: 2, available: false },
  ];

  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="রক্তদাতা রেজিস্ট্রি"
        subheading="এলাকার রক্তদাতাদের তথ্যভাণ্ডার ও প্রাপ্যতা ব্যবস্থাপনা"
      >
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
          <UserPlus className="h-4 w-4" />
          <span>রক্তদাতা যোগ করুন</span>
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Droplets className="h-4 w-4 text-rose-500" />
            <span>নিবন্ধিত রক্তদাতাদের তালিকা</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">নাম</th>
                  <th className="pb-3 font-semibold">গ্রুপ</th>
                  <th className="pb-3 font-semibold">মোবাইল</th>
                  <th className="pb-3 font-semibold">এলাকা</th>
                  <th className="pb-3 font-semibold">মোট দান</th>
                  <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                {dummyDonors.map((d, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{d.name}</td>
                    <td className="py-3 font-bold text-rose-600">{d.blood}</td>
                    <td className="py-3 font-mono text-muted-foreground">{d.phone}</td>
                    <td className="py-3 text-muted-foreground">{d.union}</td>
                    <td className="py-3">{d.total} বার</td>
                    <td className="py-3">
                      <Badge variant={d.available ? "success" : "secondary"} className="text-[10px]">
                        {d.available ? "প্রস্তুত" : "অনুপলব্ধ"}
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
