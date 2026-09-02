"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import {
  setSessionCookie,
  clearSessionCookie,
  createSessionToken,
  getCurrentUser,
} from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

function isSafeInternalCallbackUrl(
  value: unknown,
  role: "ADMIN" | "MEMBER"
): value is string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return false;
  }

  try {
    const url = new URL(value, "http://localhost");
    const allowedPath = role === "ADMIN"
      ? url.pathname.startsWith("/admin") || url.pathname.startsWith("/dashboard")
      : url.pathname.startsWith("/dashboard");
    return url.origin === "http://localhost" && !url.username && !url.password && allowedPath;
  } catch {
    return false;
  }
}

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

    const { identifier, password, callbackUrl } = validated.data;
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

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return {
        success: false,
        error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: "আপনার অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয়। পরিচালকের সাথে যোগাযোগ করুন।",
      };
    }

    if (user.role === "MEMBER") {
      const statusMessages = {
        PENDING: "আপনার সদস্য আবেদন এখনো অনুমোদিত হয়নি।",
        SUSPENDED: "আপনার সদস্য অ্যাকাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে।",
        INACTIVE: "আপনার সদস্য অ্যাকাউন্ট বর্তমানে নিষ্ক্রিয়।",
      } as const;
      const status = user.profile?.status;
      if (status !== "ACTIVE") {
        return {
          success: false,
          error: statusMessages[status || "PENDING"],
        };
      }
    }

    // Generate session token & set cookie
    const token = await createSessionToken({
      id: user.id,
      role: user.role,
    });
    await setSessionCookie(token);

    // Audit log
    await createAuditLog({
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user.id,
      details: { role: user.role },
    });

    const defaultRedirect = user.role === "ADMIN" ? "/admin" : "/dashboard";
    const redirectTo = isSafeInternalCallbackUrl(callbackUrl, user.role)
      ? callbackUrl
      : defaultRedirect;

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
  try {
    const user = await getCurrentUser();
    if (user) {
      await createAuditLog({
        action: "USER_LOGOUT",
        entityType: "User",
        entityId: user.id,
        details: { role: user.role },
      });
    }
    await clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error("[Logout Error]", error);
    try {
      await clearSessionCookie();
    } catch {
      // Ignore cookie cleanup errors after a failed logout audit.
    }
    return { success: false, error: "লগআউট করা যায়নি। আবার চেষ্টা করুন।" };
  }
}
