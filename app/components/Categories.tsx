"use client";

import {
  Mountain, Heart, Users, Flame, Star, Sunset, Landmark,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const cats = [
  { label: "Adventure", Icon: Mountain, count: "42 Packages", grad: "linear-gradient(135deg,#10b981,#059669)" },
  { label: "Honeymoon", Icon: Heart, count: "28 Packages", grad: "linear-gradient(135deg,#f472b6,#e11d48)" },
  { label: "Family", Icon: Users, count: "35 Packages", grad: "linear-gradient(135deg,#fbbf24,#f59e0b)" },
  { label: "Religious", Icon: Flame, count: "22 Packages", grad: "linear-gradient(135deg,#fb923c,#ea580c)" },
  { label: "Luxury", Icon: Star, count: "18 Packages", grad: "linear-gradient(135deg,#a855f7,#7c3aed)" },
  { label: "Weekend Trips", Icon: Sunset, count: "54 Packages", grad: "linear-gradient(135deg,#FE8100,#FF9A2E)" },
  { label: "Heritage", Icon: Landmark, count: "14 Packages", grad: "linear-gradient(135deg,#d97706,#92400e)" },
];

export default function Categories() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section style={{ padding: "96px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease",
        }}>
          <span className="section-tag">Browse By Type</span>
          <h2 className="section-title">Travel Categories</h2>
          <div className="section-divider" />
          <p className="section-sub">Whatever your travel style — we&apos;ve got the perfect package for you.</p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
          {cats.map((c, i) => (
            <div key={c.label} style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(28px)",
              transition: `all 0.5s ease ${i * 80}ms`,
              cursor: "pointer",
            }}>
              <div style={{
                background: c.grad, borderRadius: 24, padding: "28px 16px",
                textAlign: "center", position: "relative", overflow: "hidden",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
              }} className="cat-card">
                {/* Icon */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12,
                }}>
                  <c.Icon size={38} color="rgba(255,255,255,0.92)" strokeWidth={1.6} />
                </div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{c.label}</h3>
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 12 }}>{c.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`.cat-card:hover { transform: scale(1.06); box-shadow: 0 16px 48px rgba(0,0,0,0.18) !important; }`}</style>
    </section>
  );
}
