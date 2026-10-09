"use client";

/**
 * AirportCombobox
 *
 * A searchable airport picker that:
 *  - Shows top large airports on first focus
 *  - Queries /api/airports with 300ms debounce as the user types
 *  - Falls back to the static list if the API is unavailable
 *  - Renders its dropdown via ReactDOM.createPortal so it floats above
 *    any containing card/stacking-context (no z-index fights)
 *
 * Props:
 *   label        — field label text
 *   placeholder  — input placeholder
 *   value        — currently selected Airport (or null)
 *   onChange     — called with the new Airport (or null when cleared)
 *   excludeCode  — IATA code to omit from results (e.g. the opposite field)
 *   error        — error message shown below the input
 *   variant      — "hero" (compact, inside booking card) | "modal" (full-width inside form)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plane, ChevronDown, X } from "lucide-react";
import { searchAirports, AIRPORTS_STATIC, type Airport } from "@/app/data/airports";

export type { Airport };

interface Props {
  label:        string;
  placeholder:  string;
  value:        Airport | null;
  onChange:     (a: Airport | null) => void;
  excludeCode?: string;
  error?:       string;
  variant?:     "hero" | "modal";
}

export default function AirportCombobox({
  label, placeholder, value, onChange, excludeCode, error, variant = "hero",
}: Props) {
  const [query,   setQuery]   = useState("");
  const [open,    setOpen]    = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);
  const debounce   = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── position portal ── */
  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + window.scrollY + 6, left: r.left + window.scrollX, width: r.width });
  }, []);

  /* ── outside click ── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropRef.current    && !dropRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── scroll/resize ── */
  useEffect(() => {
    if (!open) return;
    const h = () => updatePos();
    window.addEventListener("scroll", h, true);
    window.addEventListener("resize", h);
    return () => { window.removeEventListener("scroll", h, true); window.removeEventListener("resize", h); };
  }, [open, updatePos]);

  /* ── search with debounce ── */
  useEffect(() => {
    if (!open) return;
    if (debounce.current) clearTimeout(debounce.current);

    if (!query.trim()) {
      // Show top large airports instantly from static list
      const top = AIRPORTS_STATIC.filter(a => a.iata !== excludeCode).slice(0, 15);
      setResults(top);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounce.current = setTimeout(async () => {
      const res = await searchAirports(query, 20);
      setResults(res.filter(a => a.iata !== excludeCode));
      setLoading(false);
    }, 300);

    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [query, open, excludeCode]);

  const handleFocus = () => {
    updatePos();
    setOpen(true);
    setQuery("");
    // Pre-populate static results immediately
    const top = AIRPORTS_STATIC.filter(a => a.iata !== excludeCode).slice(0, 15);
    setResults(top);
  };

  const select = (a: Airport) => {
    onChange(a);
    setQuery("");
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const displayVal = open ? query : value ? `${value.city} (${value.iata})` : "";

  /* ── styles ── */
  const isHero = variant === "hero";

  const wrapStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    flex: 1,
    minWidth: 0,
  };

  const labelStyle: React.CSSProperties = isHero ? {
    fontSize: 11.5, fontWeight: 700, color: "#475569",
    fontFamily: "'Poppins',sans-serif", letterSpacing: "0.06em",
    textTransform: "uppercase",
  } : {
    fontSize: 12, fontWeight: 700, color: "#475569",
    textTransform: "uppercase", letterSpacing: "0.04em",
    fontFamily: "'Poppins',sans-serif",
  };

  const inputStyle: React.CSSProperties = isHero ? {
    width: "100%", background: open ? "#fff" : "#f8faff",
    border: `1.5px solid ${error ? "#ef4444" : open ? "#0127FC" : "#dfe6f5"}`,
    borderRadius: 12, padding: "11px 32px 11px 32px",
    fontSize: 13.5, color: value && !open ? "#1e293b" : "#94a3b8",
    fontFamily: "'Inter',sans-serif", outline: "none",
    boxShadow: open ? "0 0 0 3px rgba(1,39,252,0.10)" : "none",
    transition: "border-color 0.2s,box-shadow 0.2s,background 0.2s",
    cursor: "text",
  } : {
    width: "100%", background: "#fff",
    border: `1.5px solid ${error ? "#ef4444" : open ? "#0127FC" : "#e2e8f0"}`,
    borderRadius: 10, padding: "11px 36px 11px 36px",
    fontSize: 14, color: value && !open ? "#0f172a" : "#94a3b8",
    fontFamily: "inherit", outline: "none",
    boxShadow: open ? "0 0 0 3px rgba(1,39,252,0.10)" : "none",
    transition: "border-color 0.2s,box-shadow 0.2s",
    cursor: "text",
  };

  return (
    <div style={wrapStyle}>
      <label style={labelStyle}>{label}</label>

      <div ref={triggerRef} style={{ position: "relative" }}>
        {/* Left icon */}
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
          <Plane size={14} color={open ? "#0127FC" : error ? "#ef4444" : "#94a3b8"} />
        </span>

        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={value && !open ? "" : placeholder}
          value={displayVal}
          onFocus={handleFocus}
          onChange={e => { setQuery(e.target.value); if (!open) { updatePos(); setOpen(true); } }}
          style={inputStyle}
        />

        {/* Right: clear button or chevron */}
        {value && !open ? (
          <button type="button" onClick={clear} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2, color: "#94a3b8" }}>
            <X size={13} />
          </button>
        ) : (
          <span style={{ position: "absolute", right: 10, top: "50%", transform: `translateY(-50%) ${open ? "rotate(180deg)" : ""}`, pointerEvents: "none", transition: "transform 0.2s" }}>
            <ChevronDown size={13} color="#94a3b8" />
          </span>
        )}
      </div>

      {error && <p style={{ color: "#ef4444", fontSize: 11.5, margin: 0, fontFamily: "'Inter',sans-serif" }}>{error}</p>}

      {/* Portal dropdown */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={dropRef}
          style={{
            position: "absolute",
            top:   dropPos.top,
            left:  dropPos.left,
            width: Math.max(dropPos.width, 280),
            zIndex: 99999,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
            border: "1px solid #e8edf4",
            overflow: "hidden",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {/* Loading */}
          {loading && (
            <div style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #e2e8f0", borderTopColor: "#0127FC", display: "inline-block", animation: "airportSpin 0.7s linear infinite" }} />
              Searching airports…
            </div>
          )}

          {/* No results */}
          {!loading && results.length === 0 && (
            <div style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8", fontFamily: "'Inter',sans-serif" }}>
              No airports found for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Hint when no query */}
          {!loading && results.length > 0 && !query && (
            <div style={{ padding: "8px 14px 4px", fontSize: 11, fontWeight: 700, color: "#94a3b8", fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #f1f5f9" }}>
              Popular airports
            </div>
          )}

          {/* Results */}
          {!loading && results.map(a => (
            <button
              key={a.iata}
              type="button"
              onMouseDown={e => { e.preventDefault(); select(a); }}
              style={{
                width: "100%", textAlign: "left", padding: "10px 14px",
                border: "none", background: "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                transition: "background 0.12s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f5f8ff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {/* IATA badge */}
              <span style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                color: "#0127FC", fontSize: 11,
                background: "rgba(1,39,252,0.08)", borderRadius: 7,
                padding: "3px 7px", flexShrink: 0, letterSpacing: "0.04em",
              }}>
                {a.iata}
              </span>

              {/* City + name */}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b", fontFamily: "'Inter',sans-serif", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.city}
                </span>
                <span style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "'Inter',sans-serif", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.name}
                </span>
              </span>

              {/* Country */}
              <span style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "'Inter',sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>
                {a.country}
              </span>
            </button>
          ))}

          <style>{`
            @keyframes airportSpin { to { transform: rotate(360deg); } }
            /* custom scrollbar */
            div::-webkit-scrollbar { width: 4px; }
            div::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
          `}</style>
        </div>,
        document.body
      )}
    </div>
  );
}
