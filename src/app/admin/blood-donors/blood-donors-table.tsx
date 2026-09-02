"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Droplets,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  Check,
  X,
  Eye,
  Edit,
} from "lucide-react";
import {
  type AdminBloodDonorItem,
  toggleDonorAvailability,
  updateDonorDonationRecord,
} from "@/app/actions/admin-blood-donors";

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

interface BloodDonorsTableProps {
  initialDonors: AdminBloodDonorItem[];
}

export function BloodDonorsTable({ initialDonors }: BloodDonorsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("ALL");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [viewingDonor, setViewingDonor] = useState<AdminBloodDonorItem | null>(null);
  const [editingDonor, setEditingDonor] = useState<AdminBloodDonorItem | null>(null);
  const [editTotalDonations, setEditTotalDonations] = useState<number>(0);
  const [editLastDonationDate, setEditLastDonationDate] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  // Filtering
  const filteredDonors = initialDonors.filter((d) => {
    // Blood group match
    if (selectedBloodGroup !== "ALL" && d.bloodGroup !== selectedBloodGroup) {
      return false;
    }
    // Availability match
    if (selectedAvailability === "AVAILABLE" && !d.isAvailable) {
      return false;
    }
    if (selectedAvailability === "UNAVAILABLE" && d.isAvailable) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = d.name.toLowerCase().includes(q);
      const phoneMatch = d.phone.toLowerCase().includes(q) || (d.alternatePhone?.toLowerCase().includes(q) ?? false);
      const unionMatch = d.union?.toLowerCase().includes(q) ?? false;
      const upazilaMatch = d.upazila?.toLowerCase().includes(q) ?? false;
      const codeMatch = d.member?.memberCode?.toLowerCase().includes(q) ?? false;
      const memberNameMatch = d.member?.user.name.toLowerCase().includes(q) ?? false;
      return nameMatch || phoneMatch || unionMatch || upazilaMatch || codeMatch || memberNameMatch;
    }
    return true;
  });

  const handleToggleAvailability = (donor: AdminBloodDonorItem) => {
    const targetStatus = !donor.isAvailable;
    const promptMsg = targetStatus
      ? `আপনি কি নিশ্চিত যে ${donor.name}-কে 'রক্তদানের জন্য প্রস্তুত' করতে চান?`
      : `আপনি কি নিশ্চিত যে ${donor.name}-কে 'অনুপলব্ধ' করতে চান?`;

    if (!confirm(promptMsg)) return;

    setActiveActionId(donor.id);
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await toggleDonorAvailability(donor.id, targetStatus);
        if (res.success) {
          setFeedback({
            type: "success",
            message: res.message || "প্রাপ্যতা স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে।",
          });
          router.refresh();
        } else {
          setFeedback({
            type: "error",
            message: res.error || "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।",
          });
        }
      } catch {
        setFeedback({ type: "error", message: "অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে।" });
      } finally {
        setActiveActionId(null);
      }
    });
  };

  const openEditModal = (donor: AdminBloodDonorItem) => {
    setEditingDonor(donor);
    setEditTotalDonations(donor.totalDonations);
    setEditLastDonationDate(
      donor.lastDonationDate
        ? new Date(donor.lastDonationDate).toISOString().split("T")[0]
        : ""
    );
    setEditNotes(donor.notes || "");
  };

  const handleSaveDonationRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;

    setActiveActionId(editingDonor.id);
    setFeedback(null);

    startTransition(async () => {
      try {
        const res = await updateDonorDonationRecord({
          donorId: editingDonor.id,
          totalDonations: Number(editTotalDonations),
          lastDonationDate: editLastDonationDate || null,
          notes: editNotes || null,
        });

        if (res.success) {
          setFeedback({
            type: "success",
            message: res.message || "রক্তদানের রেকর্ড সফলভাবে হালনাগাদ করা হয়েছে।",
          });
          setEditingDonor(null);
          router.refresh();
        } else {
          setFeedback({
            type: "error",
            message: res.error || "হালনাগাদ করতে সমস্যা হয়েছে।",
          });
        }
      } catch {
        setFeedback({ type: "error", message: "অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে।" });
      } finally {
        setActiveActionId(null);
      }
    });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
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

      {/* Header, Filters & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2 font-bold text-base">
            <Droplets className="h-4 w-4 text-rose-500" />
            <span>নিবন্ধিত রক্তদাতা তালিকা ({filteredDonors.length})</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="নাম, মোবাইল বা এলাকা দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>গ্রুপ:</span>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">সকল রক্তের গ্রুপ</option>
              {Object.entries(bloodGroupMap).map(([key, label]) => (
                <option key={key} value={key}>
                  {label} ({key.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>স্ট্যাটাস:</span>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">সকল স্ট্যাটাস</option>
              <option value="AVAILABLE">প্রস্তুত (Available)</option>
              <option value="UNAVAILABLE">অনুপলব্ধ (Unavailable)</option>
            </select>
          </div>

          {(searchQuery || selectedBloodGroup !== "ALL" || selectedAvailability !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedBloodGroup("ALL");
                setSelectedAvailability("ALL");
              }}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              ফিল্টার রিসেট
            </Button>
          )}
        </div>
      </div>

      {/* Table for Desktop & Tablet */}
      <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="py-3 px-4 font-semibold">রক্তের গ্রুপ</th>
              <th className="py-3 px-4 font-semibold">রক্তদাতার নাম</th>
              <th className="py-3 px-4 font-semibold">মোবাইল নম্বর</th>
              <th className="py-3 px-4 font-semibold">এলাকা</th>
              <th className="py-3 px-4 font-semibold">সর্বশেষ দান</th>
              <th className="py-3 px-4 font-semibold">মোট দান</th>
              <th className="py-3 px-4 font-semibold">প্রাপ্যতা</th>
              <th className="py-3 px-4 font-semibold text-right">পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
            {filteredDonors.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                  {searchQuery || selectedBloodGroup !== "ALL" || selectedAvailability !== "ALL"
                    ? "আপনার অনুসন্ধানের সাথে মিলছে এমন কোনো রক্তদাতা পাওয়া যায়নি।"
                    : "এখনো কোনো রক্তদাতা নিবন্ধিত হয়নি।"}
                </td>
              </tr>
            ) : (
              filteredDonors.map((d) => {
                const isItemPending = isPending && activeActionId === d.id;
                const displayBlood = bloodGroupMap[d.bloodGroup] || d.bloodGroup;

                return (
                  <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900/60">
                        {displayBlood}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{d.name}</div>
                      {d.member?.memberCode && (
                        <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                          {d.member.memberCode}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      <div>{d.phone}</div>
                      {d.alternatePhone && (
                        <div className="text-[11px] text-muted-foreground/70">
                          {d.alternatePhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      <div>{d.union || "—"}</div>
                      {d.upazila && (
                        <div className="text-[11px] text-muted-foreground/70">
                          {d.upazila}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {formatDate(d.lastDonationDate)}
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      {d.totalDonations} বার
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={d.isAvailable ? "success" : "secondary"}
                        className="text-[10px]"
                      >
                        {d.isAvailable ? "প্রস্তুত" : "অনুপলব্ধ"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isItemPending ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>...</span>
                          </div>
                        ) : (
                          <>
                            {/* Toggle availability */}
                            <Button
                              size="sm"
                              variant={d.isAvailable ? "outline" : "default"}
                              onClick={() => handleToggleAvailability(d)}
                              className={`h-7 px-2 text-xs ${d.isAvailable
                                  ? "text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                }`}
                              title={d.isAvailable ? "অনুপলব্ধ হিসেবে চিহ্নিত করুন" : "প্রস্তুত হিসেবে চিহ্নিত করুন"}
                            >
                              {d.isAvailable ? (
                                <>
                                  <X className="h-3 w-3 mr-1" />
                                  <span>অনুপলব্ধ</span>
                                </>
                              ) : (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  <span>প্রস্তুত</span>
                                </>
                              )}
                            </Button>

                            {/* Edit donation record */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(d)}
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                              title="রক্তদানের সংখ্যা হালনাগাদ করুন"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              <span>হালনাগাদ</span>
                            </Button>

                            {/* View details */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setViewingDonor(d)}
                              className="h-7 px-1.5 text-muted-foreground hover:text-foreground"
                              title="বিস্তারিত দেখুন"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
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

      {/* Details Modal */}
      {viewingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <Droplets className="h-5 w-5 text-rose-500" />
                <span>রক্তদাতার বিস্তারিত বিবরণ</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingDonor(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">রক্তদাতার নাম</div>
                <div className="font-bold text-foreground text-sm mt-0.5">{viewingDonor.name}</div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">রক্তের গ্রুপ</div>
                <div className="font-bold text-rose-600 text-sm mt-0.5">
                  {bloodGroupMap[viewingDonor.bloodGroup] || viewingDonor.bloodGroup}
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">প্রাথমিক মোবাইল</div>
                <div className="font-mono font-semibold text-foreground mt-0.5">{viewingDonor.phone}</div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">বিকল্প মোবাইল</div>
                <div className="font-mono text-foreground mt-0.5">{viewingDonor.alternatePhone || "—"}</div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">সদস্য কোড</div>
                <div className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {viewingDonor.member?.memberCode || "সাধারণ দাতা (অ-সদস্য)"}
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">প্রাপ্যতা স্ট্যাটাস</div>
                <div className="mt-1">
                  <Badge variant={viewingDonor.isAvailable ? "success" : "secondary"} className="text-[10px]">
                    {viewingDonor.isAvailable ? "প্রস্তুত (Available)" : "অনুপলব্ধ (Unavailable)"}
                  </Badge>
                </div>
              </div>

              <div className="col-span-2 rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">ঠিকানা / এলাকা</div>
                <div className="font-medium text-foreground mt-0.5">
                  {[viewingDonor.address, viewingDonor.union, viewingDonor.upazila, viewingDonor.district]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">সর্বশেষ রক্তদান</div>
                <div className="font-medium text-foreground mt-0.5">
                  {formatDate(viewingDonor.lastDonationDate)}
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="text-muted-foreground">মোট রক্তদান</div>
                <div className="font-bold text-foreground mt-0.5">{viewingDonor.totalDonations} বার</div>
              </div>

              {viewingDonor.notes && (
                <div className="col-span-2 rounded-lg border border-border/50 p-3 bg-muted/20">
                  <div className="text-muted-foreground">নোট / মন্তব্য</div>
                  <div className="text-foreground mt-0.5">{viewingDonor.notes}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingDonor(null)}
                className="text-xs"
              >
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Donation Record Modal */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <Edit className="h-4 w-4 text-emerald-600" />
                <span>রক্তদানের তথ্য হালনাগাদ</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingDonor(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveDonationRecord} className="space-y-3.5 text-xs">
              <div>
                <span className="font-semibold text-foreground">{editingDonor.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({bloodGroupMap[editingDonor.bloodGroup] || editingDonor.bloodGroup})
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">মোট রক্তদানের সংখ্যা</label>
                <Input
                  type="number"
                  min="0"
                  value={editTotalDonations}
                  onChange={(e) => setEditTotalDonations(Number(e.target.value))}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">সর্বশেষ রক্তদানের তারিখ</label>
                <Input
                  type="date"
                  value={editLastDonationDate}
                  onChange={(e) => setEditLastDonationDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">অতিরিক্ত নোট</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="জরুরি নোট বা মন্তব্য..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDonor(null)}
                  className="text-xs"
                  disabled={isPending}
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>সংরক্ষণ করুন</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
