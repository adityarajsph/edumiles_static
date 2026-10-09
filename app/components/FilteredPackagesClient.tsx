"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Star, Clock, Users, MapPin, ArrowRight, Search, X, Filter } from "lucide-react";
import ContactModal from "./ContactModal";
import type { Package } from "../lib/packages";

const SORT_OPTIONS = ["Recommended", "Price: Low to High", "Price: High to Low", "Top Rated"];

interface Props {
  packages: Package[];
  heading: string;
  emptyMessage?: string;
}

export default function FilteredPackagesClient({ packages, heading, emptyMessage }: Props) {
  const [search, setSearch]       = useState("");
  const [sort, setSort]           = useState("Recommended");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState<string | undefined>();

  const openContact = useCallback((subject?: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  }, []);

  const filtered = packages
    .filter(p =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "Price: Low to High")  return a.price - b.price;
      if (sort === "Price: High to Low")  return b.price - a.price;
      if (sort === "Top Rated")           return b.rating - a.rating;
      return 0;
    });

  return (
    <section style={{ padding: "48px 24px 96px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Filter bar */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 14, marginBottom: 36,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 220 }}>
            <Filter size={15} color="#64748b" style={{ flexShrink: 0 }} />
            <div style={{
              display: "flex", alignItems: "center", gap: 8, flex: 1,
              background: "#fff", borderRadius: 9999, border: "1.5px solid #e2e8f0",
              padding: "7px 16px",
            }}>
              <Search size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search packages…"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#334155", background: "transparent" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>Sort:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding: "8px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#334155",
                background: "#fff", cursor: "pointer", outline: "none",
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Result count */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: "#0f172a", margin: 0 }}>{heading}</h2>
          <span style={{ color: "#64748b", fontSize: 14 }}>{filtered.length} {filtered.length === 1 ? "package" : "packages"}</span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 28 }}>
            {filtered.map(pkg => (
              <PackageCard key={String(pkg.id)} pkg={pkg} onBook={openContact} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <Search size={48} color="#c7d2fe" strokeWidth={1.5} style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#0127FC", marginBottom: 8 }}>No packages found</h3>
            <p style={{ color: "#64748b" }}>{search ? "Try a different search term." : (emptyMessage || "Check back soon.")}</p>
            {search && (
              <button onClick={() => setSearch("")} className="btn-primary" style={{ marginTop: 20 }}>
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} subject={modalSubject} />
    </section>
  );
}

function PackageCard({ pkg, onBook }: { pkg: Package; onBook: (subject: string) => void }) {
  const discountPct = pkg.originalPrice > pkg.price
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      {/* Image */}
      <div style={{ position: "relative", height: 220, overflow: "hidden", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pkg.image || "/edumiles.png"}
          alt={pkg.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
          className="pkg-img"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.25),transparent)" }} />
        {pkg.badge && (
          <span style={{
            position: "absolute", top: 16, left: 16,
            background: pkg.badgeBg, color: "#fff",
            fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 9999,
          }}>{pkg.badge}</span>
        )}
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
        {discountPct > 0 && (
          <div style={{
            position: "absolute", bottom: 12, right: 14,
            background: "#ef4444", color: "#fff",
            fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 9999,
          }}>{discountPct}% OFF</div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 22px 0", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8", fontSize: 12, marginBottom: 7 }}>
          <MapPin size={12} color="#FE8100" /> {pkg.location}
        </div>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#0127FC", marginBottom: 11, lineHeight: 1.3 }}>
          {pkg.name}
        </h3>
        <div style={{ display: "flex", gap: 14, color: "#64748b", fontSize: 12, marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} color="#FE8100" /> {pkg.duration}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} color="#FE8100" /> {pkg.groupSize} people</span>
        </div>
        {pkg.highlights.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {pkg.highlights.slice(0, 3).map(h => (
              <span key={h} style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 9999 }}>{h}</span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "0 22px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
          <div>
            {pkg.originalPrice > pkg.price && (
              <div style={{ color: "#94a3b8", fontSize: 12, textDecoration: "line-through" }}>₹{pkg.originalPrice.toLocaleString("en-IN")}</div>
            )}
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
        <Link
          href={`/packages/${pkg.slug}`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: "10px 0", borderRadius: 12, marginTop: 10,
            border: "1.5px solid #0127FC", color: "#0127FC",
            fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
            textDecoration: "none", transition: "all 0.25s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#0127FC"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#0127FC"; }}
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
