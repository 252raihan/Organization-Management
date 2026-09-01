import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";
import { prisma } from "./prisma";
import type { SessionUser, AuthSession } from "@/types";

export const AUTH_COOKIE_NAME = "gswo_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-gswo-secret-key-at-least-32-chars-long"
);

export type { SessionUser, AuthSession };

export async function createSessionToken(payload: {
  id: string;
  role: Role;
  phone: string;
  name: string;
}): Promise<string> {
  return new SignJWT({
    sub: payload.id,
    role: payload.role,
    phone: payload.phone,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
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

    let dbUser = null;
    try {
      dbUser = await prisma.user.findUnique({
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
    } catch {
      // Fallback to verified JWT session if database is offline/unreachable
      return {
        id: payload.sub as string,
        name: (payload.name as string) || "ব্যবহারকারী",
        email: (payload.email as string) || null,
        phone: (payload.phone as string) || "",
        role: (payload.role as Role) || "MEMBER",
        memberCode: (payload.memberCode as string) || null,
        status: (payload.status as string) || "ACTIVE",
      };
    }

    if (!dbUser) {
      return {
        id: payload.sub as string,
        name: (payload.name as string) || "ব্যবহারকারী",
        email: (payload.email as string) || null,
        phone: (payload.phone as string) || "",
        role: (payload.role as Role) || "MEMBER",
        memberCode: (payload.memberCode as string) || null,
        status: (payload.status as string) || "ACTIVE",
      };
    }

    if (!dbUser.isActive) {
      return null;
    }

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role,
      memberCode: dbUser.profile?.memberCode,
      status: dbUser.profile?.status,
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
  if (user.role !== "ADMIN") {
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
