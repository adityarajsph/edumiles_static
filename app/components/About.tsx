"use client";

import Image from "next/image";
import { Award, MapPin, Users, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const stats = [
  { Icon: Users,  value: "2000+", label: "Happy Travellers" },
  { Icon: MapPin, value: "500+",  label: "Destinations"     },
  { Icon: Award,  value: "7+",    label: "Years Experience" },
  { Icon: Star,   value: "4.9★",  label: "Customer Rating"  },
];

const highlights = [
  "Personally verified hotels & travel routes",
  "24/7 dedicated travel support team",
  "Transparent pricing — no hidden charges",
  "Custom itineraries tailored for you",
];

export default function About() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="ab-section">

      {/* subtle background tint */}
      <div className="ab-bg-tint" aria-hidden />

      <div className="ab-container">
        <div
          ref={ref}
          className={`ab-grid ${isVisible ? "ab-in" : ""}`}
        >

          {/* ══ LEFT: image ══ */}
          <div className="ab-img-col">

            {/* accent border frame */}
            <div className="ab-frame" aria-hidden />

            <div className="ab-photo-wrap">
              <Image
                src="/ourstory/ourstory.jpeg"
                alt="EdumilesTravels team"
                width={680}
                height={480}
                className="ab-photo"
                priority
              />
              {/* bottom scrim for caption readability */}
              <div className="ab-scrim" aria-hidden />
              <div className="ab-caption">
                <span className="ab-caption__since">Since 2019</span>
                <p className="ab-caption__line">Crafting Unforgettable Travel Memories</p>
              </div>
            </div>

            {/* chip: years */}
            <div className="ab-chip ab-chip--navy">
              <span className="ab-chip__num">7+</span>
              <span className="ab-chip__sub">Years of<br/>Excellence</span>
            </div>

            {/* chip: award */}
            <div className="ab-chip ab-chip--white">
              <span className="ab-chip__ico"><Award size={17} color="#fff" /></span>
              <div>
                <span className="ab-chip__eyebrow">Awarded</span>
                <span className="ab-chip__title">Best Travel Agency 2024</span>
              </div>
            </div>

            {/* pill: rating */}
            <div className="ab-rating-pill">
              <Star size={13} fill="#FE8100" color="#FE8100" />
              <span>4.9 · Google Reviews</span>
            </div>

          </div>

          {/* ══ RIGHT: content ══ */}
          <div className="ab-content">

            {/* eyebrow */}
            <div className="ab-eyebrow">
              <span className="ab-eyebrow__dot" />
              Our Story
            </div>

            <h2 className="ab-h2">
              Making Travel Dreams<br />
              <span className="ab-h2__accent">Come True Since 2019</span>
            </h2>

            <div className="ab-divider" />

            <p className="ab-para">
              EdumilesTravels was born from a simple belief — everyone deserves a
              perfect holiday, whatever their budget. Founded in 2019, we&apos;ve grown into
              one of India&apos;s most trusted travel companies, turning first-time
              travellers into lifelong explorers.
            </p>
            <p className="ab-para">
              From Himalayan treks to beach retreats, religious yatras to luxury escapes —
              our expert team personally verifies every hotel, route and partner so your
              journey is seamless from the very first click.
            </p>

            {/* checklist */}
            <ul className="ab-list">
              {highlights.map((h) => (
                <li key={h} className="ab-list__item">
                  <span className="ab-list__dot">
                    <CheckCircle2 size={13} color="#FE8100" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            {/* stats row */}
            <div className="ab-stats">
              {stats.map((s, i) => (
                <div key={s.label} className="ab-stat" style={{ animationDelay: `${i * 80}ms` }}>
                  <span className="ab-stat__val">{s.value}</span>
                  <span className="ab-stat__lbl">{s.label}</span>
                </div>
              ))}
            </div>

            <a href="#packages" className="btn-primary ab-btn">
              Explore Our Packages <ArrowRight size={16} />
            </a>

          </div>
        </div>
      </div>

      <style>{`

        /* ── section ── */
        .ab-section {
          position: relative;
          padding: 112px 24px;
          background: #ffffff;
          overflow: hidden;
        }
        .ab-bg-tint {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 0% 100%, rgba(254,129,0,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 55% 45% at 100% 0%, rgba(1,39,252,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── layout ── */
        .ab-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .ab-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        /* ── image col entrance ── */
        .ab-img-col {
          position: relative;
          opacity: 0;
          transform: translateX(-36px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .ab-in .ab-img-col {
          opacity: 1;
          transform: translateX(0);
        }

        /* gradient accent frame */
        .ab-frame {
          position: absolute;
          inset: -3px;
          border-radius: 30px;
          background: linear-gradient(135deg, #0127FC22, #FE810022);
          z-index: 0;
        }

        /* photo */
        .ab-photo-wrap {
          position: relative;
          border-radius: 26px;
          overflow: hidden;
          box-shadow:
            0 2px 0 0 rgba(1,39,252,0.15),
            0 24px 72px rgba(0,0,0,0.11);
          z-index: 1;
        }
        .ab-photo {
          width: 100%;
          height: 480px;
          object-fit: cover;
          display: block;
        }
        .ab-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(3,10,48,0.75) 0%, transparent 55%);
        }
        .ab-caption {
          position: absolute;
          bottom: 20px; left: 20px;
          z-index: 2;
          color: #fff;
        }
        .ab-caption__since {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 5px;
        }
        .ab-caption__line {
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          font-size: 16px;
          line-height: 1.3;
          margin: 0;
        }

        /* ── floating chips ── */
        .ab-chip {
          position: absolute;
          z-index: 3;
          border-radius: 18px;
        }
        .ab-chip--navy {
          top: -18px; left: -18px;
          background: linear-gradient(135deg, #0127FC, #2545FD);
          color: #fff;
          padding: 16px 18px;
          text-align: center;
          min-width: 86px;
          box-shadow: 0 12px 40px rgba(1,39,252,0.36);
        }
        .ab-chip__num {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 36px;
          line-height: 1;
          color: #fff;
        }
        .ab-chip__sub {
          display: block;
          font-size: 10px;
          color: rgba(255,255,255,0.65);
          font-weight: 600;
          line-height: 1.5;
          margin-top: 5px;
        }
        .ab-chip--white {
          bottom: 68px; right: -22px;
          background: #fff;
          padding: 13px 15px;
          display: flex;
          align-items: center;
          gap: 11px;
          box-shadow: 0 12px 44px rgba(0,0,0,0.13);
          border: 1px solid #f1f5f9;
          min-width: 196px;
        }
        .ab-chip__ico {
          width: 42px; height: 42px;
          border-radius: 13px;
          background: linear-gradient(135deg, #FE8100, #FF9A2E);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ab-chip__eyebrow {
          display: block;
          font-size: 9.5px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
        }
        .ab-chip__title {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-weight: 800;
          font-size: 12.5px;
          color: #0127FC;
          line-height: 1.3;
        }

        /* rating pill */
        .ab-rating-pill {
          position: absolute;
          top: 22px; right: -16px;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff;
          border: 1px solid rgba(254,129,0,0.18);
          border-radius: 50px;
          padding: 8px 14px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 12px;
          color: #0f172a;
          box-shadow: 0 6px 24px rgba(0,0,0,0.1);
          white-space: nowrap;
        }

        /* ── content col entrance ── */
        .ab-content {
          opacity: 0;
          transform: translateX(36px);
          transition: opacity 0.8s ease 0.18s, transform 0.8s ease 0.18s;
        }
        .ab-in .ab-content {
          opacity: 1;
          transform: translateX(0);
        }

        /* eyebrow */
        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: rgba(254,129,0,0.08);
          border: 1px solid rgba(254,129,0,0.2);
          border-radius: 50px;
          padding: 6px 16px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          color: #FE8100;
          margin-bottom: 22px;
        }
        .ab-eyebrow__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #FE8100;
          box-shadow: 0 0 7px #FE8100;
          flex-shrink: 0;
          animation: pulse-dot 1.6s ease-in-out infinite;
        }

        /* heading */
        .ab-h2 {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: clamp(28px, 3.2vw, 44px);
          color: #0f172a;
          line-height: 1.12;
          letter-spacing: -0.01em;
          margin: 0 0 14px;
        }
        .ab-h2__accent {
          background: linear-gradient(100deg, #FE8100 0%, #FF9A2E 60%, #FFD37A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* gold rule */
        .ab-divider {
          width: 48px;
          height: 4px;
          background: linear-gradient(90deg, #FE8100, #FF9A2E);
          border-radius: 4px;
          margin-bottom: 26px;
        }

        /* body */
        .ab-para {
          font-size: 15px;
          color: #64748b;
          line-height: 1.85;
          margin: 0 0 14px;
        }
        .ab-para:last-of-type { margin-bottom: 30px; }

        /* checklist */
        .ab-list {
          list-style: none;
          margin: 0 0 36px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ab-list__item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
        }
        .ab-list__dot {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(254,129,0,0.09);
          border: 1px solid rgba(254,129,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* stats */
        .ab-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1.5px solid #e8edf5;
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 36px;
          background: #fafbff;
        }
        .ab-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 18px 10px;
          border-right: 1.5px solid #e8edf5;
          transition: background 0.2s ease;
        }
        .ab-stat:last-child { border-right: none; }
        .ab-stat:hover { background: #fff7ed; }
        .ab-stat__val {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 20px;
          color: #0127FC;
          line-height: 1;
          margin-bottom: 5px;
        }
        .ab-stat__lbl {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          text-align: center;
          letter-spacing: 0.03em;
          line-height: 1.4;
        }

        /* cta */
        .ab-btn {
          font-size: 14px !important;
          padding: 13px 28px !important;
        }

        /* ── responsive ── */
        @media (max-width: 900px) {
          .ab-grid { grid-template-columns: 1fr; gap: 52px; }
          .ab-img-col { max-width: 540px; margin: 0 auto; }
          .ab-stats { grid-template-columns: repeat(2, 1fr); }
          .ab-stat:nth-child(2) { border-right: none; }
          .ab-stat:nth-child(3) {
            border-right: 1.5px solid #e8edf5;
            border-top: 1.5px solid #e8edf5;
          }
          .ab-stat:nth-child(4) { border-top: 1.5px solid #e8edf5; }
        }
        @media (max-width: 560px) {
          .ab-section { padding: 76px 20px; }
          .ab-photo { height: 320px; }
          .ab-chip--navy { top: -10px; left: -10px; }
          .ab-chip--white { right: -10px; bottom: 56px; min-width: 170px; }
          .ab-rating-pill { right: -8px; }
        }
      `}</style>
    </section>
  );
}
