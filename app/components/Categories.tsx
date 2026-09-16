"use client";

import Link from "next/link";
import {
  Mountain, Heart, Users, Flame, Star,
  Sunset, Landmark, ArrowRight, Compass,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const cats = [
  {
    label: "Adventure",
    sub: "Trek, Camp & Explore",
    Icon: Mountain,
    count: 42,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=85&fit=crop",
    accent: "#10b981",
  },
  {
    label: "Honeymoon",
    sub: "Romantic Escapes",
    Icon: Heart,
    count: 28,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=85&fit=crop",
    accent: "#e11d48",
  },
  {
    label: "Family",
    sub: "Fun for All Ages",
    Icon: Users,
    count: 35,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=85&fit=crop",
    accent: "#f59e0b",
  },
  {
    label: "Religious",
    sub: "Sacred Journeys",
    Icon: Flame,
    count: 22,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=85&fit=crop",
    accent: "#ea580c",
  },
  {
    label: "Luxury",
    sub: "Premium Experiences",
    Icon: Star,
    count: 18,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=85&fit=crop",
    accent: "#7c3aed",
  },
  {
    label: "Weekend Trips",
    sub: "Quick Getaways",
    Icon: Sunset,
    count: 54,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=85&fit=crop",
    accent: "#FE8100",
  },
  {
    label: "Heritage",
    sub: "History & Culture",
    Icon: Landmark,
    count: 14,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=85&fit=crop",
    accent: "#d97706",
  },
];

export default function Categories() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="cat-section">
      <div className="cat-top-line" aria-hidden />

      <div className="cat-container">

        {/* ── Header ── */}
        <div
          ref={ref}
          className={`cat-header ${isVisible ? "cat-in" : ""}`}
        >
          <div className="cat-header__left">
            <span className="section-tag">Browse By Type</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Travel Categories</h2>
          </div>
          <Link
            href="/packages"
            className="cat-all-link"
          >
            View all packages <ArrowRight size={16} />
          </Link>
        </div>

        {/* ── Row 1: 4 tall portrait cards ── */}
        <div className="cat-row cat-row--tall">
          {cats.slice(0, 4).map((c, i) => (
            <CategoryCard key={c.label} c={c} i={i} isVisible={isVisible} tall />
          ))}
        </div>

        {/* ── Row 2: 3 wider landscape cards ── */}
        <div className="cat-row cat-row--wide">
          {cats.slice(4).map((c, i) => (
            <CategoryCard key={c.label} c={c} i={i + 4} isVisible={isVisible} tall={false} />
          ))}
        </div>

      </div>

      <style>{`
        .cat-section {
          padding: 100px 24px;
          background: #f8fafc;
          position: relative;
          overflow: hidden;
        }
        .cat-top-line {
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          pointer-events: none;
        }
        .cat-container { max-width: 1200px; margin: 0 auto; }

        /* header */
        .cat-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 48px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .cat-header.cat-in { opacity: 1; transform: translateY(0); }
        .cat-all-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: #0127FC; font-size: 14px; font-weight: 700;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          transition: gap 0.2s ease;
          white-space: nowrap;
        }
        .cat-all-link:hover { gap: 12px; }

        /* grid rows */
        .cat-row { display: grid; gap: 14px; margin-bottom: 14px; }
        .cat-row--tall  { grid-template-columns: repeat(4, 1fr); }
        .cat-row--wide  { grid-template-columns: repeat(3, 1fr); margin-bottom: 0; }

        /* ── individual card ── */
        .cat-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          transition: box-shadow 0.35s ease;
        }
        .cat-card:hover { box-shadow: 0 16px 52px rgba(0,0,0,0.2); }

        .cat-card__bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: transform 0.5s ease;
        }
        .cat-card:hover .cat-card__bg { transform: scale(1.07); }

        .cat-card__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.72) 100%);
        }
        .cat-card__tint {
          position: absolute; inset: 0;
          opacity: 0;
          mix-blend-mode: multiply;
          transition: opacity 0.35s ease;
        }
        .cat-card:hover .cat-card__tint { opacity: 0.22; }

        .cat-card__badge {
          position: absolute; top: 12px; left: 12px;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 9999px;
          padding: 4px 11px;
          display: flex; align-items: center; gap: 5px;
        }
        .cat-card__badge span {
          color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
        }

        .cat-card__body {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 18px;
        }
        .cat-card__title {
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          color: #fff;
          margin: 0 0 3px;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .cat-card__sub {
          color: rgba(255,255,255,0.7);
          font-size: 12px; font-weight: 500;
          margin: 0 0 10px;
        }
        .cat-card__pill {
          display: inline-flex; align-items: center; gap: 5px;
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 5px 12px; border-radius: 9999px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .cat-card:hover .cat-card__pill {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .cat-row--tall { grid-template-columns: repeat(2, 1fr); }
          .cat-row--wide { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .cat-section { padding: 72px 16px; }
          .cat-header { margin-bottom: 32px; }
          .cat-row--tall { grid-template-columns: repeat(2, 1fr); }
          .cat-row--wide { grid-template-columns: repeat(1, 1fr); }
          .cat-row { gap: 12px; margin-bottom: 12px; }
        }
        @media (max-width: 400px) {
          .cat-row--tall { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

function CategoryCard({
  c, i, isVisible, tall,
}: {
  c: (typeof cats)[0];
  i: number;
  isVisible: boolean;
  tall: boolean;
}) {
  const height = tall ? 300 : 210;

  return (
    <div
      className="cat-card"
      style={{
        height,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.55s ease ${i * 75}ms, transform 0.55s ease ${i * 75}ms`,
      }}
    >
      <div
        className="cat-card__bg"
        style={{ backgroundImage: `url('${c.image}')` }}
      />
      <div className="cat-card__overlay" />
      <div className="cat-card__tint" style={{ background: c.accent }} />

      <div className="cat-card__badge">
        <c.Icon size={11} color="#fff" />
        <span>{c.count} Packages</span>
      </div>

      <div className="cat-card__body">
        <h3
          className="cat-card__title"
          style={{ fontSize: tall ? 18 : 15 }}
        >
          {c.label}
        </h3>
        <p className="cat-card__sub">{c.sub}</p>
        <div
          className="cat-card__pill"
          style={{ background: c.accent, boxShadow: `0 4px 12px ${c.accent}66` }}
        >
          <Compass size={12} /> Explore
        </div>
      </div>
    </div>
  );
}
