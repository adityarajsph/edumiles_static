import { NextResponse } from "next/server";
import { clearAuthCookieHeader } from "@/lib/auth";

export async function POST() {
  return NextResponse.json(
    { success: true, message: "Logged out" },
    { status: 200, headers: { "Set-Cookie": clearAuthCookieHeader() } }
  );
}
