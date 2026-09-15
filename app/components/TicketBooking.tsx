"use client";

import { useState } from "react";
import {
  Plane, Train, Bus, Send, CheckCircle, Bell,
  Tag, ArrowRight, Star, Shield, Zap,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/* ─── Card data ──────────────────────────────────────────────── */
interface Service {
  Icon: React.ElementType;
  title: string;
  desc: string;
  gradient: string;
  accentColor: string;
  bg: string;
  borderColor: string;
  iconBg: string;
  perks: { icon: React.ElementType; text: string }[];
  cta: "enquiry" | "bus-enquiry" | "notify";
  ctaLabel: string;
}

const services: Service[] = [
  {
    Icon: Plane,
    title: "Flight Booking",
    desc: "Domestic & international flights at the best prices with zero hidden fees.",
    gradient: "linear-gradient(135deg,#0127FC,#3b82f6)",
    accentColor: "#0127FC",
    bg: "#f0f4ff",
    borderColor: "#c7d2fe",
    iconBg: "linear-gradient(135deg,#0127FC,#3b82f6)",
    perks: [
      { icon: Tag,    text: "Best fare guarantee" },
      { icon: Shield, text: "Free cancellation" },
      { icon: Zap,    text: "Instant e-tickets" },
    ],
    cta: "enquiry",
    ctaLabel: "Send your Enquiry",
  },
  {
    Icon: Train,
    title: "Train Booking",
    desc: "Book confirmed train seats across all routes in India, hassle-free.",
    gradient: "linear-gradient(135deg,#059669,#10b981)",
    accentColor: "#059669",
    bg: "#f0fdf4",
    borderColor: "#bbf7d0",
    iconBg: "linear-gradient(135deg,#059669,#10b981)",
    perks: [
      { icon: Tag,    text: "Tatkal availability" },
      { icon: Shield, text: "All classes covered" },
      { icon: Zap,    text: "PNR tracking" },
    ],
    cta: "notify",
    ctaLabel: "Notify Me",
  },
  {
    Icon: Bus,
    title: "Bus Booking",
    desc: "Comfortable intercity bus journeys from top operators nationwide.",
    gradient: "linear-gradient(135deg,#FE8100,#FF9A2E)",
    accentColor: "#FE8100",
    bg: "#fff7ed",
    borderColor: "#fed7aa",
    iconBg: "linear-gradient(135deg,#FE8100,#FF9A2E)",
    perks: [
      { icon: Tag,    text: "Sleeper & AC options" },
      { icon: Shield, text: "Live tracking" },
      { icon: Zap,    text: "Easy refunds" },
    ],
    cta: "bus-enquiry",
    ctaLabel: "Send your Enquiry",
  },
];

interface TicketBookingProps {
  onOpenContact: (subject?: string) => void;
  onOpenEnquiry: () => void;
  onOpenBusEnquiry: () => void;
}

export default function TicketBooking({ onOpenContact, onOpenEnquiry, onOpenBusEnquiry }: TicketBookingProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [notified, setNotified] = useState(false);

  const handleCta = (s: Service) => {
    if (s.cta === "enquiry")     { onOpenEnquiry(); return; }
    if (s.cta === "bus-enquiry") { onOpenBusEnquiry(); return; }
    onOpenContact(`Notify Me – ${s.title}`);
  };

  return (
    <section
      id="ticket-booking"
      style={{
        padding: "96px 24px",
        background: "linear-gradient(160deg,#f8faff 0%,#ffffff 55%,#fff7ed 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration blobs */}
      <div style={{
        position: "absolute", top: -80, left: -120, width: 480, height: 480,
        borderRadius: "50%",
        background: "radial-gradient(circle,rgba(1,39,252,0.06) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, right: -80, width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle,rgba(254,129,0,0.08) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* ── Section header ── */}
        <div
          ref={ref}
          style={{
            textAlign: "center", marginBottom: 64,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(28px)",
            transition: "all 0.7s ease",
          }}
        >
          <span className="section-tag">Best Prices</span>
          <h2 className="section-title">Ticket Booking</h2>
          <div className="section-divider" />
          <p className="section-sub">
            Flight, train and bus booking — all in one place at the cheapest rates.
          </p>
        </div>

        {/* ── Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 28,
          marginBottom: 56,
        }}>
          {services.map((s, i) => (
            <div
              key={s.title}
              style={{
                background: "#fff",
                borderRadius: 24,
                border: `1.5px solid ${s.borderColor}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                overflow: "hidden",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.65s ease ${i * 130}ms`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card top colour strip */}
              <div style={{
                background: s.bg,
                padding: "28px 28px 0",
                borderBottom: `1px solid ${s.borderColor}`,
              }}>
                {/* Badge + icon row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                  {/* Icon circle */}
                  <div style={{
                    width: 58, height: 58, borderRadius: 18,
                    background: s.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 24px ${s.accentColor}33`,
                  }}>
                    <s.Icon size={26} color="#fff" strokeWidth={2.2} />
                  </div>

                  {/* "Cheapest Rate" badge — only Flight & Bus */}
                  {s.cta !== "notify" ? (
                    <span style={{
                      background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
                      color: "#fff", fontSize: 10, fontWeight: 800,
                      padding: "5px 12px", borderRadius: 9999,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      boxShadow: "0 4px 12px rgba(254,129,0,0.3)",
                    }}>
                      Cheapest Rate
                    </span>
                  ) : (
                    <span style={{
                      background: "#f1f5f9",
                      color: "#64748b", fontSize: 10, fontWeight: 700,
                      padding: "5px 12px", borderRadius: 9999,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>
                      Coming Soon
                    </span>
                  )}
                </div>

                <h3 style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                  fontSize: 20, color: "#0f172a", marginBottom: 8,
                }}>{s.title}</h3>
                <p style={{
                  color: "#64748b", fontSize: 14, lineHeight: 1.65,
                  marginBottom: 20, minHeight: 42,
                }}>{s.desc}</p>
              </div>

              {/* Card body */}
              <div style={{ padding: "22px 28px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Perks */}
                <ul style={{
                  listStyle: "none", padding: 0,
                  display: "flex", flexDirection: "column", gap: 10,
                  marginBottom: 28, flex: 1,
                }}>
                  {s.perks.map(({ icon: PerkIcon, text }) => (
                    <li key={text} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      fontSize: 13, color: "#334155",
                    }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: s.bg,
                        border: `1px solid ${s.borderColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <PerkIcon size={13} color={s.accentColor} />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                {s.cta === "notify" ? (
                  <button
                    onClick={() => { setNotified(true); handleCta(s); }}
                    style={{
                      width: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: notified ? "#059669" : s.gradient,
                      color: "#fff",
                      fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                      padding: "14px", borderRadius: 14, border: "none", cursor: "pointer",
                      transition: "opacity 0.2s, transform 0.2s, background 0.3s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  >
                    {notified
                      ? <><CheckCircle size={15} /> You&apos;re on the list!</>
                      : <><Bell size={15} /> Notify Me</>}
                  </button>
                ) : (
                  <button
                    onClick={() => handleCta(s)}
                    style={{
                      width: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: s.gradient,
                      color: "#fff",
                      fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                      padding: "14px", borderRadius: 14, border: "none", cursor: "pointer",
                      transition: "opacity 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                  >
                    <Send size={15} /> {s.ctaLabel}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA banner ── */}
        <div style={{
          background: "linear-gradient(135deg,#0127FC 0%,#001060 100%)",
          borderRadius: 28,
          padding: "52px 48px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease 0.35s",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circle */}
          <div style={{
            position: "absolute", right: -60, top: -60,
            width: 280, height: 280, borderRadius: "50%",
            background: "rgba(254,129,0,0.12)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", left: -40, bottom: -40,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", maxWidth: 520 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Star size={16} color="#FE8100" fill="#FE8100" />
              <span style={{ color: "#FE8100", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Exclusive Deals
              </span>
            </div>
            <h3 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 900,
              fontSize: "clamp(20px,3vw,28px)", color: "#fff", marginBottom: 8,
            }}>
              Looking for the Best Travel Deal?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
              Drop us your requirements and our travel experts will find you the cheapest fares across flights, trains and buses.
            </p>
          </div>

          <button
            onClick={() => onOpenContact("Best Travel Deal Enquiry")}
            style={{
              position: "relative",
              display: "flex", alignItems: "center", gap: 10,
              background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
              color: "#fff",
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
              padding: "16px 32px", borderRadius: 9999, border: "none", cursor: "pointer",
              boxShadow: "0 8px 28px rgba(254,129,0,0.4)",
              whiteSpace: "nowrap",
              transition: "transform 0.2s, box-shadow 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(254,129,0,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(254,129,0,0.4)";
            }}
          >
            Get a Free Quote <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
