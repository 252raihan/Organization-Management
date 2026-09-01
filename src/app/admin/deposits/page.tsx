import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

export default function AdminDepositsPage() {
  const dummyDeposits = [
    { code: "GSWO-001", name: "মোহাম্মদ শফিকুল ইসলাম", month: "মার্চ ২০২৫", amount: 500, status: "PAID" },
    { code: "GSWO-002", name: "আহমেদ জুবায়ের", month: "মার্চ ২০২৫", amount: 500, status: "PAID" },
    { code: "GSWO-003", name: "মুস্তাফিজুর রহমান", month: "মার্চ ২০২৫", amount: 0, status: "DUE" },
  ];

  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="মাসিক জমা রেজিস্টার"
        subheading="সংগঠনের সকল সদস্যের মাসিক কিস্তি ও জমার হিসাব বিবরণী"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-600" />
            <span>জমা রেজিস্টার (মার্চ ২০২৫)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">সদস্য আইডি</th>
                  <th className="pb-3 font-semibold">নাম</th>
                  <th className="pb-3 font-semibold">মাস</th>
                  <th className="pb-3 font-semibold">জমাকৃত টাকা</th>
                  <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                {dummyDeposits.map((d, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-mono font-medium">{d.code}</td>
                    <td className="py-3 font-medium text-foreground">{d.name}</td>
                    <td className="py-3 text-muted-foreground">{d.month}</td>
                    <td className="py-3 font-semibold">৳ {d.amount}</td>
                    <td className="py-3">
                      <Badge
                        variant={d.status === "PAID" ? "success" : "destructive"}
                        className="text-[10px]"
                      >
                        {d.status === "PAID" ? "পরিশোধিত" : "বকেয়া"}
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
