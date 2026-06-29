"use client";

import { MapPin, Star } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const destinations = [
  { name: "Goa, India",         image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80", rating: 4.9, tours: 48, tag: "Beach",    tagColor: "#3b82f6" },
  { name: "Manali, Himachal",   image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80", rating: 4.8, tours: 35, tag: "Adventure", tagColor: "#10b981" },
  { name: "Rajasthan, India",   image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80", rating: 4.9, tours: 52, tag: "Heritage",  tagColor: "#f59e0b" },
  { name: "Kerala, India",      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80", rating: 4.8, tours: 41, tag: "Nature",    tagColor: "#059669" },
  { name: "Varanasi, UP",       image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&q=80", rating: 4.7, tours: 29, tag: "Religious",  tagColor: "#FE8100" },
  { name: "Andaman Islands",    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", rating: 4.9, tours: 33, tag: "Island",    tagColor: "#06b6d4" },
];

export default function PopularDestinations() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="destinations" style={{ padding: "96px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease",
        }}>
          <span className="section-tag">Explore India</span>
          <h2 className="section-title">Popular Destinations</h2>
          <div className="section-divider" />
          <p className="section-sub">From snow-capped peaks to sun-kissed beaches — pick your perfect escape.</p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {destinations.map((d, i) => (
            <DestCard key={d.name} d={d} i={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestCard({ d, i, isVisible }: { d: typeof destinations[0]; i: number; isVisible: boolean }) {
  return (
    <div
      style={{
        position: "relative", borderRadius: 24, overflow: "hidden",
        cursor: "pointer", height: 280,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
      className="dest-card"
    >
      <img src={d.image} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }} className="dest-img" />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />

      {/* Tag */}
      <span style={{
        position: "absolute", top: 16, left: 16,
        background: d.tagColor, color: "#fff",
        fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 9999,
      }}>{d.tag}</span>

      {/* Rating */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        display: "flex", alignItems: "center", gap: 4,
        background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.3)",
        color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 9999,
      }}>
        <Star size={11} fill="#FE8100" color="#FE8100" />
        {d.rating}
      </div>

      {/* Info */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 20px" }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 4 }}>{d.name}</h3>
        <p style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
          <MapPin size={11} />{d.tours} tours available
        </p>
      </div>

      <style>{`
        .dest-card:hover .dest-img { transform: scale(1.08); }
        .dest-card { transition: box-shadow 0.3s ease, transform 0.3s ease !important; }
        .dest-card:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.22) !important; transform: translateY(-6px) !important; }
      `}</style>
    </div>
  );
}
