/**
 * scripts/create-admin.mjs
 * Creates the first superadmin in MongoDB.
 * Run: node scripts/create-admin.mjs
 */

import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local manually ──────────────────────────────────────────────────
const envPath = resolve(__dirname, "../.env.local");
try {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
  console.log("✅ Loaded .env.local");
} catch {
  console.error("❌ Could not read .env.local — make sure it exists.");
  process.exit(1);
}

// Prefer the direct (non-SRV) URI on Windows where Node's DNS SRV resolution may fail
const MONGODB_URI = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@edumilestravels.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) { console.error("❌ MONGODB_URI not set"); process.exit(1); }
if (!ADMIN_PASSWORD) { console.error("❌ ADMIN_PASSWORD not set"); process.exit(1); }

// ── Dynamic imports (CJS packages) ───────────────────────────────────────────
const require = createRequire(import.meta.url);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Inline Admin schema (avoids Next.js path aliases) ────────────────────────
const AdminSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["superadmin", "editor"], default: "superadmin" },
  },
  { timestamps: true }
);

const Admin =
  mongoose.models?.Admin || mongoose.model("Admin", AdminSchema);

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔌 Connecting to MongoDB Atlas…");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("✅ Connected.");

  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${existing.email} (role: ${existing.role})`);
    await mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await Admin.create({
    email: ADMIN_EMAIL.toLowerCase(),
    password: hash,
    role: "superadmin",
  });

  console.log(`✅ Admin created successfully!`);
  console.log(`   Email : ${admin.email}`);
  console.log(`   Role  : ${admin.role}`);
  console.log(`   ID    : ${admin._id}`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected.");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
