/**
 * lib/auth.ts
 * JWT helpers for admin authentication.
 * Tokens are stored in an httpOnly, secure, sameSite=strict cookie.
 */

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET  = process.env.JWT_SECRET;
const COOKIE_NAME = "edumiles_admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface JwtPayload {
  adminId: string;
  email: string;
  role: string;
}

/** Full admin data returned to the client (includes modules from DB). */
export interface AdminSession extends JwtPayload {
  modules: string[];
}

/** Sign a JWT and return the token string. */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET || "dev-secret-replace-in-production", {
    expiresIn: "7d",
  });
}

/** Verify a token; returns the payload or null on failure. */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(
      token,
      JWT_SECRET || "dev-secret-replace-in-production"
    ) as JwtPayload;
  } catch {
    return null;
  }
}

/** Set the auth cookie in a server action / route handler. */
export function setAuthCookie(token: string): string {
  // Returns a Set-Cookie header value string
  const isProduction = process.env.NODE_ENV === "production";
  return [
    `${COOKIE_NAME}=${token}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    "Path=/",
    "HttpOnly",
    isProduction ? "Secure" : "",
    "SameSite=Strict",
  ]
    .filter(Boolean)
    .join("; ");
}

/** Clear the auth cookie. */
export function clearAuthCookieHeader(): string {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`;
}

/** Get the authenticated admin payload from the current request cookies.
 *  Returns null if not authenticated.
 */
export async function getAdminFromCookies(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

/** Extract and verify token from a NextRequest (used in middleware). */
export function getAdminFromRequest(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Check whether the authenticated admin has access to a specific module.
 *
 * Rules:
 *  - Not authenticated  → return false
 *  - superadmin         → always allowed (full access regardless of modules array)
 *  - editor             → only if the module key is in their DB modules array
 *
 * @param adminId  The JWT adminId
 * @param role     The JWT role
 * @param module   The module key to check (e.g. "packages", "blogs", etc.)
 */
export async function adminHasModuleAccess(
  adminId: string,
  role: string,
  module: string
): Promise<boolean> {
  if (role === "superadmin") return true;

  // Import here to avoid circular deps and keep this file lightweight
  const connectDB    = (await import("@/lib/mongodb")).default;
  const AdminModel   = (await import("@/lib/models/Admin")).default;

  await connectDB();
  const adminDoc = await AdminModel.findById(adminId, { modules: 1, role: 1 }).lean();
  if (!adminDoc) return false;
  // Double-check role in DB (in case it was changed after token was issued)
  if (adminDoc.role === "superadmin") return true;
  return Array.isArray(adminDoc.modules) && adminDoc.modules.includes(module);
}
