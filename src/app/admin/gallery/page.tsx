import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, UploadCloud } from "lucide-react";

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="গ্যালারি ব্যবস্থাপনা"
        subheading="সংগঠনের কার্যক্রমের ছবি আপলোড ও ক্যাটাগরি তৈরি"
      >
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
          <UploadCloud className="h-4 w-4" />
          <span>নতুন ছবি আপলোড</span>
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={Image}
            title="গ্যালারিতে এখনো কোনো ছবি আপলোড করা হয়নি"
            description="ছবি আপলোড ও গ্যালারি ম্যানেজমেন্ট সিস্টেম ফেজ ২-এ ক্লাউড স্টোরেজসহ সংযুক্ত হবে।"
          />
        </CardContent>
      </Card>
    </div>
  );
}
