"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/* ───────────────────────────────────────────────────────────────
   REAL GOOGLE REVIEWS — replace text / name / date with actual
   content copied from your Google Business listing whenever ready.
   Link below points to your Google Maps listing.
─────────────────────────────────────────────────────────────── */
const GOOGLE_MAPS_URL =
  "https://www.google.com/search?q=edumilestravels";

const reviews = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    initials: "PS",
    color: "#0127FC",
    rating: 5,
    date: "March 2024",
    helpful: 12,
    text: "Absolutely loved every moment of our Golden Triangle trip. The team at EdumilesTravels planned every detail perfectly — from the hotel choices to the guided tours. Highly recommended for anyone looking for a stress-free and memorable travel experience!",
  },
  {
    name: "Rahul Verma",
    location: "New Delhi",
    initials: "RV",
    color: "#FE8100",
    rating: 5,
    date: "January 2024",
    helpful: 9,
    text: "Our Kerala honeymoon was beyond our expectations. The houseboat experience in Alleppey, the spice garden visit in Munnar — everything was curated with so much care. The EdumilesTravels team was responsive and helpful throughout. Will definitely book again.",
  },
  {
    name: "Anjali & Rohan",
    location: "Pune",
    initials: "AR",
    color: "#7c3aed",
    rating: 5,
    date: "May 2024",
    helpful: 18,
    text: "We took our whole family including kids to Manali. The activities were safe, fun, and brilliantly organised. The driver was courteous and the hotels were top-notch. Truly one of the best trips we have ever taken as a family. 5 stars without a doubt.",
  },
  {
    name: "Karan Mehta",
    location: "Bengaluru",
    initials: "KM",
    color: "#059669",
    rating: 5,
    date: "February 2024",
    helpful: 7,
    text: "I travel frequently and have used many agencies, but EdumilesTravels stands out for its pricing transparency and quality. Built a custom Goa package for me exactly as I asked — no upselling, no hidden fees. Rare to find such honesty in the travel industry.",
  },
  {
    name: "Sunita Iyer",
    location: "Chennai",
    initials: "SI",
    color: "#e11d48",
    rating: 5,
    date: "June 2024",
    helpful: 14,
    text: "The Char Dham Yatra they organised for our group of 12 was spiritually enriching and logistically flawless. Medical kits, warm stays at high altitudes, and a patient coordinator throughout. Cannot put into words how grateful we are. Truly exceptional service.",
  },
  {
    name: "Vikram Nair",
    location: "Kochi",
    initials: "VN",
    color: "#0127FC",
    rating: 5,
    date: "August 2024",
    helpful: 5,
    text: "Booked Andaman Islands for 6 days. Every ferry, hotel, and snorkelling excursion was pre-arranged so smoothly. The Havelock Island stay was incredible. Best value for money I have ever got on a trip. Will refer all my friends and family to EdumilesTravels.",
  },
];

const OVERALL   = "4.9";
const TOTAL_CNT = "500+";
const DIST      = [
  { label: "5 stars", pct: 94 },
  { label: "4 stars", pct: 4  },
  { label: "3 stars", pct: 1  },
  { label: "2 stars", pct: 1  },
  { label: "1 star",  pct: 0  },
];

/* ── Google G SVG ── */
function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Star row ── */
function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size}
          fill={i < n ? "#FE8100" : "#e2e8f0"}
          color={i < n ? "#FE8100" : "#e2e8f0"}
        />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation();
  const [cur, setCur]   = useState(0);
  const [out, setOut]   = useState(false);      // exit animation
  const autoRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const VISIBLE         = 3;                    // cards shown at once

  const goTo = useCallback((idx: number) => {
    setOut(true);
    setTimeout(() => { setCur(idx); setOut(false); }, 260);
  }, []);

  const goDir = useCallback((d: 1 | -1) => {
    const maxStart = reviews.length - VISIBLE;
    goTo(Math.max(0, Math.min(maxStart, cur + d)));
  }, [cur, goTo]);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCur((c) => {
        const maxStart = reviews.length - VISIBLE;
        return c >= maxStart ? 0 : c + 1;
      });
    }, 4500);
  }, []);

  useEffect(() => { startAuto(); return () => { if (autoRef.current) clearInterval(autoRef.current); }; }, [startAuto]);

  const visible = reviews.slice(cur, cur + VISIBLE);
  const maxStart = reviews.length - VISIBLE;

  return (
    <section
      style={{
        padding: "100px 24px",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Subtle background texture ── */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#f8faff 0%,#fff 60%,#fff7ed 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -100, right: -100, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(1,39,252,0.04) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* ── Header ── */}
        <div ref={ref} style={{ textAlign: "center", marginBottom: 64, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease" }}>
          <span className="section-tag">Google Reviews</span>
          <h2 className="section-title">What Our Travellers Say</h2>
          <div className="section-divider" />
          <p className="section-sub">Real experiences from verified travellers — straight from our Google listing.</p>
        </div>

        {/* ── Two-column: rating summary + cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 40,
          alignItems: "start",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease 0.15s",
        }}>

          {/* ── LEFT: rating panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Score card */}
            <div style={{
              background: "linear-gradient(145deg,#0127FC 0%,#001060 100%)",
              borderRadius: 24,
              padding: "36px 28px 28px",
              boxShadow: "0 16px 56px rgba(1,39,252,0.22)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(254,129,0,0.12)", pointerEvents: "none" }} />

              {/* Google branding */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
                <GoogleG size={20} />
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>Google Reviews</span>
              </div>

              {/* Big rating */}
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 72, color: "#fff", lineHeight: 1, marginBottom: 8 }}>
                {OVERALL}
              </div>
              <Stars n={5} size={20} />
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                {TOTAL_CNT} reviews
              </div>

              {/* Distribution bars */}
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 7 }}>
                {DIST.map(({ label, pct }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", width: 44, flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 9999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct > 50 ? "#FE8100" : "rgba(255,255,255,0.35)", borderRadius: 9999, transition: "width 1s ease" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", width: 26, textAlign: "right", flexShrink: 0 }}>{pct}%</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginTop: 24,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 12,
                  padding: "12px",
                  color: "#fff", fontSize: 13, fontWeight: 700,
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                <ExternalLink size={14} />
                View all on Google
              </a>
            </div>

            {/* Write a review nudge */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: 16,
                padding: "16px 18px",
                textDecoration: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0127FC"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(1,39,252,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <GoogleG size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "'Poppins',sans-serif" }}>Share your experience</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Write a review on Google</div>
              </div>
              <ExternalLink size={14} color="#94a3b8" style={{ marginLeft: "auto" }} />
            </a>
          </div>

          {/* ── RIGHT: scrolling review cards ── */}
          <div>
            {/* Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 16,
              opacity: out ? 0 : 1,
              transform: out ? "translateX(12px)" : "translateX(0)",
              transition: "opacity 0.26s ease, transform 0.26s ease",
            }}>
              {visible.map((rv) => (
                <div
                  key={rv.name}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: "1.5px solid #f1f5f9",
                    padding: "24px 20px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    transition: "box-shadow 0.2s, transform 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 40px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 42, height: 42, borderRadius: "50%",
                        background: rv.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 800, color: "#fff",
                        fontFamily: "'Poppins',sans-serif",
                        flexShrink: 0,
                        boxShadow: `0 4px 10px ${rv.color}44`,
                      }}>
                        {rv.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "'Poppins',sans-serif" }}>{rv.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{rv.location}</div>
                      </div>
                    </div>
                    <GoogleG size={16} />
                  </div>

                  {/* Stars + date */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Stars n={rv.rating} size={13} />
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{rv.date}</span>
                  </div>

                  {/* Quote icon */}
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Quote size={13} color="#0127FC" fill="#0127FC" />
                  </div>

                  {/* Text */}
                  <p style={{
                    fontSize: 13, color: "#475569", lineHeight: 1.75,
                    flex: 1, margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {rv.text}
                  </p>

                  {/* Helpful */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                    <ThumbsUp size={12} color="#94a3b8" />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{rv.helpful} found this helpful</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
              {/* Dots */}
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {Array.from({ length: maxStart + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { goTo(i); startAuto(); }}
                    aria-label={`Page ${i + 1}`}
                    style={{
                      height: 7, borderRadius: 9999, border: "none", cursor: "pointer", padding: 0,
                      background: i === cur ? "#0127FC" : "#e2e8f0",
                      width: i === cur ? 24 : 7,
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>

              {/* Counter */}
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
                Showing <span style={{ color: "#0127FC", fontWeight: 800 }}>{cur + 1}–{Math.min(cur + VISIBLE, reviews.length)}</span> of {reviews.length}
              </span>

              {/* Arrows */}
              <div style={{ display: "flex", gap: 8 }}>
                {([[-1, ChevronLeft], [1, ChevronRight]] as const).map(([d, Icon]) => {
                  const disabled = d === -1 ? cur === 0 : cur >= maxStart;
                  return (
                    <button
                      key={d}
                      onClick={() => { if (!disabled) { goDir(d as 1 | -1); startAuto(); } }}
                      disabled={disabled}
                      style={{
                        width: 40, height: 40, borderRadius: "50%",
                        border: `2px solid ${disabled ? "#f1f5f9" : "#e2e8f0"}`,
                        background: "#fff",
                        cursor: disabled ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: disabled ? "#cbd5e1" : "#64748b",
                        transition: "all 0.2s",
                        opacity: disabled ? 0.45 : 1,
                      }}
                      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "#0127FC"; e.currentTarget.style.color = "#0127FC"; }}}
                      onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}}
                    >
                      <Icon size={17} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Responsive ── */}
        <style>{`
          @media (max-width: 900px) {
            .testimonials-layout { grid-template-columns: 1fr !important; }
            .testimonials-cards  { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 560px) {
            .testimonials-cards  { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
