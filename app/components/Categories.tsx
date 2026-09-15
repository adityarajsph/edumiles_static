"use client";

import Link from "next/link";
import {
  Mountain, Heart, Users, Flame, Star,
  Sunset, Landmark, ArrowRight, Compass,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/* ─── Category data ──────────────────────────────────────────── */
const cats = [
  {
    label: "Adventure",
    sub: "Trek, Camp & Explore",
    Icon: Mountain,
    count: 42,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=85&fit=crop",
    accent: "#10b981",
    light: "#d1fae5",
  },
  {
    label: "Honeymoon",
    sub: "Romantic Escapes",
    Icon: Heart,
    count: 28,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=85&fit=crop",
    accent: "#e11d48",
    light: "#ffe4e6",
  },
  {
    label: "Family",
    sub: "Fun for All Ages",
    Icon: Users,
    count: 35,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=85&fit=crop",
    accent: "#f59e0b",
    light: "#fef3c7",
  },
  {
    label: "Religious",
    sub: "Sacred Journeys",
    Icon: Flame,
    count: 22,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=85&fit=crop",
    accent: "#ea580c",
    light: "#ffedd5",
  },
  {
    label: "Luxury",
    sub: "Premium Experiences",
    Icon: Star,
    count: 18,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=85&fit=crop",
    accent: "#7c3aed",
    light: "#ede9fe",
  },
  {
    label: "Weekend Trips",
    sub: "Quick Getaways",
    Icon: Sunset,
    count: 54,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=85&fit=crop",
    accent: "#FE8100",
    light: "#fff7ed",
  },
  {
    label: "Heritage",
    sub: "History & Culture",
    Icon: Landmark,
    count: 14,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=85&fit=crop",
    accent: "#d97706",
    light: "#fef9c3",
  },
];

export default function Categories() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      style={{
        padding: "100px 24px",
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top-edge accent line */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
        background: "linear-gradient(90deg,transparent,#e2e8f0,transparent)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* ── Header ── */}
        <div
          ref={ref}
          style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between", flexWrap: "wrap",
            gap: 20, marginBottom: 52,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.65s ease",
          }}
        >
          <div>
            <span className="section-tag">Browse By Type</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Travel Categories
            </h2>
          </div>

          <Link
            href="/packages"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#0127FC", fontSize: 14, fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'Poppins',sans-serif",
              transition: "gap 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.gap = "12px")}
            onMouseLeave={e => (e.currentTarget.style.gap = "8px")}
          >
            View all packages <ArrowRight size={16} />
          </Link>
        </div>

        {/* ── First row: 4 tall portrait cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 16,
        }}>
          {cats.slice(0, 4).map((c, i) => (
            <CategoryCard key={c.label} c={c} i={i} isVisible={isVisible} tall />
          ))}
        </div>

        {/* ── Second row: 3 wider landscape cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {cats.slice(4).map((c, i) => (
            <CategoryCard key={c.label} c={c} i={i + 4} isVisible={isVisible} tall={false} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── Individual card ────────────────────────────────────────── */
function CategoryCard({
  c, i, isVisible, tall,
}: {
  c: (typeof cats)[0];
  i: number;
  isVisible: boolean;
  tall: boolean;
}) {
  const height = tall ? 320 : 220;

  return (
    <div
      style={{
        borderRadius: 22,
        overflow: "hidden",
        position: "relative",
        height,
        cursor: "pointer",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.55s ease ${i * 80}ms, transform 0.55s ease ${i * 80}ms`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
      }}
      className="cat-card"
    >
      {/* Background photo */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${c.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.5s ease",
        }}
        className="cat-img"
      />

      {/* Gradient overlay — stronger at bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.72) 100%)",
        transition: "opacity 0.35s ease",
      }} />

      {/* Accent colour overlay on hover (via CSS class) */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: c.accent,
          opacity: 0,
          transition: "opacity 0.35s ease",
          mixBlendMode: "multiply",
        }}
        className="cat-tint"
      />

      {/* Top badge */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 9999,
        padding: "4px 12px",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <c.Icon size={11} color="#fff" />
        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>
          {c.count} Packages
        </span>
      </div>

      {/* Bottom content */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "20px 20px 20px",
      }}>
        {/* Category name */}
        <h3 style={{
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 800,
          fontSize: tall ? 19 : 16,
          color: "#fff",
          margin: "0 0 3px",
          lineHeight: 1.2,
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          {c.label}
        </h3>

        {/* Sub label */}
        <p style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: 12,
          fontWeight: 500,
          margin: "0 0 12px",
        }}>
          {c.sub}
        </p>

        {/* Explore pill — slides up on hover */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: c.accent,
            color: "#fff", fontSize: 12, fontWeight: 700,
            padding: "6px 14px", borderRadius: 9999,
            opacity: 0,
            transform: "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            boxShadow: `0 4px 12px ${c.accent}66`,
          }}
          className="cat-pill"
        >
          <Compass size={12} />
          Explore
        </div>
      </div>

      {/* Hover styles */}
      <style>{`
        .cat-card:hover .cat-img { transform: scale(1.07); }
        .cat-card:hover .cat-tint { opacity: 0.22; }
        .cat-card:hover .cat-pill { opacity: 1 !important; transform: translateY(0) !important; }
        .cat-card:hover { box-shadow: 0 16px 52px rgba(0,0,0,0.2) !important; }
      `}</style>
    </div>
  );
}
