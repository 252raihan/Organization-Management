import React from "react";
import Link from "next/link";
import {
  Users,
  Wallet,
  Heart,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Building2,
  HeartHandshake,
  MessageCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/stat-card";
import { APP_CONFIG } from "@/lib/constants";
import { MOCK_HOME_STATS } from "@/lib/mock-data";

const iconMap = {
  Users,
  Wallet,
  Heart,
  Droplets,
};

export default function HomePage() {
  return (
    <div className="flex flex-col font-bengali">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-emerald-50/50 via-background to-background py-16 sm:py-24 dark:from-emerald-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-4 inline-flex items-center gap-1.5 border-emerald-600/30 bg-emerald-50/80 px-3 py-1 text-xs text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>মানবতার কল্যাণে ঐক্যবদ্ধ সমাজ গড়ার প্রত্যয়ে</span>
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {APP_CONFIG.name}
            </h1>

            <p className="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-400 sm:text-base">
              {APP_CONFIG.address}
            </p>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              ঐক্য, সেবা ও প্রগতির মূলমন্ত্র নিয়ে এলাকার পিছিয়ে পড়া মানুষের পাশে দাঁড়ানো এবং পারস্পরিক সহযোগিতার মাধ্যমে একটি আদর্শ কল্যাণমুখী সমাজ গড়ে তোলাই আমাদের লক্ষ্য।
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
              >
                <Link href="/register">
                  <span>সদস্য হোন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium">
                <Link href="/about">
                  <span>আমাদের সম্পর্কে জানুন</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS PREVIEW (STATIC PLACEHOLDERS) */}
      <section className="py-12 border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                সংগঠনের সারসংক্ষেপ
              </h2>
              <p className="text-xs text-muted-foreground">
                (প্রথম পর্যায় — প্রাথমিক স্ট্যাটিক ডেমো পরিসংখ্যান)
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              ফেজ ১ প্রিভিউ
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_HOME_STATS.map((stat, idx) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Users;
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
        </div>
      </section>

      {/* 3. ORGANIZATION INTRODUCTION */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400">
                  আমাদের লক্ষ্য ও উদ্দেশ্য
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  সামাজিক উন্নয়ন ও পারস্পরিক সহযোগিতার সেতুবন্ধন
                </h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                গোপীনাথপুর সমাজ কল্যাণ সংগঠন একটি অরাজনৈতিক, অলাভজনক ও সামাজিক সেবামূলক স্বেচ্ছাসেবী প্রতিষ্ঠান। সমাজের বিভিন্ন শ্রেণি-পেশার মানুষের সার্বিক কল্যাণ সাধন ও তরুণ প্রজন্মকে গঠনমূলক কাজে সম্পৃক্ত করাই আমাদের মূল উদ্দেশ্য।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 rounded-lg border border-border/60 p-4 bg-card/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">পারস্পরিক সহযোগিতা</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">বিপদাপদে একে অপরের পাশে থাকা</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border/60 p-4 bg-card/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 shrink-0">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">জরুরি রক্তদান সেবা</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">মুহূর্তে রক্তদাতার সন্ধান</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border/60 p-4 bg-card/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">স্বচ্ছ হিসাবরক্ষণ</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">ডিজিটাল জমা ও স্বচ্ছতা</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border/60 p-4 bg-card/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">সামাজিক উন্নয়ন</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">শিক্ষামূলক ও মানবসেবামূলক কাজ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intro visual placeholder card */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-card to-card p-8 shadow-sm">
              <div className="space-y-4">
                <Badge variant="outline" className="bg-background">
                  সংগঠনের তথ্য
                </Badge>
                <h3 className="text-xl font-bold text-foreground">
                  এনায়েতপুর, ফুলবাড়িয়া, ময়মনসিংহ
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  আমাদের সংগঠনের কার্যক্রম নিয়মিত পরিচালিত হয় সদস্যবৃন্দের আন্তরিক অংশগ্রহণ ও পারস্পরিক সঞ্চয়ের মাধ্যমে। সমাজের যে কোনো জরুরি প্রয়োজনে আমাদের স্বেচ্ছাসেবক দল নিয়োজিত থাকে।
                </p>
                <div className="rounded-xl border border-border/60 bg-background/80 p-4 space-y-2 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">📌 মূল কার্যক্রমের রূপরেখা:</p>
                  <p>• নিয়মিত সদস্য মাসিক সঞ্চয় তহবিল গঠন</p>
                  <p>• জরুরি রক্তের প্রয়োজনে স্বেচ্ছাসেবী ডাটাবেজ</p>
                  <p>• দুস্থ ও অসহায় মানুষের মাঝে মানবিক সহায়তা</p>
                  <p>• এলাকার সামাজিক ও পরিবেশগত উন্নয়নমূলক উদ্যোগ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GALLERY PREVIEW */}
      <section className="py-16 border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              সংগঠনের গ্যালারি
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              সংগঠনের বিভিন্ন সামাজিক উদ্যোগ ও মানবসেবামূলক কার্যক্রমের স্থিরচিত্র (প্লেসহোল্ডার)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "বার্ষিক সভা ও সম্মেলন", category: "সভা", date: "২০২৪" },
              { title: "স্বেচ্ছায় রক্তদান কর্মসূচি", category: "স্বাস্থ্যসেবা", date: "২০২৪" },
              { title: "শীতবস্ত্র বিতরণ কার্যক্রম", category: "ত্রাণ বিতরণ", date: "২০২৪" },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-md transition-all">
                <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-muted/80 transition-colors">
                  <span className="text-sm font-medium">ছবি লোড হবে (গ্যালারি প্লেসহোল্ডার)</span>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY CTA SECTION */}
      <section className="py-16 sm:py-20 border-t border-border/50 bg-gradient-to-b from-background to-emerald-50/40 dark:to-emerald-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-600/20 bg-card p-8 sm:p-12 text-center shadow-sm max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              আমাদের কমিউনিটিতে যোগ দিন
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              সংগঠনের যেকোনো পরামর্শ, জরুরি রক্তের প্রয়োজন কিংবা সামাজিক কার্যক্রমে অংশগ্রহণের জন্য আমাদের সাথে যুক্ত হোন।
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <a href={APP_CONFIG.whatsappGroupUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp গ্রুপ</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="gap-2 border-blue-600/30 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
              >
                <a href={APP_CONFIG.messengerGroupUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  <span>Messenger গ্রুপ</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </Button>

              <Button asChild variant="secondary" className="gap-2">
                <Link href="/donate">
                  <Heart className="h-4 w-4 text-rose-600" />
                  <span>অনুদান দিন</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
