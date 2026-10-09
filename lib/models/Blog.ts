import mongoose, { Schema, Document, Model } from "mongoose";

const SEOSubSchema = new Schema({
  metaTitle:       { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  ogImage:         { type: String, default: "" },
}, { _id: false });

const AuthorSubSchema = new Schema({
  name:   { type: String, default: "" },
  role:   { type: String, default: "" },
  avatar: { type: String, default: "" },
}, { _id: false });

export interface IBlogDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;           // HTML rich text
  featuredImage: string;
  author: { name: string; role: string; avatar: string };
  category: string;
  tags: string[];
  readTime: number;
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
  status: "draft" | "published";
  publishedAt: Date;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlogDocument>(
  {
    title:         { type: String, required: true, trim: true },
    slug:          { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt:       { type: String, default: "" },
    content:       { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    author:        { type: AuthorSubSchema, default: () => ({}) },
    category:      { type: String, default: "" },
    tags:          [{ type: String }],
    readTime:      { type: Number, default: 5, min: 1 },
    seo:           { type: SEOSubSchema, default: () => ({}) },
    status:        { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt:   { type: Date, default: Date.now },
    isFeatured:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 },        { unique: true });
BlogSchema.index({ status: 1 });
BlogSchema.index({ isFeatured: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ publishedAt: -1 });

const BlogModel: Model<IBlogDocument> =
  (mongoose.models.Blog as Model<IBlogDocument>) ||
  mongoose.model<IBlogDocument>("Blog", BlogSchema);

export default BlogModel;
