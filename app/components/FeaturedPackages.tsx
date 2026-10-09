"use client";

import { useState, useEffect } from "react";
import { Star, Clock, Users, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { ALL_PACKAGES } from "../lib/packages";
import type { Package } from "../lib/packages";

interface FeaturedPackagesProps {
  onOpenContact: (subject?: string) => void;
}

export default function FeaturedPackages({ onOpenContact }: FeaturedPackagesProps) {
  const { ref, isVisible } = useScrollAnimation();

  // Static data renders immediately so there is never a blank flash.
  // DB featured packages silently replace them once the fetch resolves.
  const [packages, setPackages] = useState<Package[]>(ALL_PACKAGES.slice(0, 3));

  useEffect(() => {
    fetch("/api/packages?status=published&featured=true&limit=3")
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data?.items) && d.data.items.length > 0) {
          const mapped: Package[] = d.data.items.map((p: Record<string, unknown>) => ({
            id:            p._id as string,
            name:          (p.title as string)           || "",
            slug:          (p.slug  as string)           || "",
            location:      (p.destination as string)     || "",
            image:         (p.featuredImage as string)   || "",
            images:        (p.gallery as string[])       || [],
            price:         (p.price as number)           || 0,
            originalPrice: (p.discountPrice as number) > 0
              ? (p.discountPrice as number)
              : (p.price as number) || 0,
            rating:        (p.rating as number)          || 0,
            reviews:       (p.reviews as number)         || 0,
            duration:      (p.duration as string)        || "",
            groupSize:     (p.groupSize as string)       || "",
            badge:         (p.badge as string)           || "",
            badgeBg:       (p.badgeBg as string)         || "#FE8100",
            category:      (p.category as string)        || "",
            highlights:    (p.highlights as string[])    || [],
            description:   (p.shortDescription as string) || "",
            inclusions:    (p.inclusions as string[])    || [],
            exclusions:    (p.exclusions as string[])    || [],
            season: {
              peak:          { months: "", note: "" },
              offSeason:     { months: "", note: "" },
              priceTendency: "",
              activeSeason:  "peak" as const,
            },
            faq:     [],
            featured: (p.isFeatured as boolean) || false,
          }));
          setPackages(mapped);
        }
      })
      .catch(() => { /* silently keep static fallback */ });
  }, []);

  return (
    <section id="packages" style={{ padding: "96px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease",
        }}>
          <span className="section-tag">Curated For You</span>
          <h2 className="section-title">Featured Packages</h2>
          <div className="section-divider" />
          <p className="section-sub">Premium, all-inclusive packages crafted for an extraordinary experience.</p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
          {packages.map((pkg, i) => (
            <div key={pkg.slug} className="card" style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.6s ease ${i * 120}ms`,
            }}>
              {/* Image */}
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  className="pkg-img"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }} />
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
              <div style={{ padding: "22px 24px 16px" }}>
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
                    <span key={h} style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 9999 }}>{h}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: 12, textDecoration: "line-through" }}>₹{pkg.originalPrice.toLocaleString("en-IN")}</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 22, color: "#FE8100" }}>
                      ₹{pkg.price.toLocaleString("en-IN")}
                      <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>/person</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenContact(`Book Now – ${pkg.name}`)}
                    className="btn-primary"
                    style={{ padding: "10px 20px", fontSize: 13 }}
                  >
                    Book Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* View Details */}
              <div style={{ padding: "0 24px 20px" }}>
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
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/packages" className="btn-navy-outline">
            View All Packages <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <style>{`.pkg-img:hover { transform: scale(1.07); }`}</style>
    </section>
  );
}
