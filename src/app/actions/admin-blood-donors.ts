"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { BloodGroup, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface AdminBloodDonorItem {
  id: string;
  memberId: string | null;
  name: string;
  phone: string;
  alternatePhone: string | null;
  bloodGroup: BloodGroup;
  address: string | null;
  union: string | null;
  upazila: string | null;
  district: string | null;
  lastDonationDate: Date | null;
  totalDonations: number;
  isAvailable: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  member: {
    id: string;
    memberCode: string | null;
    status: string;
    user: {
      id: string;
      name: string;
      phone: string;
      email: string | null;
    };
  } | null;
}

/**
 * Server action to retrieve real database blood donors with filtering.
 * Strictly verifies ADMIN authorization.
 * Never exposes passwords or sensitive credentials.
 */
export async function getAdminBloodDonors(params?: {
  searchQuery?: string;
  bloodGroup?: BloodGroup | "ALL";
  isAvailable?: "ALL" | "AVAILABLE" | "UNAVAILABLE";
}): Promise<{
  success: boolean;
  data: AdminBloodDonorItem[];
  error?: string;
}> {
  try {
    await requireAdmin();

    const whereClause: Prisma.BloodDonorWhereInput = {};

    // Search query filter
    const trimmed = params?.searchQuery?.trim();
    if (trimmed) {
      whereClause.OR = [
        { name: { contains: trimmed, mode: "insensitive" } },
        { phone: { contains: trimmed, mode: "insensitive" } },
        { union: { contains: trimmed, mode: "insensitive" } },
        { upazila: { contains: trimmed, mode: "insensitive" } },
        {
          member: {
            OR: [
              { memberCode: { contains: trimmed, mode: "insensitive" } },
              { user: { name: { contains: trimmed, mode: "insensitive" } } },
              { user: { phone: { contains: trimmed, mode: "insensitive" } } },
            ],
          },
        },
      ];
    }

    // Blood group filter
    if (params?.bloodGroup && params.bloodGroup !== "ALL") {
      whereClause.bloodGroup = params.bloodGroup;
    }

    // Availability filter
    if (params?.isAvailable && params.isAvailable !== "ALL") {
      whereClause.isAvailable = params.isAvailable === "AVAILABLE";
    }

    const donors = await prisma.bloodDonor.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        memberId: true,
        name: true,
        phone: true,
        alternatePhone: true,
        bloodGroup: true,
        address: true,
        union: true,
        upazila: true,
        district: true,
        lastDonationDate: true,
        totalDonations: true,
        isAvailable: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        member: {
          select: {
            id: true,
            memberCode: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: donors,
    };
  } catch (error) {
    console.error("[getAdminBloodDonors Error]", error);
    return {
      success: false,
      data: [],
      error: "রক্তদাতা তালিকা লোড করতে সমস্যা হয়েছে।",
    };
  }
}

/**
 * Toggle blood donor availability (Available <-> Unavailable).
 * Strictly verifies ADMIN authorization.
 */
export async function toggleDonorAvailability(
  donorId: string,
  targetAvailability: boolean
) {
  try {
    const admin = await requireAdmin();

    const donor = await prisma.bloodDonor.findUnique({
      where: { id: donorId },
      include: {
        member: {
          include: {
            user: {
              select: { name: true, phone: true },
            },
          },
        },
      },
    });

    if (!donor) {
      return { success: false, error: "রক্তদাতার তথ্য খুঁজে পাওয়া যায়নি।" };
    }

    const updated = await prisma.bloodDonor.update({
      where: { id: donorId },
      data: {
        isAvailable: targetAvailability,
      },
    });

    // Create AuditLog
    await createAuditLog({
      action: targetAvailability ? "DONOR_ACTIVATED" : "DONOR_DEACTIVATED",
      entityType: "BloodDonor",
      entityId: donor.id,
      details: {
        adminId: admin.id,
        adminName: admin.name,
        donorName: donor.name,
        donorPhone: donor.phone,
        bloodGroup: donor.bloodGroup,
        previousAvailability: donor.isAvailable,
        newAvailability: targetAvailability,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/admin/blood-donors");
    revalidatePath("/admin");
    revalidatePath("/dashboard/blood");

    const statusText = targetAvailability ? "প্রস্তুত (Available)" : "অনুপলব্ধ (Unavailable)";
    return {
      success: true,
      message: `${donor.name}-এর প্রাপ্যতা স্ট্যাটাস সফলভাবে '${statusText}' করা হয়েছে।`,
      data: updated,
    };
  } catch (error) {
    console.error("[toggleDonorAvailability Error]", error);
    return {
      success: false,
      error: "রক্তদাতার স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।",
    };
  }
}

/**
 * Update blood donor donation record (total count and last donation date).
 * Strictly verifies ADMIN authorization.
 */
export async function updateDonorDonationRecord(params: {
  donorId: string;
  totalDonations: number;
  lastDonationDate?: string | null;
  notes?: string | null;
}) {
  try {
    const admin = await requireAdmin();

    const donor = await prisma.bloodDonor.findUnique({
      where: { id: params.donorId },
    });

    if (!donor) {
      return { success: false, error: "রক্তদাতার তথ্য খুঁজে পাওয়া যায়নি।" };
    }

    if (params.totalDonations < 0) {
      return { success: false, error: "মোট রক্তদানের সংখ্যা ঋণাত্মক হতে পারে না।" };
    }

    let parsedDate: Date | null = null;
    if (params.lastDonationDate && params.lastDonationDate.trim() !== "") {
      const d = new Date(params.lastDonationDate);
      if (isNaN(d.getTime())) {
        return { success: false, error: "সঠিক তারিখ প্রদান করুন।" };
      }
      parsedDate = d;
    }

    const updated = await prisma.bloodDonor.update({
      where: { id: params.donorId },
      data: {
        totalDonations: params.totalDonations,
        lastDonationDate: parsedDate,
        notes: params.notes !== undefined ? params.notes : donor.notes,
      },
    });

    // Create AuditLog
    await createAuditLog({
      action: "DONOR_RECORD_UPDATED",
      entityType: "BloodDonor",
      entityId: donor.id,
      details: {
        adminId: admin.id,
        adminName: admin.name,
        donorName: donor.name,
        bloodGroup: donor.bloodGroup,
        previousTotal: donor.totalDonations,
        newTotal: params.totalDonations,
        lastDonationDate: parsedDate?.toISOString() || null,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath("/admin/blood-donors");
    revalidatePath("/admin");
    revalidatePath("/dashboard/blood");

    return {
      success: true,
      message: `${donor.name}-এর রক্তদানের রেকর্ড সফলভাবে হালনাগাদ করা হয়েছে।`,
      data: updated,
    };
  } catch (error) {
    console.error("[updateDonorDonationRecord Error]", error);
    return {
      success: false,
      error: "রক্তদানের রেকর্ড হালনাগাদ করতে সমস্যা হয়েছে।",
    };
  }
}
