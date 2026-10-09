/* ─────────────────────────────────────────────────────────────────────────────
   Shared TypeScript types for the EdumilesTravels CMS.
   These are plain interface types (not Mongoose documents).
   Mongoose document types live alongside the model files.
──────────────────────────────────────────────────────────────────────────────*/

// ─── Package ─────────────────────────────────────────────────────────────────

export interface IPackageSeason {
  peak: { months: string; note: string };
  offSeason: { months: string; note: string };
  priceTendency: string;
  activeSeason: "peak" | "off";
}

export interface IPackageFAQ {
  question: string;
  answer: string;
}

export interface IPackageItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface IPackageSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface IPackage {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;       // HTML rich text
  price: number;
  discountPrice?: number;
  currency: string;
  duration: string;              // e.g. "6 Days / 5 Nights"
  destination: string;           // primary destination label
  category: string;
  featuredImage: string;
  gallery: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: IPackageItineraryDay[];
  faqs: IPackageFAQ[];
  season?: IPackageSeason;
  seo: IPackageSEO;
  isFeatured: boolean;
  status: "draft" | "published";
  order: number;
  // legacy fields kept for backward-compat with existing UI
  badge?: string;
  badgeBg?: string;
  groupSize?: string;
  rating?: number;
  reviews?: number;
  image?: string;                // alias for featuredImage
  images?: string[];             // alias for gallery
  location?: string;             // alias for destination
  name?: string;                 // alias for title
  createdAt?: string;
  updatedAt?: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface IBlogSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface IBlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;               // HTML rich text
  featuredImage: string;
  author: IBlogAuthor;
  category: string;
  tags: string[];
  readTime: number;
  seo: IBlogSEO;
  status: "draft" | "published";
  publishedAt: string;           // ISO date string
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Form Submission ──────────────────────────────────────────────────────────

export type SubmissionStatus = "new" | "read" | "contacted" | "closed";

export interface IFormSubmission {
  _id?: string;
  formName: string;
  formSlug: string;
  data: Record<string, string | number | boolean>;
  sourcePage: string;
  packageRef?: string;
  status: SubmissionStatus;
  notes: string;
  ipAddress: string;
  userAgent: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export type AdminRole = "superadmin" | "editor";

export interface IAdmin {
  _id?: string;
  email: string;
  role: AdminRole;
  createdAt?: string;
}

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
