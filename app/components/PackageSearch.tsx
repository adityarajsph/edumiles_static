"use client";

import { useState } from "react";
import { MapPin, Calendar, Users, Compass, Search } from "lucide-react";

const travelTypes = ["Any", "Adventure", "Honeymoon", "Family", "Religious", "Luxury", "Weekend"];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px 12px 38px",
  background: "#f8fafc", border: "1.5px solid #e2e8f0",
  borderRadius: 14, fontSize: 14, fontFamily: "'Inter',sans-serif",
  color: "#334155", outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700,
  color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em",
  marginBottom: 8,
};

const iconWrap: React.CSSProperties = {
  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
  pointerEvents: "none", color: "#FE8100",
};

interface PackageSearchProps {
  onOpenContact: (subject?: string) => void;
}

export default function PackageSearch({ onOpenContact }: PackageSearchProps) {
  const [dest, setDest]     = useState("");
  const [date, setDate]     = useState("");
  const [type, setType]     = useState("Any");
  const [guests, setGuests] = useState("2 Adults");

  const handleSearch = () => {
    const subject = dest
      ? `Explore Packages – ${dest}${type !== "Any" ? ` (${type})` : ""}`
      : "Explore Packages";
    onOpenContact(subject);
  };

  return (
    <section id="search" style={{ position: "relative", zIndex: 20, marginTop: -64, padding: "0 24px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: "#fff", borderRadius: 28,
          boxShadow: "0 20px 80px rgba(0,0,0,0.12)",
          border: "1px solid #f1f5f9",
          padding: "36px 36px 32px",
        }}>
          <p style={{
            textAlign: "center", fontSize: 12, fontWeight: 700,
            color: "#FE8100", textTransform: "uppercase", letterSpacing: "0.1em",
            marginBottom: 24,
          }}>
            Find Your Perfect Package
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
            {/* Destination */}
            <div>
              <label style={labelStyle}>Destination</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><MapPin size={15} /></span>
                <input
                  type="text" value={dest} onChange={e => setDest(e.target.value)}
                  placeholder="Where to go?" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#FE8100"; e.target.style.boxShadow = "0 0 0 3px rgba(254,129,0,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label style={labelStyle}>Date</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><Calendar size={15} /></span>
                <input
                  type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#FE8100"; e.target.style.boxShadow = "0 0 0 3px rgba(254,129,0,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Travel type */}
            <div>
              <label style={labelStyle}>Travel Type</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><Compass size={15} /></span>
                <select
                  value={type} onChange={e => setType(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                  onFocus={e => { e.target.style.borderColor = "#FE8100"; e.target.style.boxShadow = "0 0 0 3px rgba(254,129,0,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                >
                  {travelTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Guests */}
            <div>
              <label style={labelStyle}>Guests</label>
              <div style={{ position: "relative" }}>
                <span style={iconWrap}><Users size={15} /></span>
                <select
                  value={guests} onChange={e => setGuests(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                  onFocus={e => { e.target.style.borderColor = "#FE8100"; e.target.style.boxShadow = "0 0 0 3px rgba(254,129,0,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                >
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults + 1 Child</option>
                  <option>2 Adults + 2 Children</option>
                  <option>Group (5+)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={handleSearch} className="btn-primary" style={{ gap: 10 }}>
              <Search size={16} />
              Explore Packages
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
