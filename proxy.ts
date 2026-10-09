/**
 * proxy.ts  (Next.js 16 — replaces the deprecated middleware.ts)
 * Protects /admin/* routes (except /admin/login).
 * Public pages are NEVER matched — matcher is strictly scoped.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminFromRequest } from "./lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and auth API calls through without auth check
  if (pathname === "/admin/login" || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const admin = getAdminFromRequest(request);

  if (!admin) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Strictly scoped — public pages are NEVER affected
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
