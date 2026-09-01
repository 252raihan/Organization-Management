import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Send, PlusCircle } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/constants";
import { MOCK_RECENT_PAYMENTS } from "@/lib/mock-data";

export default function MemberPaymentsPage() {
  return (
    <div className="space-y-8 font-bengali">
      <PageHeader
        heading="পেমেন্ট ও জমাদান"
        subheading="বিকাশ, নগদ বা ব্যাংকের মাধ্যমে আপনার মাসিক জমা দাখিল করুন"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Payment Submission Placeholder Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-emerald-600" />
                <span>নতুন পেমেন্ট দাখিল</span>
              </CardTitle>
              <CardDescription className="text-xs">
                টাকা পাঠানোর পর ট্রানজেকশন আইডি দিন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">পেমেন্ট ধরন</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="MONTHLY_DEPOSIT">মাসিক জমা</option>
                  <option value="ADVANCE_DEPOSIT">অগ্রিম জমা</option>
                  <option value="DONATION">এককালীন অনুদান</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">টাকার পরিমাণ</label>
                <Input type="number" placeholder="500" defaultValue="500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">পেমেন্ট মেথড</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm.value} value={pm.value}>
                      {pm.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">ট্রানজেকশন আইডি (TrxID)</label>
                <Input placeholder="যেমন: TRX8293741" className="font-mono uppercase" />
              </div>

              <div className="pt-2">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Send className="h-4 w-4" />
                  <span>পেমেন্ট সাবমিট করুন (ডেমো)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-600" />
                <span>পেমেন্ট হিস্ট্রি ও অনুমোদন স্ট্যাটাস</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border/60 text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-semibold">Trx ID</th>
                      <th className="pb-3 font-semibold">মেথড</th>
                      <th className="pb-3 font-semibold">পরিমাণ</th>
                      <th className="pb-3 font-semibold">তারিখ</th>
                      <th className="pb-3 font-semibold">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                    {MOCK_RECENT_PAYMENTS.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono font-medium text-foreground">{p.trxId}</td>
                        <td className="py-3 text-muted-foreground">{p.method}</td>
                        <td className="py-3 font-semibold">৳ {p.amount}</td>
                        <td className="py-3 text-muted-foreground">{p.date}</td>
                        <td className="py-3">
                          <Badge
                            variant={p.status === "VERIFIED" ? "success" : "warning"}
                            className="text-[10px]"
                          >
                            {p.status === "VERIFIED" ? "যাচাইকৃত" : "অপেক্ষমাণ"}
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
      </div>
    </div>
  );
}
