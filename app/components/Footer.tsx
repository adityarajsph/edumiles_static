"use client";

import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

/* ─── Data ────────────────────────────────────────── */
const quickLinks = [
  { label: "Home",      href: "/" },
  { label: "Packages",  href: "/packages" },
  { label: "About Us",  href: "/about" },
  { label: "Contact",   href: "/contact" },
];

const categories = [
  { label: "Adventure Tours",    href: "/packages" },
  { label: "Honeymoon Packages", href: "/packages" },
  { label: "Family Holidays",    href: "/packages" },
  { label: "Religious Yatra",    href: "/packages" },
  { label: "Luxury Escapes",     href: "/packages" },
  { label: "Weekend Getaways",   href: "/packages" },
];

const socials = [
  {
    label: "Instagram",
    Icon: FaInstagram,
    href: "https://www.instagram.com/edumilestravel/",
    color: "#e1306c",
    bg: "rgba(225,48,108,0.15)",
  },
  {
    label: "Facebook",
    Icon: FaFacebookF,
    href: "https://www.facebook.com/profile.php?id=61591224146233",
    color: "#1877f2",
    bg: "rgba(24,119,242,0.15)",
  },
  {
    label: "YouTube",
    Icon: FaYoutube,
    href: "https://www.youtube.com/@EdumilesTravel",
    color: "#ff0000",
    bg: "rgba(255,0,0,0.15)",
  },
];

const contactItems = [
  {
    Icon: MapPin,
    text: "Unit No - 806, KLJ Tower, Netaji Subhash Place, Shakurpur, New Delhi – 110034",
    href: "https://maps.google.com/?q=KLJ+Tower+Netaji+Subhash+Place+New+Delhi",
  },
  {
    Icon: Phone,
    text: "+91 87966 73667",
    href: "tel:+918796673667",
  },
  {
    Icon: Mail,
    text: "edumilestravel@gmail.com",
    href: "mailto:edumilestravel@gmail.com",
  },
];

/* ─── Component ──────────────────────────────────── */
export default function Footer() {
  return (
    <footer style={{ background: "#010e52", color: "#fff", position: "relative", overflow: "hidden" }}>

      {/* ── Subtle top accent line ── */}
      <div style={{
        height: 3,
        background: "linear-gradient(90deg, transparent, #FE8100 30%, #FF9A2E 60%, transparent)",
      }} />

      {/* ── Decorative blobs ── */}
      <div style={{
        position: "absolute", top: -120, right: -120,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(254,129,0,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(1,39,252,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── Main grid ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 48px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.4fr",
          gap: 48,
        }} className="footer-grid">

          {/* ── Brand column ── */}
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: 20 }}>
              <Image
                src="/edumiles.png"
                alt="EdumilesTravels"
                width={150}
                height={44}
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </Link>

            <p style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14, lineHeight: 1.8,
              maxWidth: 280, marginBottom: 28,
            }}>
              Crafting unforgettable journeys across India and beyond since 2019. Your adventure, our expertise.
            </p>

            {/* Stats strip */}
            <div style={{
              display: "flex", gap: 0,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16, overflow: "hidden",
              marginBottom: 28,
            }}>
              {[
                { num: "2000+", label: "Travellers" },
                { num: "500+",  label: "Destinations" },
                { num: "4.9★",  label: "Rating" },
              ].map((s, i) => (
                <div key={s.label} style={{
                  flex: 1, padding: "14px 12px", textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.09)" : "none",
                }}>
                  <div style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                    fontSize: 16, color: "#FE8100", lineHeight: 1,
                  }}>{s.num}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", marginTop: 4, letterSpacing: "0.04em" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map(({ label, Icon, href, color, bg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: bg,
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: color, textDecoration: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${color}40`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700,
              fontSize: 13, color: "#fff", marginBottom: 24,
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {quickLinks.map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      color: "rgba(255,255,255,0.5)", fontSize: 14,
                      textDecoration: "none", transition: "color 0.2s, gap 0.2s",
                      fontFamily: "'Inter',sans-serif",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#FE8100";
                      e.currentTarget.style.gap = "12px";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      e.currentTarget.style.gap = "8px";
                    }}
                  >
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "currentColor", flexShrink: 0,
                      transition: "background 0.2s",
                    }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Tour Categories ── */}
          <div>
            <h4 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700,
              fontSize: 13, color: "#fff", marginBottom: 24,
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Tour Types
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {categories.map(c => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      color: "rgba(255,255,255,0.5)", fontSize: 14,
                      textDecoration: "none", transition: "color 0.2s, gap 0.2s",
                      fontFamily: "'Inter',sans-serif",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#FE8100";
                      e.currentTarget.style.gap = "12px";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      e.currentTarget.style.gap = "8px";
                    }}
                  >
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "currentColor", flexShrink: 0,
                    }} />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700,
              fontSize: 13, color: "#fff", marginBottom: 24,
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Get In Touch
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {contactItems.map(({ Icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    textDecoration: "none",
                    color: "rgba(255,255,255,0.5)",
                    transition: "color 0.2s",
                    fontSize: 13, lineHeight: 1.65,
                    fontFamily: "'Inter',sans-serif",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "rgba(254,129,0,0.12)",
                    border: "1px solid rgba(254,129,0,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: 1,
                  }}>
                    <Icon size={15} color="#FE8100" />
                  </div>
                  <span>{text}</span>
                </a>
              ))}
            </div>

            {/* CTA pill */}
            <Link
              href="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginTop: 28,
                background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
                color: "#fff", fontFamily: "'Poppins',sans-serif",
                fontWeight: 700, fontSize: 13,
                padding: "11px 22px", borderRadius: 9999,
                textDecoration: "none",
                boxShadow: "0 6px 24px rgba(254,129,0,0.3)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 32px rgba(254,129,0,0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(254,129,0,0.3)";
              }}
            >
              Plan My Trip <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 32px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "22px 32px",
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between",
        gap: 14, position: "relative", zIndex: 1,
      }}>
        <p style={{
          color: "rgba(255,255,255,0.3)", fontSize: 12,
          fontFamily: "'Inter',sans-serif",
        }}>
          © {new Date().getFullYear()}{" "}
          <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>EdumilesTravels</span>
          . All rights reserved. Made with ♥ in India.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {["Privacy Policy", "Terms of Service", "Refund Policy"].map((t, i) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12 }}>·</span>}
              <a
                href="#"
                style={{
                  color: "rgba(255,255,255,0.3)", fontSize: 12,
                  textDecoration: "none",
                  fontFamily: "'Inter',sans-serif",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                {t}
              </a>
            </span>
          ))}
        </div>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
