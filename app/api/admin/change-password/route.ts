import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import AdminModel from "@/lib/models/Admin";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";
import { AdminPasswordChangeSchema } from "@/lib/zod-schemas";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAdminFromCookies();
    if (!auth) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(auth.adminId, auth.role, "settings");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to settings module" }, { status: 403 });

    const body   = await req.json();
    const parsed = AdminPasswordChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();
    const admin = await AdminModel.findById(auth.adminId);
    if (!admin) return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });

    const match = await bcrypt.compare(parsed.data.currentPassword, admin.password);
    if (!match) return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 });

    admin.password = await bcrypt.hash(parsed.data.newPassword, 12);
    await admin.save();

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("[CHANGE PASSWORD]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
