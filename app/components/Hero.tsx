"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Plane, Hotel, Package, MapPin, Calendar, Users,
  Star, Shield, Award, CheckCircle, Search,
  ChevronDown, ChevronLeft, ChevronRight, Plus, Minus, Baby, User, Briefcase,
} from "lucide-react";
import { AIRPORTS_STATIC, type Airport } from "@/app/data/airports";
import AirportCombobox from "@/app/components/AirportCombobox";
import HeroEnquiryPopup, { type HeroBookingContext } from "@/app/components/HeroEnquiryPopup";

/* ── Portal dropdown: renders at document.body so it's always above everything ── */
interface DropdownPortalProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  children: React.ReactNode;
  width?: number | "anchor"; /* "anchor" = match trigger width */
}

function DropdownPortal({ anchorRef, open, children, width = "anchor" }: DropdownPortalProps) {
  const [pos, setPos] = useState({ top: 0, left: 0, w: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({
      top:  r.bottom + window.scrollY + 8,
      left: r.left   + window.scrollX,
      w:    r.width,
    });
  }, [open, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div style={{
      position: "absolute",
      top:  pos.top,
      left: pos.left,
      width: typeof width === "number" ? width : pos.w,
      zIndex: 99999,
    }}>
      {children}
    </div>,
    document.body
  );
}

/* ── Close on outside click (shared) ── */
function useOutsideClose(
  refs: React.RefObject<HTMLElement | null>[],
  onClose: () => void
) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (refs.every(r => r.current && !r.current.contains(e.target as Node))) {
        onClose();
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);
}

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&q=100&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=100&fit=crop&auto=format",
];

const stats = [
  { num: "500+", label: "Destinations", isStar: false },
  { num: "50K+", label: "Happy Travellers", isStar: false },
  { num: "4.9",  label: "Average Rating", isStar: true },
];

const features = [
  { icon: Plane,  text: "Flights & Packages" },
  { icon: Shield, text: "Zero Hidden Fees" },
  { icon: Award,  text: "4.9 Rated Service" },
];

type TabId = "hotels" | "flights" | "packages";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "hotels",   label: "Hotel",    icon: Hotel   },
  { id: "flights",  label: "Flight",   icon: Plane   },
  { id: "packages", label: "Packages", icon: Package },
];

const TRAVEL_CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];
const TRAVEL_TYPES   = ["Adventure", "Honeymoon", "Family", "Religious", "Luxury", "Weekend"];

interface GuestCounts { adults: number; children: number; infants: number; }
const defaultGuests = (): GuestCounts => ({ adults: 2, children: 0, infants: 0 });

function guestLabel(g: GuestCounts) {
  const parts: string[] = [];
  if (g.adults)   parts.push(`${g.adults} Adult${g.adults > 1 ? "s" : ""}`);
  if (g.children) parts.push(`${g.children} Child${g.children > 1 ? "ren" : ""}`);
  if (g.infants)  parts.push(`${g.infants} Infant${g.infants > 1 ? "s" : ""}`);
  return parts.join(", ") || "Add guests";
}

function formatDate(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const inputBox: React.CSSProperties = {
  width: "100%",
  background: "#f8faff",
  border: "1.5px solid #dfe6f5",
  borderRadius: 12,
  padding: "11px 14px 11px 38px",
  fontSize: 13.5,
  color: "#1e293b",
  fontFamily: "'Inter',sans-serif",
  outline: "none",
  transition: "border-color 0.2s,box-shadow 0.2s",
  cursor: "pointer",
};

interface HeroProps {
  onOpenContact: (subject?: string) => void;
  onOpenEnquiry: () => void;
}

export default function Hero({ onOpenContact, onOpenEnquiry }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [fading,  setFading]  = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCurrent(c => (c + 1) % BG_IMAGES.length); setFading(false); }, 700);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const [activeTab, setActiveTab] = useState<TabId>("hotels");

  const [hotelCity,     setHotelCity]     = useState("");
  const [hotelCheckIn,  setHotelCheckIn]  = useState<Date | null>(null);
  const [hotelCheckOut, setHotelCheckOut] = useState<Date | null>(null);
  const [hotelGuests,   setHotelGuests]   = useState<GuestCounts>(defaultGuests());

  const [flightFrom,  setFlightFrom]  = useState<Airport | null>(null);
  const [flightTo,    setFlightTo]    = useState<Airport | null>(null);
  const [flightDate,  setFlightDate]  = useState<Date | null>(null);
  const [flightClass, setFlightClass] = useState("Economy");
  const [flightGuests,setFlightGuests]= useState<GuestCounts>(defaultGuests());

  const [pkgDest,   setPkgDest]   = useState("");
  const [pkgDate,   setPkgDate]   = useState<Date | null>(null);
  const [pkgType,   setPkgType]   = useState("");
  const [pkgGuests, setPkgGuests] = useState<GuestCounts>(defaultGuests());

  /* ── popup ── */
  const [popupOpen, setPopupOpen]       = useState(false);
  const [popupCtx,  setPopupCtx]        = useState<HeroBookingContext>({ tab: "hotels" });

  const handleSubmit = useCallback(() => {
    /* Build context from current tab state and open the popup */
    const ctx: HeroBookingContext = activeTab === "hotels" ? {
      tab: "hotels",
      hotelCity: hotelCity || undefined,
      checkIn:   hotelCheckIn  ? hotelCheckIn.toLocaleDateString("en-GB")  : undefined,
      checkOut:  hotelCheckOut ? hotelCheckOut.toLocaleDateString("en-GB") : undefined,
      guests:    guestLabel(hotelGuests),
    } : activeTab === "flights" ? {
      tab: "flights",
      from:          flightFrom ? `${flightFrom.city} (${flightFrom.code})` : undefined,
      to:            flightTo   ? `${flightTo.city} (${flightTo.code})`     : undefined,
      departureDate: flightDate ? flightDate.toLocaleDateString("en-GB")    : undefined,
      travelClass:   flightClass,
      guests:        guestLabel(flightGuests),
    } : {
      tab: "packages",
      destination: pkgDest    || undefined,
      travelDate:  pkgDate    ? pkgDate.toLocaleDateString("en-GB") : undefined,
      travelType:  pkgType    || undefined,
      guests:      guestLabel(pkgGuests),
    };
    setPopupCtx(ctx);
    setPopupOpen(true);
  }, [
    activeTab,
    hotelCity, hotelCheckIn, hotelCheckOut, hotelGuests,
    flightFrom, flightTo, flightDate, flightClass, flightGuests,
    pkgDest, pkgDate, pkgType, pkgGuests,
  ]);

  return (
    <section id="home" aria-label="Hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", overflow: "hidden" }}>
      {BG_IMAGES.map((src, i) => (
        <div key={src} aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `url('${src}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: i === current ? (fading ? 0 : 1) : 0, transition: "opacity 0.9s ease" }} />
      ))}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg,rgba(5,20,80,0.48) 0%,rgba(1,39,252,0.18) 35%,rgba(0,5,40,0.62) 100%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse at 50% 25%,transparent 45%,rgba(0,0,0,0.30) 100%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: "6%", left: "-8%", width: 480, height: 480, zIndex: 1, background: "radial-gradient(circle,rgba(254,129,0,0.10) 0%,transparent 65%)", borderRadius: "50%", animation: "blobFloat 9s ease-in-out infinite", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: "8%", right: "-6%", width: 400, height: 400, zIndex: 1, background: "radial-gradient(circle,rgba(1,39,252,0.12) 0%,transparent 65%)", borderRadius: "50%", animation: "blobFloat 12s ease-in-out infinite 3s", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1080, margin: "0 auto", padding: "126px 24px 56px", textAlign: "center" }}>
        <div style={{ animation: "fadeUp 0.5s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,0.13)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 9999, padding: "8px 20px", marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FE8100", boxShadow: "0 0 8px #FE8100", animation: "pulseDot 1.6s ease-in-out infinite", flexShrink: 0 }} />
            <span style={{ color: "rgba(255,255,255,0.92)", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em" }}>Best travel platform — Since 2019</span>
            <span style={{ fontSize: 15 }}>✈️ 🌍</span>
          </div>
        </div>

        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(32px,5vw,62px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 14, letterSpacing: "-0.01em", animation: "fadeUp 0.5s ease 0.10s both" }}>
          Where will your journey<br />
          <span style={{ background: "linear-gradient(135deg,#FE8100 0%,#FF9A2E 55%,#FFD080 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>take you?</span>
        </h1>

        <p style={{ fontSize: "clamp(14px,1.5vw,16px)", color: "rgba(255,255,255,0.70)", maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.8, animation: "fadeUp 0.5s ease 0.18s both" }}>
          Search deals on hotels, flights, and travel packages — all in one place.
        </p>

        <div style={{ animation: "fadeUp 0.5s ease 0.28s both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(100,116,139,0.52)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 9999, padding: "5px 5px", marginBottom: "-22px", position: "relative", zIndex: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button key={id} role="tab" aria-selected={active} onClick={() => { setActiveTab(id); setPopupOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 22px", borderRadius: 9999, border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, background: active ? "#ffffff" : "transparent", color: active ? "#1e293b" : "rgba(255,255,255,0.78)", boxShadow: active ? "0 2px 10px rgba(0,0,0,0.14)" : "none", transition: "all 0.20s ease", whiteSpace: "nowrap" }}>
                  <Icon size={15} color={active ? "#0127FC" : "rgba(255,255,255,0.70)"} />
                  {label}
                </button>
              );
            })}
          </div>

          <div id="hero-booking-card" style={{ background: "rgba(255,255,255,0.98)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", borderRadius: 22, boxShadow: "0 16px 56px rgba(0,0,0,0.22),0 2px 8px rgba(0,0,0,0.10)", border: "1px solid rgba(255,255,255,0.60)", position: "relative", zIndex: 2 }}>
            <div style={{ padding: "36px 24px 24px" }}>
              {activeTab === "hotels"   && <HotelFields   city={hotelCity} setCity={setHotelCity} checkIn={hotelCheckIn} setCheckIn={setHotelCheckIn} checkOut={hotelCheckOut} setCheckOut={setHotelCheckOut} guests={hotelGuests} setGuests={setHotelGuests} submitted={false} onSubmit={handleSubmit} />}
              {activeTab === "flights"  && <FlightFields  from={flightFrom} setFrom={setFlightFrom} to={flightTo} setTo={setFlightTo} date={flightDate} setDate={setFlightDate} travelClass={flightClass} setTravelClass={setFlightClass} guests={flightGuests} setGuests={setFlightGuests} submitted={false} onSubmit={handleSubmit} />}
              {activeTab === "packages" && <PackageFields dest={pkgDest} setDest={setPkgDest} date={pkgDate} setDate={setPkgDate} type={pkgType} setType={setPkgType} guests={pkgGuests} setGuests={setPkgGuests} submitted={false} onSubmit={handleSubmit} />}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 30, animation: "fadeUp 0.5s ease 0.42s both" }}>
          {features.map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.10)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 9999, padding: "7px 18px", color: "rgba(255,255,255,0.84)", fontSize: 13, fontWeight: 500 }}>
              <Icon size={13} color="#FE8100" />{text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", maxWidth: 440, margin: "20px auto 0", animation: "fadeUp 0.5s ease 0.50s both" }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "14px 10px", borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: "clamp(20px,2.6vw,32px)", fontWeight: 900, color: "#FE8100", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                {s.num}{s.isStar && <Star size={13} fill="#FE8100" color="#FE8100" style={{ marginBottom: 2 }} />}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.44)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
        {BG_IMAGES.map((_, i) => (
          <button key={i} onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 700); }} aria-label={`Slide ${i + 1}`} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 9999, border: "none", background: i === current ? "#FE8100" : "rgba(255,255,255,0.35)", cursor: "pointer", padding: 0, transition: "width 0.35s ease,background 0.35s ease", boxShadow: i === current ? "0 0 8px rgba(254,129,0,0.6)" : "none" }} />
        ))}
      </div>

      <HeroStyles />

      <HeroEnquiryPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        context={popupCtx}
      />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CUSTOM CALENDAR PICKER
   - No native <input type="date"> used anywhere
   - Full month grid with prev/next navigation
   - Highlights today, selected date, disables past dates
════════════════════════════════════════════════════════════ */

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function CalendarPicker({ value, onChange, minDate, label }: {
  value: Date | null;
  onChange: (d: Date) => void;
  minDate?: Date;
  label: string;
}) {
  const [open, setOpen]   = useState(false);
  const today             = new Date(); today.setHours(0,0,0,0);
  const [viewYear,  setViewYear]  = useState(value ? value.getFullYear()  : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth()     : today.getMonth());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const ref        = useRef<HTMLDivElement>(null);  // wrapper (for legacy compat)

  useOutsideClose([triggerRef as React.RefObject<HTMLElement | null>, popoverRef as React.RefObject<HTMLElement | null>], () => setOpen(false));

  /* build days grid */
  const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (day: number) =>
    value && value.getFullYear() === viewYear && value.getMonth() === viewMonth && value.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day); d.setHours(0,0,0,0);
    const base = minDate ? new Date(minDate.getTime()) : today;
    base.setHours(0,0,0,0);
    return d < base;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const select = (day: number) => {
    if (isDisabled(day)) return;
    onChange(new Date(viewYear, viewMonth, day));
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      {/* Label */}
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputBox,
          display: "flex", alignItems: "center", gap: 9,
          border: open ? "1.5px solid #0127FC" : "1.5px solid #dfe6f5",
          boxShadow: open ? "0 0 0 3px rgba(1,39,252,0.10)" : "none",
          background: open ? "#fff" : "#f8faff",
          width: "100%",
          padding: "11px 12px",
        }}
      >
        <Calendar size={15} color={open ? "#0127FC" : "#94a3b8"} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, color: value ? "#1e293b" : "#94a3b8", fontFamily: "'Inter',sans-serif" }}>
          {value ? formatDate(value) : "Select date"}
        </span>
        <ChevronDown size={14} color="#94a3b8" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {/* Calendar popover — portaled to body */}
      <DropdownPortal anchorRef={triggerRef as React.RefObject<HTMLElement | null>} open={open} width={300}>
        <div ref={popoverRef} style={{ background: "#fff", borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,0.22)", border: "1px solid #e8edf4", overflow: "hidden" }}>

          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 10px", background: "linear-gradient(135deg,#0127FC,#2563eb)" }}>
            <button type="button" onClick={prevMonth} style={{ width: 30, height: 30, borderRadius: 9999, border: "none", background: "rgba(255,255,255,0.18)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <ChevronLeft size={16} color="#fff" />
            </button>
            <span style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} style={{ width: 30, height: 30, borderRadius: 9999, border: "none", background: "rgba(255,255,255,0.18)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} color="#fff" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 12px 4px", gap: 2 }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#94a3b8", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.04em", padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px 14px", gap: 3 }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={`e${idx}`} />;
              const sel  = !!isSelected(day);
              const tod  = isToday(day);
              const dis  = isDisabled(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => select(day)}
                  disabled={dis}
                  style={{
                    height: 34, borderRadius: 9999, border: "none",
                    background: sel ? "linear-gradient(135deg,#0127FC,#2563eb)" : tod ? "rgba(1,39,252,0.10)" : "transparent",
                    color: sel ? "#fff" : dis ? "#cbd5e1" : tod ? "#0127FC" : "#334155",
                    fontFamily: "'Inter',sans-serif",
                    fontWeight: sel || tod ? 700 : 400,
                    fontSize: 13,
                    cursor: dis ? "not-allowed" : "pointer",
                    boxShadow: sel ? "0 2px 8px rgba(1,39,252,0.30)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!dis && !sel) (e.currentTarget as HTMLButtonElement).style.background = "rgba(1,39,252,0.08)"; }}
                  onMouseLeave={e => { if (!dis && !sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </DropdownPortal>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SHARED FIELD PRIMITIVES
════════════════════════════════════════════════════════════ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
      {children}
    </div>
  );
}

/** Text input with icon */
function TextInput({ label, icon: Icon, placeholder, value, onChange }: {
  label: string; icon: React.ElementType; placeholder: string;
  value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
          <Icon size={15} color={focused ? "#0127FC" : "#94a3b8"} />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...inputBox,
            border: focused ? "1.5px solid #0127FC" : "1.5px solid #dfe6f5",
            boxShadow: focused ? "0 0 0 3px rgba(1,39,252,0.10)" : "none",
            background: focused ? "#fff" : "#f8faff",
          }}
        />
      </div>
    </div>
  );
}

/** Custom styled select dropdown */
function SelectInput({ label, icon: Icon, value, onChange, options, placeholder }: {
  label: string; icon: React.ElementType;
  value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOutsideClose(
    [triggerRef as React.RefObject<HTMLElement | null>, popoverRef as React.RefObject<HTMLElement | null>],
    () => setOpen(false)
  );

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <FieldLabel>{label}</FieldLabel>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputBox,
          display: "flex", alignItems: "center", gap: 8,
          border: open ? "1.5px solid #0127FC" : "1.5px solid #dfe6f5",
          boxShadow: open ? "0 0 0 3px rgba(1,39,252,0.10)" : "none",
          background: open ? "#fff" : "#f8faff",
          width: "100%", padding: "11px 12px",
        }}
      >
        <Icon size={15} color={open ? "#0127FC" : "#94a3b8"} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, color: value ? "#1e293b" : "#94a3b8", fontFamily: "'Inter',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} color="#94a3b8" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      <DropdownPortal anchorRef={triggerRef as React.RefObject<HTMLElement | null>} open={open}>
        <div ref={popoverRef} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.18)", border: "1px solid #e8edf4", overflow: "hidden" }}>
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{ width: "100%", textAlign: "left", padding: "11px 16px", border: "none", background: value === opt ? "rgba(1,39,252,0.07)" : "transparent", cursor: "pointer", fontSize: 13.5, fontFamily: "'Inter',sans-serif", color: value === opt ? "#0127FC" : "#334155", fontWeight: value === opt ? 700 : 400, display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s" }}
              onMouseEnter={e => { if (value !== opt)(e.currentTarget as HTMLButtonElement).style.background = "#f5f8ff"; }}
              onMouseLeave={e => { if (value !== opt)(e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {value === opt && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0127FC", flexShrink: 0 }} />}
              {opt}
            </button>
          ))}
        </div>
      </DropdownPortal>
    </div>
  );
}

/** Guest counter dropdown */
function GuestInput({ value, onChange }: { value: GuestCounts; onChange: (v: GuestCounts) => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOutsideClose(
    [triggerRef as React.RefObject<HTMLElement | null>, popoverRef as React.RefObject<HTMLElement | null>],
    () => setOpen(false)
  );

  const adjust = (key: keyof GuestCounts, delta: number) =>
    onChange({ ...value, [key]: Math.max(key === "adults" ? 1 : 0, value[key] + delta) });

  const rows: { key: keyof GuestCounts; label: string; sub: string; icon: React.ElementType }[] = [
    { key: "adults",   label: "Adults",   sub: "Age 13+",  icon: User  },
    { key: "children", label: "Children", sub: "Age 2–12", icon: Users },
    { key: "infants",  label: "Infants",  sub: "Under 2",  icon: Baby  },
  ];

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <FieldLabel>Guests</FieldLabel>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputBox,
          display: "flex", alignItems: "center", gap: 8,
          border: open ? "1.5px solid #0127FC" : "1.5px solid #dfe6f5",
          boxShadow: open ? "0 0 0 3px rgba(1,39,252,0.10)" : "none",
          background: open ? "#fff" : "#f8faff",
          width: "100%", padding: "11px 12px",
        }}
      >
        <Users size={15} color={open ? "#0127FC" : "#94a3b8"} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, color: "#1e293b", fontFamily: "'Inter',sans-serif" }}>
          {guestLabel(value)}
        </span>
        <ChevronDown size={14} color="#94a3b8" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      <DropdownPortal anchorRef={triggerRef as React.RefObject<HTMLElement | null>} open={open} width={290}>
        <div ref={popoverRef} style={{ background: "#fff", borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,0.20)", border: "1px solid #e8edf4", padding: "8px 0 4px" }}>
          {rows.map(({ key, label, sub, icon: RowIcon }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", padding: "12px 18px", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(1,39,252,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <RowIcon size={16} color="#0127FC" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", fontFamily: "'Poppins',sans-serif" }}>{label}</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "'Inter',sans-serif" }}>{sub}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button type="button" onClick={() => adjust(key, -1)} disabled={value[key] <= (key === "adults" ? 1 : 0)} style={{ width: 30, height: 30, borderRadius: 9999, border: "1.5px solid #e2eaff", background: value[key] <= (key === "adults" ? 1 : 0) ? "#f5f8ff" : "#fff", cursor: value[key] <= (key === "adults" ? 1 : 0) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: value[key] <= (key === "adults" ? 1 : 0) ? 0.4 : 1 }}>
                  <Minus size={13} color="#0127FC" />
                </button>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", minWidth: 20, textAlign: "center", fontFamily: "'Poppins',sans-serif" }}>{value[key]}</span>
                <button type="button" onClick={() => adjust(key, 1)} style={{ width: 30, height: 30, borderRadius: 9999, border: "none", background: "linear-gradient(135deg,#2563eb,#0127FC)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(1,39,252,0.30)" }}>
                  <Plus size={13} color="#fff" />
                </button>
              </div>
            </div>
          ))}
          <div style={{ padding: "8px 18px 12px" }}>
            <button type="button" onClick={() => setOpen(false)} style={{ width: "100%", padding: "11px 0", background: "linear-gradient(135deg,#2563eb,#0127FC)", color: "#fff", border: "none", borderRadius: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(1,39,252,0.30)" }}>
              Done
            </button>
          </div>
        </div>
      </DropdownPortal>
    </div>
  );
}

/** Submit button */
function SubmitBtn({ submitted, onClick }: { submitted: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="hero-submit-btn" aria-label="Submit" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: submitted ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#2563eb,#0127FC)", color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, padding: "0 28px", height: 50, borderRadius: 50, border: "none", cursor: "pointer", whiteSpace: "nowrap", alignSelf: "flex-end", boxShadow: submitted ? "0 8px 24px rgba(34,197,94,0.38)" : "0 8px 28px rgba(1,39,252,0.40)", transition: "all 0.24s ease", minWidth: 120, flexShrink: 0 }}>
      {submitted ? <><CheckCircle size={16} /> Sent!</> : <><Search size={16} /> Submit</>}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB PANELS
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   TAB PANELS
════════════════════════════════════════════════════════════ */

function HotelFields({ city, setCity, checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests, submitted, onSubmit }: {
  city: string; setCity: (v: string) => void;
  checkIn: Date | null; setCheckIn: (d: Date) => void;
  checkOut: Date | null; setCheckOut: (d: Date) => void;
  guests: GuestCounts; setGuests: (v: GuestCounts) => void;
  submitted: boolean; onSubmit: () => void;
}) {
  const today = new Date(); today.setHours(0,0,0,0);
  return (
    <div className="hf-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1.1fr auto", gap: 14, alignItems: "end" }}>
      <TextInput label="Select a city" icon={MapPin} placeholder="Where are you going?" value={city} onChange={setCity} />
      <CalendarPicker label="Check in"  value={checkIn}  onChange={setCheckIn}  minDate={today} />
      <CalendarPicker label="Check out" value={checkOut} onChange={setCheckOut} minDate={checkIn || today} />
      <GuestInput value={guests} onChange={setGuests} />
      <SubmitBtn submitted={submitted} onClick={onSubmit} />
    </div>
  );
}

function FlightFields({ from, setFrom, to, setTo, date, setDate, travelClass, setTravelClass, guests, setGuests, submitted, onSubmit }: {
  from: Airport | null; setFrom: (v: Airport | null) => void;
  to:   Airport | null; setTo:   (v: Airport | null) => void;
  date: Date | null; setDate: (d: Date) => void;
  travelClass: string; setTravelClass: (v: string) => void;
  guests: GuestCounts; setGuests: (v: GuestCounts) => void;
  submitted: boolean; onSubmit: () => void;
}) {
  const today = new Date(); today.setHours(0,0,0,0);
  return (
    <div className="hf-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", gap: 14, alignItems: "end" }}>
      <AirportCombobox label="From" placeholder="City or airport" value={from} onChange={setFrom} excludeCode={to?.code} />
      <AirportCombobox label="To"   placeholder="City or airport" value={to}   onChange={setTo}   excludeCode={from?.code} />
      <CalendarPicker label="Departure" value={date} onChange={setDate} minDate={today} />
      <SelectInput label="Travel Class" icon={Briefcase} value={travelClass} onChange={setTravelClass} options={TRAVEL_CLASSES} placeholder="Economy" />
      <GuestInput value={guests} onChange={setGuests} />
      <SubmitBtn submitted={submitted} onClick={onSubmit} />
    </div>
  );
}

function PackageFields({ dest, setDest, date, setDate, type, setType, guests, setGuests, submitted, onSubmit }: {
  dest: string; setDest: (v: string) => void;
  date: Date | null; setDate: (d: Date) => void;
  type: string; setType: (v: string) => void;
  guests: GuestCounts; setGuests: (v: GuestCounts) => void;
  submitted: boolean; onSubmit: () => void;
}) {
  const today = new Date(); today.setHours(0,0,0,0);
  return (
    <div className="hf-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr auto", gap: 14, alignItems: "end" }}>
      <TextInput label="Destination" icon={MapPin} placeholder="Where do you want to go?" value={dest} onChange={setDest} />
      <CalendarPicker label="Travel Date" value={date} onChange={setDate} minDate={today} />
      <SelectInput label="Travel Type" icon={Package} value={type} onChange={setType} options={TRAVEL_TYPES} placeholder="Any type" />
      <GuestInput value={guests} onChange={setGuests} />
      <SubmitBtn submitted={submitted} onClick={onSubmit} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   GLOBAL STYLES
════════════════════════════════════════════════════════════ */
function HeroStyles() {
  return (
    <style>{`
      @keyframes blobFloat {
        0%,100% { transform:translateY(0) scale(1); }
        50%      { transform:translateY(-22px) scale(1.03); }
      }
      @keyframes pulseDot {
        0%,100% { opacity:1; transform:scale(1); }
        50%      { opacity:.4; transform:scale(1.5); }
      }
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(24px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .hero-submit-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 14px 36px rgba(1,39,252,0.52) !important;
      }
      /* responsive */
      @media (max-width: 1024px) {
        .hf-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        .hf-grid > button:last-child,
        .hf-grid > *:last-child { grid-column: 1 / -1; justify-self: stretch; }
      }
      @media (max-width: 640px) {
        .hf-grid { grid-template-columns: 1fr !important; }
        #hero-booking-card { border-radius: 16px !important; }
      }
    `}</style>
  );
}
