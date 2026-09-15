"use client";

import {
  ShieldCheck, BadgeDollarSign, Headphones,
  Lock, LayoutList, ArrowRight, CheckCircle,
  Users, Star, Award,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/* ─── Feature data ───────────────────────────────────────────── */
const features = [
  {
    Icon: ShieldCheck,
    title: "Verified Hotels",
    desc: "Every property is personally inspected by our team for quality, safety and comfort before we recommend it.",
    accent: "#0127FC",
    light: "#eff6ff",
    border: "#c7d2fe",
    num: "01",
  },
  {
    Icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    desc: "We guarantee the lowest prices. Find it cheaper elsewhere and we will match it — no questions asked.",
    accent: "#FE8100",
    light: "#fff7ed",
    border: "#fed7aa",
    num: "02",
  },
  {
    Icon: Headphones,
    title: "24 × 7 Support",
    desc: "Our dedicated travel experts are available round the clock via chat, call and email — before and during your trip.",
    accent: "#7c3aed",
    light: "#f5f3ff",
    border: "#ddd6fe",
    num: "03",
  },
  {
    Icon: Lock,
    title: "100% Safe Payments",
    desc: "Industry-standard encrypted gateways. Pay securely via cards, UPI, net banking or easy EMI options.",
    accent: "#059669",
    light: "#f0fdf4",
    border: "#bbf7d0",
    num: "04",
  },
  {
    Icon: LayoutList,
    title: "Custom Itineraries",
    desc: "Tell us your dream destination and budget — our experts will craft a bespoke, tailor-made itinerary just for you.",
    accent: "#e11d48",
    light: "#fff1f2",
    border: "#fecdd3",
    num: "05",
  },
];

/* ─── Trust stats ────────────────────────────────────────────── */
const stats = [
  { Icon: Users, num: "50K+",  label: "Happy Travellers" },
  { Icon: Star,  num: "4.9",   label: "Google Rating",   isStar: true },
  { Icon: Award, num: "7+",    label: "Years Experience" },
];

interface WhyChooseUsProps {
  onOpenContact: (subject?: string) => void;
}

export default function WhyChooseUs({ onOpenContact }: WhyChooseUsProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      style={{
        padding: "100px 24px",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -80, left: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(1,39,252,0.04) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* ── Section header ── */}
        <div
          ref={ref}
          style={{
            textAlign: "center", marginBottom: 72,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.7s ease",
          }}
        >
          <span className="section-tag">Our Promise</span>
          <h2 className="section-title">Why Choose Us</h2>
          <div className="section-divider" />
          <p className="section-sub">
            We go beyond booking. We craft memories that last a lifetime.
          </p>
        </div>

        {/* ── Main two-column layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 56,
            alignItems: "center",
            marginBottom: 72,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease 0.1s",
          }}
        >
          {/* Left — feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                style={{
                  display: "flex",
                  gap: 18,
                  padding: "20px 22px",
                  borderRadius: 18,
                  border: "1.5px solid transparent",
                  background: "#fff",
                  cursor: "default",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                  transition: `all 0.55s ease ${i * 90}ms`,
                }}
                className="wcu-row"
              >
                {/* Icon bubble */}
                <div
                  style={{
                    width: 52, height: 52,
                    borderRadius: 16,
                    background: f.light,
                    border: `1.5px solid ${f.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <f.Icon size={22} color={f.accent} strokeWidth={2.2} />
                </div>

                {/* Text */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontWeight: 700, fontSize: 15,
                      color: "#0f172a", marginBottom: 4,
                    }}
                  >
                    {f.title}
                  </div>
                  <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>

                {/* Step number — right side */}
                <div
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 900, fontSize: 11,
                    color: f.accent,
                    opacity: 0.35,
                    alignSelf: "flex-start",
                    flexShrink: 0,
                    letterSpacing: "0.04em",
                    marginTop: 2,
                  }}
                >
                  {f.num}
                </div>
              </div>
            ))}
          </div>

          {/* Right — visual card stack */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Hero highlight card */}
            <div
              style={{
                background: "linear-gradient(135deg,#0127FC 0%,#001060 100%)",
                borderRadius: 28,
                padding: "40px 36px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 64px rgba(1,39,252,0.25)",
              }}
            >
              {/* Decorative ring */}
              <div style={{ position: "absolute", top: -48, right: -48, width: 200, height: 200, borderRadius: "50%", border: "40px solid rgba(254,129,0,0.12)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -32, left: -32, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 900, fontSize: 56,
                  color: "#fff", lineHeight: 1,
                  marginBottom: 8,
                  position: "relative",
                }}
              >
                50K+
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 14, lineHeight: 1.7,
                  marginBottom: 28, maxWidth: 300, position: "relative",
                }}
              >
                Happy travellers have trusted us for their most special journeys — and they keep coming back.
              </div>

              {/* Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                {[
                  "Personalised itinerary every time",
                  "No hidden fees — ever",
                  "Rated 4.9 on Google",
                ].map((pt) => (
                  <div key={pt} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle size={16} color="#FE8100" fill="rgba(254,129,0,0.15)" />
                    <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, fontWeight: 500 }}>{pt}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => onOpenContact("Start Your Journey")}
                className="btn-primary"
                style={{
                  marginTop: 28,
                  display: "inline-flex",
                  fontSize: 14,
                  padding: "13px 28px",
                  position: "relative",
                }}
              >
                Start Your Journey <ArrowRight size={16} />
              </button>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {stats.map(({ Icon, num, label, isStar }) => (
                <div
                  key={label}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #f1f5f9",
                    borderRadius: 18,
                    padding: "18px 14px",
                    textAlign: "center",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontWeight: 900, fontSize: 22,
                      color: "#0127FC",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 2,
                      lineHeight: 1,
                    }}
                  >
                    {num}
                    {isStar && <Star size={14} fill="#FE8100" color="#FE8100" />}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, fontWeight: 600, letterSpacing: "0.03em" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom feature band ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 0,
            background: "linear-gradient(135deg,#f8faff,#fff7ed)",
            borderRadius: 24,
            border: "1.5px solid #e2e8f0",
            overflow: "hidden",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.4s",
          }}
        >
          {[
            { label: "500+",   sub: "Destinations"       },
            { label: "100%",   sub: "Secure Booking"     },
            { label: "15 Min", sub: "Response Time"      },
            { label: "Zero",   sub: "Hidden Charges"     },
            { label: "Free",   sub: "Itinerary Planning" },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              style={{
                padding: "24px 20px",
                textAlign: "center",
                borderRight: i < arr.length - 1 ? "1.5px solid #e2e8f0" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 900, fontSize: 22,
                  background: "linear-gradient(135deg,#0127FC,#FE8100)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1, marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row hover styles ── */}
      <style>{`
        .wcu-row:hover {
          background: #f8faff !important;
          border-color: #c7d2fe !important;
          transform: translateX(4px) !important;
          box-shadow: 0 4px 20px rgba(1,39,252,0.08) !important;
        }
      `}</style>
    </section>
  );
}
