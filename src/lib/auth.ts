import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { MemberStatus, Role } from "@prisma/client";
import { prisma } from "./prisma";
import type { SessionUser, AuthSession } from "@/types";

export const AUTH_COOKIE_NAME = "gswo_session";

function getJwtSecret(): Uint8Array {
  const configuredSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  if (configuredSecret) {
    if (configuredSecret.length < 32) {
      throw new Error("AUTH_SECRET must be at least 32 characters long");
    }
    return new TextEncoder().encode(configuredSecret);
  }

  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode(
      "development-only-gswo-secret-do-not-use-in-production"
    );
  }

  throw new Error("Authentication secret is not configured");
}

export type { SessionUser, AuthSession };

export async function createSessionToken(payload: {
  id: string;
  role: Role;
}): Promise<string> {
  return new SignJWT({
    sub: payload.id,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Server-side session resolver retrieving verified user from database.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.sub) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        profile: {
          select: {
            memberCode: true,
            status: true,
          },
        },
      },
    });

    if (!dbUser || !dbUser.isActive) {
      return null;
    }

    if (dbUser.role === Role.ADMIN) {
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role,
        memberCode: dbUser.profile?.memberCode,
        status: dbUser.profile?.status,
      };
    }

    if (dbUser.role !== Role.MEMBER || dbUser.profile?.status !== MemberStatus.ACTIVE) {
      return null;
    }

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role,
      memberCode: dbUser.profile.memberCode,
      status: dbUser.profile.status,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== Role.ADMIN) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export function hasRole(user: SessionUser | null, requiredRole: Role): boolean {
  if (!user) return false;
  return user.role === requiredRole;
}

export function isAdmin(user: SessionUser | null): boolean {
  return hasRole(user, "ADMIN");
}

export function isMember(user: SessionUser | null): boolean {
  return hasRole(user, "MEMBER") || hasRole(user, "ADMIN");
}
