import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

function getJwtSecret(): Uint8Array | null {
  const configuredSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (configuredSecret) {
    if (configuredSecret.length < 32) {
      return null;
    }
    return new TextEncoder().encode(configuredSecret);
  }

  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode(
      "development-only-gswo-secret-do-not-use-in-production"
    );
  }

  return null;
}

interface SessionPayload {
  role?: string;
  sub?: string;
  name?: string;
  phone?: string;
  [key: string]: unknown;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("gswo_session")?.value;

  let session: SessionPayload | null = null;
  const jwtSecret = getJwtSecret();
  if (token && jwtSecret) {
    try {
      const { payload } = await jwtVerify(token, jwtSecret);
      session = payload as SessionPayload;
    } catch {
      session = null;
    }
  }

  // Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Admin protection
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
