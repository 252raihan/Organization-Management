import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="আর্থিক ও কার্যক্রমের রিপোর্ট"
        subheading="মাসিক, বার্ষিক জমা ও খরচের বিস্তারিত পরিসংখ্যান"
      />

      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={BarChart3}
            title="রিপোর্টস মডিউল (ফেজ ২)"
            description="বিস্তারিত অডিট রিপোর্ট, পিডিএফ এক্সপোর্ট ও গ্রাফিকাল চার্ট ফেজ ২-এ চালু হবে।"
          />
        </CardContent>
      </Card>
    </div>
  );
}
