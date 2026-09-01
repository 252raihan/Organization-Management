import React from "react";
import Link from "next/link";
import {
  Users,
  Wallet,
  PiggyBank,
  Clock,
  Heart,
  Droplets,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ADMIN_STATS, MOCK_RECENT_PAYMENTS, MOCK_RECENT_MEMBERS } from "@/lib/mock-data";

const iconMap = {
  Users,
  Wallet,
  PiggyBank,
  Clock,
  Heart,
  Droplets,
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 font-bengali">
      {/* Header */}
      <PageHeader
        heading="অ্যাডমিন ওভারভিউ"
        subheading="সংগঠনের সার্বিক সদস্য পরিসংখ্যান, আর্থিক জমা ও কার্যক্রমের বিবরণী"
      >
        <Badge variant="outline" className="bg-slate-900 text-white dark:bg-emerald-600 px-3 py-1">
          সুপার অ্যাডমিন মোড
        </Badge>
      </PageHeader>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_ADMIN_STATS.map((stat, idx) => {
          const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Users;
          return (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              subtitle={stat.subtitle}
              icon={IconComponent}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Pending Payments for Verification */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">অনুমোদনের অপেক্ষায় লেনদেন</CardTitle>
              <CardDescription className="text-xs">
                সদস্যদের জমাকৃত পেমেন্ট ভেরিফিকেশন তালিকা
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/admin/payments">
                <span>সব পেমেন্ট</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/50">
              {MOCK_RECENT_PAYMENTS.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {payment.memberName}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {payment.trxId} • {payment.method}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-foreground">
                      ৳ {payment.amount}
                    </span>
                    <Badge
                      variant={payment.status === "VERIFIED" ? "success" : "warning"}
                      className="text-[10px]"
                    >
                      {payment.status === "VERIFIED" ? "অনুমোদিত" : "অপেক্ষমাণ"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Registered Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">নতুন নিবন্ধিত সদস্যবৃন্দ</CardTitle>
              <CardDescription className="text-xs">
                সাম্প্রতিক আবেদন ও সদস্য তালিকা
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/admin/members">
                <span>সব সদস্য</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/50">
              {MOCK_RECENT_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {member.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      আইডি: <span className="font-mono">{member.memberCode}</span> • রক্ত:{" "}
                      <span className="text-rose-600 font-medium">{member.bloodGroup}</span>
                    </div>
                  </div>

                  <div>
                    <Badge
                      variant={member.status === "ACTIVE" ? "success" : "warning"}
                      className="text-[10px]"
                    >
                      {member.status === "ACTIVE" ? "সক্রিয়" : "পেন্ডিং"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
