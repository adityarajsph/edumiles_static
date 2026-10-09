"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, X, ChevronLeft, ChevronRight, Loader2,
  Download, Eye, CheckCircle, Phone, XCircle, Clock,
} from "lucide-react";

interface Submission {
  _id: string;
  formName: string;
  formSlug: string;
  data: Record<string, string | number>;
  sourcePage: string;
  status: "new" | "read" | "contacted" | "closed";
  notes: string;
  ipAddress: string;
  createdAt: string;
}

interface UnreadCounts { [slug: string]: number }

/* ── Pinned form type tabs ────────────────────────────
 * These always show even if no submissions exist yet.
 * Additional slugs from the DB are appended dynamically.
 */
const PINNED_FORMS: { slug: string; label: string }[] = [
  { slug: "bus-enquiry",     label: "Bus Enquiry" },
  { slug: "flight-enquiry",  label: "Flight Enquiry" },
  { slug: "contact-enquiry", label: "Contact Enquiry" },
  { slug: "contact-form",    label: "Contact Form" },
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  new:       <Clock size={11} />,
  read:      <Eye size={11} />,
  contacted: <Phone size={11} />,
  closed:    <CheckCircle size={11} />,
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:       { bg: "#fef2f2", color: "#dc2626" },
  read:      { bg: "#eff6ff", color: "#1d4ed8" },
  contacted: { bg: "#fffbeb", color: "#d97706" },
  closed:    { bg: "#f0fdf4", color: "#15803d" },
};

export default function SubmissionsPage() {
  const [items, setItems]         = useState<Submission[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState("");
  const [formSlug, setFormSlug]   = useState("all");
  const [loading, setLoading]     = useState(true);
  const [formSlugs, setFormSlugs] = useState<string[]>([]);
  const [unread, setUnread]       = useState<UnreadCounts>({});
  const [selected, setSelected]   = useState<Submission | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [noteText, setNoteText]   = useState("");
  const LIMIT = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page), limit: String(LIMIT),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(formSlug && formSlug !== "all" ? { formSlug } : {}),
      });
      const res  = await fetch(`/api/forms?${params}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data.items);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
        setUnread(data.data.unreadCounts ?? {});
        // Derive unique formSlugs from unread counts, merging with pinned slugs
        setFormSlugs(prev => {
          const pinnedSlugs = PINNED_FORMS.map(f => f.slug);
          const dbSlugs = Object.keys(data.data.unreadCounts ?? {});
          const extra = dbSlugs.filter(s => !pinnedSlugs.includes(s));
          const all = [...new Set([...prev.filter(s => !pinnedSlugs.includes(s)), ...extra])];
          return all;
        });
      }
    } finally { setLoading(false); }
  }, [page, search, status, formSlug]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/forms/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    fetchData();
    if (selected?._id === id) setSelected(prev => prev ? { ...prev, status: newStatus as Submission["status"] } : null);
  }

  async function saveNote(id: string) {
    setSavingNote(true);
    await fetch(`/api/forms/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: noteText }) });
    setSavingNote(false);
    fetchData();
  }

  async function deleteSubmission(id: string) {
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    setSelected(null);
    fetchData();
  }

  function exportCSV() {
    if (!items.length) return;
    const allKeys = Array.from(new Set(items.flatMap(s => Object.keys(s.data))));
    const header  = ["Date", "Form", "Status", ...allKeys, "Source"].join(",");
    const rows    = items.map(s => [
      new Date(s.createdAt).toLocaleString("en-IN"),
      `"${s.formName}"`,
      s.status,
      ...allKeys.map(k => `"${String(s.data[k] ?? "").replace(/"/g, '""')}"`),
      `"${s.sourcePage}"`,
    ].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = `submissions-${formSlug}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "flex", gap: 24, height: "100%" }}>

      {/* ── Left: list ─────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", margin: 0 }}>Form Submissions</h1>
            <p style={{ color: "#64748b", fontSize: 13, margin: "3px 0 0" }}>{total} total · {totalUnread} unread</p>
          </div>
          <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#475569" }}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Form tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {/* "All" tab */}
          <button key="all" onClick={() => { setFormSlug("all"); setPage(1); }}
            style={{
              padding: "6px 14px", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: formSlug === "all" ? "#0127FC" : "#f1f5f9",
              color: formSlug === "all" ? "#fff" : "#475569",
            }}>
            All Forms
          </button>

          {/* Pinned form-type tabs */}
          {PINNED_FORMS.map(({ slug, label }) => (
            <button key={slug} onClick={() => { setFormSlug(slug); setPage(1); }}
              style={{
                padding: "6px 14px", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: formSlug === slug ? "#0127FC" : "#f1f5f9",
                color: formSlug === slug ? "#fff" : "#475569",
                position: "relative",
              }}>
              {label}
              {unread[slug] > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 9999 }}>{unread[slug]}</span>
              )}
            </button>
          ))}

          {/* Any extra slugs that come from the DB but aren't pinned */}
          {formSlugs.map(slug => (
            <button key={slug} onClick={() => { setFormSlug(slug); setPage(1); }}
              style={{
                padding: "6px 14px", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: formSlug === slug ? "#0127FC" : "#f1f5f9",
                color: formSlug === slug ? "#fff" : "#475569",
                position: "relative",
              }}>
              {slug.replace(/-/g, " ")}
              {unread[slug] > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 9999 }}>{unread[slug]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <Search size={13} color="#94a3b8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email…"
              style={{ width: "100%", padding: "8px 12px 8px 30px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a", outline: "none", boxSizing: "border-box" }} />
            {search && <button onClick={() => { setSearch(""); setPage(1); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}><X size={13} color="#94a3b8" /></button>}
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            style={{ padding: "8px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a", background: "#fff" }}>
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center" }}><Loader2 size={24} className="spin" color="#94a3b8" /></div>
          ) : items.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>No submissions found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                    {["Form", "Name", "Email", "Status", "Date", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(s => (
                    <tr key={s._id} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer" }}
                      onClick={() => { setSelected(s); setNoteText(s.notes || ""); }}
                      onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc")}
                      onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                    >
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{s.formName}</span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{String(s.data.name ?? "—")}</td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: "#64748b" }}>{String(s.data.email ?? "—")}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, width: "fit-content", padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 700, ...STATUS_COLORS[s.status] }}>
                          {STATUS_ICONS[s.status]} {s.status}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{fmtDate(s.createdAt)}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <button onClick={e => { e.stopPropagation(); setSelected(s); setNoteText(s.notes || ""); }}
                          style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                          <Eye size={11} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>Page {page} of {totalPages}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}><ChevronLeft size={13} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}><ChevronRight size={13} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: detail drawer ─────────────────── */}
      {selected && (
        <div style={{ width: 360, flexShrink: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 20px", display: "flex", flexDirection: "column", gap: 16, alignSelf: "flex-start", position: "sticky", top: 88, maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a", margin: 0 }}>{selected.formName}</h3>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><XCircle size={18} /></button>
          </div>

          {/* Status change */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Status</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["new", "read", "contacted", "closed"] as const).map(s => (
                <button key={s} onClick={() => updateStatus(selected._id, s)}
                  style={{ padding: "5px 12px", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, ...STATUS_COLORS[s], opacity: selected.status === s ? 1 : 0.5 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Form data */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Submitted Data</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(selected.data).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 8, fontSize: 13 }}>
                  <span style={{ color: "#94a3b8", fontWeight: 600, minWidth: 110, textTransform: "capitalize" }}>{k.replace(/_/g, " ")}:</span>
                  <span style={{ color: "#0f172a", wordBreak: "break-all" }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            <p style={{ margin: "0 0 4px" }}>Source: {selected.sourcePage || "—"}</p>
            <p style={{ margin: "0 0 4px" }}>IP: {selected.ipAddress}</p>
            <p style={{ margin: 0 }}>Date: {fmtDate(selected.createdAt)}</p>
          </div>

          {/* Notes */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Admin Notes</p>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a", outline: "none", resize: "vertical", boxSizing: "border-box" }}
              placeholder="Add internal notes…" />
            <button onClick={() => saveNote(selected._id)} disabled={savingNote}
              style={{ marginTop: 8, width: "100%", padding: "8px", borderRadius: 10, border: "none", background: "#0127FC", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {savingNote ? <Loader2 size={13} className="spin" /> : null} Save Note
            </button>
          </div>

          {/* Delete */}
          <button onClick={() => { if (confirm("Delete this submission?")) deleteSubmission(selected._id); }}
            style={{ padding: "8px", borderRadius: 10, border: "1px solid #fee2e2", background: "#fef2f2", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Delete Submission
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 0.8s linear infinite; }`}</style>
    </div>
  );
}
