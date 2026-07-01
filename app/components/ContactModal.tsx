"use client";

import { useState, useEffect, useRef } from "react";
import {
  X, User, Mail, Phone, MapPin, MessageSquare,
  Send, CheckCircle, ChevronDown, Loader2,
} from "lucide-react";

const WEB3FORMS_KEY = "c8845256-7de7-475d-a9ec-4f5a046fec6d";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional pre-filled subject, e.g. "Book Now – Golden Triangle Tour" */
  subject?: string;
}

const interests = [
  "Adventure Tours",
  "Honeymoon Packages",
  "Family Holidays",
  "Religious Yatra",
  "Luxury Escapes",
  "Weekend Getaways",
  "Custom Package",
  "General Enquiry",
];

export default function ContactModal({ open, onClose, subject }: ContactModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    interest: subject || "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone]       = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const overlayRef            = useRef<HTMLDivElement>(null);

  /* Full reset every time the modal opens */
  useEffect(() => {
    if (open) {
      setDone(false);
      setSending(false);
      setErrors({});
      setApiError("");
      setForm({
        name: "",
        email: "",
        phone: "",
        destination: "",
        interest: subject || "",
        message: "",
      });
    }
  }, [open, subject]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                                         e.name  = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))   e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid 10-digit phone required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;          // guard against double submission
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    setApiError("");

    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: form.interest
          ? `New Enquiry – ${form.interest} | EdumilesTravels`
          : "New Travel Enquiry | EdumilesTravels",
        from_name: "EdumilesTravels Website",
        name: form.name,
        email: form.email,
        phone: form.phone,
        destination: form.destination || "Not specified",
        package_type: form.interest  || "Not specified",
        message: form.message        || "No message provided",
        botcheck: "",   // honeypot — must be empty
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setDone(true);
      } else {
        setApiError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => { const n = { ...er }; delete n[field]; return n; });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: "fadeIn 0.25s ease",
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact form"
        style={{
          position: "fixed", inset: 0, zIndex: 1001,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
          pointerEvents: "none",
        }}
      >
        <div style={{
          pointerEvents: "auto",
          width: "100%", maxWidth: 560,
          maxHeight: "92dvh",
          background: "#fff",
          borderRadius: 28,
          boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column",
          animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}>

          {/* ── Header ── */}
          <div style={{
            background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
            padding: "28px 28px 24px",
            position: "relative",
            flexShrink: 0,
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.28) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />

            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute", top: 16, right: 16,
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
                zIndex: 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              <X size={16} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(254,129,0,0.45)",
                flexShrink: 0,
              }}>
                <MessageSquare size={20} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1.2 }}>
                  Plan Your Journey
                </h2>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 2 }}>
                  Our travel experts will get back to you within 2 hours
                </p>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px 28px" }}>

            {done ? (
              /* ── Success state ── */
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", textAlign: "center",
                padding: "40px 16px", gap: 16,
                animation: "fadeIn 0.4s ease",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(16,185,129,0.35)",
                  animation: "popIn 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}>
                  <CheckCircle size={32} color="#fff" />
                </div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0127FC" }}>
                  Request Received!
                </h3>
                <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>
                  Thank you, <strong>{form.name.split(" ")[0]}</strong>! Our travel expert will contact you within{" "}
                  <strong style={{ color: "#FE8100" }}>2 hours</strong>.
                </p>
                <button onClick={onClose} className="btn-primary" style={{ marginTop: 8 }}>
                  Close
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot — hidden from users, catches bots */}
                <input type="checkbox" name="botcheck" style={{ display: "none" }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                  {/* Name */}
                  <Field label="Full Name" error={errors.name} icon={<User size={14} color="#FE8100" />} style={{ gridColumn: "1 / -1" }}>
                    <input
                      type="text" value={form.name} onChange={set("name")}
                      placeholder="Ravi Sharma"
                      style={inputStyle(!!errors.name)}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </Field>

                  {/* Email */}
                  <Field label="Email Address" error={errors.email} icon={<Mail size={14} color="#FE8100" />}>
                    <input
                      type="email" value={form.email} onChange={set("email")}
                      placeholder="ravi@example.com"
                      style={inputStyle(!!errors.email)}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </Field>

                  {/* Phone */}
                  <Field label="Phone Number" error={errors.phone} icon={<Phone size={14} color="#FE8100" />}>
                    <input
                      type="tel" value={form.phone} onChange={set("phone")}
                      placeholder="+91 98765 43210"
                      style={inputStyle(!!errors.phone)}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </Field>

                  {/* Destination */}
                  <Field label="Dream Destination" icon={<MapPin size={14} color="#FE8100" />}>
                    <input
                      type="text" value={form.destination} onChange={set("destination")}
                      placeholder="e.g. Goa, Kerala, Manali…"
                      style={inputStyle(false)}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </Field>

                  {/* Interest */}
                  <Field label="Package Type" icon={<ChevronDown size={14} color="#FE8100" />}>
                    <select
                      value={form.interest} onChange={set("interest")}
                      style={{ ...inputStyle(false), appearance: "none", cursor: "pointer" }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    >
                      <option value="">Select type…</option>
                      {interests.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field label="Message (optional)" icon={<MessageSquare size={14} color="#FE8100" />} style={{ gridColumn: "1 / -1" }}>
                    <textarea
                      value={form.message} onChange={set("message")}
                      placeholder="Tell us your travel dates, budget, special requirements…"
                      rows={3}
                      style={{ ...inputStyle(false), resize: "none", paddingTop: 10 }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </Field>
                </div>

                {/* API-level error */}
                {apiError && (
                  <div style={{
                    marginTop: 14, padding: "12px 16px",
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: 12, color: "#dc2626", fontSize: 13,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <X size={14} /> {apiError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary"
                  style={{
                    width: "100%", marginTop: 20, justifyContent: "center",
                    fontSize: 15, padding: "14px",
                    opacity: sending ? 0.85 : 1,
                    cursor: sending ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                >
                  {sending
                    ? <><Loader2 size={17} style={{ animation: "spin 0.8s linear infinite" }} /> Sending…</>
                    : <><Send size={17} /> Send Enquiry</>}
                </button>

                <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 11, marginTop: 12 }}>
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; }                                                    to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.97); }           to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes popIn   { from { transform: scale(0.5); opacity: 0; }                             to { transform: scale(1); opacity: 1; } }
        @keyframes spin    { to   { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

/* ─── Helpers ─── */

function Field({
  label, error, icon, children, style,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <label style={{
        fontSize: 11, fontWeight: 700, color: "#64748b",
        textTransform: "uppercase", letterSpacing: "0.07em",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
            pointerEvents: "none", display: "flex", alignItems: "center",
            zIndex: 1,
          }}>{icon}</span>
        )}
        {children}
      </div>
      {error && (
        <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 500 }}>{error}</span>
      )}
    </div>
  );
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "10px 12px 10px 34px",
  background: "#f8fafc",
  border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
  borderRadius: 12,
  fontSize: 14,
  fontFamily: "'Inter',sans-serif",
  color: "#334155",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
});

const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#0127FC";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(1,39,252,0.12)";
  e.currentTarget.style.background  = "#fff";
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#e2e8f0";
  e.currentTarget.style.boxShadow   = "none";
  e.currentTarget.style.background  = "#f8fafc";
};
