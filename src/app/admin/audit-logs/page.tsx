import React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getAuditLogs } from "@/lib/audit";
import { AuditLogsTable } from "./audit-logs-table";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const result = await getAuditLogs({ limit: 20, page: 1 });
  const logs = result.success ? result.data : [];
  const total = result.success ? result.total : 0;

  return (
    <div className="space-y-6 font-bengali">
      <PageHeader
        heading="সিস্টেম অডিট লগ"
        subheading="প্রশাসনিক কার্যক্রম ও পরিবর্তনের অপরিবর্তনীয় রেকর্ড"
      />

      <Card>
        <CardContent className="pt-6">
          <AuditLogsTable initialLogs={logs} initialTotal={total} />
        </CardContent>
      </Card>
    </div>
  );
}
