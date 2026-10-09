import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import AdminModel from "@/lib/models/Admin";

export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    // Fetch the full admin document from DB to get the up-to-date modules array
    await connectDB();
    const adminDoc = await AdminModel.findById(admin.adminId, { password: 0 }).lean();
    if (!adminDoc) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        adminId: admin.adminId,
        email:   admin.email,
        role:    admin.role,
        // Superadmin gets all modules implicitly; editor gets their assigned list
        modules: admin.role === "superadmin" ? [] : (adminDoc.modules ?? []),
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
