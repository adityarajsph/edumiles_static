/**
 * scripts/create-admin.ts
 * Creates the first admin account.
 * Safe to run once; exits early if an admin already exists.
 *
 * Usage: MONGODB_URI=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npx ts-node scripts/create-admin.ts
 * Or set them in .env.local and run: npx ts-node scripts/create-admin.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI     = process.env.MONGODB_URI;
const ADMIN_EMAIL     = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌  Required env vars: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD");
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 8) {
  console.error("❌  ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, default: "superadmin" },
}, { timestamps: true });

const Admin = (mongoose.models.Admin as mongoose.Model<mongoose.Document>) || mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  console.log("🔐 Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI!, {
    serverSelectionTimeoutMS: 10000,
    dbName: "edumiles_cms",
  });
  console.log("✅ Connected.");

  const existing = await Admin.findOne({ email: ADMIN_EMAIL!.toLowerCase() });
  if (existing) {
    console.log(`⚠️  Admin already exists: ${ADMIN_EMAIL}`);
    console.log("   To reset the password, use the admin settings page or delete the record and re-run.");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD!, 12);
  await Admin.create({ email: ADMIN_EMAIL!.toLowerCase(), password: hashed, role: "superadmin" });

  console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
  console.log("   Login at: https://yourdomain.com/admin/login");
  await mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error("❌ Failed to create admin:", err);
  process.exit(1);
});
