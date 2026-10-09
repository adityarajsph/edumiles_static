import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import AdminModel from "@/lib/models/Admin";
import { signToken, setAuthCookie } from "@/lib/auth";
import { AdminLoginSchema } from "@/lib/zod-schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AdminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();
    const admin = await AdminModel.findOne({ email: parsed.data.email.toLowerCase() });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(parsed.data.password, admin.password);
    if (!passwordMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ adminId: admin._id.toString(), email: admin.email, role: admin.role });
    const cookieHeader = setAuthCookie(token);

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200, headers: { "Set-Cookie": cookieHeader } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack   = err instanceof Error ? err.stack   : undefined;
    console.error("[AUTH LOGIN ERROR]", { message, stack, mongoUri: !!process.env.MONGODB_URI, mongoUriDirect: !!process.env.MONGODB_URI_DIRECT, jwtSecret: !!process.env.JWT_SECRET });
    return NextResponse.json({ success: false, message: "Server error", detail: message }, { status: 500 });
  }
}
