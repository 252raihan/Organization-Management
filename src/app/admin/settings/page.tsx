import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Save } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="সংগঠনের সেটিংস"
        subheading="সংগঠনের প্রাথমিক তথ্য ও কনফিগারেশন পরিবর্তন"
      />

      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="h-4 w-4 text-emerald-600" />
              <span>সাধারণ সেটিংস</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">সংগঠনের নাম</label>
              <Input defaultValue={APP_CONFIG.name} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">অফিসিয়াল ঠিকানা</label>
              <Input defaultValue={APP_CONFIG.address} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">হেল্পলাইন নম্বর</label>
                <Input defaultValue={APP_CONFIG.phone} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">ইমেইল এড্রেস</label>
                <Input defaultValue={APP_CONFIG.email} />
              </div>
            </div>

            <div className="pt-2">
              <Button disabled className="bg-emerald-600 text-white gap-2">
                <Save className="h-4 w-4" />
                <span>পরিবর্তন সংরক্ষণ করুন (ফেজ ২)</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
