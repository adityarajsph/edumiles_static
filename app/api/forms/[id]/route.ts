import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FormSubmissionModel from "@/lib/models/FormSubmission";
import { SubmissionUpdateSchema } from "@/lib/zod-schemas";
import { getAdminFromCookies, adminHasModuleAccess } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "submissions");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to submissions module" }, { status: 403 });

    const { id } = await params;
    await connectDB();
    const submission = await FormSubmissionModel.findById(id).lean();
    if (!submission) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: submission });
  } catch (err) {
    console.error("[FORM GET]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "submissions");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to submissions module" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const parsed = SubmissionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();
    const submission = await FormSubmissionModel.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
    if (!submission) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: submission });
  } catch (err) {
    console.error("[FORM PATCH]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const allowed = await adminHasModuleAccess(admin.adminId, admin.role, "submissions");
    if (!allowed) return NextResponse.json({ success: false, message: "Forbidden — no access to submissions module" }, { status: 403 });

    const { id } = await params;
    await connectDB();
    const submission = await FormSubmissionModel.findByIdAndDelete(id).lean();
    if (!submission) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch (err) {
    console.error("[FORM DELETE]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
