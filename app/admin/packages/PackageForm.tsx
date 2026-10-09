"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Upload, ArrowLeft, Save } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy-load RichTextEditor so it doesn't affect server-side rendering
const RichTextEditor = dynamic(() => import("../../../components/RichTextEditor"), { ssr: false, loading: () => (
  <div style={{ minHeight: 200, border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
    Loading editor…
  </div>
) });

interface FormData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number | "";
  discountPrice: number | "";
  currency: string;
  duration: string;
  destination: string;
  destinationSlug: string;
  category: string;
  featuredImage: string;
  gallery: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  badge: string;
  badgeBg: string;
  groupSize: string;
  rating: number | "";
  reviews: number | "";
  isFeatured: boolean;
  status: "draft" | "published";
  order: number | "";
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
  bestMonths: string[];
  season: {
    peak: { months: string[]; note: string };
    offSeason: { months: string[]; note: string };
    priceTendency: string;
    activeSeason: "peak" | "off";
  };
}

const DEFAULT_FORM: FormData = {
  title: "", slug: "", shortDescription: "", fullDescription: "",
  price: "", discountPrice: "", currency: "INR",
  duration: "", destination: "", destinationSlug: "", category: "",
  featuredImage: "", gallery: [],
  highlights: [""], inclusions: [""], exclusions: [""],
  itinerary: [{ day: 1, title: "", description: "" }],
  faqs: [{ question: "", answer: "" }],
  badge: "", badgeBg: "#FE8100", groupSize: "", rating: "", reviews: "",
  isFeatured: false, status: "draft", order: "",
  seo: { metaTitle: "", metaDescription: "", ogImage: "" },
  bestMonths: [],
  season: {
    peak:      { months: [], note: "" },
    offSeason: { months: [], note: "" },
    priceTendency: "",
    activeSeason: "peak",
  },
};

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CATEGORIES_FALLBACK = ["Heritage", "Adventure", "Luxury", "Honeymoon", "Religious", "Weekend Trips"];

interface Props { packageId?: string }

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function PackageForm({ packageId }: Props) {
  const router = useRouter();
  const [form, setForm]         = useState<FormData>(DEFAULT_FORM);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]       = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [dirty, setDirty]       = useState(false);
  const [categories, setCategories] = useState<string[]>(CATEGORIES_FALLBACK);
  const [destinations, setDestinations] = useState<{ name: string; slug: string }[]>([]);
  const fileRef                 = useRef<HTMLInputElement>(null);
  const isEdit                  = !!packageId;

  // Fetch live categories from the CMS
  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) {
          setCategories(d.data.map((c: { name: string }) => c.name));
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  // Fetch managed destinations
  useEffect(() => {
    fetch("/api/destinations")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) {
          setDestinations(d.data.map((dest: { name: string; slug: string }) => ({ name: dest.name, slug: dest.slug })));
        }
      })
      .catch(() => { /* silently ignore — destination field remains a free-text fallback */ });
  }, []);

  // Load existing package data for edit
  useEffect(() => {
    if (!packageId) return;
    fetch(`/api/packages/${packageId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const pkg = d.data;
          // Normalise season months — old records may have a plain string, new ones are arrays
          const normMonths = (v: unknown): string[] => {
            if (Array.isArray(v)) return v as string[];
            if (typeof v === "string" && v.trim()) return [v];
            return [];
          };
          setForm({
            ...DEFAULT_FORM,
            ...pkg,
            // Treat 0 as empty string so the placeholder shows instead of "0"
            price:         pkg.price         != null ? pkg.price         : "",
            discountPrice: pkg.discountPrice != null ? pkg.discountPrice : "",
            rating:        pkg.rating        != null ? pkg.rating        : "",
            reviews:       pkg.reviews       != null ? pkg.reviews       : "",
            order:         pkg.order         != null ? pkg.order         : "",
            season: {
              peak:          {
                months: normMonths(pkg.season?.peak?.months),
                note:   pkg.season?.peak?.note ?? "",
              },
              offSeason:     {
                months: normMonths(pkg.season?.offSeason?.months),
                note:   pkg.season?.offSeason?.note ?? "",
              },
              priceTendency: pkg.season?.priceTendency ?? "",
              activeSeason:  pkg.season?.activeSeason  ?? "peak",
            },
            bestMonths: pkg.bestMonths ?? [],
            seo: pkg.seo ?? { metaTitle: "", metaDescription: "", ogImage: "" },
            destinationSlug: pkg.destinationSlug ?? "",
          });
        }
      });
  }, [packageId]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setDirty(true);
  }

  function setList(key: "highlights" | "inclusions" | "exclusions", idx: number, value: string) {
    const arr = [...form[key]];
    arr[idx] = value;
    set(key, arr);
  }

  function addListItem(key: "highlights" | "inclusions" | "exclusions") {
    set(key, [...form[key], ""]);
  }

  function removeListItem(key: "highlights" | "inclusions" | "exclusions", idx: number) {
    set(key, form[key].filter((_, i) => i !== idx));
  }

  async function uploadImage(file: File, field: "featuredImage" | "gallery") {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "edumiles/packages");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        if (field === "featuredImage") {
          set("featuredImage", data.data.url);
        } else {
          // Use functional updater to avoid stale closure when uploading multiple files
          setForm(f => ({ ...f, gallery: [...f.gallery, data.data.url] }));
          setDirty(true);
        }
      } else {
        showToast("error", data.message || "Upload failed");
      }
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

  async function handleSubmit(statusOverride?: "draft" | "published") {
    setSaving(true);
    setErrors({});
    try {
      // Validate rating max 5
      const ratingVal = form.rating === "" ? 0 : Number(form.rating);
      if (ratingVal > 5) {
        setErrors({ rating: "Rating cannot exceed 5" });
        showToast("error", "Rating cannot exceed 5");
        return;
      }

      const payload = {
        ...form,
        status:        statusOverride ?? form.status,
        price:         form.price         === "" ? 0 : Number(form.price),
        discountPrice: form.discountPrice === "" ? 0 : Number(form.discountPrice),
        rating:        form.rating        === "" ? 0 : Number(form.rating),
        reviews:       form.reviews       === "" ? 0 : Number(form.reviews),
        order:         form.order         === "" ? 0 : Number(form.order),
      };
      const url    = isEdit ? `/api/packages/${packageId}` : "/api/packages";
      const method = isEdit ? "PUT" : "POST";

      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!data.success) {
        if (data.errors) setErrors(data.errors as Record<string, string>);
        showToast("error", data.message || "Failed to save");
        return;
      }

      setDirty(false);
      showToast("success", isEdit ? "Package updated!" : "Package created!");
      if (!isEdit) router.push(`/admin/packages/${data.data._id}/edit`);
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ─────────── Field helpers ──────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" };
  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button onClick={() => router.push("/admin/packages")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b" }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", margin: 0 }}>
            {isEdit ? "Edit Package" : "Add New Package"}
          </h1>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button onClick={() => handleSubmit("draft")} disabled={saving}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} Save Draft
          </button>
          <button onClick={() => handleSubmit("published")} disabled={saving}
            style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FE8100,#FF9A2E)", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
            {saving ? <Loader2 size={14} className="spin" /> : null} Publish
          </button>
        </div>
      </div>

      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 200,
          padding: "12px 20px", borderRadius: 12,
          background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fca5a5"}`,
          color: toast.type === "success" ? "#15803d" : "#dc2626",
          fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }} className="pkg-form-grid">

        {/* Left column — main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Basic info */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 18 }}>Basic Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Title *</label>
                <input value={form.title} onChange={e => { set("title", e.target.value); if (!isEdit) set("slug", slugify(e.target.value)); }} style={inputStyle} placeholder="e.g. Golden Triangle Tour" />
                {errors.title && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.title}</span>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Slug *</label>
                <input value={form.slug} onChange={e => set("slug", slugify(e.target.value))} style={inputStyle} placeholder="golden-triangle-tour" />
                {errors.slug && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.slug}</span>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Category</label>
                <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Destination</label>
                {destinations.length > 0 ? (
                  <select
                    value={form.destinationSlug}
                    onChange={e => {
                      const slug = e.target.value;
                      const found = destinations.find(d => d.slug === slug);
                      set("destinationSlug", slug);
                      if (found) set("destination", found.name);
                    }}
                    style={inputStyle}
                  >
                    <option value="">Select destination</option>
                    {destinations.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}
                  </select>
                ) : (
                  <input value={form.destination} onChange={e => set("destination", e.target.value)} style={inputStyle} placeholder="e.g. Delhi • Agra • Jaipur" />
                )}
                {/* Always allow free-text override when managed destinations exist */}
                {destinations.length > 0 && (
                  <input
                    value={form.destination}
                    onChange={e => set("destination", e.target.value)}
                    style={{ ...inputStyle, marginTop: 6, fontSize: 12 }}
                    placeholder="Display name override (optional)"
                  />
                )}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Duration</label>
                <input value={form.duration} onChange={e => set("duration", e.target.value)} style={inputStyle} placeholder="e.g. 6 Days / 5 Nights" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Group Size</label>
                <input value={form.groupSize} onChange={e => set("groupSize", e.target.value)} style={inputStyle} placeholder="e.g. 2–12" />
              </div>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Short Description</label>
                <textarea value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Full Description</label>
                <RichTextEditor
                  value={form.fullDescription}
                  onChange={v => set("fullDescription", v)}
                  placeholder="Write a detailed package description…"
                  minHeight={220}
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 18 }}>Images</h2>

            {/* Featured Image */}
            <div style={{ ...fieldStyle, marginBottom: 24 }}>
              <label style={labelStyle}>Featured Image</label>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                {form.featuredImage && (
                  <div style={{ position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.featuredImage} alt="Featured" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <button onClick={() => set("featuredImage", "")} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Trash2 size={10} />
                    </button>
                  </div>
                )}
                <div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0], "featuredImage"); }} />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1.5px dashed #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#64748b" }}>
                    {uploading ? <Loader2 size={13} className="spin" /> : <Upload size={13} />} Upload Image
                  </button>
                  <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Or paste URL below</p>
                  <input value={form.featuredImage} onChange={e => set("featuredImage", e.target.value)} style={{ ...inputStyle, marginTop: 4, fontSize: 12 }} placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Gallery</label>
              <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10, marginTop: 0 }}>
                Upload multiple images for the package gallery. First image will be used as a fallback if no featured image is set.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                {form.gallery.map((url, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0", display: "block" }}
                    />
                    <button
                      onClick={() => set("gallery", form.gallery.filter((_, i) => i !== idx))}
                      style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                      title="Remove image"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}

                {/* Add gallery image button */}
                <label style={{
                  width: 100, height: 70, borderRadius: 8,
                  border: "1.5px dashed #e2e8f0", background: "#f8fafc",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: uploading ? "not-allowed" : "pointer", gap: 4,
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    disabled={uploading}
                    onChange={async e => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length === 0) return;
                      setUploading(true);
                      for (const file of files) {
                        const fd = new FormData();
                        fd.append("file", file);
                        fd.append("folder", "edumiles/packages");
                        try {
                          const res  = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.success) {
                            setForm(f => ({ ...f, gallery: [...f.gallery, data.data.url] }));
                            setDirty(true);
                          } else {
                            showToast("error", data.message || "Upload failed");
                          }
                        } catch {
                          showToast("error", "Upload failed");
                        }
                      }
                      setUploading(false);
                      e.target.value = "";
                    }}
                  />
                  {uploading ? <Loader2 size={16} className="spin" style={{ color: "#94a3b8" }} /> : <Upload size={16} style={{ color: "#94a3b8" }} />}
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Add</span>
                </label>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 11 }}>Supported: JPEG, PNG, WebP, GIF · Max 8 MB per file</p>
            </div>
          </section>

          {/* Highlights / Inclusions / Exclusions */}
          {(["highlights", "inclusions", "exclusions"] as const).map(field => (
            <section key={field} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14, textTransform: "capitalize" }}>{field}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {form[field].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8 }}>
                    <input value={item} onChange={e => setList(field, idx, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder={`${field} item ${idx + 1}`} />
                    <button onClick={() => removeListItem(field, idx)} style={{ padding: "8px 10px", borderRadius: 10, border: "none", background: "#fef2f2", cursor: "pointer", color: "#dc2626" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button onClick={() => addListItem(field)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1.5px dashed #e2e8f0", background: "transparent", cursor: "pointer", fontSize: 13, color: "#64748b", alignSelf: "flex-start" }}>
                  <Plus size={13} /> Add item
                </button>
              </div>
            </section>
          ))}

          {/* Itinerary */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>Itinerary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {form.itinerary.map((day, idx) => (
                <div key={idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <input type="number" value={day.day} onChange={e => { const arr = [...form.itinerary]; arr[idx] = { ...arr[idx], day: +e.target.value }; set("itinerary", arr); }} style={{ ...inputStyle, width: 80 }} min={1} />
                    <input value={day.title} onChange={e => { const arr = [...form.itinerary]; arr[idx] = { ...arr[idx], title: e.target.value }; set("itinerary", arr); }} style={{ ...inputStyle, flex: 1 }} placeholder="Day title" />
                    <button onClick={() => set("itinerary", form.itinerary.filter((_, i) => i !== idx))} style={{ padding: "8px 10px", borderRadius: 10, border: "none", background: "#fef2f2", cursor: "pointer", color: "#dc2626" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <textarea value={day.description} onChange={e => { const arr = [...form.itinerary]; arr[idx] = { ...arr[idx], description: e.target.value }; set("itinerary", arr); }} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Day description" />
                </div>
              ))}
              <button onClick={() => set("itinerary", [...form.itinerary, { day: form.itinerary.length + 1, title: "", description: "" }])}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1.5px dashed #e2e8f0", background: "transparent", cursor: "pointer", fontSize: 13, color: "#64748b", alignSelf: "flex-start" }}>
                <Plus size={13} /> Add Day
              </button>
            </div>
          </section>

          {/* FAQs */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>FAQs</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {form.faqs.map((faq, idx) => (
                <div key={idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input value={faq.question} onChange={e => { const arr = [...form.faqs]; arr[idx] = { ...arr[idx], question: e.target.value }; set("faqs", arr); }} style={{ ...inputStyle, flex: 1 }} placeholder="Question" />
                    <button onClick={() => set("faqs", form.faqs.filter((_, i) => i !== idx))} style={{ padding: "8px 10px", borderRadius: 10, border: "none", background: "#fef2f2", cursor: "pointer", color: "#dc2626" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <textarea value={faq.answer} onChange={e => { const arr = [...form.faqs]; arr[idx] = { ...arr[idx], answer: e.target.value }; set("faqs", arr); }} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Answer" />
                </div>
              ))}
              <button onClick={() => set("faqs", [...form.faqs, { question: "", answer: "" }])}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1.5px dashed #e2e8f0", background: "transparent", cursor: "pointer", fontSize: 13, color: "#64748b", alignSelf: "flex-start" }}>
                <Plus size={13} /> Add FAQ
              </button>
            </div>
          </section>

          {/* Best Months */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 6 }}>Best Months to Visit</h2>
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 16 }}>Select the months when this package is best experienced.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 8 }}>
              {ALL_MONTHS.map(month => {
                const checked = form.bestMonths.includes(month);
                return (
                  <label key={month} style={{
                    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                    padding: "8px 12px", borderRadius: 10,
                    border: `1.5px solid ${checked ? "#FE8100" : "#e2e8f0"}`,
                    background: checked ? "#fff8f0" : "#fff",
                    transition: "all 0.15s",
                  }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const months = checked
                          ? form.bestMonths.filter(m => m !== month)
                          : [...form.bestMonths, month];
                        set("bestMonths", months);
                      }}
                      style={{ width: 14, height: 14, accentColor: "#FE8100" }}
                    />
                    <span style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? "#FE8100" : "#374151" }}>{month}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Peak Season & Off Season */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 18 }}>Season Information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Peak Season */}
              <div style={{ background: "#fff8f0", border: "1px solid #fed7aa", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", marginBottom: 12 }}>🌟 Peak Season</p>
                {/* Month checkboxes */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ ...labelStyle, marginBottom: 8 }}>Months</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 6 }}>
                    {ALL_MONTHS.map(month => {
                      const checked = form.season.peak.months.includes(month);
                      return (
                        <label key={month} style={{
                          display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
                          padding: "6px 10px", borderRadius: 8,
                          border: `1.5px solid ${checked ? "#FE8100" : "#e2e8f0"}`,
                          background: checked ? "#fff8f0" : "#fff",
                          transition: "all 0.12s",
                        }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const months = checked
                                ? form.season.peak.months.filter(m => m !== month)
                                : [...form.season.peak.months, month];
                              set("season", { ...form.season, peak: { ...form.season.peak, months } });
                            }}
                            style={{ width: 13, height: 13, accentColor: "#FE8100" }}
                          />
                          <span style={{ fontSize: 12, fontWeight: checked ? 600 : 400, color: checked ? "#c2410c" : "#374151" }}>{month}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Note</label>
                  <input
                    value={form.season.peak.note}
                    onChange={e => set("season", { ...form.season, peak: { ...form.season.peak, note: e.target.value } })}
                    style={inputStyle}
                    placeholder="e.g. Best weather, higher prices"
                  />
                </div>
              </div>
              {/* Off Season */}
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0369a1", marginBottom: 12 }}>❄️ Off Season</p>
                {/* Month checkboxes */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ ...labelStyle, marginBottom: 8 }}>Months</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 6 }}>
                    {ALL_MONTHS.map(month => {
                      const checked = form.season.offSeason.months.includes(month);
                      return (
                        <label key={month} style={{
                          display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
                          padding: "6px 10px", borderRadius: 8,
                          border: `1.5px solid ${checked ? "#0369a1" : "#e2e8f0"}`,
                          background: checked ? "#e0f2fe" : "#fff",
                          transition: "all 0.12s",
                        }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const months = checked
                                ? form.season.offSeason.months.filter(m => m !== month)
                                : [...form.season.offSeason.months, month];
                              set("season", { ...form.season, offSeason: { ...form.season.offSeason, months } });
                            }}
                            style={{ width: 13, height: 13, accentColor: "#0369a1" }}
                          />
                          <span style={{ fontSize: 12, fontWeight: checked ? 600 : 400, color: checked ? "#0369a1" : "#374151" }}>{month}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Note</label>
                  <input
                    value={form.season.offSeason.note}
                    onChange={e => set("season", { ...form.season, offSeason: { ...form.season.offSeason, note: e.target.value } })}
                    style={inputStyle}
                    placeholder="e.g. Monsoon, lower prices"
                  />
                </div>
              </div>
              {/* Price tendency */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Price Tendency</label>
                <input
                  value={form.season.priceTendency}
                  onChange={e => set("season", { ...form.season, priceTendency: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Prices increase 20% during peak season"
                />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>SEO</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={fieldStyle}><label style={labelStyle}>Meta Title</label><input value={form.seo.metaTitle} onChange={e => set("seo", { ...form.seo, metaTitle: e.target.value })} style={inputStyle} /></div>
              <div style={fieldStyle}><label style={labelStyle}>Meta Description</label><textarea value={form.seo.metaDescription} onChange={e => set("seo", { ...form.seo, metaDescription: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} /></div>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 14 }}>Pricing</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => set("price", e.target.value === "" ? "" : Math.max(0, +e.target.value))}
                  min={0}
                  placeholder="e.g. 15000"
                  style={inputStyle}
                />
                {errors.price && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.price}</span>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Original Price (₹) <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>crossed-out price</span></label>
                <input
                  type="number"
                  value={form.discountPrice}
                  onChange={e => set("discountPrice", e.target.value === "" ? "" : Math.max(0, +e.target.value))}
                  min={0}
                  placeholder="e.g. 18000"
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 14 }}>Display</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={fieldStyle}><label style={labelStyle}>Badge Text</label><input value={form.badge} onChange={e => set("badge", e.target.value)} style={inputStyle} placeholder="Best Seller" /></div>
              <div style={fieldStyle}><label style={labelStyle}>Badge Color</label><input type="color" value={form.badgeBg} onChange={e => set("badgeBg", e.target.value)} style={{ ...inputStyle, height: 36, padding: 4 }} /></div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Rating <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>(0 – 5, decimals allowed)</span></label>
                <input
                  type="number"
                  value={form.rating}
                  onChange={e => {
                    const v = e.target.value === "" ? "" : Math.min(5, Math.max(0, +e.target.value));
                    set("rating", v);
                  }}
                  min={0} max={5} step={0.1}
                  placeholder="e.g. 4.5"
                  style={inputStyle}
                />
                {errors.rating && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.rating}</span>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Reviews Count</label>
                <input
                  type="number"
                  value={form.reviews}
                  onChange={e => set("reviews", e.target.value === "" ? "" : Math.max(0, +e.target.value))}
                  min={0}
                  placeholder="e.g. 128"
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Order (sort)</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => set("order", e.target.value === "" ? "" : Math.max(0, +e.target.value))}
                  min={0}
                  placeholder="e.g. 1"
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 14 }}>Visibility</h3>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 10 }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Featured on homepage</span>
            </label>
            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value as "draft" | "published")} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </section>
        </aside>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @media (max-width: 900px) {
          .pkg-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
