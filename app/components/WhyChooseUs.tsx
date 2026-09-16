"use client";

import {
  ShieldCheck, BadgeDollarSign, Headphones,
  Lock, LayoutList, ArrowRight, CheckCircle,
  Users, Star, Award,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const features = [
  {
    Icon: ShieldCheck,
    title: "Verified Hotels",
    desc: "Every property is personally inspected by our team for quality, safety and comfort before we recommend it.",
    accent: "#0127FC", light: "#eff6ff", border: "#c7d2fe", num: "01",
  },
  {
    Icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    desc: "We guarantee the lowest prices. Find it cheaper elsewhere and we will match it — no questions asked.",
    accent: "#FE8100", light: "#fff7ed", border: "#fed7aa", num: "02",
  },
  {
    Icon: Headphones,
    title: "24 × 7 Support",
    desc: "Our dedicated travel experts are available round the clock via chat, call and email — before and during your trip.",
    accent: "#7c3aed", light: "#f5f3ff", border: "#ddd6fe", num: "03",
  },
  {
    Icon: Lock,
    title: "100% Safe Payments",
    desc: "Industry-standard encrypted gateways. Pay securely via cards, UPI, net banking or easy EMI options.",
    accent: "#059669", light: "#f0fdf4", border: "#bbf7d0", num: "04",
  },
  {
    Icon: LayoutList,
    title: "Custom Itineraries",
    desc: "Tell us your dream destination and budget — our experts will craft a bespoke, tailor-made itinerary just for you.",
    accent: "#e11d48", light: "#fff1f2", border: "#fecdd3", num: "05",
  },
];

const stats = [
  { Icon: Users, num: "50K+", label: "Happy Travellers" },
  { Icon: Star,  num: "4.9",  label: "Google Rating", isStar: true },
  { Icon: Award, num: "7+",   label: "Years Experience" },
];

const highlights = [
  "Personalised itinerary every time",
  "No hidden fees — ever",
  "Rated 4.9 on Google",
];

const bottomBand = [
  { label: "500+",   sub: "Destinations"       },
  { label: "100%",   sub: "Secure Booking"     },
  { label: "15 Min", sub: "Response Time"      },
  { label: "Zero",   sub: "Hidden Charges"     },
  { label: "Free",   sub: "Itinerary Planning" },
];

interface WhyChooseUsProps {
  onOpenContact: (subject?: string) => void;
}

export default function WhyChooseUs({ onOpenContact }: WhyChooseUsProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="wcu-section">
      <div className="wcu-blob wcu-blob--tl" aria-hidden />
      <div className="wcu-blob wcu-blob--br" aria-hidden />

      <div className="wcu-container">

        {/* ── Header ── */}
        <div
          ref={ref}
          className={`wcu-header ${isVisible ? "wcu-in" : ""}`}
        >
          <span className="section-tag">Our Promise</span>
          <h2 className="section-title">Why Choose Us</h2>
          <div className="section-divider" />
          <p className="section-sub">We go beyond booking. We craft memories that last a lifetime.</p>
        </div>

        {/* ── Main two-column layout ── */}
        <div className={`wcu-body ${isVisible ? "wcu-in" : ""}`}>

          {/* Left — feature list */}
          <div className="wcu-features">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="wcu-row"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                  transition: `opacity 0.55s ease ${i * 90}ms, transform 0.55s ease ${i * 90}ms`,
                }}
              >
                <div
                  className="wcu-row__icon"
                  style={{ background: f.light, border: `1.5px solid ${f.border}` }}
                >
                  <f.Icon size={22} color={f.accent} strokeWidth={2.2} />
                </div>
                <div className="wcu-row__text">
                  <div className="wcu-row__title">{f.title}</div>
                  <p className="wcu-row__desc">{f.desc}</p>
                </div>
                <div className="wcu-row__num" style={{ color: f.accent }}>{f.num}</div>
              </div>
            ))}
          </div>

          {/* Right — visual cards */}
          <div className="wcu-right">

            {/* Hero card */}
            <div className="wcu-hero-card">
              <div className="wcu-hero-card__ring" aria-hidden />
              <div className="wcu-hero-card__blob" aria-hidden />

              <div className="wcu-hero-card__num">50K+</div>
              <p className="wcu-hero-card__sub">
                Happy travellers have trusted us for their most special journeys — and they keep coming back.
              </p>

              <div className="wcu-hero-card__checks">
                {highlights.map((pt) => (
                  <div key={pt} className="wcu-hero-card__check">
                    <CheckCircle size={16} color="#FE8100" fill="rgba(254,129,0,0.15)" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenContact("Start Your Journey")}
                className="btn-primary wcu-hero-card__cta"
              >
                Start Your Journey <ArrowRight size={16} />
              </button>
            </div>

            {/* Stats row */}
            <div className="wcu-stats">
              {stats.map(({ Icon, num, label, isStar }) => (
                <div key={label} className="wcu-stat">
                  <div className="wcu-stat__val">
                    {num}
                    {isStar && <Star size={14} fill="#FE8100" color="#FE8100" />}
                  </div>
                  <div className="wcu-stat__lbl">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom band ── */}
        <div className={`wcu-band ${isVisible ? "wcu-in wcu-in--delayed" : ""}`}>
          {bottomBand.map((item, i) => (
            <div key={item.label} className="wcu-band__cell" style={{ borderRight: i < bottomBand.length - 1 ? "1.5px solid #e2e8f0" : "none" }}>
              <div className="wcu-band__val">{item.label}</div>
              <div className="wcu-band__sub">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* ── section ── */
        .wcu-section {
          padding: 100px 24px;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .wcu-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .wcu-blob--tl {
          top: -80px; left: -80px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(1,39,252,0.04) 0%, transparent 70%);
        }
        .wcu-blob--br {
          bottom: -60px; right: -60px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(254,129,0,0.05) 0%, transparent 70%);
        }

        /* ── container ── */
        .wcu-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        /* ── header ── */
        .wcu-header {
          text-align: center;
          margin-bottom: 64px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .wcu-header.wcu-in { opacity: 1; transform: translateY(0); }

        /* ── body grid ── */
        .wcu-body {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 48px;
          align-items: start;
          margin-bottom: 64px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .wcu-body.wcu-in { opacity: 1; transform: translateY(0); }

        /* ── feature rows ── */
        .wcu-features { display: flex; flex-direction: column; gap: 4px; }
        .wcu-row {
          display: flex;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 16px;
          border: 1.5px solid transparent;
          background: #fff;
          cursor: default;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .wcu-row:hover {
          background: #f8faff;
          border-color: #c7d2fe;
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(1,39,252,0.08);
        }
        .wcu-row__icon {
          width: 50px; height: 50px;
          border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wcu-row__text { flex: 1; min-width: 0; }
        .wcu-row__title {
          font-family: 'Poppins', sans-serif;
          font-weight: 700; font-size: 15px;
          color: #0f172a; margin-bottom: 4px;
        }
        .wcu-row__desc { color: #64748b; font-size: 13.5px; line-height: 1.65; margin: 0; }
        .wcu-row__num {
          font-family: 'Poppins', sans-serif;
          font-weight: 900; font-size: 11px;
          opacity: 0.35; align-self: flex-start;
          flex-shrink: 0; letter-spacing: 0.04em; margin-top: 2px;
        }

        /* ── right panel ── */
        .wcu-right { display: flex; flex-direction: column; gap: 16px; }

        /* hero card */
        .wcu-hero-card {
          background: linear-gradient(135deg, #0127FC 0%, #001060 100%);
          border-radius: 26px;
          padding: 36px 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 64px rgba(1,39,252,0.25);
        }
        .wcu-hero-card__ring {
          position: absolute; top: -48px; right: -48px;
          width: 200px; height: 200px; border-radius: 50%;
          border: 40px solid rgba(254,129,0,0.12);
          pointer-events: none;
        }
        .wcu-hero-card__blob {
          position: absolute; bottom: -32px; left: -32px;
          width: 140px; height: 140px; border-radius: 50%;
          background: rgba(255,255,255,0.04); pointer-events: none;
        }
        .wcu-hero-card__num {
          font-family: 'Poppins', sans-serif;
          font-weight: 900; font-size: 52px;
          color: #fff; line-height: 1; margin-bottom: 8px;
          position: relative;
        }
        .wcu-hero-card__sub {
          color: rgba(255,255,255,0.6);
          font-size: 14px; line-height: 1.7;
          margin-bottom: 24px; max-width: 300px;
          position: relative;
        }
        .wcu-hero-card__checks {
          display: flex; flex-direction: column; gap: 10px;
          position: relative; margin-bottom: 28px;
        }
        .wcu-hero-card__check {
          display: flex; align-items: center; gap: 10px;
        }
        .wcu-hero-card__check span {
          color: rgba(255,255,255,0.82); font-size: 14px; font-weight: 500;
        }
        .wcu-hero-card__cta {
          font-size: 14px !important;
          padding: 13px 26px !important;
          position: relative;
        }

        /* stats row */
        .wcu-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1.5px solid #f1f5f9;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .wcu-stat {
          padding: 18px 12px;
          text-align: center;
          border-right: 1.5px solid #f1f5f9;
        }
        .wcu-stat:last-child { border-right: none; }
        .wcu-stat__val {
          font-family: 'Poppins', sans-serif;
          font-weight: 900; font-size: 22px;
          color: #0127FC;
          display: flex; align-items: center;
          justify-content: center; gap: 3px;
          line-height: 1;
        }
        .wcu-stat__lbl { font-size: 11px; color: #94a3b8; margin-top: 5px; font-weight: 600; }

        /* ── bottom band ── */
        .wcu-band {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          background: linear-gradient(135deg, #f8faff, #fff7ed);
          border-radius: 22px;
          border: 1.5px solid #e2e8f0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s;
        }
        .wcu-band.wcu-in { opacity: 1; transform: translateY(0); }
        .wcu-band__cell { padding: 22px 16px; text-align: center; }
        .wcu-band__val {
          font-family: 'Poppins', sans-serif;
          font-weight: 900; font-size: 21px;
          background: linear-gradient(135deg, #0127FC, #FE8100);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1; margin-bottom: 5px;
        }
        .wcu-band__sub { font-size: 12px; color: #64748b; font-weight: 600; }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .wcu-body {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .wcu-band {
            grid-template-columns: repeat(3, 1fr);
          }
          .wcu-band__cell:nth-child(3) { border-right: none !important; }
          .wcu-band__cell:nth-child(4),
          .wcu-band__cell:nth-child(5) {
            border-top: 1.5px solid #e2e8f0;
          }
          .wcu-band__cell:nth-child(5) { border-right: none !important; }
        }
        @media (max-width: 600px) {
          .wcu-section { padding: 72px 16px; }
          .wcu-header { margin-bottom: 40px; }
          .wcu-body { margin-bottom: 40px; }
          .wcu-row { padding: 14px 16px; gap: 12px; }
          .wcu-row__icon { width: 44px; height: 44px; border-radius: 12px; }
          .wcu-row__num { display: none; }
          .wcu-hero-card { padding: 28px 22px; }
          .wcu-hero-card__num { font-size: 42px; }
          .wcu-stats { grid-template-columns: repeat(3, 1fr); }
          .wcu-band { grid-template-columns: repeat(2, 1fr); }
          .wcu-band__cell:nth-child(2) { border-right: none !important; }
          .wcu-band__cell:nth-child(3) { border-right: 1.5px solid #e2e8f0 !important; border-top: 1.5px solid #e2e8f0; }
          .wcu-band__cell:nth-child(4) { border-top: 1.5px solid #e2e8f0; }
          .wcu-band__cell:nth-child(5) { border-top: 1.5px solid #e2e8f0; border-right: none !important; }
        }
      `}</style>
    </section>
  );
}
