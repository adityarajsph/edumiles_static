/**
 * lib/zod-schemas.ts
 * Server-side validation schemas for all API inputs.
 * Compatible with Zod v4 (object defaults use factory functions).
 */

import { z } from "zod";

/* ── Reusable sub-schemas ────────────────────────── */
const SeasonSubSchema = z.object({
  peak:          z.object({ months: z.array(z.string()).default([]), note: z.string().default("") }).default(() => ({ months: [], note: "" })),
  offSeason:     z.object({ months: z.array(z.string()).default([]), note: z.string().default("") }).default(() => ({ months: [], note: "" })),
  priceTendency: z.string().default(""),
  activeSeason:  z.enum(["peak", "off"]).default("peak"),
}).default(() => ({ peak: { months: [], note: "" }, offSeason: { months: [], note: "" }, priceTendency: "", activeSeason: "peak" as const }));

const SEOSubSchema = z.object({
  metaTitle:       z.string().default(""),
  metaDescription: z.string().default(""),
  ogImage:         z.string().default(""),
}).default(() => ({ metaTitle: "", metaDescription: "", ogImage: "" }));

const AuthorSubSchema = z.object({
  name:   z.string().default(""),
  role:   z.string().default(""),
  avatar: z.string().default(""),
}).default(() => ({ name: "", role: "", avatar: "" }));

/* ── Package ─────────────────────────────────────── */
export const PackageCreateSchema = z.object({
  title:            z.string().min(3, "Title is required"),
  slug:             z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  shortDescription: z.string().default(""),
  fullDescription:  z.string().default(""),
  price:            z.number().min(0, "Price must be 0 or more"),
  discountPrice:    z.number().min(0).default(0),
  currency:         z.string().default("INR"),
  duration:         z.string().default(""),
  destination:      z.string().default(""),
  category:         z.string().default(""),
  featuredImage:    z.string().default(""),
  gallery:          z.array(z.string()).default([]),
  highlights:       z.array(z.string()).default([]),
  inclusions:       z.array(z.string()).default([]),
  exclusions:       z.array(z.string()).default([]),
  itinerary:        z.array(z.object({
    day:         z.number().min(1),
    title:       z.string().default(""),
    description: z.string().default(""),
  })).default([]),
  faqs: z.array(z.object({
    question: z.string().default(""),
    answer:   z.string().default(""),
  })).default([]),
  season:     SeasonSubSchema,
  seo:        SEOSubSchema,
  isFeatured: z.boolean().default(false),
  status:     z.enum(["draft", "published"]).default("draft"),
  order:      z.number().default(0),
  // legacy UI compatibility fields
  badge:      z.string().default(""),
  badgeBg:    z.string().default("#FE8100"),
  groupSize:  z.string().default(""),
  rating:     z.number().min(0).max(5, "Rating cannot exceed 5").default(0),
  reviews:    z.number().min(0).default(0),
  bestMonths: z.array(z.string()).default([]),
  // optional soft-link to a managed Destination document (by slug)
  destinationSlug: z.string().default(""),
});

export const PackageUpdateSchema = PackageCreateSchema.partial();

/* ── Blog ────────────────────────────────────────── */
export const BlogCreateSchema = z.object({
  title:         z.string().min(3, "Title is required"),
  slug:          z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt:       z.string().default(""),
  content:       z.string().default(""),
  featuredImage: z.string().default(""),
  author:        AuthorSubSchema,
  category:      z.string().default(""),
  tags:          z.array(z.string()).default([]),
  readTime:      z.number().min(1).default(5),
  seo:           SEOSubSchema,
  status:        z.enum(["draft", "published"]).default("draft"),
  publishedAt:   z.string().default(() => new Date().toISOString()),
  isFeatured:    z.boolean().default(false),
});

export const BlogUpdateSchema = BlogCreateSchema.partial();

/* ── Form submission (public) ────────────────────── */
export const FormSubmitSchema = z.object({
  formName:   z.string().min(1, "formName is required"),
  formSlug:   z.string().min(1, "formSlug is required"),
  data:       z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  sourcePage: z.string().default(""),
  packageRef: z.string().default(""),
  _hp:        z.string().max(0, "Spam detected").optional(),
});

/* ── Admin login ─────────────────────────────────── */
export const AdminLoginSchema = z.object({
  email:    z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/* ── Admin password change ───────────────────────── */
export const AdminPasswordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
});

/* ── Submission status update ────────────────────── */
export const SubmissionUpdateSchema = z.object({
  status: z.enum(["new", "read", "contacted", "closed"]).optional(),
  notes:  z.string().optional(),
});

/* ── Category ─────────────────────────────────────── */
export const CategoryCreateSchema = z.object({
  name:        z.string().min(1, "Category name is required").max(60),
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().default(""),
  image:       z.string().default(""),
  order:       z.number().min(0).default(0),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

/* ── Destination ─────────────────────────────────── */
export const DestinationCreateSchema = z.object({
  name:        z.string().min(1, "Destination name is required").max(80),
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().default(""),
  image:       z.string().default(""),
  tag:         z.string().default(""),
  tagColor:    z.string().default("#FE8100"),
  order:       z.number().min(0).default(0),
  isFeatured:  z.boolean().default(false),
});

export const DestinationUpdateSchema = DestinationCreateSchema.partial();

/* ── Admin user create/update ────────────────────── */
export const AdminUserCreateSchema = z.object({
  email:    z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role:     z.enum(["superadmin", "editor"], { error: "Role must be superadmin or editor" }),
  modules:  z.array(z.string()).default([]),
});

export const AdminUserUpdateSchema = z.object({
  email:    z.string().email("Valid email required").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role:     z.enum(["superadmin", "editor"]).optional(),
  modules:  z.array(z.string()).optional(),
});
