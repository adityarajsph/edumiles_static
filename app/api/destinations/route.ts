import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DestinationModel from "@/lib/models/Destination";
import PackageModel from "@/lib/models/Package";
import { DestinationCreateSchema } from "@/lib/zod-schemas";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

/**
 * GET /api/destinations
 * Public. Returns all destinations sorted by order, optionally with package counts.
 * Query param: ?counts=true to include packageCount aggregation.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const withCounts = req.nextUrl.searchParams.get("counts") === "true";

    const items = await DestinationModel.find({}).sort({ order: 1, name: 1 }).lean();

    if (!withCounts) {
      return NextResponse.json({ success: true, data: items });
    }

    // Attach package counts using a single aggregation — no N+1
    const slugs = items.map(d => d.slug);
    const counts = await PackageModel.aggregate([
      { $match: { destinationSlug: { $in: slugs }, status: "published" } },
      { $group: { _id: "$destinationSlug", count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    for (const c of counts) countMap[c._id] = c.count;

    const withCount = items.map(d => ({
      ...d,
      packageCount: countMap[d.slug] ?? 0,
    }));

    return NextResponse.json({ success: true, data: withCount });
  } catch (err) {
    console.error("[DESTINATIONS GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/destinations  (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "destinations");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = DestinationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await DestinationModel.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ success: false, message: "A destination with this slug already exists" }, { status: 409 });
    }

    const dest = await DestinationModel.create(parsed.data);
    return NextResponse.json({ success: true, data: dest }, { status: 201 });
  } catch (err) {
    console.error("[DESTINATIONS POST]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
