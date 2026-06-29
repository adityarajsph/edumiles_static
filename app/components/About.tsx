"use client";

import { Award, MapPin, Users, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const stats = [
  { Icon: Users,      num: "2000+", label: "Happy Travellers", bg: "#fff7ed", iconBg: "#FE8100" },
  { Icon: MapPin,     num: "500+",    label: "Destinations",     bg: "#eff6ff", iconBg: "#0127FC" },
  { Icon: Award,      num: "7+",     label: "Years Experience", bg: "#f5f3ff", iconBg: "#7c3aed" },
  { Icon: TrendingUp, num: "4.9★",    label: "Customer Rating",  bg: "#f0fdf4", iconBg: "#059669" },
];

export default function About() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" style={{ padding: "96px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 64, alignItems: "center" }}>

          {/* Image */}
          <div ref={ref} style={{
            position: "relative",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-40px)",
            transition: "all 0.8s ease",
          }}>
            <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}>
              <img
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=85"
                alt="About EdumilesTravels"
                style={{ width: "100%", height: 460, objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(1,39,252,0.3), transparent)", borderRadius: 28 }} />
            </div>

            {/* Award badge */}
            <div style={{
              position: "absolute", bottom: -20, right: -16,
              background: "#fff", borderRadius: 20, padding: "16px 20px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.14)", border: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FE8100,#FF9A2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Awarded</div>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 13, color: "#0127FC" }}>Best Travel Agency 2024</div>
              </div>
            </div>

            {/* Experience tag */}
            <div style={{
              position: "absolute", top: -14, left: -14,
              background: "linear-gradient(135deg,#0127FC,#2545FD)",
              color: "#fff", borderRadius: 20, padding: "16px 18px",
              textAlign: "center", boxShadow: "0 8px 32px rgba(1,39,252,0.35)",
            }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>7+</div>
              <div style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.3, marginTop: 4 }}>Years of<br />Excellence</div>
            </div>
          </div>

          {/* Text */}
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(40px)",
            transition: "all 0.8s ease 0.2s",
          }}>
            <span className="section-tag">Our Story</span>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.5vw,42px)", color: "#0127FC", lineHeight: 1.15, marginBottom: 12 }}>
              Making Travel Dreams<br />
              <span style={{ color: "#FE8100" }}>Come True Since 2019</span>
            </h2>
            <div style={{ width: 56, height: 5, background: "linear-gradient(90deg,#FE8100,#FF9A2E)", borderRadius: 3, marginBottom: 24 }} />

            <p style={{ color: "#475569", lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
              EdumilesTravels was born from a simple idea — everyone deserves a perfect holiday, no matter their budget.
              Founded in 2019, we&apos;ve grown into one of India&apos;s most trusted travel companies.
            </p>
            <p style={{ color: "#475569", lineHeight: 1.8, marginBottom: 32, fontSize: 15 }}>
              From mountain treks to beach retreats, religious yatras to luxury escapes — we craft experiences that go beyond the ordinary.
              Our expert team personally verifies every hotel, route and partner for a seamless journey.
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {stats.map(s => (
                <div key={s.label} style={{
                  background: s.bg, borderRadius: 18, padding: "16px",
                  display: "flex", alignItems: "center", gap: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <s.Icon size={18} color={s.iconBg} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 18, color: s.iconBg, lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
