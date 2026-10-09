import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BlogModel from "@/lib/models/Blog";
import { BlogCreateSchema } from "@/lib/zod-schemas";
import { sanitizeRichText } from "@/lib/sanitize";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (!admin) filter.status = "published";
    else if (status) filter.status = status;

    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (search) filter.$or = [
      { title:   { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];

    const [items, total] = await Promise.all([
      BlogModel.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
      BlogModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[BLOGS GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "blogs");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to blogs module" }, { status: 403 });

    const body = await req.json();
    const parsed = BlogCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await BlogModel.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json({ success: false, message: "A blog with this slug already exists" }, { status: 409 });
    }

    const blog = await BlogModel.create({
      ...parsed.data,
      content: sanitizeRichText(parsed.data.content),
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (err) {
    console.error("[BLOGS POST]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
