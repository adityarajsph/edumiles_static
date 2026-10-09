/**
 * lib/fetchers.ts
 * Server-side DB fetch helpers for public pages (packages, blogs).
 * Called from Server Components only. Each function:
 *   1. Tries to fetch from MongoDB.
 *   2. Returns null on any error so the caller can fall back to static data.
 *
 * These are intentionally NOT cached with `unstable_cache` so that
 * ISR revalidation (`revalidate = 60`) handles freshness correctly.
 */

import connectDB from "./mongodb";
import PackageModel from "./models/Package";
import BlogModel from "./models/Blog";
import type { Package, PackageFAQ, PackageSeason } from "../app/lib/packages";
import type { BlogPost, BlogSection, BlogAuthor } from "../app/lib/posts";

/* ── Package helpers ────────────────────────────────────────────── */

/** Fetch all published package slugs — used for generateStaticParams. */
export async function fetchPublishedPackageSlugs(): Promise<{ slug: string }[]> {
  try {
    await connectDB();
    const docs = await PackageModel.find({ status: "published" }, { slug: 1 }).lean();
    return docs.map(d => ({ slug: d.slug }));
  } catch {
    return []; // falls back to static list in generateStaticParams
  }
}

/** Fetch a single published package by slug. Returns null on miss or error. */
export async function fetchPackageBySlug(slug: string): Promise<Package | null> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await PackageModel.findOne({ slug, status: "published" }).lean() as any;
    if (!doc) return null;
    return mapDocToPackage(doc);
  } catch {
    return null;
  }
}

/** Fetch published packages in the same category, excluding the given slug. */
export async function fetchSimilarPackages(category: string, excludeSlug: string, limit = 4): Promise<Package[]> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = await PackageModel.find({ category, slug: { $ne: excludeSlug }, status: "published" }, {}).limit(limit).lean() as any[];
    return docs.map(mapDocToPackage);
  } catch {
    return [];
  }
}

/** Fetch featured published packages. */
export async function fetchFeaturedPackages(limit = 3): Promise<Package[]> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = await PackageModel.find({ isFeatured: true, status: "published" }).sort({ order: 1 }).limit(limit).lean() as any[];
    return docs.map(mapDocToPackage);
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDocToPackage(doc: any): Package {
  const faqs: PackageFAQ[] = (doc.faqs || []).map((f: { question: string; answer: string }) => ({
    q: f.question || "",
    a: f.answer   || "",
  }));

  const season: PackageSeason = {
    peak:         { months: doc.season?.peak?.months || "",      note: doc.season?.peak?.note || "" },
    offSeason:    { months: doc.season?.offSeason?.months || "", note: doc.season?.offSeason?.note || "" },
    priceTendency: doc.season?.priceTendency || "",
    activeSeason:  (doc.season?.activeSeason === "off" ? "off" : "peak") as "peak" | "off",
  };

  return {
    id:            doc._id?.toString() || "",
    name:          doc.title           || "",
    slug:          doc.slug            || "",
    location:      doc.destination     || "",
    image:         doc.featuredImage   || "",
    images:        Array.isArray(doc.gallery) ? doc.gallery : [],
    price:         doc.price           || 0,
    originalPrice: doc.discountPrice   || doc.price || 0,
    rating:        doc.rating          || 0,
    reviews:       doc.reviews         || 0,
    duration:      doc.duration        || "",
    groupSize:     doc.groupSize       || "",
    badge:         doc.badge           || "",
    badgeBg:       doc.badgeBg         || "#FE8100",
    category:      doc.category        || "",
    highlights:    Array.isArray(doc.highlights) ? doc.highlights : [],
    description:   doc.shortDescription || doc.fullDescription || "",
    inclusions:    Array.isArray(doc.inclusions)  ? doc.inclusions  : [],
    exclusions:    Array.isArray(doc.exclusions)  ? doc.exclusions  : [],
    season,
    faq:           faqs,
    itinerary:     Array.isArray(doc.itinerary)
      ? doc.itinerary.map((d: { day: number; title: string; description: string }) => ({
          day: d.day, title: d.title || "", description: d.description || "",
        }))
      : [],
    destinationSlug: doc.destinationSlug || "",
    featured:      doc.isFeatured      || false,
  };
}

/* ── Blog helpers ───────────────────────────────────────────────── */

/** Fetch all published blog slugs. */
export async function fetchPublishedBlogSlugs(): Promise<{ slug: string }[]> {
  try {
    await connectDB();
    const docs = await BlogModel.find({ status: "published" }, { slug: 1 }).lean();
    return docs.map(d => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

/** Fetch a single published blog by slug. Returns null on miss or error. */
export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await BlogModel.findOne({ slug, status: "published" }).lean() as any;
    if (!doc) return null;
    return mapDocToBlog(doc);
  } catch {
    return null;
  }
}

/** Fetch related blogs by category, excluding the current slug. */
export async function fetchRelatedBlogs(category: string, excludeSlug: string, limit = 3): Promise<BlogPost[]> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = await BlogModel.find({ category, slug: { $ne: excludeSlug }, status: "published" }).sort({ publishedAt: -1 }).limit(limit).lean() as any[];
    return docs.map(mapDocToBlog);
  } catch {
    return [];
  }
}

/** Fetch featured published blogs. */
export async function fetchFeaturedBlogs(limit = 3): Promise<BlogPost[]> {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = await BlogModel.find({ isFeatured: true, status: "published" }).sort({ publishedAt: -1 }).limit(limit).lean() as any[];
    return docs.map(mapDocToBlog);
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDocToBlog(doc: any): BlogPost {
  // content from DB is HTML string; wrap in a single BlogSection for rendering
  const content: BlogSection[] = doc.content
    ? [{ body: doc.content }]
    : [];

  const author: BlogAuthor = {
    name:   doc.author?.name   || "",
    role:   doc.author?.role   || "",
    avatar: doc.author?.avatar || "",
  };

  return {
    id:          doc._id?.toString() || "",
    title:       doc.title           || "",
    slug:        doc.slug            || "",
    excerpt:     doc.excerpt         || "",
    content,
    coverImage:  doc.featuredImage   || "",
    author,
    category:    doc.category        || "",
    tags:        Array.isArray(doc.tags) ? doc.tags : [],
    readTime:    doc.readTime        || 5,
    publishedAt: doc.publishedAt
      ? new Date(doc.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    featured:    doc.isFeatured      || false,
  };
}
