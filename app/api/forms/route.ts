import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FormSubmissionModel from "@/lib/models/FormSubmission";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    // Allow sidebar badge fetch (status=new&limit=1) from any authenticated admin;
    // full submissions access requires the submissions module.
    const { searchParams } = req.nextUrl;
    const isBadgeFetch = searchParams.get("status") === "new" && searchParams.get("limit") === "1";

    if (!isBadgeFetch) {
      const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "submissions");
      if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to submissions module" }, { status: 403 });
    }

    await connectDB();
    const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit    = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip     = (page - 1) * limit;
    const formSlug = searchParams.get("formSlug") ?? "";
    const status   = searchParams.get("status") ?? "";
    const search   = searchParams.get("search") ?? "";
    const from     = searchParams.get("from") ?? "";
    const to       = searchParams.get("to") ?? "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (formSlug) filter.formSlug = formSlug;
    if (status) filter.status = status;
    if (search) filter.$or = [
      { "data.name":  { $regex: search, $options: "i" } },
      { "data.email": { $regex: search, $options: "i" } },
      { "data.phone": { $regex: search, $options: "i" } },
    ];
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(to + "T23:59:59.999Z");
    }

    const [items, total] = await Promise.all([
      FormSubmissionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      FormSubmissionModel.countDocuments(filter),
    ]);

    // Count new submissions per formSlug for sidebar badges
    const unreadCounts = await FormSubmissionModel.aggregate([
      { $match: { status: "new" } },
      { $group: { _id: "$formSlug", count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items, total, page, limit,
        totalPages: Math.ceil(total / limit),
        unreadCounts: Object.fromEntries(unreadCounts.map(u => [u._id, u.count])),
      },
    });
  } catch (err) {
    console.error("[FORMS GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
