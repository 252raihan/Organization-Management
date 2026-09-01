import React from "react";
import Link from "next/link";
import {
  Wallet,
  CalendarCheck,
  AlertCircle,
  HeartHandshake,
  ArrowRight,
  PlusCircle,
  Receipt,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_MEMBER_STATS, MOCK_RECENT_PAYMENTS } from "@/lib/mock-data";

const iconMap = {
  Wallet,
  CalendarCheck,
  AlertCircle,
  HeartHandshake,
};

export default function MemberDashboardPage() {
  return (
    <div className="space-y-8 font-bengali">
      {/* Header */}
      <PageHeader
        heading="স্বাগতম, তানভীর হাসান"
        subheading="গোপীনাথপুর সমাজ কল্যাণ সংগঠন — সদস্য প্যানেল ওভারভিউ"
      >
        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
          <Link href="/dashboard/payments">
            <PlusCircle className="h-4 w-4" />
            <span>জমা / পেমেন্ট দাখিল</span>
          </Link>
        </Button>
      </PageHeader>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_MEMBER_STATS.map((stat, idx) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Wallet;
          return (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={IconComponent}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Payments Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold">সাম্প্রতিক লেনদেন</CardTitle>
                <CardDescription className="text-xs">আপনার সাম্প্রতিক জমার রেকর্ড</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-emerald-600">
                <Link href="/dashboard/payments">
                  <span>সব দেখুন</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/50">
                {MOCK_RECENT_PAYMENTS.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground font-mono">
                          {item.trxId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.date} • {item.method}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        ৳ {item.amount}
                      </div>
                      <Badge
                        variant={item.status === "VERIFIED" ? "success" : "warning"}
                        className="text-[10px] mt-0.5"
                      >
                        {item.status === "VERIFIED" ? "যাচাইকৃত" : "অপেক্ষমাণ"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Profile Summary / Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">সদস্য তথ্য সংক্ষেপ</CardTitle>
              <CardDescription className="text-xs">সংগঠনের নিবন্ধন তথ্য</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">সদস্য আইডি:</span>
                <span className="font-mono font-bold text-foreground">GSWO-M042</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">স্ট্যাটাস:</span>
                <Badge variant="success" className="text-[10px]">সক্রিয় সদস্য</Badge>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">রক্তের গ্রুপ:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">O+ (পজিটিভ)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">নিবন্ধন তারিখ:</span>
                <span className="text-foreground">০১ জানুয়ারি, ২০২৪</span>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild className="w-full text-xs">
                  <Link href="/dashboard/profile">
                    সম্পূর্ণ প্রোফাইল দেখুন
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
