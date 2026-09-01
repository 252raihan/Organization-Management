import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { getAdminMembers } from "@/app/actions/admin-members";
import { MembersTable } from "./members-table";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const result = await getAdminMembers();
  const members = result.success ? result.data : [];

  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="সংগঠনের সদস্য তালিকা"
        subheading="সকল সাধারণ ও আজীবন সদস্যের প্রোফাইল ও তথ্য ব্যবস্থাপনা"
      >
        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
          <Link href="/register">
            <UserPlus className="h-4 w-4" />
            <span>নতুন সদস্য যোগ করুন</span>
          </Link>
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          <MembersTable initialMembers={members} />
        </CardContent>
      </Card>
    </div>
  );
}
