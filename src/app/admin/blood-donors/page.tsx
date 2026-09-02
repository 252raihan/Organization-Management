import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminBloodDonors } from "@/app/actions/admin-blood-donors";
import { BloodDonorsTable } from "./blood-donors-table";

export const dynamic = "force-dynamic";

export default async function AdminBloodDonorsPage() {
  const result = await getAdminBloodDonors();
  const donors = result.success ? result.data : [];

  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="রক্তদাতা রেজিস্ট্রি"
        subheading="এলাকার রক্তদাতাদের তথ্যভাণ্ডার ও প্রাপ্যতা ব্যবস্থাপনা"
      />

      <Card>
        <CardContent className="pt-6">
          <BloodDonorsTable initialDonors={donors} />
        </CardContent>
      </Card>
    </div>
  );
}

