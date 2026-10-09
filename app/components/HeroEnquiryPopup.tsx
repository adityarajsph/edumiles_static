"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import {
  X, User, Mail, Phone, Send, CheckCircle, Loader2, Plane, Hotel, Package,
} from "lucide-react";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

/* ── Summary types passed from Hero ────────────────────────────── */
export interface HeroBookingContext {
  tab: "hotels" | "flights" | "packages";
  /* hotel */
  hotelCity?: string;
  checkIn?: string;
  checkOut?: string;
  /* flight */
  from?: string;
  to?: string;
  departureDate?: string;
  travelClass?: string;
  /* package */
  destination?: string;
  travelDate?: string;
  travelType?: string;
  /* shared */
  guests?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  context: HeroBookingContext;
}

/* Map tab → icon + title */
const TAB_META = {
  hotels:   { icon: Hotel,   label: "Hotel Enquiry"   },
  flights:  { icon: Plane,   label: "Flight Enquiry"  },
  packages: { icon: Package, label: "Package Enquiry" },
};

export default function HeroEnquiryPopup({ open, onClose, context }: Props) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Reset when reopened */
  useEffect(() => {
    if (open) {
      setName(""); setEmail(""); setPhone("");
      setErrors({}); setSending(false); setDone(false); setApiError("");
    }
  }, [open]);

  /* ESC to close */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  /* Lock body scroll — use a counter-based approach to avoid race conditions */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim())                             e.name  = "Name is required";
    if (!/\S+@\S+\.\S+/.test(email.trim()))       e.email = "Valid email required";
    if (!/^[+\d\s\-()\u0020]{7,}$/.test(phone.trim())) e.phone = "Valid phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, email, phone]);

  /* Build a human-readable booking summary for the email */
  const buildSummary = () => {
    const { tab } = context;
    if (tab === "hotels") {
      return [
        `Type: Hotel Booking`,
        context.hotelCity     ? `City: ${context.hotelCity}`          : null,
        context.checkIn       ? `Check-in: ${context.checkIn}`        : null,
        context.checkOut      ? `Check-out: ${context.checkOut}`      : null,
        context.guests        ? `Guests: ${context.guests}`           : null,
      ].filter(Boolean).join("\n");
    }
    if (tab === "flights") {
      return [
        `Type: Flight Booking`,
        context.from          ? `From: ${context.from}`               : null,
        context.to            ? `To: ${context.to}`                   : null,
        context.departureDate ? `Departure: ${context.departureDate}` : null,
        context.travelClass   ? `Class: ${context.travelClass}`       : null,
        context.guests        ? `Passengers: ${context.guests}`       : null,
      ].filter(Boolean).join("\n");
    }
    return [
      `Type: Package Enquiry`,
      context.destination   ? `Destination: ${context.destination}`  : null,
      context.travelDate    ? `Travel Date: ${context.travelDate}`   : null,
      context.travelType    ? `Package Type: ${context.travelType}`  : null,
      context.guests        ? `Guests: ${context.guests}`            : null,
    ].filter(Boolean).join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true); setApiError("");

    const summary = buildSummary();
    const { label } = TAB_META[context.tab];

    const body = {
      access_key: WEB3FORMS_KEY,
      subject: `${label} — ${name}`,
      from_name: "EdumilesTravels Website",
      botcheck: "",
      name, email, phone,
      booking_summary: summary,
    };

    try {
      const res  = await fetchWithTimeout("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        /* fire-and-forget DB save */
        fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            formName: label,
            formSlug: `hero-${context.tab}-enquiry`,
            data: Object.fromEntries(
              Object.entries({ name, email, phone, ...context }).filter(([, v]) => v !== undefined && v !== null)
            ),
            sourcePage: typeof window !== "undefined" ? window.location.pathname : "",
          }),
        }).catch(() => {});
      } else {
        setApiError(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  const { icon: TabIcon, label: tabLabel } = TAB_META[context.tab];

  /* ── Success screen ── */
  if (done) {
    return (
      <div
        ref={overlayRef}
        className="hep-overlay"
        onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      >
        <div className="hep-panel hep-panel--success">
          <div className="hep-success-icon">
            <CheckCircle size={38} color="#16a34a" />
          </div>
          <h2 className="hep-success-title">Enquiry Received!</h2>
          <p className="hep-success-body">
            Thank you, <strong>{name}</strong>!<br />
            Our team will get back to you within 24 hours.
          </p>
          <button onClick={onClose} className="hep-done-btn">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="hep-overlay"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="hep-panel">

        {/* Header */}
        <div className="hep-header">
          <div className="hep-header__left">
            <div className="hep-header__icon">
              <TabIcon size={20} color="#fff" />
            </div>
            <div>
              <h2 className="hep-header__title">{tabLabel}</h2>
              <p className="hep-header__sub">Fill in your details and we&apos;ll reach out shortly</p>
            </div>
          </div>
          <button onClick={onClose} className="hep-close" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Booking summary pill */}
        <div className="hep-summary">
          {context.tab === "hotels" && (
            <>
              {context.hotelCity && <SummaryChip label="City" value={context.hotelCity} />}
              {context.checkIn   && <SummaryChip label="Check-in"  value={context.checkIn}  />}
              {context.checkOut  && <SummaryChip label="Check-out" value={context.checkOut} />}
              {context.guests    && <SummaryChip label="Guests" value={context.guests} />}
            </>
          )}
          {context.tab === "flights" && (
            <>
              {context.from          && <SummaryChip label="From"      value={context.from}          />}
              {context.to            && <SummaryChip label="To"        value={context.to}            />}
              {context.departureDate && <SummaryChip label="Date"      value={context.departureDate} />}
              {context.travelClass   && <SummaryChip label="Class"     value={context.travelClass}   />}
              {context.guests        && <SummaryChip label="Passengers" value={context.guests}       />}
            </>
          )}
          {context.tab === "packages" && (
            <>
              {context.destination && <SummaryChip label="Destination" value={context.destination} />}
              {context.travelDate  && <SummaryChip label="Date"        value={context.travelDate}  />}
              {context.travelType  && <SummaryChip label="Type"        value={context.travelType}  />}
              {context.guests      && <SummaryChip label="Guests"      value={context.guests}      />}
            </>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="hep-form">

          {/* Name */}
          <div className="hep-field">
            <label className="hep-label">Full Name *</label>
            <div className="hep-input-wrap">
              <User size={15} color={errors.name ? "#ef4444" : "#94a3b8"} className="hep-icon" />
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`hep-input${errors.name ? " hep-input--err" : ""}`}
              />
            </div>
            {errors.name && <p className="hep-error">{errors.name}</p>}
          </div>

          {/* Email + Phone side by side */}
          <div className="hep-row">
            <div className="hep-field">
              <label className="hep-label">Email *</label>
              <div className="hep-input-wrap">
                <Mail size={15} color={errors.email ? "#ef4444" : "#94a3b8"} className="hep-icon" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`hep-input${errors.email ? " hep-input--err" : ""}`}
                />
              </div>
              {errors.email && <p className="hep-error">{errors.email}</p>}
            </div>

            <div className="hep-field">
              <label className="hep-label">Phone *</label>
              <div className="hep-input-wrap">
                <Phone size={15} color={errors.phone ? "#ef4444" : "#94a3b8"} className="hep-icon" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={`hep-input${errors.phone ? " hep-input--err" : ""}`}
                />
              </div>
              {errors.phone && <p className="hep-error">{errors.phone}</p>}
            </div>
          </div>

          {apiError && <p className="hep-api-error">{apiError}</p>}

          <button
            type="submit"
            disabled={sending}
            className="hep-submit"
          >
            {sending
              ? <><Loader2 size={16} className="hep-spin" /> Sending…</>
              : <><Send size={15} /> Send Enquiry</>
            }
          </button>
        </form>
      </div>

      <style>{`
        /* overlay */
        .hep-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(10,20,60,0.65);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }
        /* panel */
        .hep-panel {
          width: 100%; max-width: 500px;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.28);
          overflow: hidden;
          animation: hepIn 0.26s cubic-bezier(.22,.68,0,1.2) both;
        }
        .hep-panel--success {
          max-width: 380px;
          padding: 48px 32px;
          text-align: center;
        }
        @keyframes hepIn {
          from { opacity:0; transform:translateY(28px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        /* success */
        .hep-success-icon {
          width: 76px; height: 76px; border-radius: 50%;
          background: linear-gradient(135deg,#d1fae5,#a7f3d0);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
        }
        .hep-success-title {
          font-family:'Poppins',sans-serif; font-size:22px; font-weight:800;
          color:#0f172a; margin:0 0 10px;
        }
        .hep-success-body {
          color:#64748b; font-size:14px; line-height:1.8; margin:0 0 24px;
        }
        .hep-done-btn {
          width:100%; padding:13px; background:linear-gradient(135deg,#2563eb,#0127FC);
          color:#fff; border:none; border-radius:50px; cursor:pointer;
          font-family:'Poppins',sans-serif; font-weight:700; font-size:15px;
          box-shadow:0 8px 24px rgba(1,39,252,0.35);
          transition:all 0.2s;
        }
        .hep-done-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(1,39,252,0.48); }
        /* header */
        .hep-header {
          background: linear-gradient(135deg,#0127FC,#1d4ed8);
          padding: 22px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .hep-header__left { display:flex; align-items:center; gap:14px; }
        .hep-header__icon {
          width:44px; height:44px; border-radius:14px;
          background:rgba(255,255,255,0.18);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .hep-header__title {
          font-family:'Poppins',sans-serif; font-weight:800; font-size:18px;
          color:#fff; margin:0;
        }
        .hep-header__sub { color:rgba(255,255,255,0.65); font-size:12.5px; margin:3px 0 0; }
        .hep-close {
          background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.22);
          border-radius:9px; color:#fff; cursor:pointer; padding:7px;
          display:flex; align-items:center; justify-content:center;
          transition:background 0.2s; flex-shrink:0;
        }
        .hep-close:hover { background:rgba(255,255,255,0.25); }
        /* summary chips */
        .hep-summary {
          display:flex; flex-wrap:wrap; gap:8px;
          padding:14px 22px 0;
        }
        /* form */
        .hep-form {
          padding: 18px 22px 24px;
          display: flex; flex-direction:column; gap:14px;
        }
        .hep-row { display:flex; gap:12px; }
        .hep-field { display:flex; flex-direction:column; gap:5px; flex:1; min-width:0; }
        .hep-label {
          font-size:11.5px; font-weight:700; color:#475569;
          letter-spacing:0.05em; text-transform:uppercase;
          font-family:'Poppins',sans-serif;
        }
        .hep-input-wrap { position:relative; display:flex; align-items:center; }
        .hep-icon { position:absolute; left:12px; pointer-events:none; }
        .hep-input {
          width:100%; padding:11px 12px 11px 36px;
          background:#f8faff; border:1.5px solid #dfe6f5; border-radius:12px;
          color:#1e293b; font-size:14px; outline:none;
          font-family:'Inter',sans-serif;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .hep-input:focus {
          border-color:#0127FC;
          box-shadow:0 0 0 3px rgba(1,39,252,0.10);
          background:#fff;
        }
        .hep-input--err { border-color:#ef4444 !important; }
        .hep-error { color:#ef4444; font-size:11.5px; margin:0; }
        .hep-api-error { color:#ef4444; font-size:13px; text-align:center; margin:0; }
        .hep-submit {
          display:flex; align-items:center; justify-content:center; gap:8px;
          background:linear-gradient(135deg,#2563eb,#0127FC);
          color:#fff; border:none; border-radius:50px;
          padding:14px; width:100%;
          font-family:'Poppins',sans-serif; font-weight:700; font-size:15px;
          cursor:pointer;
          box-shadow:0 8px 28px rgba(1,39,252,0.38);
          transition:all 0.24s ease;
        }
        .hep-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 36px rgba(1,39,252,0.52); }
        .hep-submit:disabled { opacity:0.7; cursor:not-allowed; }
        .hep-spin { animation:hepSpin 1s linear infinite; }
        @keyframes hepSpin { to { transform:rotate(360deg); } }
        @media (max-width:480px) {
          .hep-row { flex-direction:column; }
          .hep-panel { border-radius:18px; }
        }
      `}</style>
    </div>
  );
}

/* Tiny chip showing a booking detail */
function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(1,39,252,0.06)", border: "1px solid rgba(1,39,252,0.14)",
      borderRadius: 9999, padding: "4px 12px",
      fontSize: 12.5, color: "#1e293b",
      fontFamily: "'Inter',sans-serif",
    }}>
      <span style={{ color: "#94a3b8", fontWeight: 600 }}>{label}:</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}
