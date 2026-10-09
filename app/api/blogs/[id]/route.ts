import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import BlogModel from "@/lib/models/Blog";
import { BlogUpdateSchema } from "@/lib/zod-schemas";
import { sanitizeRichText } from "@/lib/sanitize";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const blog = await BlogModel.findById(id).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    console.error("[BLOG GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "blogs");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to blogs module" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const parsed = BlogUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();
    if (parsed.data.slug) {
      const dupe = await BlogModel.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
      if (dupe) return NextResponse.json({ success: false, message: "Slug already in use" }, { status: 409 });
    }

    const updateData = { ...parsed.data };
    if (updateData.content) updateData.content = sanitizeRichText(updateData.content);

    const blog = await BlogModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (parsed.data.slug) revalidatePath(`/blog/${parsed.data.slug}`, "page");
    revalidatePath("/blog", "page");
    revalidatePath("/", "page");
    revalidateTag("blogs", "default");

    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    console.error("[BLOG PUT]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "blogs");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to blogs module" }, { status: 403 });

    const { id } = await params;
    await connectDB();
    const blog = await BlogModel.findByIdAndDelete(id).lean();
    if (!blog) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    revalidatePath("/blog", "page");
    revalidatePath("/", "page");
    revalidateTag("blogs", "default");

    return NextResponse.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    console.error("[BLOG DELETE]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
