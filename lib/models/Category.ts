import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;       // Cloudinary URL (optional)
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    slug:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    image:       { type: String, default: "" },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ order: 1 });

const CategoryModel: Model<ICategoryDocument> =
  (mongoose.models.Category as Model<ICategoryDocument>) ||
  mongoose.model<ICategoryDocument>("Category", CategorySchema);

export default CategoryModel;
