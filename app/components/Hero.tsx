"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight, Plane, MapPin, Star,
  Shield, Award, Send,
} from "lucide-react";

/* ── Hero images — premium cinematic travel shots ── */
const BG_IMAGES = [
  /* Aerial view of Santorini cliffs & Aegean Sea */
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=95&fit=crop",
  /* Golden hour over the Dolomites mountain range */
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=95&fit=crop",
  /* Maldives aerial overwater bungalows & turquoise lagoon */
  "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1920&q=95&fit=crop",
];

const stats = [
  { num: "500+",  label: "Destinations",    icon: MapPin  },
  { num: "50K+",  label: "Happy Travellers", icon: Award   },
  { num: "4.9",   label: "Average Rating",   icon: Star, isStar: true },
];

const features = [
  { icon: Plane,  text: "Flights & Packages" },
  { icon: Shield, text: "Zero Hidden Fees"   },
  { icon: Award,  text: "4.9 Rated Service"  },
];

interface HeroProps {
  onOpenContact: (subject?: string) => void;
  onOpenEnquiry: () => void;
}

export default function Hero({ onOpenContact, onOpenEnquiry }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  /* Auto-advance every 6 s with a cross-fade */
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % BG_IMAGES.length);
        setFading(false);
      }, 700);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Background slideshow ── */}
      {BG_IMAGES.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `url('${src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.06)",
            opacity: i === current ? (fading ? 0 : 1) : 0,
            transition: "opacity 0.9s ease, transform 8s ease",
          }}
        />
      ))}

      {/* ── Multi-layer overlay for depth ── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(1,16,96,0.65) 0%, rgba(1,39,252,0.52) 40%, rgba(0,0,0,0.82) 100%)",
        }}
      />
      {/* Subtle vignette edges */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.52) 100%)",
        }}
      />

      {/* ── Ambient light blobs ── */}
      <div
        style={{
          position: "absolute", top: "8%", left: "-6%",
          width: 560, height: 560, zIndex: 1,
          background: "radial-gradient(circle, rgba(254,129,0,0.18) 0%, transparent 65%)",
          borderRadius: "50%",
          animation: "blobFloat 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: "4%", right: "-5%",
          width: 480, height: 480, zIndex: 1,
          background: "radial-gradient(circle, rgba(1,39,252,0.22) 0%, transparent 65%)",
          borderRadius: "50%",
          animation: "blobFloat 11s ease-in-out infinite 3s",
          pointerEvents: "none",
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative", zIndex: 2,
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
          padding: "120px 28px 100px",
          textAlign: "center",
        }}
      >
        {/* Trust badge */}
        <div style={{ animation: "fadeUp 0.55s ease both" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.09)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 9999,
              padding: "9px 20px",
              marginBottom: 36,
            }}
          >
            <span
              style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#FE8100",
                boxShadow: "0 0 8px #FE8100",
                animation: "pulse-dot 1.6s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.88)", fontSize: 13, fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              Premium Travel Experiences Await
            </span>
            <span
              style={{
                background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
                color: "#fff", fontSize: 10, fontWeight: 800,
                padding: "3px 10px", borderRadius: 9999,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              Since 2019
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(42px, 7.5vw, 82px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.08,
            marginBottom: 28,
            letterSpacing: "-0.01em",
            animation: "fadeUp 0.55s ease 0.12s both",
          }}
        >
          Discover Your
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #FE8100 0%, #FF9A2E 50%, #FFD080 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Next Adventure
          </span>
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: "clamp(15px,1.8vw,18px)",
            color: "rgba(255,255,255,0.68)",
            maxWidth: 540,
            margin: "0 auto 44px",
            lineHeight: 1.8,
            animation: "fadeUp 0.55s ease 0.24s both",
          }}
        >
          Handpicked destinations, curated experiences and unbeatable prices.
          Your dream journey starts right here.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            marginBottom: 56,
            animation: "fadeUp 0.55s ease 0.36s both",
          }}
        >
          <button
            onClick={() => onOpenContact("Explore Packages")}
            className="btn-primary"
            style={{ fontSize: 15, padding: "15px 34px" }}
          >
            Explore Packages <ArrowRight size={17} />
          </button>
          <button
            onClick={onOpenEnquiry}
            className="btn-outline"
            style={{ fontSize: 15, padding: "15px 34px", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Send size={16} /> Send your Enquiry
          </button>
        </div>

        {/* Feature pills row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
            marginBottom: 60,
            animation: "fadeUp 0.55s ease 0.46s both",
          }}
        >
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.13)",
                borderRadius: 9999,
                padding: "7px 16px",
                color: "rgba(255,255,255,0.75)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <Icon size={14} color="#FE8100" />
              {text}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 0,
            animation: "fadeUp 0.55s ease 0.56s both",
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "20px 12px",
                borderRight: i < stats.length - 1
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 40px)",
                  fontWeight: 900,
                  color: "#FE8100",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                {s.num}
                {s.isStar && (
                  <Star size={18} fill="#FE8100" color="#FE8100" style={{ marginBottom: 2 }} />
                )}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 6,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Slide dots ── */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 3,
        }}
      >
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 700); }}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 9999,
              border: "none",
              background: i === current ? "#FE8100" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.35s ease, background 0.35s ease",
              boxShadow: i === current ? "0 0 8px rgba(254,129,0,0.6)" : "none",
            }}
          />
        ))}
      </div>
      <a
        href="#search"
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "rgba(255,255,255,0.35)",
          textDecoration: "none",
          animation: "bounce 2.2s ease-in-out infinite 1.5s",
          zIndex: 2,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 28, height: 44,
            borderRadius: 14,
            border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "6px 0",
          }}
        >
          <div
            style={{
              width: 3, height: 8,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.5)",
              animation: "scrollDot 2s ease-in-out infinite",
            }}
          />
        </div>
      </a>

      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes scrollDot {
          0%,100% { transform: translateY(0); opacity: 1; }
          80%     { transform: translateY(14px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
