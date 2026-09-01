"use client";

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
} from "lucide-react";
import { type AuditLogItem, getAuditLogs } from "@/lib/audit";

const ACTION_OPTIONS = [
  { value: "ALL", label: "সব কার্যক্রম" },
  { value: "MEMBER_APPROVED", label: "সদস্য অনুমোদন (MEMBER_APPROVED)" },
  { value: "MEMBER_SUSPENDED", label: "সদস্য স্থগিতকরণ (MEMBER_SUSPENDED)" },
  { value: "MEMBER_DEACTIVATED", label: "সদস্য নিষ্ক্রিয়করণ (MEMBER_DEACTIVATED)" },
  { value: "MEMBER_REGISTRATION", label: "সদস্য নিবন্ধন (MEMBER_REGISTRATION)" },
  { value: "USER_LOGIN", label: "ব্যবহারকারী লগইন (USER_LOGIN)" },
];

interface AuditLogsTableProps {
  initialLogs: AuditLogItem[];
  initialTotal: number;
}

export function AuditLogsTable({
  initialLogs,
  initialTotal,
}: AuditLogsTableProps) {
  const [logs, setLogs] = useState<AuditLogItem[]>(initialLogs);
  const [total, setTotal] = useState(initialTotal);
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const pageSize = 20;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const fetchLogs = (action: string, page: number) => {
    startTransition(async () => {
      const res = await getAuditLogs({
        action: action === "ALL" ? undefined : action,
        page,
        limit: pageSize,
      });

      if (res.success) {
        setLogs(res.data);
        setTotal(res.total);
      }
    });
  };

  const handleActionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    setSelectedAction(action);
    setCurrentPage(1);
    fetchLogs(action, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchLogs(selectedAction, newPage);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "MEMBER_APPROVED":
        return (
          <Badge variant="success" className="font-mono text-[10px]">
            অনুমোদন
          </Badge>
        );
      case "MEMBER_SUSPENDED":
        return (
          <Badge variant="warning" className="font-mono text-[10px]">
            স্থগিত
          </Badge>
        );
      case "MEMBER_DEACTIVATED":
        return (
          <Badge variant="destructive" className="font-mono text-[10px]">
            নিষ্ক্রিয়
          </Badge>
        );
      case "MEMBER_REGISTRATION":
        return (
          <Badge variant="info" className="font-mono text-[10px]">
            নতুন নিবন্ধন
          </Badge>
        );
      case "USER_LOGIN":
        return (
          <Badge variant="outline" className="font-mono text-[10px]">
            লগইন
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-mono text-[10px]">
            {action}
          </Badge>
        );
    }
  };

  const parseDetails = (details: string | null) => {
    if (!details) return "—";
    try {
      const parsed = JSON.parse(details);
      if (typeof parsed === "object" && parsed !== null) {
        const parts: string[] = [];
        if (parsed.memberName) parts.push(`সদস্য: ${parsed.memberName}`);
        if (parsed.memberCode) parts.push(`(${parsed.memberCode})`);
        if (parsed.previousStatus && parsed.newStatus) {
          parts.push(`${parsed.previousStatus} ➔ ${parsed.newStatus}`);
        }
        if (parsed.reason) parts.push(`কারণ: ${parsed.reason}`);
        if (parsed.notes) parts.push(`নোট: ${parsed.notes}`);
        if (parsed.role) parts.push(`ভূমিকা: ${parsed.role}`);

        if (parts.length > 0) {
          return parts.join(" | ");
        }
        return Object.entries(parsed)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
      }
      return String(details);
    } catch {
      return details;
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(date);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2 font-bold text-base">
          <FileText className="h-4 w-4 text-emerald-600" />
          <span>মোট রেকর্ড ({total})</span>
          {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:inline-block" />
          <select
            value={selectedAction}
            onChange={handleActionFilterChange}
            disabled={isPending}
            className="flex h-9 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="py-3 px-4 font-semibold">অ্যাকশন</th>
              <th className="py-3 px-4 font-semibold">মডিউল</th>
              <th className="py-3 px-4 font-semibold">টার্গেট আইডি</th>
              <th className="py-3 px-4 font-semibold">বিবরণ</th>
              <th className="py-3 px-4 font-semibold">সম্পাদনকারী</th>
              <th className="py-3 px-4 font-semibold">সময়</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground text-xs">
                  {isPending ? "লোড হচ্ছে..." : "কোন অডিট লগ পাওয়া যায়নি।"}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      {getActionBadge(log.action)}
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                    {log.entityType}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                    {log.entityId ? log.entityId.slice(0, 10) + "..." : "—"}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-foreground max-w-xs sm:max-w-md truncate">
                    {parseDetails(log.details)}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {log.user ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {log.user.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {log.user.role === "ADMIN" ? "অ্যাডমিন" : "সদস্য"} ({log.user.phone})
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">সিস্টেম / নামহীন</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs font-mono whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            পৃষ্ঠা {currentPage} / {totalPages} (মোট {total} টি লগ)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isPending}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-8 gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>পূর্ববর্তী</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-8 gap-1 text-xs"
            >
              <span>পরবর্তী</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
