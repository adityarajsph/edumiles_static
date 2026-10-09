"use client";

import { useState } from "react";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MapPin, Phone, Mail, Clock,
  User, MessageSquare, Send, CheckCircle, ChevronDown, Loader2, X,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

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

const socials = [
  { label: "Instagram", Icon: FaInstagram, href: "https://www.instagram.com/edumilestravel/",                           color: "#e1306c" },
  { label: "Facebook",  Icon: FaFacebookF, href: "https://www.facebook.com/profile.php?id=61591224146233",              color: "#1877f2" },
  { label: "YouTube",   Icon: FaYoutube,   href: "https://www.youtube.com/@EdumilesTravel",                             color: "#ff0000" },
];

const contactInfo = [
  {
    Icon: MapPin,
    title: "Visit Our Office",
    lines: ["Unit No - 806, KLJ TOWER,", "Netaji Subhash Place, Shakurpur,", "New Delhi, Delhi – 110034"],
    href: "https://maps.google.com/?q=KLJ+Tower+Netaji+Subhash+Place+New+Delhi",
    linkLabel: "Get Directions",
    bg: "#fff7ed", iconBg: "#FE8100",
  },
  {
    Icon: Phone,
    title: "Call Us",
    lines: ["+91 87966 73667"],
    href: "tel:+918796673667",
    linkLabel: "Call Now",
    bg: "#eff6ff", iconBg: "#0127FC",
  },
  {
    Icon: Mail,
    title: "Email Us",
    lines: ["edumilestravel@gmail.com"],
    href: "mailto:edumilestravel@gmail.com",
    linkLabel: "Send Email",
    bg: "#f0fdf4", iconBg: "#059669",
  },
  {
    Icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Sat: 9 AM – 7 PM", "Sunday: 10 AM – 4 PM"],
    href: null,
    linkLabel: null,
    bg: "#f5f3ff", iconBg: "#7c3aed",
  },
];

/* ─── Input helpers ─────────────────────────────────── */
const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px 14px 12px 38px",
  background: "#f8fafc",
  border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
  borderRadius: 12,
  fontSize: 15,
  fontFamily: "'Inter',sans-serif",
  color: "#334155",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
});

const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#0127FC";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(1,39,252,0.1)";
  e.currentTarget.style.background  = "#fff";
};

const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "#e2e8f0";
  e.currentTarget.style.boxShadow   = "none";
  e.currentTarget.style.background  = "#f8fafc";
};

function Field({
  label, error, icon, children, full,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : undefined }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center", zIndex: 1 }}>
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 500 }}>{error}</span>}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", destination: "", interest: "", message: "" });
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [sending, setSending]   = useState(false);
  const [done, setDone]         = useState(false);
  const [apiError, setApiError] = useState("");
  const { ref, isVisible }      = useScrollAnimation();

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(er => { const n = { ...er }; delete n[field]; return n; });
    };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                                             e.name  = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))       e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid 10-digit phone required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
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
        package_type: form.interest   || "Not specified",
        message: form.message         || "No message provided",
        botcheck: "",
      };
      const res  = await fetchWithTimeout("https://api.web3forms.com/submit", {
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
            formName: "Contact Form",
            formSlug: "contact-form",
            data: {
              name:         form.name,
              email:        form.email,
              phone:        form.phone,
              destination:  form.destination || "",
              package_type: form.interest    || "",
              message:      form.message     || "",
            },
            sourcePage: typeof window !== "undefined" ? window.location.pathname : "/contact",
          }),
        }).catch(() => {});
      }
      else { setApiError(data.message || "Something went wrong. Please try again."); }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section style={{
          background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
          padding: "140px 24px 80px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.25) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <span className="section-tag" style={{ color: "#FE8100" }}>Get In Touch</span>
            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(32px,5vw,60px)", color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
              Contact Us
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>
              Have a question or ready to plan your next trip? Our travel experts are here to help.
            </p>
          </div>
        </section>

        {/* ── Contact Cards ── */}
        <section style={{ padding: "80px 24px 0", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
              {contactInfo.map((c, i) => (
                <div
                  key={c.title}
                  ref={i === 0 ? ref : undefined}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(28px)",
                    transition: `all 0.6s ease ${i * 100}ms`,
                  }}
                >
                  <div className="card" style={{ padding: "28px 24px", height: "100%", background: c.bg }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                      <c.Icon size={22} color={c.iconBg} />
                    </div>
                    <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 8 }}>{c.title}</h3>
                    {c.lines.map(line => (
                      <p key={line} style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{line}</p>
                    ))}
                    {c.href && c.linkLabel && (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        style={{ display: "inline-block", marginTop: 12, color: c.iconBg, fontWeight: 700, fontSize: 13, textDecoration: "none" }}
                      >
                        {c.linkLabel} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form + Map ── */}
        <section style={{ padding: "64px 24px 96px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 40, alignItems: "start" }}>

              {/* ── Form ── */}
              <div className="card" style={{ padding: "40px 36px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 100%)", margin: "-40px -36px 32px", padding: "28px 36px", position: "relative" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.3) 0%,transparent 70%)", pointerEvents: "none" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FE8100,#FF9A2E)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(254,129,0,0.4)" }}>
                      <MessageSquare size={20} color="#fff" />
                    </div>
                    <div>
                      <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1.2 }}>Plan Your Journey</h2>
                      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>We reply within 2 hours</p>
                    </div>
                  </div>
                </div>

                {done ? (
                  /* Success */
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 0", gap: 14 }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(16,185,129,0.35)" }}>
                      <CheckCircle size={32} color="#fff" />
                    </div>
                    <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0127FC" }}>Message Sent!</h3>
                    <p style={{ color: "#64748b", lineHeight: 1.7, maxWidth: 320 }}>
                      Thanks, <strong>{form.name.split(" ")[0]}</strong>! Our expert will contact you within{" "}
                      <strong style={{ color: "#FE8100" }}>2 hours</strong>.
                    </p>
                    <button
                      onClick={() => { setDone(false); setForm({ name: "", email: "", phone: "", destination: "", interest: "", message: "" }); }}
                      className="btn-primary"
                      style={{ marginTop: 8 }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <input type="checkbox" name="botcheck" style={{ display: "none" }} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <Field label="Full Name" error={errors.name} icon={<User size={14} color="#FE8100" />} full>
                        <input
                          type="text" value={form.name} onChange={set("name")}
                          placeholder="Ravi Sharma"
                          style={inputStyle(!!errors.name)}
                          onFocus={focusStyle} onBlur={blurStyle}
                        />
                      </Field>

                      <Field label="Email Address" error={errors.email} icon={<Mail size={14} color="#FE8100" />}>
                        <input
                          type="email" value={form.email} onChange={set("email")}
                          placeholder="ravi@example.com"
                          style={inputStyle(!!errors.email)}
                          onFocus={focusStyle} onBlur={blurStyle}
                        />
                      </Field>

                      <Field label="Phone Number" error={errors.phone} icon={<Phone size={14} color="#FE8100" />}>
                        <input
                          type="tel" value={form.phone} onChange={set("phone")}
                          placeholder="+91 98765 43210"
                          style={inputStyle(!!errors.phone)}
                          onFocus={focusStyle} onBlur={blurStyle}
                        />
                      </Field>

                      <Field label="Dream Destination" icon={<MapPin size={14} color="#FE8100" />}>
                        <input
                          type="text" value={form.destination} onChange={set("destination")}
                          placeholder="e.g. Goa, Manali, Kashmir…"
                          style={inputStyle(false)}
                          onFocus={focusStyle} onBlur={blurStyle}
                        />
                      </Field>

                      <Field label="Package Type" icon={<ChevronDown size={14} color="#FE8100" />} full>
                        <select
                          value={form.interest} onChange={set("interest")}
                          style={{ ...inputStyle(false), appearance: "none", cursor: "pointer" }}
                          onFocus={focusStyle} onBlur={blurStyle}
                        >
                          <option value="">Select type…</option>
                          {interests.map(i => <option key={i}>{i}</option>)}
                        </select>
                      </Field>

                      <Field label="Message (optional)" icon={<MessageSquare size={14} color="#FE8100" />} full>
                        <textarea
                          value={form.message} onChange={set("message")}
                          placeholder="Tell us your travel dates, group size, special requests…"
                          rows={4}
                          style={{ ...inputStyle(false), resize: "none", paddingTop: 12 }}
                          onFocus={focusStyle} onBlur={blurStyle}
                        />
                      </Field>
                    </div>

                    {apiError && (
                      <div style={{ marginTop: 14, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                        <X size={14} /> {apiError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-primary"
                      style={{ width: "100%", marginTop: 20, justifyContent: "center", opacity: sending ? 0.85 : 1, cursor: sending ? "not-allowed" : "pointer" }}
                    >
                      {sending
                        ? <><Loader2 size={17} style={{ animation: "spin 0.8s linear infinite" }} /> Sending…</>
                        : <><Send size={17} /> Send Enquiry</>}
                    </button>
                    <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 11, marginTop: 10 }}>
                      We respect your privacy. No spam, ever.
                    </p>
                  </form>
                )}
              </div>

              {/* ── Right column: Map + Socials ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Map embed */}
                <div className="card" style={{ overflow: "hidden", height: 320 }}>
                  <iframe
                    title="EdumilesTravels Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.6451093577!2d77.15247!3d28.69505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d01d7c2e3b7b3%3A0x5e8c4b2e8f7c9a1!2sKLJ%20Tower%2C%20Netaji%20Subhash%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Social links */}
                <div className="card" style={{ padding: "28px 28px" }}>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16, color: "#0127FC", marginBottom: 18 }}>
                    Follow Our Journeys
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {socials.map(({ label, Icon, href, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: 14,
                          padding: "14px 18px", borderRadius: 14,
                          background: "#f8fafc", border: "1.5px solid #f1f5f9",
                          textDecoration: "none", transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = color + "12"; e.currentTarget.style.borderColor = color + "44"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
                      >
                        <div style={{ width: 38, height: 38, borderRadius: 11, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={18} color={color} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{label}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>@edumilestravel</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick contact card */}
                <div style={{ background: "linear-gradient(135deg,#FE8100,#FF9A2E)", borderRadius: 24, padding: "28px 28px" }}>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#fff", marginBottom: 10 }}>
                    Prefer to call us?
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                    Our travel consultants are available Mon–Sat, 9 AM to 7 PM.
                  </p>
                  <a
                    href="tel:+918796673667"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "#fff", color: "#FE8100",
                      fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15,
                      padding: "12px 24px", borderRadius: 9999, textDecoration: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Phone size={16} /> +91 87966 73667
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "80px 24px 96px", background: "#fff" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-tag">Common Questions</span>
              <h2 className="section-title">FAQs</h2>
              <div className="section-divider" />
            </div>
            {[
              { q: "How quickly do you respond to enquiries?", a: "We typically respond within 2 hours during business hours (Mon–Sat, 9 AM–7 PM). For urgent queries, please call us directly." },
              { q: "Can I customise an existing package?", a: "Absolutely! Every package can be fully tailored — duration, hotels, activities and budget. Just mention your preferences in the message." },
              { q: "Is there an advance payment required to confirm a booking?", a: "We require a small advance (usually 20–30%) to confirm your booking. The balance is collected closer to the travel date." },
              { q: "Do you offer group discounts?", a: "Yes — groups of 6 or more receive special rates. Contact us with your group size and destination for a customised quote." },
              { q: "What if I need to cancel or reschedule?", a: "We offer a flexible cancellation and rescheduling policy. Terms vary by package — our team will walk you through the details at the time of booking." },
            ].map(({ q, a }) => (
              <FaqItem key={q} question={q} answer={a} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

/* ─── FAQ accordion ─────────────────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 16, border: "1.5px solid #e2e8f0", marginBottom: 12, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", background: open ? "#f8fafc" : "#fff",
          border: "none", cursor: "pointer", textAlign: "left", gap: 16,
          transition: "background 0.2s",
        }}
      >
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, color: open ? "#0127FC" : "#0f172a" }}>
          {question}
        </span>
        <ChevronDown
          size={18}
          color="#0127FC"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease" }}
        />
      </button>
      <div style={{
        maxHeight: open ? 200 : 0,
        overflow: "hidden",
        transition: "max-height 0.35s ease",
      }}>
        <div style={{ padding: "0 24px 18px", color: "#475569", fontSize: 14, lineHeight: 1.75 }}>
          {answer}
        </div>
      </div>
    </div>
  );
}
