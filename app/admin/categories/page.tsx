"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Tag, Upload } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  packageCount?: number;
}

const EMPTY_FORM = { name: "", slug: "", description: "", image: "", order: 0 };

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: 10,
  border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
  outline: "none", boxSizing: "border-box", background: "#fff",
};
const labelStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block",
};

export default function CategoriesPage() {
  const [items, setItems]         = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [editItem, setEditItem]   = useState<Category | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/categories?counts=true")
      .then(r => r.json())
      .then(d => { if (!cancelled && d.success) setItems(d.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "edumiles/categories");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm(f => ({ ...f, image: data.data.url }));
      } else {
        showToast("error", data.message || "Upload failed");
      }
    } catch {
      showToast("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function openAdd() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditItem(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image || "", order: cat.order });
    setErrors({});
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditItem(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function setField(key: keyof typeof EMPTY_FORM, value: string | number) {
    setForm(f => {
      const updated = { ...f, [key]: value };
      if (key === "name" && !editItem) updated.slug = slugify(value as string);
      return updated;
    });
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim())  errs.name  = "Name is required";
    if (!form.slug.trim())  errs.slug  = "Slug is required";
    if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = "Slug must be lowercase letters, numbers, hyphens only";
    if (form.order < 0)     errs.order = "Order must be 0 or more";
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const url    = editItem ? `/api/categories/${editItem._id}` : "/api/categories";
      const method = editItem ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { showToast("error", data.message || "Failed to save"); return; }
      showToast("success", editItem ? "Category updated!" : "Category created!");
      closeForm();
      refresh();
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    showToast("success", "Category deleted");
    refresh();
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", margin: 0 }}>Categories</h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: "3px 0 0" }}>{items.length} categories</p>
        </div>
        <button onClick={openAdd} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10,
          background: "linear-gradient(135deg,#FE8100,#FF9A2E)", color: "#fff",
          fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
        }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 300, padding: "12px 20px", borderRadius: 12,
          background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fca5a5"}`,
          color: toast.type === "success" ? "#15803d" : "#dc2626",
          fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}>{toast.msg}</div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>
            <Loader2 size={24} className="spin" />
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <Tag size={40} color="#cbd5e1" strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>No categories yet. Add your first category.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                  {["Image", "Name", "Slug", "Description", "Packages", "Order", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(cat => (
                  <tr key={cat._id} style={{ borderBottom: "1px solid #f8fafc" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#fafbfc")}
                    onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      {cat.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.image} alt={cat.name} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                      ) : (
                        <div style={{ width: 56, height: 40, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Tag size={16} color="#cbd5e1" />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{cat.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "#f1f5f9", color: "#475569", fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>{cat.slug}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.description || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{cat.packageCount ?? 0}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a" }}>{cat.order}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(cat)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, color: "#475569", cursor: "pointer" }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => setDeleteId(cat._id)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", fontSize: 12, color: "#dc2626", cursor: "pointer" }}>
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
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", maxWidth: 500, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#0f172a", margin: 0 }}>
                {editItem ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={closeForm} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input value={form.name} onChange={e => setField("name", e.target.value)} style={inputStyle} placeholder="e.g. Adventure" />
                {errors.name && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.name}</span>}
              </div>
              <div>
                <label style={labelStyle}>Slug *</label>
                <input value={form.slug} onChange={e => setField("slug", slugify(e.target.value))} style={inputStyle} placeholder="adventure" />
                {errors.slug && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.slug}</span>}
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={e => setField("description", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Short description (optional)" />
              </div>

              {/* Image */}
              <div>
                <label style={labelStyle}>Category Image</label>
                {form.image && (
                  <div style={{ position: "relative", marginBottom: 10, display: "inline-block" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Category" style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0", display: "block" }} />
                    <button onClick={() => setField("image", "")}
                      style={{ position: "absolute", top: -7, right: -7, width: 22, height: 22, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <X size={11} />
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); e.currentTarget.value = ""; }} />
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1.5px dashed #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#64748b" }}>
                    {uploading ? <Loader2 size={13} className="spin" /> : <Upload size={13} />} Upload Image
                  </button>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>or paste URL:</span>
                </div>
                <input value={form.image} onChange={e => setField("image", e.target.value)} style={{ ...inputStyle, marginTop: 8, fontSize: 12 }} placeholder="https://..." />
              </div>

              <div>
                <label style={labelStyle}>Order (sort)</label>
                <input type="number" value={form.order} onChange={e => setField("order", Math.max(0, +e.target.value))} min={0} style={inputStyle} />
                {errors.order && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.order}</span>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={closeForm}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#64748b" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || uploading}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FE8100,#FF9A2E)", cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                {editItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", marginBottom: 8 }}>Delete Category?</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
              Existing packages assigned to this category will keep their category value but it will no longer appear as a filter option.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#64748b" }}>
                Cancel
              </button>
              <button onClick={handleDelete}
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
