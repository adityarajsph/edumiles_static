import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/lib/models/Category";
import { CategoryUpdateSchema } from "@/lib/zod-schemas";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/* ── PUT /api/categories/[id] (admin) ──────────────── */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "categories");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to categories module" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const parsed = CategoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    if (parsed.data.slug) {
      const dupe = await CategoryModel.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (dupe) {
        return NextResponse.json({ success: false, message: "Slug already in use" }, { status: 409 });
      }
    }

    const category = await CategoryModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true }).lean();
    if (!category) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    console.error("[CATEGORY PUT]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── DELETE /api/categories/[id] (admin) ──────────── */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "categories");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to categories module" }, { status: 403 });

    const { id } = await params;
    await connectDB();
    const category = await CategoryModel.findByIdAndDelete(id).lean();
    if (!category) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("[CATEGORY DELETE]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
