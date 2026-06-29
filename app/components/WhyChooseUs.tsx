"use client";

import { ShieldCheck, BadgeDollarSign, Headphones, Lock, LayoutList, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const features = [
  { Icon: ShieldCheck,     title: "Verified Hotels",   desc: "Every property is personally verified by our team for quality, safety and comfort.",   iconBg: "#0127FC", cardBg: "#eff6ff", border: "#dbeafe" },
  { Icon: BadgeDollarSign, title: "Best Prices",       desc: "We guarantee the lowest prices. Find it cheaper elsewhere and we'll match it.",       iconBg: "#FE8100", cardBg: "#fff7ed", border: "#ffedd5" },
  { Icon: Headphones,      title: "24×7 Support",      desc: "Our travel experts are available round the clock via chat, call and email.",           iconBg: "#7c3aed", cardBg: "#f5f3ff", border: "#ede9fe" },
  { Icon: Lock,            title: "Safe Payments",     desc: "100% secure, encrypted payment gateways. Pay via cards, UPI, net banking or EMI.",    iconBg: "#059669", cardBg: "#f0fdf4", border: "#dcfce7" },
  { Icon: LayoutList,      title: "Custom Packages",   desc: "Tell us your dream and our experts will craft a perfect tailor-made itinerary.",       iconBg: "#e11d48", cardBg: "#fff1f2", border: "#fecdd3" },
];

interface WhyChooseUsProps {
  onOpenContact: (subject?: string) => void;
}

export default function WhyChooseUs({ onOpenContact }: WhyChooseUsProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section style={{ padding: "96px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease",
        }}>
          <span className="section-tag">Our Promise</span>
          <h2 className="section-title">Why Choose Us</h2>
          <div className="section-divider" />
          <p className="section-sub">We go beyond booking. We create memories that last a lifetime.</p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              background: f.cardBg, border: `1px solid ${f.border}`,
              borderRadius: 24, padding: "28px 26px",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(36px)",
              transition: `all 0.6s ease ${i * 100}ms`,
              cursor: "default",
            }}
            className="why-card">
              <div style={{
                width: 54, height: 54, borderRadius: 16,
                background: f.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 18, boxShadow: `0 4px 14px ${f.iconBg}55`,
              }}>
                <f.Icon size={24} color="#fff" strokeWidth={2} />
              </div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0127FC", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}

          {/* CTA card */}
          <div style={{
            background: "linear-gradient(135deg,#0127FC,#2545FD)",
            borderRadius: 24, padding: "28px 26px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(36px)",
            transition: `all 0.6s ease ${features.length * 100}ms`,
          }}>
            <div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 38, color: "#fff", lineHeight: 1 }}>50K+</div>
              <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.65, margin: "10px 0 20px" }}>
                Happy travellers trust us every year for their most special trips.
              </p>
            </div>
            <button
              onClick={() => onOpenContact("Start Your Journey")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#fff", color: "#0127FC",
                fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                padding: "12px", borderRadius: 14,
                border: "none", cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FE8100"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0127FC"; }}
            >
              Start Your Journey <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <style>{`.why-card { transition: box-shadow 0.3s ease, transform 0.3s ease !important; } .why-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; transform: translateY(-6px) !important; }`}</style>
    </section>
  );
}
