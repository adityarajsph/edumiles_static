"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

interface Props {
  images: string[];
  packageName: string;
}

export default function ImageGallery({ images, packageName }: Props) {
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxIdx,  setLightboxIdx]    = useState(0);

  const safe = images.length > 0 ? images : ["/edumiles.png"];

  const open  = (i: number) => { setLightboxIdx(i); setLightboxOpen(true); };
  const close = useCallback(() => setLightboxOpen(false), []);
  const prev  = useCallback(() => setLightboxIdx(i => (i - 1 + safe.length) % safe.length), [safe.length]);
  const next  = useCallback(() => setLightboxIdx(i => (i + 1) % safe.length), [safe.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     close();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxOpen, prev, next, close]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  /* ── Build grid slots: main (index 0) + up to 4 thumbs ── */
  const main   = safe[0];
  const thumbs = safe.slice(1, 5);          // max 4
  const extra  = Math.max(0, safe.length - 5); // hidden count

  return (
    <>
      {/*
        Layout on ≥768 px:
          [  large main  ] [ t1 ]
          [              ] [ t2 ]
          [              ] [ t3 ]
          [              ] [ t4 ] ← "View all" badge on last
        On mobile: stacked vertically.
      */}
      <div className="gallery-root" style={{ position: "relative" }}>

        {/* Grid wrapper */}
        <div
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",   /* overridden by CSS below */
            gap: 6,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* ── Main image ─────────────────────────── */}
          <div
            className="gallery-main-cell"
            role="button" tabIndex={0}
            onClick={() => open(0)}
            onKeyDown={e => e.key === "Enter" && open(0)}
            aria-label={`View full photo of ${packageName}`}
            style={{
              position: "relative",
              cursor: "zoom-in",
              overflow: "hidden",
              background: "#e2e8f0",
              /* height controlled by CSS class */
            }}
          >
            <Image
              src={main}
              alt={`${packageName} – main photo`}
              fill
              sizes="(max-width:767px) 100vw, 65vw"
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              priority
              unoptimized
              className="gimg"
            />
            {/* Subtle scrim */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)",
              pointerEvents: "none",
            }} />
          </div>

          {/* ── Thumbnail column ───────────────────── */}
          {thumbs.length > 0 && (
            <div
              className="gallery-thumb-col"
              style={{ display: "grid", gap: 6 }}
            >
              {thumbs.map((src, i) => {
                const realIdx  = i + 1;
                const isLast   = i === thumbs.length - 1 && extra > 0;
                return (
                  <div
                    key={src}
                    role="button" tabIndex={0}
                    onClick={() => open(realIdx)}
                    onKeyDown={e => e.key === "Enter" && open(realIdx)}
                    aria-label={`Photo ${realIdx + 1} of ${packageName}`}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      background: "#e2e8f0",
                      cursor: "zoom-in",
                      /* height fills equally via CSS grid */
                    }}
                    className="gallery-thumb-cell"
                  >
                    <Image
                      src={src}
                      alt={`${packageName} photo ${realIdx + 1}`}
                      fill
                      sizes="(max-width:767px) 50vw, 22vw"
                      style={{ objectFit: "cover", transition: "transform 0.45s ease" }}
                      unoptimized
                      className="gimg"
                    />

                    {/* "View all" overlay on last thumb if there are more */}
                    {isLast && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0.52)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 6,
                      }}>
                        <LayoutGrid size={22} color="#fff" />
                        <span style={{
                          color: "#fff", fontFamily: "'Poppins',sans-serif",
                          fontWeight: 700, fontSize: 13,
                        }}>+{extra + 1} more</span>
                      </div>
                    )}

                    {/* Hover scrim */}
                    {!isLast && (
                      <div className="thumb-scrim" style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0)",
                        transition: "background 0.2s",
                        pointerEvents: "none",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Photo count pill — bottom-left of entire gallery */}
        <button
          onClick={() => open(0)}
          aria-label="View all photos in lightbox"
          style={{
            position: "absolute", bottom: 14, left: 14,
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.94)", backdropFilter: "blur(8px)",
            border: "none", borderRadius: 9999, padding: "7px 14px",
            fontSize: 13, fontWeight: 600, color: "#1e293b",
            cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#fff")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.94)")}
        >
          <LayoutGrid size={14} color="#FE8100" />
          View all {safe.length} photos
        </button>
      </div>

      {/* ── Lightbox ──────────────────────────────────── */}
      {lightboxOpen && (
        <div
          onClick={close}
          role="dialog" aria-modal="true" aria-label="Photo lightbox"
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(2,6,23,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Close */}
          <button onClick={close} aria-label="Close"
            style={{
              position: "absolute", top: 20, right: 20, zIndex: 10,
              background: "rgba(255,255,255,0.12)", border: "none",
              borderRadius: "50%", width: 42, height: 42,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff",
            }}>
            <X size={18} />
          </button>

          {/* Prev */}
          {safe.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous"
              style={{
                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "rgba(255,255,255,0.12)", border: "none",
                borderRadius: "50%", width: 46, height: 46,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff",
              }}>
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: "relative", width: "min(90vw, 1100px)", aspectRatio: "16/9" }}
          >
            <Image
              src={safe[lightboxIdx]}
              alt={`${packageName} photo ${lightboxIdx + 1}`}
              fill sizes="90vw"
              style={{ objectFit: "contain", borderRadius: 10 }}
              priority unoptimized
            />
          </div>

          {/* Next */}
          {safe.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next(); }} aria-label="Next"
              style={{
                position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "rgba(255,255,255,0.12)", border: "none",
                borderRadius: "50%", width: 46, height: 46,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#fff",
              }}>
              <ChevronRight size={24} />
            </button>
          )}

          {/* Counter */}
          <div style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)",
            color: "#fff", fontSize: 13, fontWeight: 600,
            padding: "5px 16px", borderRadius: 9999,
          }}>
            {lightboxIdx + 1} / {safe.length}
          </div>
        </div>
      )}

      <style>{`
        /* ── Desktop: side-by-side ──────────────────── */
        @media (min-width: 640px) {
          .gallery-grid {
            grid-template-columns: 2fr 1fr !important;
            height: 420px;
          }
          .gallery-main-cell {
            grid-row: 1;
            height: 100%;
          }
          .gallery-thumb-col {
            grid-template-rows: repeat(4, 1fr);
            height: 100%;
          }
          .gallery-thumb-cell {
            height: 100%;
          }
        }

        /* ── Mobile: stacked ────────────────────────── */
        @media (max-width: 639px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
          .gallery-main-cell {
            height: 240px;
          }
          .gallery-thumb-col {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: none !important;
            height: 76px;
          }
          .gallery-thumb-cell {
            height: 76px;
          }
        }

        /* ── Hover zoom ─────────────────────────────── */
        .gallery-main-cell:hover .gimg,
        .gallery-thumb-cell:hover .gimg {
          transform: scale(1.05);
        }
        .gallery-thumb-cell:hover .thumb-scrim {
          background: rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </>
  );
}
