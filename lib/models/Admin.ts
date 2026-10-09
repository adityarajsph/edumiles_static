import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminDocument extends Document {
  email: string;
  password: string;   // bcrypt hash
  role: "superadmin" | "editor";
  modules: string[];  // e.g. ["packages", "blogs", "submissions", "categories"]
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDocument>(
  {
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["superadmin", "editor"], default: "superadmin" },
    // Granular module permissions. Empty array = all modules for superadmin,
    // or restricted access for editor. Superadmin always gets full access regardless.
    modules:  [{ type: String }],
  },
  { timestamps: true }
);

AdminSchema.index({ email: 1 }, { unique: true });

const AdminModel: Model<IAdminDocument> =
  (mongoose.models.Admin as Model<IAdminDocument>) ||
  mongoose.model<IAdminDocument>("Admin", AdminSchema);

export default AdminModel;
