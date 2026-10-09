import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import PackageModel from "@/lib/models/Package";
import { PackageUpdateSchema } from "@/lib/zod-schemas";
import { sanitizeRichText } from "@/lib/sanitize";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/* ── GET /api/packages/[id] ────────────────────── */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const pkg = await PackageModel.findById(id).lean();
    if (!pkg) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: pkg });
  } catch (err) {
    console.error("[PACKAGE GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── PUT /api/packages/[id] (admin) ────────────── */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "packages");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to packages module" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const parsed = PackageUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    // Slug uniqueness check (only if slug is being changed)
    if (parsed.data.slug) {
      const dupe = await PackageModel.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (dupe) {
        return NextResponse.json({ success: false, message: "Slug already in use" }, { status: 409 });
      }
    }

    const updateData = { ...parsed.data };
    if (updateData.fullDescription) {
      updateData.fullDescription = sanitizeRichText(updateData.fullDescription);
    }

    const pkg = await PackageModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
    if (!pkg) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    // Bust the ISR cache for this package's detail page
    if (parsed.data.slug) {
      revalidatePath(`/packages/${parsed.data.slug}`, "page");
    }
    revalidatePath("/packages", "page");
    revalidatePath("/", "page");
    revalidateTag("packages", "default");

    return NextResponse.json({ success: true, data: pkg });
  } catch (err) {
    console.error("[PACKAGE PUT]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── DELETE /api/packages/[id] (admin) ─────────── */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "packages");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to packages module" }, { status: 403 });

    const { id } = await params;
    await connectDB();
    const pkg = await PackageModel.findByIdAndDelete(id).lean();
    if (!pkg) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    revalidatePath("/packages", "page");
    revalidatePath("/", "page");
    revalidateTag("packages", "default");

    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (err) {
    console.error("[PACKAGE DELETE]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
