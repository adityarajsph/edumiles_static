import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/lib/models/Category";
import PackageModel from "@/lib/models/Package";
import { CategoryCreateSchema } from "@/lib/zod-schemas";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

/* ── GET /api/categories ───────────────────────────
 * Public: returns all categories sorted by order.
 * Query param: ?counts=true to include packageCount aggregation.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const withCounts = req.nextUrl.searchParams.get("counts") === "true";

    const items = await CategoryModel.find({}).sort({ order: 1, name: 1 }).lean();

    if (!withCounts) {
      return NextResponse.json({ success: true, data: items });
    }

    // One aggregation instead of N queries
    const names = items.map(c => c.name);
    const counts = await PackageModel.aggregate([
      { $match: { category: { $in: names }, status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    for (const c of counts) countMap[c._id] = c.count;

    const withCount = items.map(c => ({ ...c, packageCount: countMap[c.name] ?? 0 }));
    return NextResponse.json({ success: true, data: withCount });
  } catch (err) {
    console.error("[CATEGORIES GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/* ── POST /api/categories (admin) ──────────────────── */
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "categories");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to categories module" }, { status: 403 });

    const body = await req.json();
    const parsed = CategoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await CategoryModel.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ success: false, message: "A category with this slug already exists" }, { status: 409 });
    }

    const category = await CategoryModel.create(parsed.data);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    console.error("[CATEGORIES POST]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
