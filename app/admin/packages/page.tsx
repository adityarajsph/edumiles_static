"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface PackageRow {
  _id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  status: "draft" | "published";
  isFeatured: boolean;
  destination: string;
  createdAt: string;
}

export default function AdminPackagesPage() {
  const [items, setItems]       = useState<PackageRow[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const LIMIT = 15;

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page), limit: String(LIMIT),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      });
      const res  = await fetch(`/api/packages?${params}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data.items);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  async function toggleStatus(id: string, current: string) {
    const newStatus = current === "published" ? "draft" : "published";
    await fetch(`/api/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchPackages();
  }

  async function toggleFeatured(id: string, current: boolean) {
    await fetch(`/api/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    });
    fetchPackages();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    await fetch(`/api/packages/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    fetchPackages();
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", margin: 0 }}>Packages</h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: "3px 0 0" }}>{total} total packages</p>
        </div>
        <Link href="/admin/packages/new" style={{
          display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10,
          background: "linear-gradient(135deg,#FE8100,#FF9A2E)", color: "#fff",
          fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none",
        }}>
          <Plus size={16} /> Add New
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search packages…"
            style={{
              width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10,
              border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a",
              outline: "none", boxSizing: "border-box",
            }}
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
              <X size={14} color="#94a3b8" />
            </button>
          )}
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a", background: "#fff" }}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>
            <Loader2 size={24} className="spin" />
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>No packages found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                  {["Title", "Category", "Price", "Status", "Featured", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(pkg => (
                  <tr key={pkg._id} style={{ borderBottom: "1px solid #f8fafc" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#fafbfc")}
                    onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", margin: 0 }}>{pkg.title}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>/{pkg.slug}</p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                        {pkg.category || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => toggleStatus(pkg._id, pkg.status)}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          padding: "4px 10px", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
                          background: pkg.status === "published" ? "#f0fdf4" : "#fef2f2",
                          color: pkg.status === "published" ? "#15803d" : "#dc2626",
                        }}>
                        {pkg.status === "published" ? <Eye size={11} /> : <EyeOff size={11} />}
                        {pkg.status === "published" ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => toggleFeatured(pkg._id, pkg.isFeatured)}
                        style={{
                          background: "none", border: "none", cursor: "pointer", padding: 4,
                          color: pkg.isFeatured ? "#f59e0b" : "#cbd5e1",
                        }}
                        aria-label={pkg.isFeatured ? "Remove featured" : "Mark featured"}
                      >
                        <Star size={16} fill={pkg.isFeatured ? "#f59e0b" : "none"} />
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link href={`/admin/packages/${pkg._id}/edit`}
                          style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                            borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff",
                            fontSize: 12, color: "#475569", textDecoration: "none",
                          }}>
                          <Edit2 size={12} /> Edit
                        </Link>
                        <button onClick={() => setDeleteId(pkg._id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                            borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2",
                            fontSize: 12, color: "#dc2626", cursor: "pointer",
                          }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Page {page} of {totalPages}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", marginBottom: 8 }}>Delete Package?</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>This action cannot be undone. The package will be permanently deleted.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#64748b" }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#ef4444", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#fff" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 0.8s linear infinite; }`}</style>
    </div>
  );
}
