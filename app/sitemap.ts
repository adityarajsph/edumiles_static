import type { MetadataRoute } from "next";
import { ALL_PACKAGES } from "./lib/packages";
import { ALL_POSTS }    from "./lib/posts";

const BASE = "https://edumilestravels.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ── Static routes ─────────────────────────────── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/packages`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/blog`,     lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  /* ── Package detail pages ─────────────────────── */
  let packageSlugs: string[] = ALL_PACKAGES.map(p => p.slug);
  try {
    const { fetchPublishedPackageSlugs } = await import("./lib/fetchers");
    const dbSlugs = await fetchPublishedPackageSlugs();
    if (dbSlugs.length > 0) {
      const merged = new Set([...packageSlugs, ...dbSlugs.map((s: { slug: string }) => s.slug)]);
      packageSlugs = Array.from(merged);
    }
  } catch { /* use static only */ }

  const packageRoutes: MetadataRoute.Sitemap = packageSlugs.map(slug => ({
    url:             `${BASE}/packages/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly"  as const,
    priority:        0.8,
  }));

  /* ── Blog detail pages ────────────────────────── */
  let blogSlugs: string[] = ALL_POSTS.map(p => p.slug);
  try {
    const { fetchPublishedBlogSlugs } = await import("./lib/fetchers");
    const dbSlugs = await fetchPublishedBlogSlugs();
    if (dbSlugs.length > 0) {
      const merged = new Set([...blogSlugs, ...dbSlugs.map((s: { slug: string }) => s.slug)]);
      blogSlugs = Array.from(merged);
    }
  } catch { /* use static only */ }

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url:             `${BASE}/blog/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  return [...staticRoutes, ...packageRoutes, ...blogRoutes];
}
