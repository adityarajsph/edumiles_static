import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import AdminModel from "@/lib/models/Admin";
import { AdminUserCreateSchema } from "@/lib/zod-schemas";
import { getAdminFromCookies } from "@/lib/auth";

/* ── GET /api/admin/users  (superadmin only) ─────── */
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (admin.role !== "superadmin") {
      return NextResponse.json({ success: false, message: "Forbidden — superadmin only" }, { status: 403 });
    }

    await connectDB();
    // Never return password hashes to the client
    const users = await AdminModel.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    console.error("[ADMIN USERS GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── POST /api/admin/users  (superadmin only) ────── */
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (admin.role !== "superadmin") {
      return NextResponse.json({ success: false, message: "Forbidden — superadmin only" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = AdminUserCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await AdminModel.findOne({ email: parsed.data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, message: "An admin with this email already exists" }, { status: 409 });
    }

    const hash = await bcrypt.hash(parsed.data.password, 12);
    const user = await AdminModel.create({
      email:    parsed.data.email.toLowerCase(),
      password: hash,
      role:     parsed.data.role,
      modules:  parsed.data.modules ?? [],
    });

    // Never return the hash — strip it from the plain object before sending
    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj["password"];
    return NextResponse.json({ success: true, data: userObj }, { status: 201 });
  } catch (err) {
    console.error("[ADMIN USERS POST]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
