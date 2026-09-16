"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const GOOGLE_MAPS_URL = "https://www.google.com/search?q=edumilestravels";

const reviews = [
  {
    name: "Priya Sharma", location: "Mumbai", initials: "PS", color: "#0127FC", rating: 5, date: "March 2024", helpful: 12,
    text: "Absolutely loved every moment of our Golden Triangle trip. The team at EdumilesTravels planned every detail perfectly — from the hotel choices to the guided tours. Highly recommended for anyone looking for a stress-free and memorable travel experience!",
  },
  {
    name: "Rahul Verma", location: "New Delhi", initials: "RV", color: "#FE8100", rating: 5, date: "January 2024", helpful: 9,
    text: "Our Kerala honeymoon was beyond our expectations. The houseboat experience in Alleppey, the spice garden visit in Munnar — everything was curated with so much care. The EdumilesTravels team was responsive and helpful throughout. Will definitely book again.",
  },
  {
    name: "Anjali & Rohan", location: "Pune", initials: "AR", color: "#7c3aed", rating: 5, date: "May 2024", helpful: 18,
    text: "We took our whole family including kids to Manali. The activities were safe, fun, and brilliantly organised. The driver was courteous and the hotels were top-notch. Truly one of the best trips we have ever taken as a family. 5 stars without a doubt.",
  },
  {
    name: "Karan Mehta", location: "Bengaluru", initials: "KM", color: "#059669", rating: 5, date: "February 2024", helpful: 7,
    text: "I travel frequently and have used many agencies, but EdumilesTravels stands out for its pricing transparency and quality. Built a custom Goa package for me exactly as I asked — no upselling, no hidden fees. Rare to find such honesty in the travel industry.",
  },
  {
    name: "Sunita Iyer", location: "Chennai", initials: "SI", color: "#e11d48", rating: 5, date: "June 2024", helpful: 14,
    text: "The Char Dham Yatra they organised for our group of 12 was spiritually enriching and logistically flawless. Medical kits, warm stays at high altitudes, and a patient coordinator throughout. Cannot put into words how grateful we are. Truly exceptional service.",
  },
  {
    name: "Vikram Nair", location: "Kochi", initials: "VN", color: "#0127FC", rating: 5, date: "August 2024", helpful: 5,
    text: "Booked Andaman Islands for 6 days. Every ferry, hotel, and snorkelling excursion was pre-arranged so smoothly. The Havelock Island stay was incredible. Best value for money I have ever got on a trip. Will refer all my friends and family to EdumilesTravels.",
  },
];

const OVERALL   = "4.9";
const TOTAL_CNT = "500+";
const DIST = [
  { label: "5 stars", pct: 94 },
  { label: "4 stars", pct: 4  },
  { label: "3 stars", pct: 1  },
  { label: "2 stars", pct: 1  },
  { label: "1 star",  pct: 0  },
];

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < n ? "#FE8100" : "#e2e8f0"} color={i < n ? "#FE8100" : "#e2e8f0"} />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation();
  const [cur, setCur]   = useState(0);
  const [out, setOut]   = useState(false);
  const autoRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  /* Adjust visible cards based on screen width */
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640)       setVisibleCount(1);
      else if (window.innerWidth < 960)  setVisibleCount(2);
      else                               setVisibleCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxStart = Math.max(0, reviews.length - visibleCount);

  const goTo = useCallback((idx: number) => {
    setOut(true);
    setTimeout(() => { setCur(idx); setOut(false); }, 260);
  }, []);

  const goDir = useCallback((d: 1 | -1) => {
    goTo(Math.max(0, Math.min(maxStart, cur + d)));
  }, [cur, goTo, maxStart]);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCur((c) => (c >= maxStart ? 0 : c + 1));
    }, 4500);
  }, [maxStart]);

  useEffect(() => {
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto]);

  /* clamp cur when visibleCount changes */
  useEffect(() => {
    if (cur > maxStart) setCur(maxStart);
  }, [maxStart, cur]);

  const visible = reviews.slice(cur, cur + visibleCount);

  return (
    <section className="tm-section">
      <div className="tm-bg" aria-hidden />
      <div className="tm-orb tm-orb--tr" aria-hidden />
      <div className="tm-orb tm-orb--bl" aria-hidden />

      <div className="tm-container">

        {/* ── Header ── */}
        <div ref={ref} className={`tm-header ${isVisible ? "tm-in" : ""}`}>
          <span className="section-tag">Google Reviews</span>
          <h2 className="section-title">What Our Travellers Say</h2>
          <div className="section-divider" />
          <p className="section-sub">Real experiences from verified travellers — straight from our Google listing.</p>
        </div>

        {/* ── Two-column layout ── */}
        <div className={`tm-layout ${isVisible ? "tm-in tm-in--delay" : ""}`}>

          {/* LEFT: rating panel */}
          <div className="tm-rating-col">

            {/* Score card */}
            <div className="tm-score-card">
              <div className="tm-score-card__ring" aria-hidden />
              <div className="tm-score-card__google">
                <GoogleG size={20} />
                <span>Google Reviews</span>
              </div>
              <div className="tm-score-card__num">{OVERALL}</div>
              <Stars n={5} size={20} />
              <div className="tm-score-card__count">{TOTAL_CNT} reviews</div>

              <div className="tm-dist">
                {DIST.map(({ label, pct }) => (
                  <div key={label} className="tm-dist__row">
                    <span className="tm-dist__lbl">{label}</span>
                    <div className="tm-dist__bar">
                      <div className="tm-dist__fill" style={{ width: `${pct}%`, background: pct > 50 ? "#FE8100" : "rgba(255,255,255,0.35)" }} />
                    </div>
                    <span className="tm-dist__pct">{pct}%</span>
                  </div>
                ))}
              </div>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="tm-score-card__link"
              >
                <ExternalLink size={14} /> View all on Google
              </a>
            </div>

            {/* Write a review nudge */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="tm-write-link"
            >
              <div className="tm-write-link__icon"><GoogleG size={20} /></div>
              <div>
                <div className="tm-write-link__title">Share your experience</div>
                <div className="tm-write-link__sub">Write a review on Google</div>
              </div>
              <ExternalLink size={14} color="#94a3b8" style={{ marginLeft: "auto" }} />
            </a>
          </div>

          {/* RIGHT: review cards */}
          <div className="tm-cards-col">
            <div
              className="tm-cards"
              style={{
                gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                opacity: out ? 0 : 1,
                transform: out ? "translateX(10px)" : "translateX(0)",
                transition: "opacity 0.26s ease, transform 0.26s ease",
              }}
            >
              {visible.map((rv) => (
                <div key={rv.name} className="tm-card">
                  {/* Top row */}
                  <div className="tm-card__top">
                    <div className="tm-card__author">
                      <div className="tm-card__avatar" style={{ background: rv.color, boxShadow: `0 4px 10px ${rv.color}44` }}>
                        {rv.initials}
                      </div>
                      <div>
                        <div className="tm-card__name">{rv.name}</div>
                        <div className="tm-card__loc">{rv.location}</div>
                      </div>
                    </div>
                    <GoogleG size={16} />
                  </div>

                  {/* Stars + date */}
                  <div className="tm-card__meta">
                    <Stars n={rv.rating} size={13} />
                    <span className="tm-card__date">{rv.date}</span>
                  </div>

                  {/* Quote icon */}
                  <div className="tm-card__quote">
                    <Quote size={13} color="#0127FC" fill="#0127FC" />
                  </div>

                  {/* Review text */}
                  <p className="tm-card__text">{rv.text}</p>

                  {/* Helpful */}
                  <div className="tm-card__helpful">
                    <ThumbsUp size={12} color="#94a3b8" />
                    <span>{rv.helpful} found this helpful</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="tm-nav">
              {/* Dots */}
              <div className="tm-nav__dots">
                {Array.from({ length: maxStart + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { goTo(i); startAuto(); }}
                    aria-label={`Page ${i + 1}`}
                    className="tm-nav__dot"
                    style={{
                      background: i === cur ? "#0127FC" : "#e2e8f0",
                      width: i === cur ? 24 : 7,
                    }}
                  />
                ))}
              </div>

              {/* Counter */}
              <span className="tm-nav__counter">
                <span style={{ color: "#0127FC", fontWeight: 800 }}>{cur + 1}–{Math.min(cur + visibleCount, reviews.length)}</span>
                {" "}of {reviews.length}
              </span>

              {/* Arrows */}
              <div className="tm-nav__arrows">
                {([[-1, ChevronLeft], [1, ChevronRight]] as const).map(([d, Icon]) => {
                  const disabled = d === -1 ? cur === 0 : cur >= maxStart;
                  return (
                    <button
                      key={d}
                      onClick={() => { if (!disabled) { goDir(d as 1 | -1); startAuto(); } }}
                      disabled={disabled}
                      className="tm-nav__arrow"
                      style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
                    >
                      <Icon size={17} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── section ── */
        .tm-section {
          padding: 100px 24px;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .tm-bg {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, #f8faff 0%, #fff 60%, #fff7ed 100%);
          pointer-events: none;
        }
        .tm-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .tm-orb--tr { top: -100px; right: -100px; width: 520px; height: 520px; background: radial-gradient(circle, rgba(1,39,252,0.04) 0%, transparent 70%); }
        .tm-orb--bl { bottom: -60px; left: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(254,129,0,0.05) 0%, transparent 70%); }

        .tm-container { max-width: 1200px; margin: 0 auto; position: relative; }

        /* ── header ── */
        .tm-header {
          text-align: center; margin-bottom: 56px;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .tm-header.tm-in { opacity: 1; transform: translateY(0); }

        /* ── layout ── */
        .tm-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 36px;
          align-items: start;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
        }
        .tm-layout.tm-in { opacity: 1; transform: translateY(0); }

        /* ── score card ── */
        .tm-score-card {
          background: linear-gradient(145deg, #0127FC 0%, #001060 100%);
          border-radius: 22px;
          padding: 32px 24px 24px;
          box-shadow: 0 16px 56px rgba(1,39,252,0.22);
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .tm-score-card__ring {
          position: absolute; top: -40px; right: -40px;
          width: 180px; height: 180px; border-radius: 50%;
          background: rgba(254,129,0,0.12); pointer-events: none;
        }
        .tm-score-card__google {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 20px;
          color: #fff; font-size: 13px; font-weight: 700; letter-spacing: 0.04em;
        }
        .tm-score-card__num {
          font-family: 'Poppins', sans-serif;
          font-weight: 900; font-size: 68px;
          color: #fff; line-height: 1; margin-bottom: 8px;
        }
        .tm-score-card__count {
          color: rgba(255,255,255,0.55); font-size: 13px; margin-top: 8px; font-weight: 600;
        }
        .tm-dist { margin-top: 20px; display: flex; flex-direction: column; gap: 7px; }
        .tm-dist__row { display: flex; align-items: center; gap: 8px; }
        .tm-dist__lbl { font-size: 11px; color: rgba(255,255,255,0.5); width: 44px; flex-shrink: 0; }
        .tm-dist__bar { flex: 1; height: 5px; background: rgba(255,255,255,0.12); border-radius: 9999px; overflow: hidden; }
        .tm-dist__fill { height: 100%; border-radius: 9999px; transition: width 1s ease; }
        .tm-dist__pct { font-size: 11px; color: rgba(255,255,255,0.5); width: 26px; text-align: right; flex-shrink: 0; }
        .tm-score-card__link {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 12px; padding: 11px;
          color: #fff; font-size: 13px; font-weight: 700;
          text-decoration: none;
          transition: background 0.2s;
        }
        .tm-score-card__link:hover { background: rgba(255,255,255,0.18); }

        /* write review link */
        .tm-write-link {
          display: flex; align-items: center; gap: 12px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px; padding: 14px 16px;
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tm-write-link:hover { border-color: #0127FC; box-shadow: 0 4px 16px rgba(1,39,252,0.1); }
        .tm-write-link__icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: #f0f4ff;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .tm-write-link__title { font-size: 13px; font-weight: 700; color: #0f172a; font-family: 'Poppins', sans-serif; }
        .tm-write-link__sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }

        /* ── cards ── */
        .tm-cards {
          display: grid;
          gap: 14px;
          transition: opacity 0.26s ease, transform 0.26s ease;
        }
        .tm-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #f1f5f9;
          padding: 22px 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          display: flex; flex-direction: column; gap: 12px;
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }
        .tm-card:hover { box-shadow: 0 10px 40px rgba(0,0,0,0.1); transform: translateY(-3px); }
        .tm-card__top { display: flex; align-items: center; justify-content: space-between; }
        .tm-card__author { display: flex; align-items: center; gap: 10px; }
        .tm-card__avatar {
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800; color: #fff;
          font-family: 'Poppins', sans-serif; flex-shrink: 0;
        }
        .tm-card__name { font-size: 13px; font-weight: 700; color: #0f172a; font-family: 'Poppins', sans-serif; }
        .tm-card__loc { font-size: 11px; color: #94a3b8; }
        .tm-card__meta { display: flex; align-items: center; justify-content: space-between; }
        .tm-card__date { font-size: 10px; color: #94a3b8; font-weight: 600; }
        .tm-card__quote {
          width: 28px; height: 28px; border-radius: 9px;
          background: #f0f4ff;
          display: flex; align-items: center; justify-content: center;
        }
        .tm-card__text {
          font-size: 13px; color: #475569; line-height: 1.75;
          flex: 1; margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tm-card__helpful {
          display: flex; align-items: center; gap: 6px;
          padding-top: 10px; border-top: 1px solid #f1f5f9;
          font-size: 11px; color: #94a3b8;
        }

        /* ── navigation ── */
        .tm-nav {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          flex-wrap: wrap; gap: 12px;
        }
        .tm-nav__dots { display: flex; gap: 6px; align-items: center; }
        .tm-nav__dot {
          height: 7px; border-radius: 9999px;
          border: none; cursor: pointer; padding: 0;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .tm-nav__counter { font-size: 13px; color: #94a3b8; font-weight: 600; }
        .tm-nav__arrows { display: flex; gap: 8px; }
        .tm-nav__arrow {
          width: 38px; height: 38px; border-radius: 50%;
          border: 2px solid #e2e8f0;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          color: #64748b;
          transition: border-color 0.2s, color 0.2s;
        }
        .tm-nav__arrow:hover:not(:disabled) { border-color: #0127FC; color: #0127FC; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .tm-layout { grid-template-columns: 1fr; }
          .tm-rating-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            align-items: start;
          }
          .tm-score-card { margin-bottom: 0; }
        }
        @media (max-width: 640px) {
          .tm-section { padding: 72px 16px; }
          .tm-header { margin-bottom: 36px; }
          .tm-rating-col { grid-template-columns: 1fr; }
          .tm-score-card__num { font-size: 52px; }
          .tm-nav { justify-content: center; }
          .tm-nav__counter { display: none; }
        }
      `}</style>
    </section>
  );
}
