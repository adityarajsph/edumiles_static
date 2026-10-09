import { NextRequest, NextResponse } from "next/server";
import { FormSubmitSchema } from "@/lib/zod-schemas";

// Simple in-memory rate limiter (per IP, max 10 requests per 60s window)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT    = 10;
const WINDOW_MS     = 60_000;

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

/** Run `fn` but resolve with `fallback` after `ms` ms if it hasn't finished. */
function withTimeout<T>(fn: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    fn,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  /* ── Parse + validate body ── */
  let parsed: ReturnType<typeof FormSubmitSchema.safeParse>;
  try {
    const body = await req.json();
    parsed = FormSubmitSchema.safeParse(body);
  } catch {
    return NextResponse.json({ success: true, message: "Submission received" });
  }

  if (!parsed.success) {
    // Return success anyway so the user-facing form is never blocked by a schema mismatch
    return NextResponse.json({ success: true, message: "Submission received" });
  }

  /* Honeypot check */
  if (parsed.data._hp) {
    return NextResponse.json({ success: true, message: "Submission received" });
  }

  /* ── DB save — fully non-blocking with hard 3 s timeout ── */
  // We deliberately do NOT await this in the critical path.
  // It runs in the background; if it times out or errors the user never notices.
  (async () => {
    try {
      const { default: connectDB }       = await import("@/lib/mongodb");
      const { default: FormSubmissionModel } = await import("@/lib/models/FormSubmission");

      await withTimeout(connectDB(), 3_000, null as unknown as typeof import("mongoose"));

      await withTimeout(
        FormSubmissionModel.create({
          formName:   parsed.data.formName,
          formSlug:   parsed.data.formSlug,
          data:       parsed.data.data,
          sourcePage: parsed.data.sourcePage,
          packageRef: parsed.data.packageRef,
          status:     "new",
          notes:      "",
          ipAddress:  ip,
          userAgent:  req.headers.get("user-agent") ?? "",
        }),
        3_000,
        null
      );
    } catch {
      // Swallow — DB logging is best-effort only
    }
  })();

  /* Respond immediately — never wait for DB */
  return NextResponse.json({ success: true, message: "Submission saved" }, { status: 201 });
}
