"use client";

/**
 * app/admin/blogs/BlogForm.tsx
 *
 * Blog create/edit form with Tiptap rich-text editor.
 * All existing blog fields (title, slug, excerpt, featured image, author,
 * SEO, category, tags, status, etc.) are preserved.
 * The old plain-HTML textarea is replaced with the <RichTextEditor> component.
 */

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, ArrowLeft, Save, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

/* Load the rich-text editor client-side only to avoid SSR issues */
const RichTextEditor = dynamic(
  () => import("../../../components/RichTextEditor"),
  { ssr: false, loading: () => <div style={{ height: 420, background: "#f8fafc", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>Loading editor…</div> }
);

/* ─────────────────────────────────────────── types ── */
interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: { name: string; role: string; avatar: string };
  category: string;
  tags: string;          // comma-separated string in UI, converted to array on save
  readTime: number;
  isFeatured: boolean;
  status: "draft" | "published";
  publishedAt: string;
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
}

const DEFAULT: FormData = {
  title: "", slug: "", excerpt: "", content: "",
  featuredImage: "",
  author: { name: "", role: "", avatar: "" },
  category: "", tags: "", readTime: 5,
  isFeatured: false, status: "draft",
  publishedAt: new Date().toISOString().slice(0, 10),
  seo: { metaTitle: "", metaDescription: "", ogImage: "" },
};

const CATEGORIES = ["Heritage", "Adventure", "Luxury", "Honeymoon", "Religious", "Weekend Trips"];

interface Props { blogId?: string }

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

/* ═══════════════════════════════════════ COMPONENT ══ */
export default function BlogForm({ blogId }: Props) {
  const router = useRouter();
  const [form, setForm]           = useState<FormData>(DEFAULT);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [dirty, setDirty]         = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);
  const isEdit                    = !!blogId;

  /* ── Load existing blog for edit ── */
  useEffect(() => {
    if (!blogId) return;
    fetch(`/api/blogs/${blogId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setForm({
            ...DEFAULT,
            ...d.data,
            tags: Array.isArray(d.data.tags) ? d.data.tags.join(", ") : "",
            publishedAt: d.data.publishedAt
              ? new Date(d.data.publishedAt).toISOString().slice(0, 10)
              : DEFAULT.publishedAt,
            /* Ensure nested objects are merged correctly */
            author: { ...DEFAULT.author, ...(d.data.author || {}) },
            seo:    { ...DEFAULT.seo,    ...(d.data.seo    || {}) },
          });
        }
      })
      .catch(() => showToast("error", "Failed to load blog data"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  /* ── Dirty guard on browser close ── */
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  /* ── Generic field setter ── */
  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setDirty(true);
  }

  /* ── Featured image upload ── */
  async function uploadFeaturedImage() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "edumiles/blogs");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) set("featuredImage", data.data.url);
      else showToast("error", data.message || "Upload failed");
    } catch {
      showToast("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Save / Publish ── */
  async function handleSubmit(statusOverride?: "draft" | "published") {
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        status: statusOverride ?? form.status,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      };
      const url    = isEdit ? `/api/blogs/${blogId}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        if (data.errors) setErrors(data.errors as Record<string, string>);
        showToast("error", data.message || "Failed to save");
        return;
      }
      setDirty(false);
      showToast("success", isEdit ? "Post updated!" : "Post created!");
      if (!isEdit) router.push(`/admin/blogs/${data.data._id}/edit`);
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  /* ── Shared styles ── */
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block",
  };
  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };

  /* ═══════════════════════ RENDER ════════════════════ */
  return (
    <div>
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button
          onClick={() => router.push("/admin/blogs")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b" }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", margin: 0 }}>
          {isEdit ? "Edit Post" : "Add New Post"}
        </h1>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button
            onClick={() => handleSubmit("draft")}
            disabled={saving}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}
          >
            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={saving}
            style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0127FC,#2545FD)", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200, padding: "12px 20px", borderRadius: 12, background: toast.type === "success" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fca5a5"}`, color: toast.type === "success" ? "#15803d" : "#dc2626", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          {toast.msg}
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }} className="blog-form-grid">

        {/* ═══ LEFT COLUMN ════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Post Details card */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 16 }}>
              Post Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Title */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Title *</label>
                <input
                  value={form.title}
                  onChange={e => {
                    set("title", e.target.value);
                    if (!isEdit) set("slug", slugify(e.target.value));
                  }}
                  style={inputStyle}
                  placeholder="Blog post title"
                />
                {errors.title && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.title}</span>}
              </div>

              {/* Slug */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Slug *</label>
                <input
                  value={form.slug}
                  onChange={e => set("slug", slugify(e.target.value))}
                  style={inputStyle}
                />
                {errors.slug && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.slug}</span>}
              </div>

              {/* Excerpt */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => set("excerpt", e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  placeholder="Short description for listing pages and SEO"
                />
              </div>

              {/* ── Rich Text Content ── */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Content</label>
                <RichTextEditor
                  value={form.content}
                  onChange={html => set("content", html)}
                  placeholder="Start writing your blog post…"
                  minHeight={500}
                />
                {errors.content && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.content}</span>}
              </div>
            </div>
          </section>

          {/* Featured Image card */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 16 }}>
              Featured Image
            </h2>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
              {form.featuredImage && (
                <div style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.featuredImage} alt="Cover" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <button
                    onClick={() => set("featuredImage", "")}
                    style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
              <div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadFeaturedImage} />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1.5px dashed #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#64748b" }}
                >
                  {uploading ? <Loader2 size={13} className="spin" /> : <Upload size={13} />} Upload
                </button>
                <input
                  value={form.featuredImage}
                  onChange={e => set("featuredImage", e.target.value)}
                  style={{ ...inputStyle, marginTop: 8, fontSize: 12 }}
                  placeholder="Or paste image URL"
                />
              </div>
            </div>
          </section>

          {/* Author card */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 16 }}>Author</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Name</label>
                <input value={form.author.name} onChange={e => set("author", { ...form.author, name: e.target.value })} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Role</label>
                <input value={form.author.role} onChange={e => set("author", { ...form.author, role: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Avatar URL</label>
                <input value={form.author.avatar} onChange={e => set("author", { ...form.author, avatar: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </section>

          {/* SEO card */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 16 }}>SEO</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Meta Title</label>
                <input value={form.seo.metaTitle} onChange={e => set("seo", { ...form.seo, metaTitle: e.target.value })} style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Meta Description</label>
                <textarea value={form.seo.metaDescription} onChange={e => set("seo", { ...form.seo, metaDescription: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
          </section>
        </div>

        {/* ═══ RIGHT SIDEBAR ══════════════════════════ */}
        <aside style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 16 }}>
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 14 }}>Settings</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              <div style={fieldStyle}>
                <label style={labelStyle}>Category</label>
                <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => set("tags", e.target.value)} style={inputStyle} placeholder="Kerala, Travel, Tips" />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Read time (min)</label>
                <input type="number" value={form.readTime} onChange={e => set("readTime", +e.target.value)} min={1} style={inputStyle} />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Publish date</label>
                <input type="date" value={form.publishedAt} onChange={e => set("publishedAt", e.target.value)} style={inputStyle} />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => set("status", e.target.value as "draft" | "published")} style={inputStyle}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: 13, color: "#374151" }}>Featured post</span>
              </label>
            </div>
          </section>

          {/* Quick save buttons duplicated in sidebar for convenience */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => handleSubmit("draft")}
              disabled={saving}
              style={{ width: "100%", padding: "10px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} Save Draft
            </button>
            <button
              onClick={() => handleSubmit("published")}
              disabled={saving}
              style={{ width: "100%", padding: "10px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0127FC,#2545FD)", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff" }}
            >
              Publish
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @media (max-width: 900px) { .blog-form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
