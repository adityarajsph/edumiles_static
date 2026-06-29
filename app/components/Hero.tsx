"use client";

import { ArrowRight, Clock, ChevronDown } from "lucide-react";

const stats = [
  { num: "500+",  label: "Destinations" },
  { num: "50K+",  label: "Happy Travellers" },
  { num: "4.9★",  label: "Average Rating" },
];

interface HeroProps {
  onOpenContact: (subject?: string) => void;
}

export default function Hero({ onOpenContact }: HeroProps) {
  return (
    <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

      {/* BG image */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=90')",
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg, rgba(1,39,252,0.88) 0%, rgba(11,25,107,0.80) 50%, rgba(0,0,0,0.75) 100%)",
      }} />

      {/* Blob left */}
      <div style={{
        position: "absolute", top: 120, left: -60, width: 480, height: 480, zIndex: 1,
        background: "radial-gradient(circle, rgba(254,129,0,0.25) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "blobFloat 7s ease-in-out infinite",
      }} />
      {/* Blob right */}
      <div style={{
        position: "absolute", bottom: 60, right: -60, width: 420, height: 420, zIndex: 1,
        background: "radial-gradient(circle, rgba(254,129,0,0.18) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "blobFloat 9s ease-in-out infinite 2s",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 920, margin: "0 auto", padding: "0 24px",
        textAlign: "center",
      }}>

        {/* Badge */}
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "#fff", fontSize: 13, fontWeight: 600,
            padding: "8px 18px", borderRadius: 9999, marginBottom: 24,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#FE8100",
              animation: "pulse-dot 1.5s ease-in-out infinite",
            }} />
            Premium Travel Experiences Await
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Poppins',sans-serif",
          fontSize: "clamp(40px, 7vw, 76px)",
          fontWeight: 900, color: "#fff",
          lineHeight: 1.1, marginBottom: 24,
          animation: "fadeUp 0.6s ease 0.15s both",
        }}>
          Discover Your
          <span style={{
            display: "block",
            background: "linear-gradient(135deg, #FE8100, #FF9A2E, #FFB347)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Next Adventure
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 18, color: "rgba(255,255,255,0.75)",
          maxWidth: 560, margin: "0 auto 40px",
          lineHeight: 1.75,
          animation: "fadeUp 0.6s ease 0.3s both",
        }}>
          Handpicked destinations, curated experiences and unbeatable prices.
          Your dream journey starts right here.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center",
          marginBottom: 64,
          animation: "fadeUp 0.6s ease 0.45s both",
        }}>
          <button onClick={() => onOpenContact("Explore Packages")} className="btn-primary">
            Explore Packages <ArrowRight size={17} />
          </button>
          <a href="#ticket-booking" className="btn-outline">
            <Clock size={17} /> Ticket Booking — Coming Soon
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,64px)",
          animation: "fadeUp 0.6s ease 0.6s both",
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Poppins',sans-serif",
                fontSize: "clamp(24px,3vw,36px)",
                fontWeight: 900, color: "#FE8100",
              }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4, letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#search" style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        color: "rgba(255,255,255,0.45)", textDecoration: "none",
        animation: "bounce 2s infinite 1.2s",
        zIndex: 2,
      }}>
        <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
        <ChevronDown size={18} />
      </a>

      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}
