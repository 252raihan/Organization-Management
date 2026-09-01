"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { setSessionCookie, clearSessionCookie, createSessionToken } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export interface LoginResult {
  success: boolean;
  message?: string;
  error?: string;
  redirectTo?: string;
}

/**
 * Server-side login action.
 * Allows login via Phone or Email + Password.
 * Returns generic error on mismatch (security best practice).
 */
export async function loginUser(formData: unknown): Promise<LoginResult> {
  try {
    const validated = loginSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        error: "মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড প্রদান করুন।",
      };
    }

    const { identifier, password } = validated.data;
    const cleanIdentifier = identifier.trim();

    // Query user by phone or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: cleanIdentifier },
          { email: cleanIdentifier },
        ],
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: "আপনার একাউন্টটি বর্তমানে স্থগিত বা নিষ্ক্রিয় রয়েছে। পরিচালকের সাথে যোগাযোগ করুন।",
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return {
        success: false,
        error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।",
      };
    }

    // Generate session token & set cookie
    const token = await createSessionToken({
      id: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
    });
    await setSessionCookie(token);

    // Audit log
    await createAuditLog({
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user.id,
      details: { role: user.role },
    });

    const redirectTo = user.role === "ADMIN" ? "/admin" : "/dashboard";

    return {
      success: true,
      message: "সফলভাবে লগইন হয়েছে।",
      redirectTo,
    };
  } catch (error) {
    console.error("[Login Error]", error);
    return {
      success: false,
      error: "লগইন প্রক্রিয়াকরণে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    };
  }
}

/**
 * Server-side logout action.
 */
export async function logoutUser() {
  await clearSessionCookie();
  return { success: true };
}
