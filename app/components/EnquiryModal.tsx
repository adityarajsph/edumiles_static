"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import {
  X, PlaneTakeoff, PlaneLanding, Calendar, Users,
  User, Mail, Phone, ChevronDown, Send, CheckCircle,
  Loader2, Baby, UserCheck, Plane,
} from "lucide-react";
import AirportCombobox, { type Airport } from "@/app/components/AirportCombobox";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

interface EnquiryModalProps { open: boolean; onClose: () => void; }
/* â”€â”€â”€ Counter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Counter({
  label, sublabel, icon: Icon, value, onChange, min = 0, max = 20,
}: {
  label: string; sublabel?: string; icon: React.ElementType;
  value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="cnt-row">
      <div className="cnt-row__left">
        <Icon size={16} color="#FE8100" />
        <div>
          <div className="cnt-row__label">{label}</div>
          {sublabel && <div className="cnt-row__sub">{sublabel}</div>}
        </div>
      </div>
      <div className="cnt-row__ctrl">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="cnt-btn" data-disabled={value <= min}>âˆ’</button>
        <span className="cnt-val">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="cnt-btn" data-disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Main Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function EnquiryModal({ open, onClose }: EnquiryModalProps) {
  const [step, setStep]             = useState<1 | 2>(1);
  const [from, setFrom]             = useState<Airport | null>(null);
  const [to, setTo]                 = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType]     = useState<"one-way" | "round-trip">("round-trip");
  const [adults, setAdults]         = useState(1);
  const [children, setChildren]     = useState(0);
  const [infants, setInfants]       = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [message, setMessage]       = useState("");
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [sending, setSending]       = useState(false);
  const [done, setDone]             = useState(false);
  const [apiError, setApiError]     = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const today      = new Date().toISOString().split("T")[0];
  const totalTravellers = adults + children + infants;

  useEffect(() => {
    if (open) {
      setStep(1); setFrom(null); setTo(null);
      setDepartDate(""); setReturnDate(""); setTripType("round-trip");
      setAdults(1); setChildren(0); setInfants(0); setTravelClass("Economy");
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
    if (!from) e.from = "Please select departure airport";
    if (!to) e.to = "Please select arrival airport";
    if (!departDate) e.departDate = "Please select departure date";
    if (tripType === "round-trip" && !returnDate) e.returnDate = "Please select return date";
    if (adults < 1) e.adults = "At least 1 adult required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [from, to, departDate, returnDate, tripType, adults]);

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
    const body = {
      access_key: WEB3FORMS_KEY,
      subject: `Flight Enquiry: ${from?.city} â†’ ${to?.city}`,
      from_name: "EdumilesTravels Website",
      botcheck: "",   // honeypot â€” must be empty string
      name, email, phone,
      from_airport: `${from?.city} (${from?.iata}) â€“ ${from?.name}`,
      to_airport:   `${to?.city} (${to?.iata}) â€“ ${to?.name}`,
      trip_type: tripType,
      departure_date: departDate,
      return_date: tripType === "round-trip" ? returnDate : "N/A",
      travel_class: travelClass,
      adults, children, infants,
      total_travellers: totalTravellers,
      message: message || "â€”",
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
        // Fire-and-forget DB save â€” never blocks or breaks the form
        fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formName: "Flight Enquiry",
            formSlug: "flight-enquiry",
            data: {
              name, email, phone,
              from_airport:   `${from?.city} (${from?.iata})`,
              to_airport:     `${to?.city} (${to?.iata})`,
              trip_type:      tripType,
              departure_date: departDate,
              return_date:    tripType === "round-trip" ? returnDate : "",
              travel_class:   travelClass,
              adults, children, infants,
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

  /* â”€â”€ Success â”€â”€ */
  if (done) {
    return (
      <div ref={overlayRef} className="em-overlay" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
        <div className="em-panel em-panel--success">
          <div className="em-success-icon">
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h2 className="em-success-title">Enquiry Sent!</h2>
          <p className="em-success-body">
            Thank you, <strong style={{ color: "#FE8100" }}>{name}</strong>. Our team will get back to you shortly with the best options for your journey.
          </p>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%" }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={overlayRef} className="em-overlay" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="em-panel">

        {/* Header */}
        <div className="em-header">
          <div>
            <h2 className="em-header__title"><PlaneTakeoff size={18} /> Send Your Enquiry</h2>
            <p className="em-header__sub">Step {step} of 2 â€” {step === 1 ? "Flight Details" : "Your Information"}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="em-close"><X size={18} /></button>
        </div>

        {/* Step bar */}
        <div className="em-steps">
          {[1, 2].map((s) => (
            <div key={s} className="em-step" style={{ background: s <= step ? "linear-gradient(90deg,#FE8100,#FF9A2E)" : "#e2e8f0" }} />
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="em-body">

            {/* â•â• STEP 1 â•â• */}
            {step === 1 && (
              <>
                {/* Trip type */}
                <div className="em-trip-btns">
                  {(["round-trip", "one-way"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripType(t)}
                      className="em-trip-btn"
                      style={{
                        borderColor: tripType === t ? "#0127FC" : "#e2e8f0",
                        background:  tripType === t ? "#0127FC" : "#fff",
                        color:       tripType === t ? "#fff"    : "#64748b",
                      }}
                    >
                      {t === "round-trip" ? "â†” Round Trip" : "â†’ One Way"}
                    </button>
                  ))}
                </div>

                {/* From / To */}
                <div className="em-row">
                  <AirportCombobox label="From" value={from} onChange={setFrom} placeholder="Departure city or airport" excludeCode={to?.iata} error={errors.from} variant="modal" />
                  <AirportCombobox label="To" value={to} onChange={setTo} placeholder="Arrival city or airport" excludeCode={from?.iata} error={errors.to} variant="modal" />
                </div>

                {/* Dates */}
                <div className="em-row">
                  <div className="em-field">
                    <label className="em-label">Departure Date</label>
                    <div style={{ position: "relative" }}>
                      <span className="em-icon-wrap"><Calendar size={15} color="#FE8100" /></span>
                      <input type="date" min={today} value={departDate} onChange={(e) => setDepartDate(e.target.value)}
                        className="em-input" style={{ paddingLeft: 38, borderColor: errors.departDate ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.departDate && <p className="em-error">{errors.departDate}</p>}
                  </div>
                  {tripType === "round-trip" && (
                    <div className="em-field">
                      <label className="em-label">Return Date</label>
                      <div style={{ position: "relative" }}>
                        <span className="em-icon-wrap"><Calendar size={15} color="#FE8100" /></span>
                        <input type="date" min={departDate || today} value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                          className="em-input" style={{ paddingLeft: 38, borderColor: errors.returnDate ? "#ef4444" : "#e2e8f0" }} />
                      </div>
                      {errors.returnDate && <p className="em-error">{errors.returnDate}</p>}
                    </div>
                  )}
                </div>

                {/* Class */}
                <div className="em-field">
                  <label className="em-label">Travel Class</label>
                  <div style={{ position: "relative" }}>
                    <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}
                      className="em-input" style={{ paddingLeft: 14, appearance: "none" }}>
                      {["Economy", "Premium Economy", "Business", "First Class"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="em-chevron"><ChevronDown size={14} color="#94a3b8" /></span>
                  </div>
                </div>

                {/* Travellers */}
                <div className="em-field">
                  <label className="em-label em-label--row">
                    <Users size={14} color="#FE8100" /> Travellers
                    <span className="em-label__count">{totalTravellers} total</span>
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Counter label="Adults"   sublabel="12+ years"      icon={UserCheck} value={adults}   onChange={setAdults}   min={1} max={9} />
                    <Counter label="Children" sublabel="2â€“11 years"     icon={User}      value={children} onChange={setChildren} min={0} max={9} />
                    <Counter label="Infants"  sublabel="Under 2 years"  icon={Baby}      value={infants}  onChange={setInfants}  min={0} max={adults} />
                  </div>
                  {errors.adults && <p className="em-error">{errors.adults}</p>}
                </div>

                <button type="button" onClick={handleNext} className="btn-primary em-submit-btn">
                  Next: Your Details â†’
                </button>
              </>
            )}

            {/* â•â• STEP 2 â•â• */}
            {step === 2 && (
              <>
                {/* Summary */}
                <div className="em-summary">
                  <span className="em-summary__item"><Plane size={13} color="#0127FC" /> <strong style={{ color: "#0127FC" }}>{from?.city} ({from?.iata})</strong> â†’ <strong style={{ color: "#0127FC" }}>{to?.city} ({to?.iata})</strong></span>
                  <span className="em-summary__item"><Calendar size={13} color="#475569" /> {departDate}{tripType === "round-trip" ? ` â€“ ${returnDate}` : ""}</span>
                  <span className="em-summary__item"><Users size={13} color="#475569" /> {totalTravellers} traveller{totalTravellers !== 1 ? "s" : ""} Â· {travelClass}</span>
                </div>

                {/* Name */}
                <div className="em-field">
                  <label className="em-label">Full Name *</label>
                  <div style={{ position: "relative" }}>
                    <span className="em-icon-wrap"><User size={15} color="#FE8100" /></span>
                    <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)}
                      className="em-input" style={{ paddingLeft: 38, borderColor: errors.name ? "#ef4444" : "#e2e8f0" }} />
                  </div>
                  {errors.name && <p className="em-error">{errors.name}</p>}
                </div>

                {/* Email + Phone */}
                <div className="em-row">
                  <div className="em-field">
                    <label className="em-label">Email *</label>
                    <div style={{ position: "relative" }}>
                      <span className="em-icon-wrap"><Mail size={15} color="#FE8100" /></span>
                      <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="em-input" style={{ paddingLeft: 38, borderColor: errors.email ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.email && <p className="em-error">{errors.email}</p>}
                  </div>
                  <div className="em-field">
                    <label className="em-label">Phone *</label>
                    <div style={{ position: "relative" }}>
                      <span className="em-icon-wrap"><Phone size={15} color="#FE8100" /></span>
                      <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="em-input" style={{ paddingLeft: 38, borderColor: errors.phone ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.phone && <p className="em-error">{errors.phone}</p>}
                  </div>
                </div>

                {/* Message */}
                <div className="em-field">
                  <label className="em-label">Additional Notes (optional)</label>
                  <textarea placeholder="Any special requests, preferred airlines, meal preferencesâ€¦" value={message}
                    onChange={(e) => setMessage(e.target.value)} rows={3}
                    className="em-input" style={{ paddingLeft: 14, paddingTop: 10, resize: "vertical", minHeight: 80 }} />
                </div>

                {apiError && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: 0 }}>{apiError}</p>}

                <div className="em-actions">
                  <button type="button" onClick={() => setStep(1)} className="em-back-btn">â† Back</button>
                  <button type="submit" disabled={sending} className={`em-submit-btn ${sending ? "em-submit-btn--sending" : "btn-primary"}`} style={{ flex: 1 }}>
                    {sending
                      ? <span className="em-sending"><Loader2 size={16} className="em-spin" /> Sendingâ€¦</span>
                      : <span className="em-sending"><Send size={15} /> Send Enquiry</span>}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>

      <style>{`
        /* â”€â”€ overlay â”€â”€ */
        .em-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 12px;
          overflow-y: auto;
        }

        /* â”€â”€ panel â”€â”€ */
        .em-panel {
          width: 100%; max-width: 640px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          animation: modalIn 0.28s ease both;
          max-height: 92dvh;
          overflow-y: auto;
        }
        .em-panel--success {
          max-width: 420px;
          text-align: center;
          padding: 48px 32px;
        }
        .em-success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg,#d1fae5,#a7f3d0);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .em-success-title { font-family:'Poppins',sans-serif; font-weight:800; font-size:22px; color:#0f172a; margin-bottom:10px; }
        .em-success-body  { color:#64748b; font-size:14px; line-height:1.75; margin-bottom:24px; }

        /* â”€â”€ header â”€â”€ */
        .em-header {
          background: linear-gradient(135deg,#0127FC 0%,#001060 100%);
          border-radius: 20px 20px 0 0;
          padding: 20px 24px 18px;
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .em-header__title {
          font-family:'Poppins',sans-serif; font-weight:800; font-size:18px;
          color:#fff; margin:0; display:flex; align-items:center; gap:8px;
        }
        .em-header__sub { color:rgba(255,255,255,0.6); font-size:12px; margin:5px 0 0; }
        .em-close {
          background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2);
          border-radius:8px; color:#fff; cursor:pointer; padding:6px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
          transition:background 0.2s;
        }
        .em-close:hover { background:rgba(255,255,255,0.2); }

        /* â”€â”€ step bar â”€â”€ */
        .em-steps { display:flex; gap:6px; padding:14px 24px 0; }
        .em-step  { flex:1; height:4px; border-radius:9999px; transition:background 0.3s; }

        /* â”€â”€ body â”€â”€ */
        .em-body {
          padding: 18px 24px 24px;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* trip type buttons */
        .em-trip-btns { display:flex; gap:8px; }
        .em-trip-btn {
          flex:1; padding:9px 0; border-radius:9999px;
          border:2px solid; font-weight:700; font-size:13px; cursor:pointer;
          transition:all 0.2s; font-family:'Poppins',sans-serif;
        }

        /* two-col rows */
        .em-row { display:flex; gap:12px; }
        .em-field { flex:1; min-width:0; }

        /* label */
        .em-label {
          display:block; font-size:12px; font-weight:700; color:#475569;
          margin-bottom:6px; letter-spacing:0.04em; text-transform:uppercase;
        }
        .em-label--row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .em-label__count { margin-left:auto; color:#FE8100; font-weight:700; }

        /* input */
        .em-input {
          width:100%; padding:11px 36px 11px 14px;
          background:#fff; border:1.5px solid #e2e8f0; border-radius:10px;
          color:#0f172a; font-size:14px; outline:none; box-sizing:border-box;
          transition:border-color 0.2s, box-shadow 0.2s; font-family:inherit;
        }
        .em-input:focus { border-color:#0127FC; box-shadow:0 0 0 3px rgba(1,39,252,0.1); }

        /* icon + chevron */
        .em-icon-wrap {
          position:absolute; left:12px; top:50%; transform:translateY(-50%);
          pointer-events:none; display:flex; align-items:center; z-index:1;
        }
        .em-chevron {
          position:absolute; right:10px; top:50%; transform:translateY(-50%);
          pointer-events:none;
        }

        /* errors / hints */
        .em-error { color:#ef4444; font-size:11px; margin:4px 0 0; }
        .em-hint  { color:#0127FC; font-size:11px; margin:4px 0 0; }

        /* â”€â”€ airport dropdown â”€â”€ */
        .ap-wrap { flex:1; min-width:0; }
        .ap-dropdown {
          position:absolute; bottom:calc(100% + 4px); left:0; right:0; z-index:200;
          background:#fff; border:1.5px solid #e2e8f0; border-radius:12px;
          max-height:220px; overflow-y:auto;
          box-shadow:0 -8px 32px rgba(0,0,0,0.12);
        }
        .ap-item {
          width:100%; display:flex; align-items:center; padding:9px 13px;
          background:transparent; border:none; border-bottom:1px solid #f1f5f9;
          cursor:pointer; text-align:left; transition:background 0.12s; gap:6px;
        }
        .ap-item:hover { background:#fff5eb; }
        .ap-item--custom {
          color:#0127FC; font-size:13px; font-weight:600;
          border-bottom:1.5px solid #e2e8f0; background:#f0f4ff;
          gap:8px;
        }
        .ap-item--custom:hover { background:#e0eaff; }
        .ap-item__code  { font-weight:700; color:#FE8100; font-size:13px; flex-shrink:0; min-width:38px; }
        .ap-item__city  { color:#0f172a; font-size:13px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
        .ap-item__name  { color:#94a3b8; font-size:12px; }
        .ap-item__country { font-size:11px; color:#94a3b8; flex-shrink:0; padding-left:6px; }
        .ap-empty { padding:14px 16px; color:#94a3b8; font-size:13px; text-align:center; }

        /* â”€â”€ counter row â”€â”€ */
        .cnt-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 14px; background:#f8fafc; border-radius:10px;
          border:1px solid #e2e8f0;
        }
        .cnt-row__left { display:flex; align-items:center; gap:10px; }
        .cnt-row__label { font-size:13px; color:#0f172a; font-weight:600; }
        .cnt-row__sub   { font-size:11px; color:#94a3b8; }
        .cnt-row__ctrl  { display:flex; align-items:center; gap:10px; }
        .cnt-val { min-width:20px; text-align:center; color:#0f172a; font-weight:700; font-size:15px; }
        .cnt-btn {
          width:28px; height:28px; border-radius:6px; border:1.5px solid;
          font-size:16px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center; transition:all 0.15s;
        }
        .cnt-btn[data-disabled="false"] { border-color:#FE8100; background:#fff5eb; color:#FE8100; }
        .cnt-btn[data-disabled="true"]  { border-color:#e2e8f0; background:#f8fafc; color:#cbd5e1; cursor:not-allowed; }

        /* â”€â”€ summary strip â”€â”€ */
        .em-summary {
          background:linear-gradient(135deg,rgba(1,39,252,0.06),rgba(1,39,252,0.03));
          border:1px solid rgba(1,39,252,0.15); border-radius:12px;
          padding:12px 16px; display:flex; flex-wrap:wrap; gap:8px 16px;
        }
        .em-summary__item { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#334155; }

        /* â”€â”€ actions â”€â”€ */
        .em-actions { display:flex; gap:10px; }
        .em-back-btn {
          flex:0 0 auto; padding:12px 18px; border-radius:10px;
          border:2px solid #e2e8f0; background:#fff; color:#64748b;
          font-weight:700; font-size:14px; cursor:pointer; font-family:inherit;
          transition:border-color 0.2s, color 0.2s;
        }
        .em-back-btn:hover { border-color:#0127FC; color:#0127FC; }
        .em-submit-btn { width:100%; border-radius:10px; padding:12px; font-weight:700; font-size:15px; }
        .em-submit-btn--sending {
          background:linear-gradient(135deg,#FE8100,#FF9A2E); border:none;
          color:#fff; font-family:inherit; cursor:not-allowed; opacity:0.65;
        }
        .em-sending { display:flex; align-items:center; justify-content:center; gap:8px; }
        .em-spin { animation:spin 1s linear infinite; }

        /* â”€â”€ keyframes â”€â”€ */
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes modalIn  {
          from { opacity:0; transform:translateY(20px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        /* â”€â”€ MOBILE â”€â”€ */
        @media (max-width: 600px) {
          .em-overlay { padding: 0; align-items: flex-end; }
          .em-panel {
            border-radius: 20px 20px 0 0;
            max-height: 96dvh;
            max-width: 100%;
          }
          .em-header { padding: 18px 18px 16px; }
          .em-header__title { font-size: 16px; }
          .em-steps { padding: 12px 18px 0; }
          .em-body { padding: 16px 18px 20px; gap: 14px; }
          .em-row { flex-direction: column; gap: 14px; }
          .em-trip-btns { gap: 6px; }
          .em-trip-btn { font-size: 12px; padding: 8px 0; }
          .ap-dropdown { max-height: 180px; }
          .em-actions { flex-direction: column; }
          .em-back-btn { width: 100%; text-align: center; }
          .em-summary { font-size: 12px; }
        }
        @media (max-width: 380px) {
          .em-header__title { font-size: 15px; }
          .cnt-row { padding: 9px 10px; }
        }
      `}</style>
    </div>
  );
}




