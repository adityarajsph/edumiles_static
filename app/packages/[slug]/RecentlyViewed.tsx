"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import { getPackageBySlug } from "../../lib/packages";
import type { Package } from "../../lib/packages";

const LS_KEY = "recentlyViewedPackages";
const MAX_STORED = 6;

interface RecentlyViewedProps {
  currentSlug: string;
}

/** Called on the detail page to record a visit. Pure side-effect, safe to call in useEffect. */
export function recordRecentlyViewed(slug: string): void {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const slugs: string[] = raw ? JSON.parse(raw) : [];
    const deduplicated = [slug, ...slugs.filter(s => s !== slug)].slice(0, MAX_STORED);
    localStorage.setItem(LS_KEY, JSON.stringify(deduplicated));
  } catch {
    // localStorage may be unavailable (SSR guard, private mode, quota exceeded)
  }
}

export default function RecentlyViewed({ currentSlug }: RecentlyViewedProps) {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    // Record current page visit
    recordRecentlyViewed(currentSlug);

    // Read stored slugs, exclude the page being viewed, resolve to Package objects
    try {
      const raw = localStorage.getItem(LS_KEY);
      const slugs: string[] = raw ? JSON.parse(raw) : [];
      const resolved = slugs
        .filter(s => s !== currentSlug)
        .map(s => getPackageBySlug(s))
        .filter((p): p is Package => p !== undefined)
        .slice(0, MAX_STORED);
      setPackages(resolved);
    } catch {
      setPackages([]);
    }
  }, [currentSlug]);

  if (packages.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-heading">
      <h2
        id="recently-viewed-heading"
        style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 900,
          fontSize: "clamp(20px,2.5vw,28px)", color: "#0127FC",
          marginBottom: 6,
        }}
      >
        Recently Viewed
      </h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
        Packages you explored recently
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20,
      }}>
        {packages.map(pkg => (
          <Link
            key={pkg.slug}
            href={`/packages/${pkg.slug}`}
            style={{ textDecoration: "none" }}
            aria-label={`Revisit ${pkg.name}`}
          >
            <div
              className="card"
              style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                  className="rv-img"
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top,rgba(0,0,0,0.25),transparent)",
                }} />
                <span style={{
                  position: "absolute", top: 10, left: 10,
                  background: pkg.badgeBg, color: "#fff",
                  fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 9999,
                }}>{pkg.badge}</span>
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  display: "flex", alignItems: "center", gap: 3,
                  background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)",
                  fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 9999, color: "#1e293b",
                }}>
                  <Star size={10} fill="#FE8100" color="#FE8100" />
                  {pkg.rating}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>
                  <MapPin size={10} color="#FE8100" />{pkg.location}
                </div>
                <h3 style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                  fontSize: 14, color: "#0127FC", marginBottom: 8,
                  lineHeight: 1.3,
                }}>
                  {pkg.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: 11, marginBottom: 10 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Clock size={10} color="#FE8100" />{pkg.duration}
                  </span>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: 10, borderTop: "1px solid #f1f5f9",
                }}>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 16, color: "#FE8100" }}>
                      ₹{pkg.price.toLocaleString("en-IN")}
                      <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>/person</span>
                    </div>
                  </div>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: "#0127FC", fontSize: 12, fontWeight: 700,
                  }}>
                    View <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`.rv-img:hover { transform: scale(1.07); }`}</style>
    </section>
  );
}
