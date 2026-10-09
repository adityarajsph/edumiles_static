"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2, Check, MessageCircle, ArrowRight,
  Clock, User, Tag, Calendar,
} from "lucide-react";
import ContactModal from "../../components/ContactModal";
import type { BlogPost } from "../../lib/posts";

const WHATSAPP = "918796673667";

interface Props {
  post: BlogPost;
  relatedCards: React.ReactNode;
}

export default function BlogDetailClient({ post, relatedCards }: Props) {
  const [copied,    setCopied]    = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleShare() {
    if (!mounted) return;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  }

  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hi, I just read "${post.title}" on EdumilesTravels and would like to know more about this destination!`
  )}`;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
  }

  return (
    <>
      {/* ── Two-column layout ──────────────────────── */}
      <div
        className="blog-detail-grid"
        style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "40px 24px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 40,
          alignItems: "start",
        }}
      >

        {/* ══ LEFT — Article body ═══════════════════ */}
        <article>

          {/* ── Full description / lead paragraph ── */}
          <div style={{
            position: "relative",
            marginBottom: 32,
            borderRadius: 16,
            overflow: "hidden",
            background: "linear-gradient(135deg, #fff9f2 0%, #fff 60%, #f0f4ff 100%)",
            border: "1px solid #e8edf8",
            boxShadow: "0 2px 16px rgba(1,39,252,0.06)",
            padding: "28px 28px 24px",
          }}>
            {/* Accent bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: 4,
              background: "linear-gradient(180deg, #FE8100 0%, #0127FC 100%)",
              borderRadius: "4px 0 0 4px",
            }} />
            {/* Decorative quote mark */}
            <span style={{
              position: "absolute", top: 12, right: 20,
              fontSize: 80, lineHeight: 1, color: "rgba(1,39,252,0.05)",
              fontFamily: "Georgia,serif", fontWeight: 900, userSelect: "none",
              pointerEvents: "none",
            }}>&#8220;</span>

            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#FE8100",
              marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 18, height: 2, background: "#FE8100", display: "inline-block", borderRadius: 2 }} />
              Article Overview
            </p>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(15px, 1.6vw, 17px)",
              fontWeight: 500,
              color: "#1e293b",
              lineHeight: 1.85,
              margin: 0,
            }}>
              {post.excerpt}
            </p>
          </div>

          {/* Author + meta strip */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            gap: 16, marginBottom: 32,
            padding: "18px 22px",
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.author.avatar}
              alt={post.author.name}
              style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, color: "#0f172a", margin: 0 }}>
                {post.author.name}
              </p>
              <p style={{ color: "#94a3b8", fontSize: 13, margin: "2px 0 0" }}>{post.author.role}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", fontSize: 13, color: "#64748b" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={13} color="#FE8100" /> {formatDate(post.publishedAt)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={13} color="#FE8100" /> {post.readTime} min read
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Tag size={13} color="#FE8100" /> {post.category}
              </span>
            </div>
          </div>

          {/* Article sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {post.content.map((section, i) => (
              <section key={i} id={`section-${i}`}>
                {section.heading && (
                  <h2 style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                    fontSize: "clamp(18px,2.2vw,22px)", color: "#0f172a",
                    marginBottom: 14, lineHeight: 1.35,
                    paddingBottom: 10, borderBottom: "2px solid #f1f5f9",
                  }}>
                    {section.heading}
                  </h2>
                )}
                {/* Render as rich HTML if body contains HTML tags, otherwise plain text */}
                {/<[a-z][\s\S]*>/i.test(section.body) ? (
                  <div
                    className="blog-rich-content"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                ) : (
                  <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.9, margin: 0 }}>
                    {section.body}
                  </p>
                )}
              </section>
            ))}
          </div>

          {/* Tags */}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #f1f5f9" }}>
            <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Topics
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {post.tags.map(t => (
                <span key={t} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "#f1f5f9", color: "#475569",
                  fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 9999,
                  border: "1px solid #e2e8f0",
                }}>
                  <Tag size={10} color="#FE8100" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Share row */}
          <div style={{
            marginTop: 28,
            display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <span style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>Share:</span>
            <button
              onClick={handleShare}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 10,
                border: "1px solid #e2e8f0", background: "#fff",
                cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#334155",
                transition: "border-color 0.2s, background 0.2s",
              }}
              aria-label="Copy link"
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#FE8100")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              {copied
                ? <><Check size={13} color="#16a34a" /> Copied!</>
                : <><Share2 size={13} color="#FE8100" /> Copy link</>
              }
            </button>

            <a
              href={waUrl}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 10,
                background: "#25d366", color: "#fff",
                fontSize: 13, fontWeight: 700, textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              aria-label="Share on WhatsApp"
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.88")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>

          {/* Related posts */}
          {relatedCards && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                fontSize: 20, color: "#0f172a", marginBottom: 6,
              }}>
                Related Articles
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>More stories from {post.category}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
                {relatedCards}
              </div>
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <Link
              href="/blog"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#0127FC", fontWeight: 600, fontSize: 14, textDecoration: "none",
              }}
            >
              ← Back to all articles
            </Link>
          </div>
        </article>

        {/* ══ RIGHT — Sticky sidebar ════════════════ */}
        <aside aria-label="Article sidebar">

          {/* Table of contents */}
          <div
            className="blog-sidebar"
            style={{
              position: "sticky", top: 88,
              display: "flex", flexDirection: "column", gap: 20,
            }}
          >
            {/* ToC */}
            <div style={{
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 16, padding: "22px 22px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <p style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                fontSize: 14, color: "#0f172a", marginBottom: 14,
                display: "flex", alignItems: "center", gap: 7,
              }}>
                <span style={{ width: 4, height: 16, background: "#FE8100", borderRadius: 2, display: "inline-block" }} />
                In this article
              </p>
              <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                {post.content.filter(s => s.heading).map((s, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        padding: "7px 10px", borderRadius: 8,
                        color: "#475569", fontSize: 13, lineHeight: 1.45,
                        textDecoration: "none", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = "#fff7ee";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#FE8100";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#475569";
                      }}
                    >
                      <span style={{
                        minWidth: 20, height: 20, borderRadius: "50%",
                        background: "#f1f5f9", color: "#64748b",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
                      }}>{i + 1}</span>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA card */}
            <div style={{
              background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 100%)",
              borderRadius: 16, padding: "22px 22px",
              boxShadow: "0 4px 20px rgba(1,39,252,0.2)",
            }}>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Plan This Trip
              </p>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>
                Inspired by {post.category.toLowerCase()} travel?
              </p>
              <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, lineHeight: 1.65, marginBottom: 18 }}>
                Let our travel experts build a personalised package for your next adventure.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary"
                style={{ width: "100%", padding: "12px 16px", fontSize: 14 }}
                aria-label="Get a custom quote"
              >
                Get a Custom Quote <ArrowRight size={14} />
              </button>
              <a
                href={waUrl}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  marginTop: 10, padding: "11px 16px", borderRadius: 9999,
                  background: "#25d366", color: "#fff",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                  textDecoration: "none",
                }}
                aria-label="WhatsApp us"
              >
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            </div>

            {/* Browse packages link */}
            <div style={{
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 14, padding: "18px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 10, textDecoration: "none",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a", margin: 0 }}>
                  Browse Packages
                </p>
                <p style={{ color: "#94a3b8", fontSize: 12, margin: "3px 0 0" }}>
                  View all curated tours
                </p>
              </div>
              <Link
                href="/packages"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  color: "#FE8100", fontWeight: 700, fontSize: 13,
                  textDecoration: "none",
                }}
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Contact modal */}
      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        subject={`Blog enquiry – ${post.title}`}
      />

      <style>{`
        @media (min-width: 1024px) {
          .blog-detail-grid {
            grid-template-columns: minmax(0,1fr) 300px !important;
            gap: 48px !important;
          }
          .blog-sidebar {
            display: flex !important;
          }
        }
        @media (max-width: 1023px) {
          .blog-sidebar {
            display: none !important;
          }
        }

        /* ── Rich content renderer ─────────────────────── */
        .blog-rich-content {
          color: #374151;
          font-size: 16px;
          line-height: 1.9;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .blog-rich-content h1,
        .blog-rich-content h2,
        .blog-rich-content h3,
        .blog-rich-content h4,
        .blog-rich-content h5,
        .blog-rich-content h6 {
          font-family: 'Poppins', sans-serif;
          color: #0f172a;
          line-height: 1.3;
          margin: 1.4em 0 0.5em;
        }
        .blog-rich-content h1 { font-size: clamp(22px,3vw,34px); font-weight: 800; }
        .blog-rich-content h2 { font-size: clamp(18px,2.4vw,26px); font-weight: 700; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9; }
        .blog-rich-content h3 { font-size: clamp(16px,2vw,21px); font-weight: 700; }
        .blog-rich-content h4 { font-size: 17px; font-weight: 600; }
        .blog-rich-content h5 { font-size: 15px; font-weight: 600; }
        .blog-rich-content h6 { font-size: 14px; font-weight: 600; color: #64748b; }
        .blog-rich-content p  { margin: 0 0 1em; }
        .blog-rich-content strong { font-weight: 700; color: #0f172a; }
        .blog-rich-content em     { font-style: italic; }
        .blog-rich-content u      { text-decoration: underline; }
        .blog-rich-content s,
        .blog-rich-content del    { text-decoration: line-through; }
        .blog-rich-content ul,
        .blog-rich-content ol     { padding-left: 1.75em; margin: 0.5em 0 1em; }
        .blog-rich-content li     { margin-bottom: 0.35em; }
        .blog-rich-content blockquote {
          border-left: 4px solid #0127FC;
          padding: 12px 18px;
          margin: 1.25em 0;
          background: #f1f5f9;
          border-radius: 0 8px 8px 0;
          color: #475569;
          font-style: italic;
        }
        .blog-rich-content code {
          background: #f1f5f9;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.87em;
          font-family: 'Fira Mono', 'Consolas', monospace;
          color: #0127FC;
        }
        .blog-rich-content pre {
          background: #1e293b;
          color: #e2e8f0;
          border-radius: 10px;
          padding: 18px 22px;
          overflow-x: auto;
          margin: 1em 0;
          max-width: 100%;
        }
        .blog-rich-content pre code {
          background: none;
          color: inherit;
          padding: 0;
          font-size: 0.9em;
        }
        .blog-rich-content hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 2em 0;
        }
        .blog-rich-content a {
          color: #0127FC;
          text-decoration: underline;
          word-break: break-word;
        }
        .blog-rich-content a:hover { opacity: 0.8; }
        .blog-rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          display: block;
        }
        .blog-rich-content figure {
          margin: 1em 0;
        }
        .blog-rich-content figcaption {
          font-size: 13px;
          color: #64748b;
          margin-top: 6px;
          font-style: italic;
          text-align: center;
        }
        .blog-rich-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.25em 0;
          overflow-x: auto;
          display: block;
        }
        .blog-rich-content th,
        .blog-rich-content td {
          border: 1px solid #e2e8f0;
          padding: 9px 14px;
          text-align: left;
          white-space: nowrap;
        }
        .blog-rich-content th {
          background: #f1f5f9;
          font-weight: 700;
          color: #0f172a;
        }
        .blog-rich-content iframe {
          max-width: 100%;
          border-radius: 10px;
          display: block;
          margin: 1em auto;
        }
        .blog-rich-content mark {
          border-radius: 3px;
          padding: 1px 3px;
        }
        .blog-rich-content sup { font-size: 0.75em; vertical-align: super; }
        .blog-rich-content sub { font-size: 0.75em; vertical-align: sub; }

        /* Mobile overflow guard */
        @media (max-width: 768px) {
          .blog-rich-content table {
            font-size: 13px;
          }
          .blog-rich-content th,
          .blog-rich-content td {
            padding: 6px 10px;
            white-space: normal;
          }
          .blog-rich-content pre {
            font-size: 12px;
            padding: 12px 14px;
          }
          .blog-rich-content iframe {
            width: 100% !important;
            height: auto !important;
            min-height: 220px;
          }
        }
      `}</style>
    </>
  );
}
