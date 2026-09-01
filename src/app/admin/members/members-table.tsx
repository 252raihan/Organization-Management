"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  Check,
  Ban,
  UserX,
  RotateCcw,
} from "lucide-react";
import {
  type AdminMemberItem,
  approveMember,
  suspendMember,
  deactivateMember,
  updateMemberStatus,
} from "@/app/actions/admin-members";
import { MemberStatus } from "@prisma/client";

const bloodGroupMap: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

interface MembersTableProps {
  initialMembers: AdminMemberItem[];
}

export function MembersTable({ initialMembers }: MembersTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredMembers = initialMembers.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = m.user.name.toLowerCase().includes(q);
    const phoneMatch = m.user.phone.toLowerCase().includes(q);
    const codeMatch = m.memberCode?.toLowerCase().includes(q) ?? false;
    return nameMatch || phoneMatch || codeMatch;
  });

  const handleApprove = (memberId: string, memberName: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে ${memberName}-কে সদস্য হিসেবে অনুমোদন করতে চান?`)) {
      return;
    }
    setActiveActionId(memberId);
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await approveMember(memberId);
        if (res.success) {
          setFeedback({ type: "success", message: res.message || "সদস্য সফলভাবে অনুমোদিত হয়েছে।" });
          router.refresh();
        } else {
          setFeedback({ type: "error", message: res.error || "অনুমোদনে সমস্যা হয়েছে।" });
        }
      } catch {
        setFeedback({ type: "error", message: "অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে।" });
      } finally {
        setActiveActionId(null);
      }
    });
  };

  const handleSuspend = (memberId: string, memberName: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে ${memberName}-এর সদস্যপদ সাময়িক স্থগিত করতে চান?`)) {
      return;
    }
    setActiveActionId(memberId);
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await suspendMember(memberId);
        if (res.success) {
          setFeedback({ type: "success", message: res.message || "সদস্যপদ সাময়িক স্থগিত করা হয়েছে।" });
          router.refresh();
        } else {
          setFeedback({ type: "error", message: res.error || "স্থগিতকরণে সমস্যা হয়েছে।" });
        }
      } catch {
        setFeedback({ type: "error", message: "অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে।" });
      } finally {
        setActiveActionId(null);
      }
    });
  };

  const handleDeactivate = (memberId: string, memberName: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে ${memberName}-এর সদস্যপদ নিষ্ক্রিয় করতে চান?`)) {
      return;
    }
    setActiveActionId(memberId);
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await deactivateMember(memberId);
        if (res.success) {
          setFeedback({ type: "success", message: res.message || "সদস্যপদ নিষ্ক্রিয় করা হয়েছে।" });
          router.refresh();
        } else {
          setFeedback({ type: "error", message: res.error || "নিষ্ক্রিয়করণে সমস্যা হয়েছে।" });
        }
      } catch {
        setFeedback({ type: "error", message: "অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে।" });
      } finally {
        setActiveActionId(null);
      }
    });
  };

  const handleReactivate = (memberId: string, memberName: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে ${memberName}-কে পুনরায় সক্রিয় করতে চান?`)) {
      return;
    }
    setActiveActionId(memberId);
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await updateMemberStatus({
          memberId,
          newStatus: MemberStatus.ACTIVE,
          notes: "অ্যাডমিন কর্তৃক পুনঃসক্রিয়করণ",
        });
        if (res.success) {
          setFeedback({ type: "success", message: res.message || "সদস্যপদ পুনঃসক্রিয় করা হয়েছে।" });
          router.refresh();
        } else {
          setFeedback({ type: "error", message: res.error || "পুনঃসক্রিয়করণে সমস্যা হয়েছে।" });
        }
      } catch {
        setFeedback({ type: "error", message: "অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে।" });
      } finally {
        setActiveActionId(null);
      }
    });
  };

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case MemberStatus.ACTIVE:
        return (
          <Badge variant="success" className="text-[10px]">
            সক্রিয়
          </Badge>
        );
      case MemberStatus.PENDING:
        return (
          <Badge variant="warning" className="text-[10px]">
            পেন্ডিং
          </Badge>
        );
      case MemberStatus.SUSPENDED:
        return (
          <Badge variant="destructive" className="text-[10px]">
            স্থগিত
          </Badge>
        );
      case MemberStatus.INACTIVE:
        return (
          <Badge variant="secondary" className="text-[10px]">
            নিষ্ক্রিয়
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(date);
    }
  };

  return (
    <div className="space-y-4">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 text-xs rounded-lg border ${feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60"
            }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2 font-bold text-base">
          <Users className="h-4 w-4 text-emerald-600" />
          <span>মোট নিবন্ধিত সদস্য ({filteredMembers.length})</span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="নাম, মোবাইল বা কোড দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="py-3 px-4 font-semibold">সদস্য কোড</th>
              <th className="py-3 px-4 font-semibold">নাম</th>
              <th className="py-3 px-4 font-semibold">মোবাইল</th>
              <th className="py-3 px-4 font-semibold">রক্তের গ্রুপ</th>
              <th className="py-3 px-4 font-semibold">নিবন্ধন তারিখ</th>
              <th className="py-3 px-4 font-semibold">স্ট্যাটাস</th>
              <th className="py-3 px-4 font-semibold text-right">পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                  {searchQuery ? "খুঁজে পাওয়া যায়নি।" : "কোন সদস্য পাওয়া যায়নি।"}
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const isItemPending = isPending && activeActionId === m.id;
                const displayBlood = m.bloodGroup
                  ? bloodGroupMap[m.bloodGroup] || m.bloodGroup
                  : "N/A";

                return (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      {m.memberCode || "—"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {m.user.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {m.user.phone}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                      {displayBlood}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {formatDate(m.registrationDate || m.createdAt)}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(m.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isItemPending ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>প্রক্রিয়াধীন...</span>
                          </div>
                        ) : (
                          <>
                            {/* PENDING -> Approve */}
                            {m.status === MemberStatus.PENDING && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(m.id, m.user.name)}
                                className="h-7 px-2.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900 border-emerald-300 dark:border-emerald-800"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                <span>অনুমোদন</span>
                              </Button>
                            )}

                            {/* ACTIVE -> Suspend / Deactivate */}
                            {m.status === MemberStatus.ACTIVE && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuspend(m.id, m.user.name)}
                                  className="h-7 px-2 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                                >
                                  <Ban className="h-3 w-3 mr-1" />
                                  <span>স্থগিত</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeactivate(m.id, m.user.name)}
                                  className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                >
                                  <UserX className="h-3 w-3 mr-1" />
                                  <span>নিষ্ক্রিয়</span>
                                </Button>
                              </>
                            )}

                            {/* SUSPENDED -> Reactivate / Deactivate */}
                            {m.status === MemberStatus.SUSPENDED && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReactivate(m.id, m.user.name)}
                                  className="h-7 px-2 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  <span>পুনঃসক্রিয়</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeactivate(m.id, m.user.name)}
                                  className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                >
                                  <UserX className="h-3 w-3 mr-1" />
                                  <span>নিষ্ক্রিয়</span>
                                </Button>
                              </>
                            )}

                            {/* INACTIVE -> Reactivate */}
                            {m.status === MemberStatus.INACTIVE && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReactivate(m.id, m.user.name)}
                                className="h-7 px-2 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                <span>পুনঃসক্রিয়</span>
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
