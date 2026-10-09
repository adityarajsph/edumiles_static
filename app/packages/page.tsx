"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import {
  Star, Clock, Users, MapPin, ArrowRight, Search, Filter, X,
} from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { ALL_PACKAGES } from "../lib/packages";
import type { Package } from "../lib/packages";

const STATIC_CATEGORIES = ["All", "Adventure", "Honeymoon", "Luxury", "Heritage", "Religious", "Weekend Trips"];
const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Top Rated"];

/* ─── Sub-components ────────────────────────────────── */
function PackageCard({
  pkg,
  delay,
  visible,
  onBook,
}: {
  pkg: Package;
  delay: number;
  visible: boolean;
  onBook: (subject: string) => void;
}) {
  return (
    <div
      className="card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.6s ease ${delay}ms`,
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img
          src={pkg.image}
          alt={pkg.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
          className="pkg-img"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.25),transparent)" }} />
        <span style={{
          position: "absolute", top: 16, left: 16,
          background: pkg.badgeBg, color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 9999,
        }}>{pkg.badge}</span>
        <div style={{
          position: "absolute", top: 16, right: 16,
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
          fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 9999, color: "#1e293b",
        }}>
          <Star size={11} fill="#FE8100" color="#FE8100" />
          {pkg.rating}
          <span style={{ color: "#94a3b8", fontWeight: 400 }}>({pkg.reviews})</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>
          <MapPin size={12} color="#FE8100" />{pkg.location}
        </div>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#0127FC", marginBottom: 12 }}>
          {pkg.name}
        </h3>
        <div style={{ display: "flex", gap: 16, color: "#64748b", fontSize: 12, marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} color="#FE8100" />{pkg.duration}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} color="#FE8100" />{pkg.groupSize} people</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {pkg.highlights.map(h => (
            <span key={h} style={{
              background: "#f1f5f9", color: "#475569",
              fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 9999,
            }}>{h}</span>
          ))}
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 16, borderTop: "1px solid #f1f5f9",
        }}>
          <div>
            <div style={{ color: "#94a3b8", fontSize: 12, textDecoration: "line-through" }}>
              ₹{pkg.originalPrice.toLocaleString("en-IN")}
            </div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 22, color: "#FE8100" }}>
              ₹{pkg.price.toLocaleString("en-IN")}
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>/person</span>
            </div>
          </div>
          <button
            onClick={() => onBook(`Book Now – ${pkg.name}`)}
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: 13 }}
          >
            Book Now <ArrowRight size={14} />
          </button>
        </div>

        {/* View Details */}
        <div style={{ padding: "12px 24px 20px" }}>
          <Link
            href={`/packages/${pkg.slug}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "10px 0", borderRadius: 14,
              border: "1.5px solid #0127FC", color: "#0127FC",
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
              textDecoration: "none", transition: "all 0.25s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#0127FC";
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#0127FC";
            }}
            aria-label={`View details for ${pkg.name}`}
          >
            View Details <ArrowRight size={14} style={{ transition: "transform 0.25s ease" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────── */
export default function PackagesPage() {
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");
  const [sort, setSort]           = useState("Recommended");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState<string | undefined>();
  // Start with static data so the page renders instantly with no flash.
  // When the DB responds, swap in the live data.
  const [packages, setPackages]   = useState<Package[]>(ALL_PACKAGES);
  const [categories, setCategories] = useState<string[]>(STATIC_CATEGORIES);
  const { ref, isVisible }        = useScrollAnimation();

  // Silently fetch published packages from the CMS on mount.
  // Falls back to static data on any error — live site never breaks.
  useEffect(() => {
    fetch("/api/packages?status=published&limit=100")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.items.length > 0) {
          // Map CMS fields to the shape the card component expects
          const mapped: Package[] = d.data.items.map((p: Record<string, unknown>) => ({
            id:            p._id as string,
            name:          (p.title as string) || "",
            slug:          p.slug as string,
            location:      (p.destination as string) || "",
            image:         (p.featuredImage as string) || "",
            images:        (p.gallery as string[]) || [],
            price:         (p.price as number) || 0,
            originalPrice: (p.discountPrice as number) > 0 ? (p.discountPrice as number) : ((p.price as number) || 0),
            rating:        (p.rating as number) || 0,
            reviews:       (p.reviews as number) || 0,
            duration:      (p.duration as string) || "",
            groupSize:     (p.groupSize as string) || "",
            badge:         (p.badge as string) || "",
            badgeBg:       (p.badgeBg as string) || "#FE8100",
            category:      (p.category as string) || "",
            highlights:    (p.highlights as string[]) || [],
            description:   (p.shortDescription as string) || "",
            inclusions:    (p.inclusions as string[]) || [],
            exclusions:    (p.exclusions as string[]) || [],
            season:        (p.season as Package["season"]) || { peak: { months: "", note: "" }, offSeason: { months: "", note: "" }, priceTendency: "", activeSeason: "peak" as const },
            faq:           ((p.faqs as Array<{ question: string; answer: string }>) || []).map(f => ({ q: f.question, a: f.answer })),
            featured:      (p.isFeatured as boolean) || false,
          }));
          setPackages(mapped);
        }
      })
      .catch(() => { /* silently keep static fallback */ });
  }, []);

  // Fetch live categories, fall back to static list on any error
  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) {
          setCategories(["All", ...d.data.map((c: { name: string }) => c.name)]);
        }
      })
      .catch(() => { /* keep static fallback */ });
  }, []);

  const openContact = useCallback((subject?: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  }, []);

  const filtered = packages
    .filter(p =>
      (category === "All" || p.category === category) &&
      (search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "Price: Low to High")  return a.price - b.price;
      if (sort === "Price: High to Low")  return b.price - a.price;
      if (sort === "Top Rated")           return b.rating - a.rating;
      return 0; // Recommended: original order
    });

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero Banner ── */}
        <section style={{
          background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
          padding: "140px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Blobs */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.25) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <span className="section-tag" style={{ color: "#FE8100" }}>Explore India & Beyond</span>
            <h1 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 900,
              fontSize: "clamp(32px,5vw,60px)", color: "#fff",
              lineHeight: 1.15, marginBottom: 16,
            }}>
              Our Travel Packages
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
              Hand-crafted itineraries for every kind of traveller — from thrill-seekers to honeymooners.
            </p>

            {/* Search bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fff", borderRadius: 9999,
              padding: "8px 8px 8px 24px",
              maxWidth: 500, margin: "0 auto",
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
            }}>
              <Search size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destination or package…"
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontFamily: "'Inter',sans-serif", fontSize: 15, color: "#334155",
                  background: "transparent",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94a3b8", display: "flex", alignItems: "center" }}>
                  <X size={16} />
                </button>
              )}
              <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14, flexShrink: 0 }}>
                Search
              </button>
            </div>
          </div>
        </section>

        {/* ── Filter + Grid ── */}
        <section style={{ padding: "64px 24px 96px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>

            {/* Filter bar */}
            <div ref={ref} style={{
              display: "flex", flexWrap: "wrap", alignItems: "center",
              justifyContent: "space-between", gap: 16, marginBottom: 48,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease",
            }}>
              {/* Category pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <Filter size={15} color="#64748b" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "7px 18px", borderRadius: 9999, fontSize: 13, fontWeight: 600,
                      fontFamily: "'Inter',sans-serif", cursor: "pointer",
                      border: category === cat ? "none" : "1.5px solid #e2e8f0",
                      background: category === cat
                        ? "linear-gradient(135deg,#FE8100,#FF9A2E)"
                        : "#fff",
                      color: category === cat ? "#fff" : "#475569",
                      boxShadow: category === cat ? "0 4px 16px rgba(254,129,0,0.3)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#64748b", fontSize: 13 }}>Sort by:</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    padding: "8px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0",
                    fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#334155",
                    background: "#fff", cursor: "pointer", outline: "none",
                  }}
                >
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Result count */}
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
              Showing <strong style={{ color: "#0127FC" }}>{filtered.length}</strong> packages
              {category !== "All" && <> in <strong style={{ color: "#FE8100" }}>{category}</strong></>}
            </p>

            {/* Cards */}
            {filtered.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 28 }}>
                {filtered.map((pkg, i) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    delay={i * 80}
                    visible={isVisible}
                    onBook={openContact}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <Search size={48} color="#c7d2fe" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#0127FC", marginBottom: 8 }}>
                  No packages found
                </h3>
                <p style={{ color: "#64748b" }}>Try a different search term or category.</p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="btn-primary"
                  style={{ marginTop: 24 }}
                >
                  Clear Filters
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
              <div style={{ position: "absolute", top: -40, right: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.3) 0%,transparent 70%)", pointerEvents: "none" }} />
              <span className="section-tag" style={{ color: "#FF9A2E" }}>Custom Itinerary</span>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(22px,3vw,36px)", color: "#fff", marginBottom: 12 }}>
                Can&apos;t find the perfect trip?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
                Tell us your dream destination and we&apos;ll build a custom package just for you.
              </p>
              <button onClick={() => openContact("Custom Package Enquiry")} className="btn-primary">
                Build My Custom Trip <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} subject={modalSubject} />

      <style>{`.pkg-img:hover { transform: scale(1.07); }`}</style>
    </>
  );
}
