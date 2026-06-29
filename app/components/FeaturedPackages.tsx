"use client";

import { Star, Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const packages = [
  {
    id: 1, name: "Golden Triangle Tour",
    location: "Delhi • Agra • Jaipur",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700&q=80",
    price: 12999, originalPrice: 18999,
    rating: 4.9, reviews: 312,
    duration: "6 Days / 5 Nights", groupSize: "2–12",
    badge: "Best Seller", badgeBg: "#FE8100",
    highlights: ["Taj Mahal Sunrise", "Amber Fort", "City Palace"],
  },
  {
    id: 2, name: "Kerala Backwaters Bliss",
    location: "Kochi • Alleppey • Munnar",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80",
    price: 15999, originalPrice: 22999,
    rating: 4.8, reviews: 248,
    duration: "7 Days / 6 Nights", groupSize: "2–8",
    badge: "Premium", badgeBg: "#0127FC",
    highlights: ["Houseboat Stay", "Spice Plantation", "Kathakali Show"],
  },
  {
    id: 3, name: "Himachal Adventure",
    location: "Manali • Solang • Rohtang",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80",
    price: 9999, originalPrice: 14999,
    rating: 4.7, reviews: 187,
    duration: "5 Days / 4 Nights", groupSize: "4–15",
    badge: "Adventure", badgeBg: "#10b981",
    highlights: ["Paragliding", "Snow Activities", "Hadimba Temple"],
  },
];

interface FeaturedPackagesProps {
  onOpenContact: (subject?: string) => void;
}

export default function FeaturedPackages({ onOpenContact }: FeaturedPackagesProps) {
  const { ref, isVisible } = useScrollAnimation();

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
            <div key={pkg.id} className="card" style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.6s ease ${i * 120}ms`,
            }}>
              {/* Image */}
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                <img src={pkg.image} alt={pkg.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} className="pkg-img" />
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
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a href="#" className="btn-navy-outline">View All Packages <ArrowRight size={15} /></a>
        </div>
      </div>

      <style>{`.pkg-img:hover { transform: scale(1.07); }`}</style>
    </section>
  );
}
