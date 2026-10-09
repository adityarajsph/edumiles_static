import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PackageModel from "@/lib/models/Package";
import { PackageCreateSchema } from "@/lib/zod-schemas";
import { sanitizeRichText } from "@/lib/sanitize";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

/* ── GET /api/packages ─────────────────────────────
 * Public (published) or admin (all) depending on auth.
 * Query params: status, category, featured, page, limit, search
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const admin = await getAdminFromCookies();
    const { searchParams } = req.nextUrl;

    const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit    = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip     = (page - 1) * limit;
    const search   = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const featured = searchParams.get("featured") ?? "";
    const status   = searchParams.get("status") ?? "";
    const destinationSlug = searchParams.get("destinationSlug") ?? "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    // Non-admin always sees published only
    if (!admin) filter.status = "published";
    else if (status) filter.status = status;

    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (destinationSlug) filter.destinationSlug = destinationSlug;
    if (search) filter.$or = [
      { title:       { $regex: search, $options: "i" } },
      { destination: { $regex: search, $options: "i" } },
    ];

    const [items, total] = await Promise.all([
      PackageModel.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      PackageModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[PACKAGES GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── POST /api/packages (admin) ────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "packages");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to packages module" }, { status: 403 });

    const body = await req.json();
    const parsed = PackageCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    // Check slug uniqueness
    const existing = await PackageModel.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ success: false, message: "A package with this slug already exists" }, { status: 409 });
    }

    const pkg = await PackageModel.create({
      ...parsed.data,
      fullDescription: sanitizeRichText(parsed.data.fullDescription),
    });

    return NextResponse.json({ success: true, data: pkg }, { status: 201 });
  } catch (err) {
    console.error("[PACKAGES POST]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
