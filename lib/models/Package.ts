import mongoose, { Schema, Document, Model } from "mongoose";

/* ── Sub-schemas ─────────────────────────────────── */
const SeasonSubSchema = new Schema({
  peak: {
    months: [{ type: String }],  // array of month names, e.g. ["October", "November"]
    note:   { type: String, default: "" },
  },
  offSeason: {
    months: [{ type: String }],
    note:   { type: String, default: "" },
  },
  priceTendency: { type: String, default: "" },
  activeSeason:  { type: String, enum: ["peak", "off"], default: "peak" },
}, { _id: false });

const FAQSubSchema = new Schema({
  question: { type: String, default: "" },
  answer:   { type: String, default: "" },
}, { _id: false });

const ItinerarySubSchema = new Schema({
  day:         { type: Number, required: true },
  title:       { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

const SEOSubSchema = new Schema({
  metaTitle:       { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  ogImage:         { type: String, default: "" },
}, { _id: false });

/* ── Main document interface ─────────────────────── */
export interface IPackageDocument extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice: number;
  currency: string;
  duration: string;
  destination: string;
  category: string;
  featuredImage: string;
  gallery: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  season: {
    peak: { months: string[]; note: string };
    offSeason: { months: string[]; note: string };
    priceTendency: string;
    activeSeason: "peak" | "off";
  };
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
  isFeatured: boolean;
  status: "draft" | "published";
  order: number;
  // Best travel months (e.g. ["October", "November", "December"])
  bestMonths: string[];
  // optional soft-link to a managed Destination document (by slug)
  destinationSlug: string;
  badge: string;
  badgeBg: string;
  groupSize: string;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

/* ── Schema ──────────────────────────────────────── */
const PackageSchema = new Schema<IPackageDocument>(
  {
    title:            { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, default: "" },
    fullDescription:  { type: String, default: "" },
    price:            { type: Number, required: true, min: 0 },
    discountPrice:    { type: Number, default: 0, min: 0 },
    currency:         { type: String, default: "INR" },
    duration:         { type: String, default: "" },
    destination:      { type: String, default: "" },
    category:         { type: String, default: "" },
    featuredImage:    { type: String, default: "" },
    gallery:          [{ type: String }],
    highlights:       [{ type: String }],
    inclusions:       [{ type: String }],
    exclusions:       [{ type: String }],
    itinerary:        [ItinerarySubSchema],
    faqs:             [FAQSubSchema],
    season:           { type: SeasonSubSchema, default: () => ({}) },
    seo:              { type: SEOSubSchema,    default: () => ({}) },
    isFeatured:       { type: Boolean, default: false },
    status:           { type: String, enum: ["draft", "published"], default: "draft" },
    order:            { type: Number, default: 0 },
    // legacy UI fields
    badge:     { type: String, default: "" },
    badgeBg:   { type: String, default: "#FE8100" },
    groupSize: { type: String, default: "" },
    rating:    { type: Number, default: 0, min: 0, max: 5 },
    reviews:   { type: Number, default: 0, min: 0 },
    bestMonths: [{ type: String }],
    // optional soft-link to a managed Destination document (by slug)
    destinationSlug: { type: String, default: "" },
  },
  { timestamps: true }
);

/* ── Indexes ─────────────────────────────────────── */
PackageSchema.index({ status: 1 });
PackageSchema.index({ isFeatured: 1 });
PackageSchema.index({ category: 1 });
PackageSchema.index({ destinationSlug: 1 });
PackageSchema.index({ createdAt: -1 });
PackageSchema.index({ order: 1 });

/* ── Guard against model re-compilation (HMR) ───── */
const PackageModel: Model<IPackageDocument> =
  (mongoose.models.Package as Model<IPackageDocument>) ||
  mongoose.model<IPackageDocument>("Package", PackageSchema);

export default PackageModel;
