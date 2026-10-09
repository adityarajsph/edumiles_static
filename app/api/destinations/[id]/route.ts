import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DestinationModel from "@/lib/models/Destination";
import { DestinationUpdateSchema } from "@/lib/zod-schemas";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/* ── GET /api/destinations/[id] ─ public ────────── */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const dest = await DestinationModel.findById(id).lean();
    if (!dest) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: dest });
  } catch (err) {
    console.error("[DESTINATION GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── PUT /api/destinations/[id] ─ admin ─────────── */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "destinations");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const parsed = DestinationUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    if (parsed.data.slug) {
      const dupe = await DestinationModel.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (dupe) return NextResponse.json({ success: false, message: "Slug already in use" }, { status: 409 });
    }

    const dest = await DestinationModel.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true }).lean();
    if (!dest) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: dest });
  } catch (err) {
    console.error("[DESTINATION PUT]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── DELETE /api/destinations/[id] ─ admin ──────── */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "destinations");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const { id } = await params;
    await connectDB();
    const dest = await DestinationModel.findByIdAndDelete(id).lean();
    if (!dest) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Destination deleted" });
  } catch (err) {
    console.error("[DESTINATION DELETE]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
