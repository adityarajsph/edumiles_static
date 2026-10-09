import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import AdminModel from "@/lib/models/Admin";
import { AdminUserUpdateSchema } from "@/lib/zod-schemas";
import { getAdminFromCookies } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/* ── PUT /api/admin/users/[id]  (superadmin only) ── */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (admin.role !== "superadmin") {
      return NextResponse.json({ success: false, message: "Forbidden — superadmin only" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = AdminUserUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    // Prevent removing the last superadmin
    if (parsed.data.role === "editor") {
      const superadminCount = await AdminModel.countDocuments({ role: "superadmin", _id: { $ne: id } });
      if (superadminCount === 0) {
        const target = await AdminModel.findById(id);
        if (target?.role === "superadmin") {
          return NextResponse.json(
            { success: false, message: "Cannot demote the last superadmin" },
            { status: 400 }
          );
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = {};
    if (parsed.data.email)   update.email   = parsed.data.email.toLowerCase();
    if (parsed.data.role)    update.role    = parsed.data.role;
    if (parsed.data.modules !== undefined) update.modules = parsed.data.modules;
    if (parsed.data.password) {
      update.password = await bcrypt.hash(parsed.data.password, 12);
    }

    const user = await AdminModel.findByIdAndUpdate(id, update, { new: true, runValidators: true, projection: { password: 0 } }).lean();
    if (!user) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error("[ADMIN USER PUT]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── DELETE /api/admin/users/[id]  (superadmin only) */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (admin.role !== "superadmin") {
      return NextResponse.json({ success: false, message: "Forbidden — superadmin only" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if (admin.adminId === id) {
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 });
    }

    await connectDB();

    // Prevent deleting the last superadmin
    const target = await AdminModel.findById(id);
    if (!target) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (target.role === "superadmin") {
      const count = await AdminModel.countDocuments({ role: "superadmin" });
      if (count <= 1) {
        return NextResponse.json({ success: false, message: "Cannot delete the last superadmin" }, { status: 400 });
      }
    }

    await AdminModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("[ADMIN USER DELETE]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
