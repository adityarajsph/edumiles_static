"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Clock, Users, Star, Check, X as XIcon,
  MessageCircle, PhoneCall, ChevronDown, ChevronUp, ArrowRight,
  Sun, Leaf, Banknote, Info, BookOpen, HelpCircle, Compass,
  ThumbsUp, Eye, Calendar,
} from "lucide-react";
import ContactModal from "../../components/ContactModal";
import type { Package } from "../../lib/packages";

const WHATSAPP = "918796673667";

/* ─── Full Description Dropdown Card ──────────────── */
function FullDescriptionCard({ body }: { body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 16,
      background: "#fff",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
      marginTop: 14,
    }}>
      {/* Clickable header */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
          padding: "20px 28px",
          background: open
            ? "linear-gradient(135deg,#0127FC 0%,#0f1f8f 100%)"
            : "#fff",
          border: "none", cursor: "pointer", textAlign: "left",
          borderBottom: open ? "1px solid rgba(255,255,255,0.12)" : "none",
          transition: "background 0.25s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 9,
            background: open ? "rgba(254,129,0,0.2)" : "#eff6ff",
            border: `1px solid ${open ? "rgba(254,129,0,0.4)" : "#bfdbfe"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "all 0.25s",
          }}>
            <BookOpen size={14} color={open ? "#FE8100" : "#0127FC"} />
          </span>
          <div>
            <p style={{
              margin: 0, fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: open ? "rgba(255,255,255,0.55)" : "#94a3b8",
            }}>
              Detailed Description
            </p>
            <p style={{
              margin: 0, fontFamily: "'Poppins',sans-serif",
              fontWeight: 700, fontSize: 15,
              color: open ? "#fff" : "#0f172a",
              transition: "color 0.25s",
            }}>
              Full Package Overview
            </p>
          </div>
        </div>
        <span style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: open ? "rgba(255,255,255,0.15)" : "#f1f5f9",
          border: `1px solid ${open ? "rgba(255,255,255,0.2)" : "#e2e8f0"}`,
          transition: "all 0.25s",
        }}>
          {open
            ? <ChevronUp size={16} color="#fff" />
            : <ChevronDown size={16} color="#64748b" />
          }
        </span>
      </button>

      {/* Expandable body */}
      {open && (
        <div style={{ padding: "24px 28px 28px" }}>
          {/<[a-z][\s\S]*>/i.test(body) ? (
            <div className="pkg-rich-content" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: 1.85 }}>
              {body}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
function SectionHeading({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: sub ? 5 : 0 }}>
        <span style={{ color: "#FE8100", display: "flex" }}>{icon}</span>
        <h2 style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 800,
          fontSize: 20, color: "#0f172a", margin: 0,
        }}>{title}</h2>
      </div>
      {sub && <p style={{ color: "#94a3b8", fontSize: 14, margin: 0, paddingLeft: 28 }}>{sub}</p>}
    </div>
  );
}

/* ─── Divider ──────────────────────────────────────── */
function Divider() {
  return <div style={{ borderTop: "1px solid #f1f5f9", margin: "32px 0" }} />;
}

/* ─── FAQ accordion item ───────────────────────────── */
function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f1f5f9" }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: 12,
          padding: "16px 0", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{
            minWidth: 24, height: 24, borderRadius: "50%",
            background: open ? "#FE8100" : "#f1f5f9",
            color: open ? "#fff" : "#94a3b8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, marginTop: 1, transition: "all 0.2s",
            flexShrink: 0,
          }}>{idx + 1}</span>
          <span style={{
            fontFamily: "'Inter',sans-serif", fontWeight: 600,
            fontSize: 15, color: "#0f172a", lineHeight: 1.5,
          }}>{q}</span>
        </div>
        {open
          ? <ChevronUp size={17} color="#FE8100" style={{ flexShrink: 0, marginTop: 4 }} />
          : <ChevronDown size={17} color="#cbd5e1" style={{ flexShrink: 0, marginTop: 4 }} />
        }
      </button>
      {open && (
        <p style={{
          color: "#64748b", fontSize: 14, lineHeight: 1.8,
          paddingBottom: 16, paddingLeft: 36, margin: 0,
        }}>{a}</p>
      )}
    </div>
  );
}

/* ─── Itinerary day item ───────────────────────────── */
function ItineraryDay({ day, title, description, idx, total }: {
  day: number; title: string; description: string; idx: number; total: number;
}) {
  const [open, setOpen] = useState(idx === 0); // first day open by default
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 14, overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 14,
          padding: "16px 20px", background: open ? "#fff8f0" : "#fff",
          border: "none", cursor: "pointer", textAlign: "left",
          borderBottom: open ? "1px solid #fde68a" : "none",
          transition: "background 0.2s",
        }}
      >
        {/* Day number bubble */}
        <span style={{
          minWidth: 40, height: 40, borderRadius: "50%",
          background: open ? "#FE8100" : "#f1f5f9",
          color: open ? "#fff" : "#64748b",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, flexShrink: 0,
          transition: "all 0.2s",
        }}>
          {day}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: open ? "#FE8100" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Day {day} of {total}
          </p>
          <p style={{ margin: "2px 0 0", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, color: "#0f172a", lineHeight: 1.3 }}>
            {title || `Day ${day}`}
          </p>
        </div>
        {open
          ? <ChevronUp size={17} color="#FE8100" style={{ flexShrink: 0 }} />
          : <ChevronDown size={17} color="#cbd5e1" style={{ flexShrink: 0 }} />
        }
      </button>
      {open && description && (
        <div style={{ padding: "16px 20px 18px 74px" }}>
          {/<[a-z][\s\S]*>/i.test(description) ? (
            <div className="itinerary-rich-content" dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p style={{ margin: 0, color: "#475569", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


export default function PackageDetailClient({
  pkg, galleryNode, similarCards, recommendedCards, recentlyViewedNode,
}: {
  pkg: Package;
  galleryNode: React.ReactNode;
  similarCards: React.ReactNode;
  recommendedCards: React.ReactNode;
  recentlyViewedNode: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const discountPct = pkg.price < pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hi, I'm interested in the "${pkg.name}" package. Please share more details.`
  )}`;

  return (
    <>
      {/* ── Two-column grid ───────────────────────────── */}
      <div
        className="pkg-detail-grid"
        style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 32,
          alignItems: "start",
        }}
      >

        {/* ══ LEFT ════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* ── Gallery ───────────────────────────────── */}
          {/* Gallery is now rendered full-width ABOVE this grid via page.tsx */}

          {/* ── Title block ─────────────────────────── */}
          <div style={{ marginBottom: 20 }}>

            {/* Badges row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <span style={{
                background: pkg.badgeBg, color: "#fff",
                fontSize: 10, fontWeight: 700, padding: "4px 12px",
                borderRadius: 9999, letterSpacing: "0.04em",
              }}>{pkg.badge}</span>
              <span style={{
                background: "#f1f5f9", color: "#64748b",
                fontSize: 10, fontWeight: 600, padding: "4px 12px",
                borderRadius: 9999,
              }}>{pkg.category}</span>
              {pkg.season.activeSeason === "peak" ? (
                <span style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#fffbeb", color: "#b45309",
                  border: "1px solid #fde68a",
                  fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 9999,
                }}>
                  <Sun size={10} /> Peak Season
                </span>
              ) : (
                <span style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#f0fdf4", color: "#166534",
                  border: "1px solid #bbf7d0",
                  fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 9999,
                }}>
                  <Leaf size={10} /> Off Season
                </span>
              )}
            </div>

            <h1 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 800,
              fontSize: "clamp(24px,3vw,36px)", color: "#0f172a",
              lineHeight: 1.25, marginBottom: 14,
            }}>
              {pkg.name}
            </h1>

            {/* Meta row */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "10px 22px",
              color: "#64748b", fontSize: 14,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} color="#FE8100" strokeWidth={2} />
                {pkg.location}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={14} color="#FE8100" strokeWidth={2} />
                {pkg.duration}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={14} color="#FE8100" strokeWidth={2} />
                {pkg.groupSize} people
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Star size={14} fill="#FE8100" color="#FE8100" />
                <strong style={{ color: "#0f172a" }}>{pkg.rating}</strong>
                <span style={{ color: "#94a3b8" }}>({pkg.reviews} reviews)</span>
              </span>
            </div>

            {/* Best time hint */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 16, background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderLeft: "3px solid #FE8100",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#475569",
            }}>
              <Info size={13} color="#FE8100" />
              <span>
                <strong style={{ color: "#0f172a" }}>Best months:</strong>{" "}
                {pkg.season.activeSeason === "peak"
                  ? (Array.isArray(pkg.season.peak.months) ? pkg.season.peak.months.join(", ") : pkg.season.peak.months)
                  : (Array.isArray(pkg.season.offSeason.months) ? pkg.season.offSeason.months.join(", ") : pkg.season.offSeason.months)}
              </span>
            </div>
          </div>

          {/* ── Card 1: Short Description ──────────── */}
          <div style={{
            position: "relative",
            borderRadius: 16,
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            padding: "24px 28px",
            overflow: "hidden",
          }}>
            {/* Left accent bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: 4,
              background: "linear-gradient(180deg,#FE8100,#ffb347)",
              borderRadius: "4px 0 0 4px",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8,
                background: "#fff7ed", border: "1px solid #fed7aa",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Info size={14} color="#FE8100" />
              </span>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                At a Glance
              </p>
            </div>
            <p style={{
              margin: 0,
              fontSize: 15, color: "#475569", lineHeight: 1.85,
              fontFamily: "'Inter',sans-serif",
            }}>
              {pkg.description}
            </p>
          </div>

          {/* ── Card 2: Full Description (dropdown) ─── */}
          {pkg.fullDescription && (
            <FullDescriptionCard body={pkg.fullDescription} />
          )}

          <Divider />

          {/* ── Highlights strip ──────────────────────── */}
          <section aria-labelledby="highlights-heading">
            <SectionHeading icon={<Star size={18} />} title="Trip Highlights" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {pkg.highlights.map(h => (
                <span key={h} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "#fff", border: "1px solid #e2e8f0",
                  color: "#334155", fontSize: 14, fontWeight: 500,
                  padding: "8px 14px", borderRadius: 10,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <Check size={13} color="#FE8100" strokeWidth={2.5} />
                  {h}
                </span>
              ))}
            </div>
          </section>

          <Divider />

          {/* ── Itinerary ─────────────────────────────── */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <>
              <section aria-labelledby="itinerary-heading">
                <SectionHeading
                  icon={<Calendar size={18} />}
                  title="Day-wise Itinerary"
                  sub={`${pkg.itinerary.length}-day detailed plan`}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {pkg.itinerary
                    .slice()
                    .sort((a, b) => a.day - b.day)
                    .map((item, idx) => (
                      <ItineraryDay
                        key={item.day}
                        day={item.day}
                        title={item.title}
                        description={item.description}
                        idx={idx}
                        total={pkg.itinerary!.length}
                      />
                    ))}
                </div>
              </section>
              <Divider />
            </>
          )}

          {/* ── Inclusions & Exclusions ───────────────── */}
          <section aria-labelledby="incl-heading">
            <SectionHeading icon={<Check size={18} />} title="Inclusions & Exclusions" />
            <div className="incl-excl-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>

              {/* Inclusions */}
              <div style={{
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 14, padding: "22px 24px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <p style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700,
                  fontSize: 14, color: "#15803d", marginBottom: 14,
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "#dcfce7", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={13} color="#16a34a" strokeWidth={3} />
                  </span>
                  What&apos;s Included
                </p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                      <Check size={13} color="#16a34a" strokeWidth={2.5} style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div style={{
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 14, padding: "22px 24px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <p style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700,
                  fontSize: 14, color: "#b91c1c", marginBottom: 14,
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "#fee2e2", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <XIcon size={13} color="#dc2626" strokeWidth={3} />
                  </span>
                  Not Included
                </p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {pkg.exclusions.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                      <XIcon size={13} color="#dc2626" strokeWidth={2.5} style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Divider />

          {/* ── Season Info ───────────────────────────── */}
          <section aria-labelledby="season-heading">
            <SectionHeading
              icon={<Compass size={18} />}
              title="Best Time to Visit"
              sub={pkg.season.priceTendency}
            />
            <div className="season-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

              {/* Peak */}
              <div style={{
                borderRadius: 14, padding: "18px 20px",
                background: pkg.season.activeSeason === "peak" ? "#fffbeb" : "#fff",
                border: pkg.season.activeSeason === "peak"
                  ? "1.5px solid #fde68a"
                  : "1px solid #e2e8f0",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Sun size={15} color={pkg.season.activeSeason === "peak" ? "#d97706" : "#94a3b8"} />
                  <span style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                    color: pkg.season.activeSeason === "peak" ? "#92400e" : "#64748b",
                  }}>Peak Season</span>
                  {pkg.season.activeSeason === "peak" && (
                    <span style={{
                      background: "#f59e0b", color: "#fff",
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                    }}>NOW</span>
                  )}
                </div>
                {/* Month badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {(Array.isArray(pkg.season.peak.months)
                    ? pkg.season.peak.months
                    : (pkg.season.peak.months as string).split(/[,–\-\/]/).map((m: string) => m.trim()).filter(Boolean)
                  ).map((m: string) => (
                    <span key={m} style={{
                      background: pkg.season.activeSeason === "peak" ? "#fef3c7" : "#f1f5f9",
                      color: pkg.season.activeSeason === "peak" ? "#92400e" : "#64748b",
                      border: `1px solid ${pkg.season.activeSeason === "peak" ? "#fde68a" : "#e2e8f0"}`,
                      fontSize: 12, fontWeight: 600,
                      padding: "3px 10px", borderRadius: 9999,
                    }}>{m}</span>
                  ))}
                </div>
                <p style={{ color: "#78716c", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                  {pkg.season.peak.note}
                </p>
              </div>

              {/* Off Season */}
              <div style={{
                borderRadius: 14, padding: "18px 20px",
                background: pkg.season.activeSeason === "off" ? "#f0fdf4" : "#fff",
                border: pkg.season.activeSeason === "off"
                  ? "1.5px solid #bbf7d0"
                  : "1px solid #e2e8f0",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Leaf size={15} color={pkg.season.activeSeason === "off" ? "#16a34a" : "#94a3b8"} />
                  <span style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                    color: pkg.season.activeSeason === "off" ? "#14532d" : "#64748b",
                  }}>Off Season</span>
                  {pkg.season.activeSeason === "off" && (
                    <span style={{
                      background: "#16a34a", color: "#fff",
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                    }}>NOW</span>
                  )}
                </div>
                {/* Month badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {(Array.isArray(pkg.season.offSeason.months)
                    ? pkg.season.offSeason.months
                    : (pkg.season.offSeason.months as string).split(/[,–\-\/]/).map((m: string) => m.trim()).filter(Boolean)
                  ).map((m: string) => (
                    <span key={m} style={{
                      background: pkg.season.activeSeason === "off" ? "#dcfce7" : "#f1f5f9",
                      color: pkg.season.activeSeason === "off" ? "#14532d" : "#64748b",
                      border: `1px solid ${pkg.season.activeSeason === "off" ? "#bbf7d0" : "#e2e8f0"}`,
                      fontSize: 12, fontWeight: 600,
                      padding: "3px 10px", borderRadius: 9999,
                    }}>{m}</span>
                  ))}
                </div>
                <p style={{ color: "#78716c", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                  {pkg.season.offSeason.note}
                </p>
              </div>
            </div>
          </section>

          {/* ── Similar Packages ──────────────────────── */}
          {similarCards && (
            <>
              <Divider />
              <section aria-labelledby="similar-heading">
                <SectionHeading
                  icon={<Compass size={18} />}
                  title="Similar Packages"
                  sub={`More ${pkg.category.toLowerCase()} experiences`}
                />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                  gap: 20,
                }}>
                  {similarCards}
                </div>
              </section>
            </>
          )}

          {/* ── Recommended ───────────────────────────── */}
          {recommendedCards && (
            <>
              <Divider />
              <section aria-labelledby="recommended-heading">
                <SectionHeading
                  icon={<ThumbsUp size={18} />}
                  title="Recommended For You"
                  sub="Our most popular packages"
                />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                  gap: 20,
                }}>
                  {recommendedCards}
                </div>
              </section>
            </>
          )}

          {/* ── Recently Viewed ───────────────────────── */}
          {recentlyViewedNode && (
            <>
              <Divider />
              <section>
                <SectionHeading icon={<Eye size={18} />} title="Recently Viewed" />
                {recentlyViewedNode}
              </section>
            </>
          )}

          {/* ── FAQ ───────────────────────────────────── */}
          <Divider />
          <section aria-labelledby="faq-heading">
            <SectionHeading
              icon={<HelpCircle size={18} />}
              title="Frequently Asked Questions"
              sub={`Everything you need to know about ${pkg.name}`}
            />
            <div style={{
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 14, overflow: "hidden", padding: "0 6px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              {pkg.faq.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} idx={i} />
              ))}
            </div>
          </section>

          {/* ── SEO paragraph ─────────────────────────── */}
          <Divider />
          <section style={{ paddingBottom: 8 }}>
            <SectionHeading icon={<Info size={18} />} title="About This Package" />
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.85, margin: "0 0 18px" }}>
              The <strong style={{ color: "#334155" }}>{pkg.name}</strong> is a {pkg.duration.toLowerCase()} journey through {pkg.location}.
              Perfect for {pkg.groupSize === "2" ? "couples" : "groups of " + pkg.groupSize}, this{" "}
              {pkg.category.toLowerCase()} package covers the best of the region with expert guides, comfortable
              accommodation, and seamless transfers — all curated by EdumilesTravels, a trusted travel agency
              in New Delhi. Book your {pkg.location.split("•")[0].trim()} tour package today.
            </p>
            <Link
              href="/packages"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#0127FC", fontWeight: 600, fontSize: 14, textDecoration: "none",
              }}
            >
              ← Browse all packages
            </Link>
          </section>

        </div>

        {/* ══ RIGHT — Sticky booking card ═════════════ */}
        <aside aria-label="Booking card">
          <div
            className="booking-card"
            style={{
              position: "sticky", top: 88,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              padding: "22px 22px 20px",
              display: "flex", flexDirection: "column", gap: 16,
            }}
          >
            {/* Price block */}
            <div>
              {discountPct > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: "#94a3b8", fontSize: 13, textDecoration: "line-through" }}>
                    ₹{pkg.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span style={{
                    background: "#dcfce7", color: "#15803d",
                    fontWeight: 700, fontSize: 11, padding: "2px 8px", borderRadius: 9999,
                  }}>
                    {discountPct}% OFF
                  </span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                  fontSize: 30, color: "#0f172a", lineHeight: 1,
                }}>
                  ₹{pkg.price.toLocaleString("en-IN")}
                </span>
                <span style={{ color: "#94a3b8", fontSize: 12 }}>/person</span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 11, margin: "3px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                <Banknote size={11} /> incl. all taxes &amp; fees
              </p>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9" }} />

            {/* Quick stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Clock size={14} color="#FE8100" />,             label: pkg.duration },
                { icon: <Users size={14} color="#FE8100" />,             label: `Group size: ${pkg.groupSize}` },
                { icon: <MapPin size={14} color="#FE8100" />,            label: pkg.location },
                { icon: <Star size={14} fill="#FE8100" color="#FE8100" />, label: `${pkg.rating} · ${pkg.reviews} reviews` },
                { icon: <Sun size={14} color="#FE8100" />,               label: `Best: ${pkg.season.activeSeason === "peak" ? (Array.isArray(pkg.season.peak.months) ? pkg.season.peak.months.join(", ") : pkg.season.peak.months) : (Array.isArray(pkg.season.offSeason.months) ? pkg.season.offSeason.months.join(", ") : pkg.season.offSeason.months)}` },
              ].map(({ icon, label }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#475569", lineHeight: 1.45 }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9" }} />

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary"
                style={{ width: "100%", padding: "13px 18px", fontSize: 14, borderRadius: 10 }}
                aria-label={`Enquire about ${pkg.name}`}
              >
                Enquire Now <ArrowRight size={15} />
              </button>

              <a
                href={waUrl}
                target="_blank" rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px 18px", borderRadius: 10,
                  background: "#25d366",
                  color: "#fff", fontFamily: "'Poppins',sans-serif",
                  fontWeight: 700, fontSize: 14, textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.88")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>

            <p style={{ color: "#94a3b8", fontSize: 11, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
              ✓ Free cancellation up to 14 days before departure
            </p>
          </div>
        </aside>
      </div>

      {/* ── Mobile sticky bottom bar ─────────────────── */}
      <div
        className="mobile-booking-bar"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
          background: "#fff", borderTop: "1px solid #e2e8f0",
          padding: "10px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          boxShadow: "0 -2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div>
          {discountPct > 0 && (
            <div style={{ color: "#94a3b8", fontSize: 11, textDecoration: "line-through", lineHeight: 1 }}>
              ₹{pkg.originalPrice.toLocaleString("en-IN")}
            </div>
          )}
          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", lineHeight: 1.1 }}>
            ₹{pkg.price.toLocaleString("en-IN")}
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>/person</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={waUrl} target="_blank" rel="noopener noreferrer"
            aria-label="WhatsApp"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: 10,
              background: "#25d366", color: "#fff", textDecoration: "none",
            }}
          >
            <PhoneCall size={16} />
          </a>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary"
            style={{ padding: "9px 20px", fontSize: 13, borderRadius: 10 }}
            aria-label="Enquire"
          >
            Enquire <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        subject={`Enquiry – ${pkg.name}`}
      />

      <style>{`
        @media (min-width: 1024px) {
          .pkg-detail-grid {
            grid-template-columns: minmax(0,1fr) 320px !important;
            gap: 40px !important;
          }
          .incl-excl-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .mobile-booking-bar {
            display: none !important;
          }
        }
        @media (max-width: 639px) {
          .season-grid {
            grid-template-columns: 1fr !important;
          }
          .booking-card {
            display: none !important;
          }
        }
        /* Rich text content in Overview and Itinerary */
        .pkg-rich-content, .itinerary-rich-content {
          color: #475569; font-size: 15px; line-height: 1.85;
        }
        .pkg-rich-content h1,.pkg-rich-content h2,.pkg-rich-content h3,
        .pkg-rich-content h4,.pkg-rich-content h5,.pkg-rich-content h6,
        .itinerary-rich-content h1,.itinerary-rich-content h2,.itinerary-rich-content h3 {
          font-family: 'Poppins',sans-serif; color: #0f172a; line-height: 1.3;
          margin: 1.2em 0 0.5em;
        }
        .pkg-rich-content h2,.itinerary-rich-content h2 { font-size: 18px; font-weight: 700; }
        .pkg-rich-content h3,.itinerary-rich-content h3 { font-size: 16px; font-weight: 700; }
        .pkg-rich-content p,.itinerary-rich-content p { margin: 0 0 0.9em; }
        .pkg-rich-content ul,.pkg-rich-content ol,
        .itinerary-rich-content ul,.itinerary-rich-content ol { padding-left: 1.6em; margin: 0.4em 0 0.9em; }
        .pkg-rich-content li,.itinerary-rich-content li { margin-bottom: 0.3em; }
        .pkg-rich-content strong,.itinerary-rich-content strong { font-weight: 700; color: #0f172a; }
        .pkg-rich-content a,.itinerary-rich-content a { color: #0127FC; text-decoration: underline; }
        .pkg-rich-content img,.itinerary-rich-content img { max-width: 100%; border-radius: 10px; height: auto; }
        .pkg-rich-content blockquote,.itinerary-rich-content blockquote {
          border-left: 3px solid #FE8100; padding: 10px 16px; margin: 1em 0;
          background: #f8fafc; color: #64748b; font-style: italic; border-radius: 0 8px 8px 0;
        }

        /* ── Premium feature card rich text (dark bg) ── */
        .pkg-feature-rich {
          color: rgba(255,255,255,0.82);
          font-size: clamp(14px, 1.5vw, 16px);
          line-height: 1.9;
          font-family: 'Inter', sans-serif;
        }
        .pkg-feature-rich h1,.pkg-feature-rich h2,.pkg-feature-rich h3,
        .pkg-feature-rich h4,.pkg-feature-rich h5,.pkg-feature-rich h6 {
          font-family: 'Poppins', sans-serif;
          color: #fff;
          line-height: 1.3;
          margin: 1.2em 0 0.5em;
        }
        .pkg-feature-rich h2 { font-size: 18px; font-weight: 700; }
        .pkg-feature-rich h3 { font-size: 16px; font-weight: 700; }
        .pkg-feature-rich p  { margin: 0 0 0.9em; }
        .pkg-feature-rich ul,.pkg-feature-rich ol {
          padding-left: 1.6em; margin: 0.4em 0 0.9em;
        }
        .pkg-feature-rich li { margin-bottom: 0.4em; }
        .pkg-feature-rich strong { font-weight: 700; color: #fff; }
        .pkg-feature-rich em    { font-style: italic; color: rgba(255,255,255,0.7); }
        .pkg-feature-rich a     { color: #FE8100; text-decoration: underline; }
        .pkg-feature-rich a:hover { opacity: 0.8; }
        .pkg-feature-rich blockquote {
          border-left: 3px solid #FE8100;
          padding: 10px 16px; margin: 1em 0;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.7);
          font-style: italic; border-radius: 0 8px 8px 0;
        }
        .pkg-feature-rich img {
          max-width: 100%; border-radius: 10px; height: auto; display: block;
        }
        .pkg-feature-rich code {
          background: rgba(255,255,255,0.1); border-radius: 4px;
          padding: 2px 6px; font-size: 0.87em; color: #FE8100;
        }
      `}</style>
    </>
  );
}
