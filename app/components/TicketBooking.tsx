"use client";

import { useState } from "react";
import { Plane, Train, Bus, Bell, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const services = [
  {
    Icon: Plane, title: "Flight Booking",
    desc: "Domestic & international flights at the best prices with zero hidden fees.",
    gradient: "linear-gradient(135deg,#3b82f6,#0127FC)",
    bg: "#eff6ff", iconBg: "#dbeafe", iconColor: "#0127FC",
    perks: ["Best fare guarantee", "Free cancellation", "Instant e-tickets"],
  },
  {
    Icon: Train, title: "Train Booking",
    desc: "Book confirmed train seats across all routes in India, hassle-free.",
    gradient: "linear-gradient(135deg,#10b981,#059669)",
    bg: "#f0fdf4", iconBg: "#dcfce7", iconColor: "#059669",
    perks: ["Tatkal availability", "All classes", "PNR tracking"],
  },
  {
    Icon: Bus, title: "Bus Booking",
    desc: "Comfortable intercity bus journeys from top operators nationwide.",
    gradient: "linear-gradient(135deg,#FE8100,#FF9A2E)",
    bg: "#fff7ed", iconBg: "#ffedd5", iconColor: "#FE8100",
    perks: ["Sleeper & AC options", "Live tracking", "Easy refunds"],
  },
];

interface TicketBookingProps {
  onOpenContact: (subject?: string) => void;
}

export default function TicketBooking({ onOpenContact }: TicketBookingProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [notified, setNotified] = useState<string | null>(null);
  const [email, setEmail]       = useState("");
  const [globalDone, setGlobalDone] = useState(false);

  const handleNotify = (serviceTitle: string) => {
    setNotified(serviceTitle);
    onOpenContact(`Notify Me – ${serviceTitle}`);
  };

  return (
    <section id="ticket-booking" style={{ padding: "96px 24px", background: "linear-gradient(135deg,rgba(1,39,252,0.04) 0%,#fff 50%,rgba(254,129,0,0.04) 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease",
        }}>
          <span className="section-tag">Coming Soon</span>
          <h2 className="section-title">Ticket Booking</h2>
          <div className="section-divider" />
          <p className="section-sub">We&apos;re building something great. Flight, train and bus booking — all in one place.</p>
        </div>

        {/* Service cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginBottom: 48 }}>
          {services.map((s, i) => (
            <div key={s.title} style={{
              background: s.bg, borderRadius: 24, padding: "32px 28px",
              border: "1px solid #fff", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(36px)",
              transition: `all 0.6s ease ${i * 120}ms`,
              position: "relative", overflow: "hidden",
            }}>
              {/* Coming soon ribbon */}
              <span style={{
                position: "absolute", top: 18, right: 18,
                background: "#fff", border: "1px solid #e2e8f0",
                color: "#64748b", fontSize: 10, fontWeight: 700,
                padding: "4px 10px", borderRadius: 9999, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>Coming Soon</span>

              {/* Icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 18, background: s.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
              }}>
                <s.Icon size={26} color={s.iconColor} />
              </div>

              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: "#0127FC", marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>{s.desc}</p>

              <ul style={{ listStyle: "none", padding: 0, marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                {s.perks.map(p => (
                  <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" }}>
                    <CheckCircle size={14} color={s.iconColor} />
                    {p}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleNotify(s.title)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: notified === s.title ? "#059669" : s.gradient,
                  color: "#fff",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                  padding: "13px", borderRadius: 14, border: "none", cursor: "pointer",
                  transition: "opacity 0.2s, transform 0.2s, background 0.3s",
                }}
              >
                {notified === s.title
                  ? <><CheckCircle size={15} /> You&apos;re on the list!</>
                  : <><Bell size={15} /> Notify Me</>}
              </button>
            </div>
          ))}
        </div>

        {/* Global email capture */}
        <div style={{
          background: "linear-gradient(135deg,#0127FC,#2545FD)",
          borderRadius: 28, padding: "48px 40px",
          textAlign: "center",
          opacity: isVisible ? 1 : 0,
          transition: "all 0.7s ease 0.3s",
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
        }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 28, color: "#fff", marginBottom: 8 }}>Get Early Access</h3>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 15, marginBottom: 28 }}>Be the first to know when ticket booking goes live.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 440, margin: "0 auto" }}>
            <input
              type="email" placeholder="Enter your email" value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: 1, minWidth: 200, padding: "14px 18px",
                background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: 14, color: "#fff", fontSize: 14, outline: "none",
                fontFamily: "'Inter',sans-serif",
              }}
            />
            <button
              onClick={() => {
                setEmail("");
                setGlobalDone(true);
                onOpenContact("Notify Me – Ticket Booking");
              }}
              style={{
                background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
                color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 700,
                fontSize: 14, padding: "14px 24px", borderRadius: 14, border: "none", cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 8,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              {globalDone
                ? <><CheckCircle size={15} /> Done!</>
                : <><Bell size={15} /> Notify Me</>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
