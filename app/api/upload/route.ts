import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { getAdminFromCookies } from "@/lib/auth";

export const maxDuration = 60; // seconds
export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES  = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "edumiles/uploads";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 8 MB." },
        { status: 400 }
      );
    }

    // Convert to base64 data URL for Cloudinary upload
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadToCloudinary(base64, folder);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err) {
    console.error("[UPLOAD]", err);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

/**
 * DELETE /api/upload
 * Body: { publicId: string }
 * Deletes an image from Cloudinary by its public ID.
 * Accepts either a full public ID ("edumiles/packages/abc123")
 * or a full Cloudinary URL from which the public ID is extracted.
 */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json() as { publicId?: string; url?: string };
    let publicId = body.publicId;

    // If a full URL was provided instead, extract the public ID from it.
    // Cloudinary URLs look like:
    //   https://res.cloudinary.com/<cloud>/image/upload/v<version>/<folder/name>.<ext>
    if (!publicId && body.url) {
      const match = body.url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i);
      publicId = match?.[1];
    }

    if (!publicId) {
      return NextResponse.json({ success: false, message: "publicId or url is required" }, { status: 400 });
    }

    await deleteFromCloudinary(publicId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE UPLOAD]", err);
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}
