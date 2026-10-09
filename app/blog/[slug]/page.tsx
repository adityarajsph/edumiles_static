import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BlogDetailClient from "./BlogDetailClient";
import {
  ALL_POSTS,
  getPostBySlug as getStaticPostBySlug,
  getRelatedPosts as getStaticRelated,
} from "../../lib/posts";
import {
  fetchBlogBySlug,
  fetchRelatedBlogs,
} from "../../lib/fetchers";
import type { BlogPost } from "../../lib/posts";
import { Clock, User, Tag, Calendar, ArrowRight } from "lucide-react";

/* ── ISR: revalidate every 60 seconds ──────────────── */
export const revalidate = 60;

/* ── generateStaticParams — static baseline + DB merge ── */
export async function generateStaticParams() {
  const staticSlugs = ALL_POSTS.map(p => ({ slug: p.slug }));
  try {
    const { fetchPublishedBlogSlugs } = await import("../../lib/fetchers");
    const dbSlugs = await fetchPublishedBlogSlugs();
    if (dbSlugs.length > 0) {
      const all  = [...staticSlugs, ...dbSlugs];
      const seen = new Set<string>();
      return all.filter(s => { if (seen.has(s.slug)) return false; seen.add(s.slug); return true; });
    }
  } catch { /* static only */ }
  return staticSlugs;
}

/* ── generateMetadata — DB first, static fallback ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try { post = await fetchBlogBySlug(slug); } catch { /* ignore */ }
  if (!post) post = getStaticPostBySlug(slug) ?? null;

  if (!post) {
    return {
      title: "Article Not Found | EdumilesTravels Blog",
      description: "The requested article could not be found.",
    };
  }

  const titleStr = `${post.title} | EdumilesTravels Blog`;
  const descStr  = post.excerpt.slice(0, 160);

  return {
    title: titleStr,
    description: descStr,
    keywords: [...post.tags, "EdumilesTravels", "travel guide", "India travel", post.category],
    alternates: { canonical: `https://edumilestravels.com/blog/${post.slug}` },
    openGraph: {
      title: titleStr, description: descStr,
      url: `https://edumilestravels.com/blog/${post.slug}`,
      siteName: "EdumilesTravels",
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      locale: "en_IN", type: "article",
    },
    twitter: { card: "summary_large_image", title: titleStr, description: descStr, images: [post.coverImage] },
  };
}

/* ── Inline related-post mini card ──────────────────── */
function RelatedCard({ post }: { post: BlogPost }) {
  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }} aria-label={`Read: ${post.title}`}>
      <article className="card" style={{ height: "100%" }}>
        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
            className="rel-card-img" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.28),transparent)" }} />
          <span style={{ position: "absolute", top: 10, left: 10, background: "#0127FC", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 9999 }}>{post.category}</span>
        </div>
        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", fontSize: 11, marginBottom: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} color="#FE8100" />{post.readTime} min</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={10} color="#FE8100" />{fmtDate(post.publishedAt)}</span>
          </div>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 14, color: "#0f172a", lineHeight: 1.4, marginBottom: 10 }}>{post.title}</h3>
          <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#FE8100", fontWeight: 700, fontSize: 12 }}>Read more <ArrowRight size={12} /></span>
        </div>
      </article>
    </Link>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* 1. Try DB first ─────────────────────────── */
  let post: BlogPost | null = null;
  try { post = await fetchBlogBySlug(slug); } catch { /* ignore */ }

  /* 2. Fall back to static ─────────────────── */
  if (!post) post = getStaticPostBySlug(slug) ?? null;

  if (!post) notFound();

  /* 3. Related posts ───────────────────────── */
  let related: BlogPost[] = [];
  try { related = await fetchRelatedBlogs(post.category, post.slug, 3); } catch { /* ignore */ }
  if (related.length === 0) {
    related = getStaticRelated(post.category, typeof post.id === "number" ? post.id : 0, 3);
  }

  /* ── JSON-LD ─────────────────────────────── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        url: `https://edumilestravels.com/blog/${post.slug}`,
        datePublished: post.publishedAt,
        author: { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
        publisher: {
          "@type": "Organization", name: "EdumilesTravels", url: "https://edumilestravels.com",
          logo: { "@type": "ImageObject", url: "https://edumilestravels.com/edumiles.png" },
        },
        keywords: post.tags.join(", "),
        articleSection: post.category,
        wordCount: post.content.reduce((n, s) => n + s.body.split(" ").length, 0),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",     item: "https://edumilestravels.com" },
          { "@type": "ListItem", position: 2, name: "Blog",     item: "https://edumilestravels.com/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: `https://edumilestravels.com/blog/${post.slug}` },
        ],
      },
    ],
  };

  const relatedCards = related.length > 0 ? related.map(p => <RelatedCard key={p.slug} post={p} />) : null;

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main style={{ background: "#f8fafc", minHeight: "100vh" }}>
        {/* ── Hero banner ───────────────────────── */}
        <section style={{ background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)", padding: "100px 24px 0", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />

          <nav aria-label="Breadcrumb" style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, marginBottom: 20 }}>
            <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
              <li><Link href="/"     className="breadcrumb-link">Home</Link></li>
              <li style={{ color: "rgba(255,255,255,0.3)" }}>›</li>
              <li><Link href="/blog" className="breadcrumb-link">Blog</Link></li>
              <li style={{ color: "rgba(255,255,255,0.3)" }}>›</li>
              <li style={{ color: "#fff", fontWeight: 600 }} aria-current="page">{post.title}</li>
            </ol>
          </nav>

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, alignItems: "center" }}>
              <span style={{ background: "#FE8100", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 9999 }}>{post.category}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.7)", fontSize: 13 }}><User size={13} /> {post.author.name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.7)", fontSize: 13 }}><Calendar size={13} /> {fmtDate(post.publishedAt)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.7)", fontSize: 13 }}><Clock size={13} /> {post.readTime} min read</span>
              {post.tags.slice(0, 2).map(t => (
                <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 9999 }}>
                  <Tag size={9} /> {t}
                </span>
              ))}
            </div>

            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(24px,4vw,42px)", color: "#fff", lineHeight: 1.2, marginBottom: 18, maxWidth: 820 }}>
              {post.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.7, maxWidth: 700, marginBottom: 28 }}>
              {post.excerpt}
            </p>

            <div style={{ borderRadius: "16px 16px 0 0", overflow: "hidden", height: "min(460px, 52vw)", position: "relative", boxShadow: "0 -8px 48px rgba(0,0,0,0.22)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </section>

        {/* ── Article + sidebar ─────────────────── */}
        <BlogDetailClient post={post} relatedCards={relatedCards} />
      </main>

      <Footer />

      <style>{`
        .rel-card-img:hover { transform: scale(1.06); }
        @media (max-width: 1023px) { main { padding-bottom: 24px; } }
      `}</style>
    </>
  );
}
