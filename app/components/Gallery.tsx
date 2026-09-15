"use client";

import Image from "next/image";
import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const imgs = [
  "/travelmoments/a.jpeg",
  "/travelmoments/b.jpeg",
  "/travelmoments/c.jpeg",
  "/travelmoments/d.jpeg",
  "/travelmoments/e.jpeg",
  "/travelmoments/f.jpeg",
  "/travelmoments/g.png",
  "/travelmoments/l.jpeg",
  "/travelmoments/m.jpeg",
  "/travelmoments/p.jpeg",
  "/travelmoments/r.jpeg",
  "/travelmoments/x.jpeg",
  "/travelmoments/y.jpeg",
  "/travelmoments/z.jpeg",
];

const INITIAL = 6;
const STEP = 4;

export default function Gallery() {
  const { ref, isVisible } = useScrollAnimation();
  const [visible, setVisible] = useState(INITIAL);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const shown = imgs.slice(0, visible);
  const hasMore = visible < imgs.length;

  return (
    <section className="gal-section">
      <div className="gal-wrap">

        {/* Header */}
        <div ref={ref} className={`gal-header ${isVisible ? "in" : ""}`}>
          <span className="section-tag">Travel Moments</span>
          <h2 className="section-title">Captured Journeys</h2>
          <div className="section-divider" />
          <p className="section-sub">
            A glimpse of the incredible places our travellers have explored.
          </p>
        </div>

        {/* Grid */}
        <div className={`gal-grid ${isVisible ? "in" : ""}`}>
          {shown.map((src, i) => (
            <div
              key={src}
              className="gal-tile"
              style={{ animationDelay: `${(i % STEP) * 80}ms` }}
              onClick={() => setLightbox(src)}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                className="gal-img"
              />
              <div className="gal-shine" />
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="gal-footer">
            <button
              className="gal-btn"
              onClick={() => setVisible((v) => Math.min(v + STEP, imgs.length))}
            >
              <span>Load More</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </button>
            <p className="gal-count">{visible} of {imgs.length} photos</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="gal-lb" onClick={() => setLightbox(null)}>
          <button className="gal-lb-close" onClick={() => setLightbox(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="gal-lb-img" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox} alt="" fill className="gal-img" sizes="100vw" />
          </div>
        </div>
      )}

      <style>{`
        .gal-section {
          padding: 96px 24px 112px;
          background: #f8faff;
        }
        .gal-wrap {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .gal-header {
          text-align: center;
          margin-bottom: 56px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .gal-header.in { opacity: 1; transform: translateY(0); }

        /* Grid */
        .gal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .75s ease .15s, transform .75s ease .15s;
        }
        .gal-grid.in { opacity: 1; transform: translateY(0); }

        /* Tile */
        .gal-tile {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          background: #e2e8f0;
          box-shadow: 0 2px 14px rgba(0,0,0,.08);
          transition: transform .4s cubic-bezier(.25,.46,.45,.94),
                      box-shadow .4s ease;
        }
        .gal-tile:first-child {
          grid-column: span 2;
          aspect-ratio: 16/7;
        }
        .gal-tile:hover {
          transform: translateY(-5px) scale(1.015);
          box-shadow: 0 18px 48px rgba(1,39,252,.15);
        }

        /* Image */
        .gal-img {
          object-fit: cover;
          transition: transform .6s ease !important;
        }
        .gal-tile:hover .gal-img {
          transform: scale(1.07) !important;
        }

        /* Shine sweep on hover */
        .gal-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255,255,255,.13) 50%,
            transparent 70%
          );
          opacity: 0;
          transform: translateX(-100%);
          transition: opacity .1s;
          pointer-events: none;
        }
        .gal-tile:hover .gal-shine {
          opacity: 1;
          animation: shine .55s ease forwards;
        }
        @keyframes shine {
          to { transform: translateX(100%); }
        }

        /* Footer */
        .gal-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 44px;
        }

        /* Load more button */
        .gal-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: linear-gradient(135deg, #FE8100, #FF9A2E);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 36px;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(254,129,0,.38);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .gal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 38px rgba(254,129,0,.52);
        }
        .gal-btn:active { transform: translateY(0); }

        .gal-count {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }

        /* Lightbox */
        .gal-lb {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,.88);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lbIn .25s ease;
        }
        @keyframes lbIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .gal-lb-close {
          position: absolute;
          top: 20px;
          right: 24px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.2);
          color: #fff;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background .2s;
        }
        .gal-lb-close:hover { background: rgba(255,255,255,.25); }
        .gal-lb-img {
          position: relative;
          width: min(90vw, 1000px);
          height: min(80vh, 700px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,.6);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .gal-grid { grid-template-columns: repeat(2, 1fr); }
          .gal-tile:first-child { grid-column: span 2; }
        }
        @media (max-width: 540px) {
          .gal-grid { grid-template-columns: 1fr; gap: 10px; }
          .gal-tile:first-child { grid-column: span 1; aspect-ratio: 4/3; }
          .gal-section { padding: 64px 16px 80px; }
        }
      `}</style>
    </section>
  );
}
