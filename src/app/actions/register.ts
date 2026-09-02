"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { generateNextMemberCode } from "@/lib/member-code";
import { createAuditLog } from "@/lib/audit";
import { clearSessionCookie } from "@/lib/auth";
import { BloodGroup } from "@prisma/client";

export interface RegisterResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    memberCode: string;
    userId: string;
  };
}

/**
 * Server-side member registration action.
 * - Validates input with Zod
 * - Hashes password with bcrypt
 * - Generates unique memberCode in transaction (GSWO-001...)
 * - Sets status = PENDING
 * - Sets server-generated registrationDate = now()
 * - Performs atomic transaction for User + MemberProfile
 */
export async function registerMember(formData: unknown): Promise<RegisterResult> {
  try {
    const validated = registerSchema.safeParse(formData);

    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      return {
        success: false,
        error: firstIssue?.message || "প্রদত্ত তথ্যে ভুল রয়েছে। পুনরায় যাচাই করুন।",
      };
    }

    const {
      name,
      phone,
      email,
      password,
      bloodGroup,
      presentAddress,
      permanentAddress,
      fatherName,
      motherName,
      guardianPhone,
      dateOfBirth,
    } = validated.data;

    // Check duplicate phone
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
      select: { id: true },
    });
    if (existingPhone) {
      return {
        success: false,
        error: "এই মোবাইল নম্বরটি দিয়ে ইতোমধ্যে নিবন্ধন করা হয়েছে।",
      };
    }

    // Check duplicate email if provided
    const cleanEmail = email && email.trim() !== "" ? email.trim() : null;
    if (cleanEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail },
        select: { id: true },
      });
      if (existingEmail) {
        return {
          success: false,
          error: "এই ইমেইল এড্রেসটি দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে।",
        };
      }
    }

    // Hash password with 12 rounds
    const passwordHash = await bcrypt.hash(password, 12);

    // Parse dateOfBirth safely if provided
    let parsedDob: Date | null = null;
    if (dateOfBirth && dateOfBirth.trim() !== "") {
      const d = new Date(dateOfBirth);
      if (!isNaN(d.getTime())) {
        parsedDob = d;
      }
    }

    // Execute Prisma transaction for User and MemberProfile
    const result = await prisma.$transaction(async (tx) => {
      // Generate next member code safely inside transaction
      const memberCode = await generateNextMemberCode(tx);

      // Server generated registration date
      const serverRegistrationDate = new Date();

      const user = await tx.user.create({
        data: {
          name,
          phone,
          email: cleanEmail,
          passwordHash,
          role: "MEMBER",
          isActive: true,
          profile: {
            create: {
              memberCode,
              status: "PENDING",
              bloodGroup: bloodGroup as BloodGroup,
              presentAddress,
              permanentAddress: permanentAddress || null,
              fatherName: fatherName || null,
              motherName: motherName || null,
              guardianPhone: guardianPhone || null,
              dateOfBirth: parsedDob,
              registrationDate: serverRegistrationDate,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return { user, memberCode };
    });

    // Create AuditLog
    await createAuditLog({
      action: "MEMBER_REGISTRATION",
      entityType: "User",
      entityId: result.user.id,
      details: {
        memberCode: result.memberCode,
        phone,
        status: "PENDING",
      },
    });

    // A PENDING member must remain unauthenticated until admin approval.
    await clearSessionCookie();

    return {
      success: true,
      message: "আপনার আবেদন সফলভাবে গৃহীত হয়েছে। অ্যাডমিনের অনুমোদনের পর সক্রিয় হবে।",
      data: {
        memberCode: result.memberCode,
        userId: result.user.id,
      },
    };
  } catch (error) {
    console.error("[Register Error]", error);
    return {
      success: false,
      error: "নিবন্ধন প্রক্রিয়াকরণে ত্রুটি হয়েছে। কিছু সময় পর আবার চেষ্টা করুন।",
    };
  }
}
