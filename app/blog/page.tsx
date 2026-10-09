"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import Link from "next/link";
import {
  Search, X, Clock, Tag, ArrowRight, BookOpen, User, Filter,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { ALL_POSTS, BLOG_CATEGORIES } from "../lib/posts";
import type { BlogPost } from "../lib/posts";

/* ── Helpers ──────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ── Blog card ────────────────────────────────────── */
function BlogCard({
  post,
  delay,
  visible,
}: {
  post: BlogPost;
  delay: number;
  visible: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: "none" }}
      aria-label={`Read: ${post.title}`}
    >
      <article
        className="card"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: `all 0.6s ease ${delay}ms`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Cover image */}
        <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.55s ease",
            }}
            className="blog-card-img"
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",
          }} />
          {/* Category pill */}
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: "#0127FC", color: "#fff",
            fontSize: 10, fontWeight: 700, padding: "4px 12px",
            borderRadius: 9999, letterSpacing: "0.04em",
          }}>
            {post.category}
          </span>
          {/* Read time */}
          <span style={{
            position: "absolute", top: 14, right: 14,
            display: "flex", alignItems: "center", gap: 4,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
            fontSize: 11, fontWeight: 600, padding: "3px 9px",
            borderRadius: 9999, color: "#334155",
          }}>
            <Clock size={10} color="#FE8100" />
            {post.readTime} min read
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {/* Author + date */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.author.avatar}
              alt={post.author.name}
              style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }}
            />
            <span style={{ color: "#64748b", fontWeight: 500 }}>{post.author.name}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 800,
            fontSize: 16, color: "#0f172a", lineHeight: 1.4,
            margin: 0, flex: 1,
          }}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p style={{
            color: "#64748b", fontSize: 13, lineHeight: 1.7,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 2 }}>
            {post.tags.slice(0, 3).map(t => (
              <span key={t} style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "#f1f5f9", color: "#64748b",
                fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 9999,
              }}>
                <Tag size={8} />
                {t}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 12, marginTop: "auto",
            borderTop: "1px solid #f1f5f9",
          }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatDate(post.publishedAt)}</span>
            <span style={{
              display: "flex", alignItems: "center", gap: 5,
              color: "#FE8100", fontWeight: 700, fontSize: 13,
            }}>
              Read more <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── Featured hero card ───────────────────────────── */
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }} aria-label={`Read: ${post.title}`}>
      <article style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        height: 420, cursor: "pointer",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}
        className="featured-card"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.55s ease" }}
          className="featured-img"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, padding: "28px 28px 28px",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              background: "#FE8100", color: "#fff",
              fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 9999,
            }}>FEATURED</span>
            <span style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 9999,
              backdropFilter: "blur(4px)",
            }}>{post.category}</span>
          </div>
          <h2 style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 900,
            fontSize: "clamp(18px,2.5vw,26px)", color: "#fff",
            lineHeight: 1.3, marginBottom: 10,
          }}>
            {post.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
            {post.excerpt.slice(0, 120)}…
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <User size={11} /> {post.author.name}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={11} /> {post.readTime} min read
            </span>
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, color: "#FE8100", fontWeight: 700, fontSize: 13 }}>
              Read article <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── Page ─────────────────────────────────────────── */
export default function BlogPage() {
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("All");
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalSubject, setModalSubject] = useState<string | undefined>();
  // Static data renders immediately; DB data silently replaces it when ready.
  const [posts, setPosts]               = useState<BlogPost[]>(ALL_POSTS);
  const { ref, isVisible }              = useScrollAnimation();

  // Fetch published posts from CMS on mount — fallback to static on any error.
  useEffect(() => {
    fetch("/api/blogs?status=published&limit=100")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.items.length > 0) {
          const mapped: BlogPost[] = d.data.items.map((b: Record<string, unknown>) => ({
            id:           b._id as string,
            title:        (b.title as string) || "",
            slug:         b.slug as string,
            excerpt:      (b.excerpt as string) || "",
            content:      [],  // listing page doesn't need full content
            coverImage:   (b.featuredImage as string) || "",
            author: {
              name:   ((b.author as Record<string, string>)?.name)   || "",
              role:   ((b.author as Record<string, string>)?.role)   || "",
              avatar: ((b.author as Record<string, string>)?.avatar) || "",
            },
            category:    (b.category as string) || "",
            tags:        (b.tags as string[])   || [],
            readTime:    (b.readTime as number) || 5,
            publishedAt: b.publishedAt ? new Date(b.publishedAt as string).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            featured:    (b.isFeatured as boolean) || false,
          }));
          setPosts(mapped);
        }
      })
      .catch(() => { /* silently keep static fallback */ });
  }, []);

  const openContact = useCallback((subject?: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  }, []);

  const featured = posts.filter(p => p.featured);

  const filtered = posts
    .filter(p =>
      (category === "All" || p.category === category) &&
      (search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    );

  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero ──────────────────────────────────── */}
        <section style={{
          background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
          padding: "140px 24px 72px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.22) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", padding: "6px 16px", borderRadius: 9999 }}>
              <BookOpen size={14} color="#FE8100" />
              <span style={{ color: "#FE8100", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Travel Stories & Guides</span>
            </div>
            <h1 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 900,
              fontSize: "clamp(32px,5vw,58px)", color: "#fff",
              lineHeight: 1.15, marginBottom: 16,
            }}>
              The EdumilesTravels Blog
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 36px" }}>
              Expert travel guides, destination deep-dives, and honest advice from people who've actually been there.
            </p>

            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fff", borderRadius: 9999,
              padding: "8px 8px 8px 22px",
              maxWidth: 480, margin: "0 auto",
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
            }}>
              <Search size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations, tips, guides…"
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#334155",
                  background: "transparent",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94a3b8", display: "flex" }}>
                  <X size={15} />
                </button>
              )}
              <button className="btn-primary" style={{ padding: "9px 20px", fontSize: 13, flexShrink: 0 }}>
                Search
              </button>
            </div>
          </div>
        </section>

        {/* ── Featured posts ────────────────────────── */}
        {search === "" && category === "All" && featured.length > 0 && (
          <section style={{ padding: "64px 24px 0", background: "#f8fafc" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ marginBottom: 32 }}>
                <span className="section-tag">Editor&apos;s Picks</span>
                <h2 className="section-title" style={{ marginBottom: 4 }}>Featured Stories</h2>
                <div className="section-divider" style={{ margin: "0 0 0" }} />
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 24,
              }}>
                {featured.slice(0, 3).map(p => (
                  <FeaturedCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Filter + grid ─────────────────────────── */}
        <section style={{ padding: "56px 24px 96px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>

            {/* Filter bar */}
            <div ref={ref} style={{
              display: "flex", flexWrap: "wrap", alignItems: "center",
              justifyContent: "space-between", gap: 16, marginBottom: 40,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease",
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <Filter size={14} color="#64748b" />
                {BLOG_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "7px 18px", borderRadius: 9999, fontSize: 13, fontWeight: 600,
                      fontFamily: "'Inter',sans-serif", cursor: "pointer",
                      border: category === cat ? "none" : "1.5px solid #e2e8f0",
                      background: category === cat ? "linear-gradient(135deg,#FE8100,#FF9A2E)" : "#fff",
                      color: category === cat ? "#fff" : "#475569",
                      boxShadow: category === cat ? "0 4px 16px rgba(254,129,0,0.28)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
                <strong style={{ color: "#0127FC" }}>{filtered.length}</strong> article{filtered.length !== 1 ? "s" : ""}
                {category !== "All" && <> in <strong style={{ color: "#FE8100" }}>{category}</strong></>}
              </p>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 28 }}>
                {filtered.map((post, i) => (
                  <BlogCard key={post.slug} post={post} delay={i * 70} visible={isVisible} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <BookOpen size={48} color="#c7d2fe" strokeWidth={1.5} style={{ display: "block", margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#0127FC", marginBottom: 8 }}>
                  No articles found
                </h3>
                <p style={{ color: "#64748b" }}>Try a different search term or category.</p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="btn-primary"
                  style={{ marginTop: 24 }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* CTA strip */}
            <div style={{
              marginTop: 72, borderRadius: 28,
              background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 100%)",
              padding: "48px 40px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.28) 0%,transparent 70%)", pointerEvents: "none" }} />
              <span className="section-tag" style={{ color: "#FF9A2E" }}>Custom Itinerary</span>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(20px,3vw,34px)", color: "#fff", marginBottom: 12 }}>
                Ready to turn reading into a real trip?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
                Our travel experts will build a personalised package based on the destination you love.
              </p>
              <button onClick={() => openContact("Blog — Custom Package Enquiry")} className="btn-primary">
                Plan My Trip <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} subject={modalSubject} />

      <style>{`
        .blog-card-img:hover { transform: scale(1.06); }
        .featured-img:hover  { transform: scale(1.04); }
      `}</style>
    </>
  );
}
