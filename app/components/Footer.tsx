"use client";

import { MapPin, Phone, Mail, Camera, ThumbsUp, PlayCircle } from "lucide-react";
import Image from "next/image";

const quickLinks = [
  { label: "Home",         href: "#home" },
  { label: "Packages",     href: "#packages" },
  { label: "Destinations", href: "#destinations" },
  { label: "About Us",     href: "#about" },
  { label: "Contact",      href: "#contact" },
];

const categories = [
  "Adventure Tours", "Honeymoon Packages", "Family Holidays",
  "Religious Yatra",  "Luxury Escapes",     "Weekend Getaways",
];

const socials = [
  { label: "Instagram", Icon: Camera,     href: "https://www.instagram.com/edumilestravel/" },
  { label: "Facebook",  Icon: ThumbsUp,   href: "https://www.facebook.com/profile.php?id=61591224146233" },
  { label: "YouTube",   Icon: PlayCircle, href: "https://www.youtube.com/@EdumilesTravel" },
];

const linkStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none",
  transition: "color 0.2s",
};

export default function Footer() {
  return (
    <footer id="contact" style={{ background: "#0127FC", color: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ marginBottom: 18 }}>
              <Image
                src="/edumiles.png"
                alt="EdumilesTravels"
                width={160}
                height={40}
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.75, marginBottom: 22 }}>
              Crafting unforgettable journeys across India and beyond since 2019.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: "rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", textDecoration: "none",
                    transition: "background 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#FE8100"; e.currentTarget.style.transform = "scale(1.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {quickLinks.map(l => (
                <li key={l.label}>
                  <a href={l.href} style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = "#FE8100")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#FE8100", flexShrink: 0 }} />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Categories</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {categories.map(c => (
                <li key={c}>
                  <a href="#packages" style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = "#FE8100")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#FE8100", flexShrink: 0 }} />
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Contact Us</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  Icon: MapPin,
                  text: "Unit No - 806, KLJ TOWER, Netaji Subhash Place,\nShakurpur, New Delhi, Delhi – 110034",
                },
                { Icon: Phone, text: "+91 99558 92640", href: "tel:+919955892640" },
                { Icon: Mail,  text: "hello@edumilestravels.com", href: "mailto:hello@edumilestravels.com" },
              ].map(({ Icon, text, href }) => (
                <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon size={14} color="#FE8100" />
                  </div>
                  {href ? (
                    <a href={href} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, textDecoration: "none", whiteSpace: "pre-line" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#FE8100")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                    >{text}</a>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            © {new Date().getFullYear()} EdumilesTravels. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map(t => (
              <a key={t} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
