import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Check, X } from "lucide-react";
import { MOCK_RECENT_PAYMENTS } from "@/lib/mock-data";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="পেমেন্ট অনুমোদন ও যাচাইকরণ"
        subheading="বিকাশ, নগদ বা ব্যাংকে প্রাপ্ত লেনদেন যাচাই করে অনুমোদন দিন"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Receipt className="h-4 w-4 text-emerald-600" />
            <span>সকল জমাকৃত পেমেন্ট তালিকা</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3 font-semibold">সদস্যের নাম</th>
                  <th className="pb-3 font-semibold">মেথড</th>
                  <th className="pb-3 font-semibold">TrxID</th>
                  <th className="pb-3 font-semibold">পরিমাণ</th>
                  <th className="pb-3 font-semibold">তারিখ</th>
                  <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                  <th className="pb-3 font-semibold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                {MOCK_RECENT_PAYMENTS.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{p.memberName}</td>
                    <td className="py-3 text-muted-foreground">{p.method}</td>
                    <td className="py-3 font-mono font-medium">{p.trxId}</td>
                    <td className="py-3 font-bold">৳ {p.amount}</td>
                    <td className="py-3 text-muted-foreground">{p.date}</td>
                    <td className="py-3">
                      <Badge
                        variant={p.status === "VERIFIED" ? "success" : "warning"}
                        className="text-[10px]"
                      >
                        {p.status === "VERIFIED" ? "অনুমোদিত" : "অপেক্ষমাণ"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      {p.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-emerald-600">
                            <Check className="h-3.5 w-3.5 mr-1" /> অনুমোদন
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-rose-600">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">সম্পন্ন</span>
                      )}
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
