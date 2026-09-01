"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { MemberStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface AdminMemberItem {
  id: string;
  memberCode: string | null;
  status: MemberStatus;
  bloodGroup: string | null;
  presentAddress: string | null;
  registrationDate: Date;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    role: string;
    isActive: boolean;
  };
}

/**
 * Server action to retrieve real database members with simple search.
 * Only authenticated ADMINs can call this.
 * Never selects or exposes passwordHash.
 */
export async function getAdminMembers(searchQuery?: string): Promise<{
  success: boolean;
  data: AdminMemberItem[];
  error?: string;
}> {
  try {
    await requireAdmin();

    const trimmed = searchQuery?.trim();
    const whereClause: Prisma.MemberProfileWhereInput = trimmed
      ? {
          OR: [
            {
              user: {
                name: {
                  contains: trimmed,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                phone: {
                  contains: trimmed,
                  mode: "insensitive",
                },
              },
            },
            {
              memberCode: {
                contains: trimmed,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const members = await prisma.memberProfile.findMany({
      where: whereClause,
      orderBy: {
        registrationDate: "desc",
      },
      select: {
        id: true,
        memberCode: true,
        status: true,
        bloodGroup: true,
        presentAddress: true,
        registrationDate: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    return {
      success: true,
      data: members,
    };
  } catch (error) {
    console.error("[getAdminMembers Error]", error);
    return {
      success: false,
      data: [],
      error: "সদস্য তালিকা লোড করতে সমস্যা হয়েছে।",
    };
  }
}

/**
 * Validates allowed status transitions.
 * PENDING -> ACTIVE
 * ACTIVE -> SUSPENDED
 * ACTIVE -> INACTIVE
 * SUSPENDED -> ACTIVE / INACTIVE
 * INACTIVE -> ACTIVE
 */
function isValidStatusTransition(
  currentStatus: MemberStatus,
  targetStatus: MemberStatus
): boolean {
  if (currentStatus === targetStatus) return false;

  const validTransitions: Record<MemberStatus, MemberStatus[]> = {
    PENDING: [MemberStatus.ACTIVE, MemberStatus.INACTIVE],
    ACTIVE: [MemberStatus.SUSPENDED, MemberStatus.INACTIVE],
    SUSPENDED: [MemberStatus.ACTIVE, MemberStatus.INACTIVE],
    INACTIVE: [MemberStatus.ACTIVE],
  };

  return validTransitions[currentStatus]?.includes(targetStatus) ?? false;
}

/**
 * Approve a PENDING member.
 */
export async function approveMember(memberId: string) {
  const admin = await requireAdmin();

  const profile = await prisma.memberProfile.findUnique({
    where: { id: memberId },
    include: { user: true },
  });

  if (!profile) {
    return { success: false, error: "সদস্য খুঁজে পাওয়া যায়নি।" };
  }

  if (profile.status !== "PENDING") {
    return {
      success: false,
      error: `শুধুমাত্র 'পেন্ডিং' সদস্যকে অনুমোদন করা যাবে। বর্তমান স্ট্যাটাস: ${profile.status}`,
    };
  }

  const updated = await prisma.memberProfile.update({
    where: { id: memberId },
    data: {
      status: MemberStatus.ACTIVE,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  await createAuditLog({
    action: "MEMBER_APPROVED",
    entityType: "MemberProfile",
    entityId: profile.id,
    details: {
      adminId: admin.id,
      adminName: admin.name,
      memberCode: profile.memberCode,
      memberName: profile.user.name,
      previousStatus: profile.status,
      newStatus: MemberStatus.ACTIVE,
      timestamp: new Date().toISOString(),
    },
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin");

  return {
    success: true,
    message: `${profile.user.name}-কে সফলভাবে অনুমোদন করা হয়েছে।`,
    data: updated,
  };
}

/**
 * Suspend an ACTIVE member.
 */
export async function suspendMember(memberId: string, reason?: string) {
  const admin = await requireAdmin();

  const profile = await prisma.memberProfile.findUnique({
    where: { id: memberId },
    include: { user: true },
  });

  if (!profile) {
    return { success: false, error: "সদস্য খুঁজে পাওয়া যায়নি।" };
  }

  if (profile.status !== "ACTIVE") {
    return {
      success: false,
      error: `শুধুমাত্র 'সক্রিয়' সদস্যকে সাময়িক স্থগিত করা যাবে। বর্তমান স্ট্যাটাস: ${profile.status}`,
    };
  }

  const updated = await prisma.memberProfile.update({
    where: { id: memberId },
    data: {
      status: MemberStatus.SUSPENDED,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  await createAuditLog({
    action: "MEMBER_SUSPENDED",
    entityType: "MemberProfile",
    entityId: profile.id,
    details: {
      adminId: admin.id,
      adminName: admin.name,
      memberCode: profile.memberCode,
      memberName: profile.user.name,
      previousStatus: profile.status,
      newStatus: MemberStatus.SUSPENDED,
      reason: reason || "অ্যাডমিন কর্তৃক স্থগিত",
      timestamp: new Date().toISOString(),
    },
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin");

  return {
    success: true,
    message: `${profile.user.name}-কে সাময়িক স্থগিত করা হয়েছে।`,
    data: updated,
  };
}

/**
 * Deactivate a member (ACTIVE -> INACTIVE).
 */
export async function deactivateMember(memberId: string, reason?: string) {
  const admin = await requireAdmin();

  const profile = await prisma.memberProfile.findUnique({
    where: { id: memberId },
    include: { user: true },
  });

  if (!profile) {
    return { success: false, error: "সদস্য খুঁজে পাওয়া যায়নি।" };
  }

  if (profile.status !== "ACTIVE" && profile.status !== "SUSPENDED") {
    return {
      success: false,
      error: `বর্তমান স্ট্যাটাস '${profile.status}' থেকে নিষ্ক্রিয় করা যাবে না।`,
    };
  }

  const updated = await prisma.memberProfile.update({
    where: { id: memberId },
    data: {
      status: MemberStatus.INACTIVE,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  await createAuditLog({
    action: "MEMBER_DEACTIVATED",
    entityType: "MemberProfile",
    entityId: profile.id,
    details: {
      adminId: admin.id,
      adminName: admin.name,
      memberCode: profile.memberCode,
      memberName: profile.user.name,
      previousStatus: profile.status,
      newStatus: MemberStatus.INACTIVE,
      reason: reason || "অ্যাডমিন কর্তৃক নিষ্ক্রিয়",
      timestamp: new Date().toISOString(),
    },
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin");

  return {
    success: true,
    message: `${profile.user.name}-কে নিষ্ক্রিয় করা হয়েছে।`,
    data: updated,
  };
}

/**
 * Generic status updater with transition validation.
 */
export async function updateMemberStatus(params: {
  memberId: string;
  newStatus: MemberStatus;
  notes?: string;
}) {
  const admin = await requireAdmin();

  const profile = await prisma.memberProfile.findUnique({
    where: { id: params.memberId },
    include: { user: true },
  });

  if (!profile) {
    return { success: false, error: "সদস্য খুঁজে পাওয়া যায়নি।" };
  }

  const oldStatus = profile.status;

  if (!isValidStatusTransition(oldStatus, params.newStatus)) {
    return {
      success: false,
      error: `'${oldStatus}' থেকে '${params.newStatus}' স্ট্যাটাসে পরিবর্তন অনুমোদিত নয়।`,
    };
  }

  const updated = await prisma.memberProfile.update({
    where: { id: params.memberId },
    data: { status: params.newStatus },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  // Determine audit log action name
  let auditAction = `MEMBER_STATUS_CHANGE_${params.newStatus}`;
  if (params.newStatus === MemberStatus.ACTIVE && oldStatus === MemberStatus.PENDING) {
    auditAction = "MEMBER_APPROVED";
  } else if (params.newStatus === MemberStatus.SUSPENDED) {
    auditAction = "MEMBER_SUSPENDED";
  } else if (params.newStatus === MemberStatus.INACTIVE) {
    auditAction = "MEMBER_DEACTIVATED";
  }

  await createAuditLog({
    action: auditAction,
    entityType: "MemberProfile",
    entityId: profile.id,
    details: {
      adminId: admin.id,
      adminName: admin.name,
      memberCode: profile.memberCode,
      memberName: profile.user.name,
      oldStatus,
      newStatus: params.newStatus,
      notes: params.notes,
      timestamp: new Date().toISOString(),
    },
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin");

  return {
    success: true,
    message: `সদস্য স্ট্যাটাস সফলভাবে '${params.newStatus}' এ পরিবর্তন করা হয়েছে।`,
    data: updated,
  };
}
