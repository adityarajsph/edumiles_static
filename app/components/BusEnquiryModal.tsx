"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import {
  X, Bus, MapPin, Calendar, Users, User, Mail, Phone,
  ChevronDown, Send, CheckCircle, Loader2, UserCheck, Baby,
} from "lucide-react";

/* ─── Popular bus routes (cities) ───────────────────────────── */
const CITIES = [
  // North India
  "New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad",
  "Agra", "Mathura", "Vrindavan", "Lucknow", "Kanpur",
  "Varanasi", "Allahabad", "Jhansi", "Meerut", "Haridwar",
  "Rishikesh", "Dehradun", "Mussoorie",
  // Rajasthan
  "Jaipur", "Jodhpur", "Udaipur", "Jaisalmer", "Ajmer", "Pushkar", "Bikaner", "Kota",
  // West India
  "Mumbai", "Pune", "Nashik", "Aurangabad", "Nagpur", "Surat", "Ahmedabad", "Vadodara",
  "Goa (Panaji)", "Goa (Margao)",
  // South India
  "Bengaluru", "Mysuru", "Mangaluru", "Chennai", "Coimbatore",
  "Madurai", "Trichy", "Salem", "Tirunelveli",
  "Hyderabad", "Vijayawada", "Visakhapatnam", "Warangal",
  "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur",
  // East India
  "Kolkata", "Howrah", "Siliguri", "Bhubaneswar", "Cuttack", "Puri",
  "Patna", "Gaya", "Ranchi",
  // Northeast
  "Guwahati", "Shillong",
  // Central India
  "Bhopal", "Indore", "Jabalpur", "Raipur",
  // Hill Stations / Pilgrimage
  "Shimla", "Manali", "Dharamshala", "McLeod Ganj",
  "Amritsar", "Chandigarh", "Ludhiana",
  "Tirupati", "Shirdi", "Dwarka",
];

const BUS_TYPES = ["Any", "AC Sleeper", "Non-AC Sleeper", "AC Semi-Sleeper", "AC Seater", "Non-AC Seater", "Volvo AC", "Luxury / Multi-Axle"];

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

interface BusEnquiryModalProps {
  open: boolean;
  onClose: () => void;
}

/* ─── City Combobox ──────────────────────────────────────────── */
function CityCombobox({
  label,
  value,
  onChange,
  placeholder,
  excludeCity,
  error,
}: {
  label: string;
  value: string;
  onChange: (c: string) => void;
  placeholder: string;
  excludeCity?: string;
  error?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = CITIES.filter(
    (c) =>
      c !== excludeCity &&
      (query.length === 0 || c.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 18);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: 0 }} ref={ref}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        {/* Dropdown ABOVE the input */}
        {open && (
          <div style={dropdownStyle}>
            {filtered.length === 0 ? (
              <div style={dropdownEmptyStyle}>No cities found</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c}
                  type="button"
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#fff5eb")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
                  onClick={() => { onChange(c); setQuery(""); setOpen(false); }}
                >
                  <MapPin size={13} color="#FE8100" style={{ flexShrink: 0 }} />
                  <span style={{ marginLeft: 8, color: "#0f172a", fontSize: 13 }}>{c}</span>
                </button>
              ))
            )}
          </div>
        )}

        <span style={iconWrapStyle}><MapPin size={15} color="#FE8100" /></span>
        <input
          value={open ? query : value}
          placeholder={placeholder}
          onFocus={() => { setQuery(""); setOpen(true); }}
          onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true); }}
          style={{
            ...inputStyle,
            paddingLeft: 38,
            borderColor: error ? "#ef4444" : open ? "#0127FC" : "#e2e8f0",
            boxShadow: open ? "0 0 0 3px rgba(1,39,252,0.12)" : "none",
          }}
          autoComplete="off"
        />
        <span style={chevronStyle}>
          <ChevronDown
            size={14}
            color="#94a3b8"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          />
        </span>
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

/* ─── Counter ────────────────────────────────────────────────── */
function Counter({
  label, sublabel, icon: Icon, value, onChange, min = 0, max = 20,
}: {
  label: string; sublabel?: string; icon: React.ElementType;
  value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 14px", background: "#f8fafc",
      borderRadius: 10, border: "1px solid #e2e8f0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={16} color="#FE8100" />
        <div>
          <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{label}</div>
          {sublabel && <div style={{ fontSize: 11, color: "#94a3b8" }}>{sublabel}</div>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} style={counterBtnStyle(value <= min)}>−</button>
        <span style={{ minWidth: 20, textAlign: "center", color: "#0f172a", fontWeight: 700, fontSize: 15 }}>{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} style={counterBtnStyle(value >= max)}>+</button>
      </div>
    </div>
  );
}

/* ─── Main Modal ─────────────────────────────────────────────── */
export default function BusEnquiryModal({ open, onClose }: BusEnquiryModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [busType, setBusType] = useState("Any");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split("T")[0];
  const totalPassengers = adults + children;

  useEffect(() => {
    if (open) {
      setStep(1); setFrom(""); setTo(""); setTravelDate(""); setReturnDate("");
      setTripType("one-way"); setAdults(1); setChildren(0); setBusType("Any");
      setName(""); setEmail(""); setPhone(""); setMessage("");
      setErrors({}); setSending(false); setDone(false); setApiError("");
    }
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validateStep1 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!from.trim()) e.from = "Please select departure city";
    if (!to.trim()) e.to = "Please select arrival city";
    if (!travelDate) e.travelDate = "Please select travel date";
    if (tripType === "round-trip" && !returnDate) e.returnDate = "Please select return date";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [from, to, travelDate, returnDate, tripType]);

  const validateStep2 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!phone.trim() || !/^[+\d\s\-()]{7,}$/.test(phone)) e.phone = "Valid phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, email, phone]);

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setSending(true); setApiError("");

    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `Bus Enquiry: ${from} to ${to}`,
      from_name: "EdumilesTravels Website",
      name,
      email,
      phone,
      from_city: from,
      to_city: to,
      trip_type: tripType,
      travel_date: travelDate,
      return_date: tripType === "round-trip" ? returnDate : "One Way",
      bus_type: busType,
      passengers: `${adults} adult${adults !== 1 ? "s" : ""}${children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}`,
      message: message || "No additional notes",
      botcheck: "",
    };

    try {
      const res = await fetchWithTimeout("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        // Fire-and-forget DB save — never blocks or breaks the form
        fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            formName: "Bus Enquiry",
            formSlug: "bus-enquiry",
            data: {
              name, email, phone,
              from_city:   from,
              to_city:     to,
              trip_type:   tripType,
              travel_date: travelDate,
              return_date: tripType === "round-trip" ? returnDate : "",
              bus_type:    busType,
              adults, children,
              message: message || "",
            },
            sourcePage: typeof window !== "undefined" ? window.location.pathname : "",
          }),
        }).catch(() => {});
      }
      else setApiError(data.message || "Submission failed. Please try again.");
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  /* ── Success ── */
  if (done) {
    return (
      <div ref={overlayRef} style={overlayStyle} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
        <div style={{ ...panelStyle, maxWidth: 440, textAlign: "center", padding: "52px 36px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 10 }}>
            Enquiry Sent!
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.75, marginBottom: 28 }}>
            Thank you, <strong style={{ color: "#FE8100" }}>{name}</strong>. Our team will reach out shortly with the best bus options for your journey.
          </p>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%" }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={overlayRef} style={overlayStyle} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div style={panelStyle}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#0127FC 0%,#001060 100%)",
          borderRadius: "20px 20px 0 0",
          padding: "22px 28px 20px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", margin: 0 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Bus size={18} /> Bus Enquiry</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "5px 0 0" }}>
              Step {step} of 2 — {step === 1 ? "Journey Details" : "Your Information"}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 8, color: "#fff", cursor: "pointer", padding: 6,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Step bar */}
        <div style={{ display: "flex", gap: 6, padding: "16px 28px 0" }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 9999,
              background: s <= step ? "linear-gradient(90deg,#FE8100,#FF9A2E)" : "#e2e8f0",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 18 }}>

            {/* ══ STEP 1 ══ */}
            {step === 1 && (
              <>
                {/* Trip type */}
                <div style={{ display: "flex", gap: 8 }}>
                  {(["one-way", "round-trip"] as const).map((t) => (
                    <button
                      key={t} type="button" onClick={() => setTripType(t)}
                      style={{
                        flex: 1, padding: "9px 0", borderRadius: 9999,
                        border: "2px solid",
                        borderColor: tripType === t ? "#0127FC" : "#e2e8f0",
                        background: tripType === t ? "#0127FC" : "#fff",
                        color: tripType === t ? "#fff" : "#64748b",
                        fontWeight: 700, fontSize: 13, cursor: "pointer",
                        transition: "all 0.2s", fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {t === "one-way" ? "→ One Way" : "↔ Round Trip"}
                    </button>
                  ))}
                </div>

                {/* From / To */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <CityCombobox label="From" value={from} onChange={setFrom} placeholder="Departure city" excludeCity={to} error={errors.from} />
                  <CityCombobox label="To" value={to} onChange={setTo} placeholder="Arrival city" excludeCity={from} error={errors.to} />
                </div>

                {/* Dates */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <label style={labelStyle}>Travel Date</label>
                    <div style={{ position: "relative" }}>
                      <span style={iconWrapStyle}><Calendar size={15} color="#FE8100" /></span>
                      <input type="date" min={today} value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 38, borderColor: errors.travelDate ? "#ef4444" : "#e2e8f0" }}
                      />
                    </div>
                    {errors.travelDate && <p style={errorStyle}>{errors.travelDate}</p>}
                  </div>
                  {tripType === "round-trip" && (
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <label style={labelStyle}>Return Date</label>
                      <div style={{ position: "relative" }}>
                        <span style={iconWrapStyle}><Calendar size={15} color="#FE8100" /></span>
                        <input type="date" min={travelDate || today} value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          style={{ ...inputStyle, paddingLeft: 38, borderColor: errors.returnDate ? "#ef4444" : "#e2e8f0" }}
                        />
                      </div>
                      {errors.returnDate && <p style={errorStyle}>{errors.returnDate}</p>}
                    </div>
                  )}
                </div>

                {/* Bus type */}
                <div>
                  <label style={labelStyle}>Bus Type</label>
                  <div style={{ position: "relative" }}>
                    <select value={busType} onChange={(e) => setBusType(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 14, appearance: "none" }}>
                      {BUS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <span style={chevronStyle}><ChevronDown size={14} color="#94a3b8" /></span>
                  </div>
                </div>

                {/* Passengers */}
                <div>
                  <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Users size={14} color="#FE8100" />
                    Passengers
                    <span style={{ marginLeft: "auto", color: "#FE8100", fontWeight: 700 }}>
                      {totalPassengers} total
                    </span>
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Counter label="Adults" sublabel="13+ years" icon={UserCheck} value={adults} onChange={setAdults} min={1} max={10} />
                    <Counter label="Children" sublabel="3–12 years" icon={Baby} value={children} onChange={setChildren} min={0} max={10} />
                  </div>
                </div>

                <button type="button" onClick={handleNext} className="btn-primary"
                  style={{ width: "100%", borderRadius: 10 }}>
                  Next: Your Details →
                </button>
              </>
            )}

            {/* ══ STEP 2 ══ */}
            {step === 2 && (
              <>
                {/* Summary */}
                <div style={{
                  background: "linear-gradient(135deg,rgba(1,39,252,0.06),rgba(1,39,252,0.03))",
                  border: "1px solid rgba(1,39,252,0.15)",
                  borderRadius: 12, padding: "12px 16px",
                  fontSize: 13, color: "#334155",
                  display: "flex", flexWrap: "wrap", gap: "6px 16px",
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Bus size={13} color="#0127FC" /> <strong style={{ color: "#0127FC" }}>{from}</strong> → <strong style={{ color: "#0127FC" }}>{to}</strong></span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Calendar size={13} color="#475569" /> {travelDate}{tripType === "round-trip" ? ` – ${returnDate}` : ""}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Users size={13} color="#475569" /> {totalPassengers} passenger{totalPassengers !== 1 ? "s" : ""} · {busType}</span>
                </div>

                {/* Name */}
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <div style={{ position: "relative" }}>
                    <span style={iconWrapStyle}><User size={15} color="#FE8100" /></span>
                    <input type="text" placeholder="Your full name" value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 38, borderColor: errors.name ? "#ef4444" : "#e2e8f0" }} />
                  </div>
                  {errors.name && <p style={errorStyle}>{errors.name}</p>}
                </div>

                {/* Email + Phone */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={labelStyle}>Email *</label>
                    <div style={{ position: "relative" }}>
                      <span style={iconWrapStyle}><Mail size={15} color="#FE8100" /></span>
                      <input type="email" placeholder="you@email.com" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 38, borderColor: errors.email ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.email && <p style={errorStyle}>{errors.email}</p>}
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={labelStyle}>Phone *</label>
                    <div style={{ position: "relative" }}>
                      <span style={iconWrapStyle}><Phone size={15} color="#FE8100" /></span>
                      <input type="tel" placeholder="+91 98765 43210" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 38, borderColor: errors.phone ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label style={labelStyle}>Additional Notes (optional)</label>
                  <textarea placeholder="Preferred pickup point, special requirements…"
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, paddingLeft: 14, paddingTop: 10, resize: "vertical", minHeight: 80 }} />
                </div>

                {apiError && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: 0 }}>{apiError}</p>}

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setStep(1)} style={{
                    flex: "0 0 auto", padding: "12px 20px", borderRadius: 10,
                    border: "2px solid #e2e8f0", background: "#fff",
                    color: "#64748b", fontWeight: 700, fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>← Back</button>
                  <button type="submit" disabled={sending}
                    className={sending ? "" : "btn-primary"}
                    style={{
                      flex: 1, borderRadius: 10, padding: "12px",
                      fontWeight: 700, fontSize: 15,
                      opacity: sending ? 0.6 : 1,
                      cursor: sending ? "not-allowed" : "pointer",
                      ...(sending ? {
                        background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
                        border: "none", color: "#fff", fontFamily: "inherit",
                      } : {}),
                    }}
                  >
                    {sending ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending…
                      </span>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Send size={15} /> Send Enquiry
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─── Shared styles ─────────────────────────────────────────── */
const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 9999,
  background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 16, overflowY: "auto",
};

const panelStyle: React.CSSProperties = {
  width: "100%", maxWidth: 620,
  background: "#ffffff", borderRadius: 20,
  boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
  animation: "modalIn 0.28s ease both",
  maxHeight: "92vh", overflowY: "auto",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: "#475569", marginBottom: 6,
  letterSpacing: "0.04em", textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 36px 11px 14px",
  background: "#fff", border: "1.5px solid #e2e8f0",
  borderRadius: 10, color: "#0f172a", fontSize: 14,
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
};

const iconWrapStyle: React.CSSProperties = {
  position: "absolute", left: 12, top: "50%",
  transform: "translateY(-50%)", pointerEvents: "none",
  display: "flex", alignItems: "center", zIndex: 1,
};

const chevronStyle: React.CSSProperties = {
  position: "absolute", right: 10, top: "50%",
  transform: "translateY(-50%)", pointerEvents: "none",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "calc(100% + 4px)",   /* above the input */
  left: 0, right: 0, zIndex: 200,
  background: "#fff", border: "1.5px solid #e2e8f0",
  borderRadius: 12, maxHeight: 220, overflowY: "auto",
  boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
};

const dropdownEmptyStyle: React.CSSProperties = {
  padding: "14px 16px", color: "#94a3b8", fontSize: 13, textAlign: "center",
};

const dropdownItemStyle: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center",
  padding: "9px 14px", background: "transparent",
  border: "none", borderBottom: "1px solid #f1f5f9",
  cursor: "pointer", textAlign: "left", transition: "background 0.12s",
};

const errorStyle: React.CSSProperties = {
  color: "#ef4444", fontSize: 11, marginTop: 4, marginBottom: 0,
};

const counterBtnStyle = (disabled: boolean): React.CSSProperties => ({
  width: 28, height: 28, borderRadius: 6,
  border: "1.5px solid",
  borderColor: disabled ? "#e2e8f0" : "#FE8100",
  background: disabled ? "#f8fafc" : "#fff5eb",
  color: disabled ? "#cbd5e1" : "#FE8100",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: 16, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "all 0.15s",
});
