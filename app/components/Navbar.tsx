"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "#home",         label: "Home" },
  { href: "#packages",     label: "Packages" },
  { href: "#about",        label: "About" },
  { href: "#contact",      label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all 0.4s ease",
      background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.08)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>

          {/* Logo */}
          <a href="#home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image
              src="/edumiles.png"
              alt="EdumilesTravels"
              width={140}
              height={48}
              style={{ objectFit: "contain"}}
              priority
            />
          </a>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hide-mobile">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{
                fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 14,
                color: scrolled ? "#0127FC" : "rgba(255,255,255,0.9)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#FE8100")}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "#0127FC" : "rgba(255,255,255,0.9)")}
              >
                {l.label}
              </a>
            ))}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(254,129,0,0.12)", border: "1px solid rgba(254,129,0,0.35)",
              color: "#FE8100", fontSize: 11, fontWeight: 700, padding: "6px 14px",
              borderRadius: 9999, letterSpacing: "0.03em",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: "#FE8100",
                animation: "pulse-dot 1.5s ease-in-out infinite",
              }} />
              Ticket Booking Coming Soon
            </span>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="show-mobile"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 8,
              color: scrolled ? "#0127FC" : "#fff",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <div style={{
          overflow: "hidden",
          maxHeight: open ? 320 : 0,
          transition: "max-height 0.35s ease",
        }} className="show-mobile">
          <div style={{
            background: "#fff", borderRadius: 20, padding: "12px 8px 16px",
            margin: "0 0 12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid #f1f5f9",
          }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                display: "block", padding: "12px 16px", color: "#0127FC",
                fontWeight: 600, textDecoration: "none", borderRadius: 12,
                fontSize: 15, transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fff7ee")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .hide-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hide-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  );
}
