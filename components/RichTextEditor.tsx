"use client";

/**
 * components/RichTextEditor.tsx
 *
 * Full-featured WYSIWYG rich-text editor built on Tiptap v3.
 * Covers all requirements:
 *   - H1–H6, paragraphs, bold, italic, underline, strikethrough
 *   - Text alignment (left / center / right / justify)
 *   - Ordered & unordered lists
 *   - Blockquote, code block, horizontal rule
 *   - Text colour & highlight (background colour)
 *   - Hyperlinks (URL, target, editable/removable)
 *   - Images (upload via /api/upload, URL insert, align, alt text, caption)
 *   - YouTube embeds
 *   - Tables (insert / edit)
 *   - Superscript / subscript
 *   - SSR-safe (immediatelyRender: false)
 */

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Image as ImageExt } from "@tiptap/extension-image";
import { Link as LinkExt } from "@tiptap/extension-link";
import { TextAlign as TextAlignExt } from "@tiptap/extension-text-align";
import { Underline as UnderlineExt } from "@tiptap/extension-underline";
import { Color as ColorExt } from "@tiptap/extension-color";
import { TextStyle as TextStyleExt } from "@tiptap/extension-text-style";
import { Highlight as HighlightExt } from "@tiptap/extension-highlight";
import { Youtube as YoutubeExt } from "@tiptap/extension-youtube";
import { Table as TableExt } from "@tiptap/extension-table";
import { TableRow as TableRowExt } from "@tiptap/extension-table-row";
import { TableHeader as TableHeaderExt } from "@tiptap/extension-table-header";
import { TableCell as TableCellExt } from "@tiptap/extension-table-cell";
import { Superscript as SuperscriptExt } from "@tiptap/extension-superscript";
import { Subscript as SubscriptExt } from "@tiptap/extension-subscript";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────── types ── */
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

/* ────────────────────────────────── toolbar button ── */
function ToolBtn({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 7px",
        minWidth: 28,
        height: 28,
        borderRadius: 6,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        background: active ? "#e0e7ff" : "transparent",
        color: active ? "#0127FC" : "#374151",
        fontSize: 13,
        fontFamily: "inherit",
        transition: "background 0.12s",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

/* ────────────────────────── divider between toolbar groups ── */
function Sep() {
  return (
    <div
      style={{
        width: 1,
        height: 22,
        background: "#e2e8f0",
        margin: "0 4px",
        flexShrink: 0,
      }}
    />
  );
}

/* ──────────────────────────────────────────── link modal ── */
interface LinkModalProps {
  initial: { href: string; text: string; newTab: boolean };
  onSave: (href: string, newTab: boolean) => void;
  onRemove: () => void;
  onClose: () => void;
}
function LinkModal({ initial, onSave, onRemove, onClose }: LinkModalProps) {
  const [href, setHref] = useState(initial.href);
  const [newTab, setNewTab] = useState(initial.newTab);
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", width: 420, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#0f172a" }}>
          {initial.href ? "Edit Link" : "Insert Link"}
        </h3>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#374151" }}>URL</label>
        <input
          autoFocus
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="https://example.com"
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 20, fontSize: 13, color: "#374151" }}>
          <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} />
          Open in new tab
        </label>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {initial.href && (
            <button type="button" onClick={onRemove} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Remove link
            </button>
          )}
          <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { if (href.trim()) onSave(href.trim(), newTab); }}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#0127FC,#2545FD)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── image modal ── */
interface ImageInsertOpts {
  src: string;
  alt: string;
  width: string;
  align: "left" | "center" | "right";
  caption: string;
}
interface ImageModalProps {
  onInsert: (opts: ImageInsertOpts) => void;
  onClose: () => void;
}
function ImageModal({ onInsert, onClose }: ImageModalProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [width, setWidth] = useState("100%");
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "edumiles/blogs/content");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.data.url);
      } else {
        setErr(data.message || "Upload failed");
      }
    } catch {
      setErr("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const finalSrc = tab === "upload" ? uploadedUrl : url;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.38)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", width: 480, maxWidth: "95vw", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#0f172a" }}>
          Insert Image
        </h3>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["upload", "url"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{ padding: "6px 16px", borderRadius: 8, border: tab === t ? "1.5px solid #0127FC" : "1.5px solid #e2e8f0", background: tab === t ? "#e0e7ff" : "#fff", color: tab === t ? "#0127FC" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              {t === "upload" ? "Upload" : "Image URL"}
            </button>
          ))}
        </div>

        {tab === "upload" ? (
          <div style={{ marginBottom: 14 }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ padding: "8px 18px", borderRadius: 8, border: "1.5px dashed #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#64748b", marginBottom: 8 }}
            >
              {uploading ? "Uploading…" : "Choose file"}
            </button>
            {uploadedUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={uploadedUrl} alt="preview" style={{ maxHeight: 100, display: "block", marginTop: 8, borderRadius: 6 }} />
            )}
            {err && <span style={{ color: "#dc2626", fontSize: 12 }}>{err}</span>}
          </div>
        ) : (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>Image URL</label>
            <input
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>Alt text</label>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>Width</label>
            <input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="100%, 600px, …" style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>Alignment</label>
            <select value={align} onChange={(e) => setAlign(e.target.value as "left" | "center" | "right")} style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>Caption (optional)</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Image caption" style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, boxSizing: "border-box" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button
            type="button"
            disabled={!finalSrc}
            onClick={() => { if (finalSrc) onInsert({ src: finalSrc, alt, width, align, caption }); }}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: finalSrc ? "linear-gradient(135deg,#0127FC,#2545FD)" : "#e2e8f0", color: finalSrc ? "#fff" : "#94a3b8", fontSize: 13, fontWeight: 700, cursor: finalSrc ? "pointer" : "not-allowed" }}
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── youtube modal ── */
function YoutubeModal({ onInsert, onClose }: { onInsert: (url: string) => void; onClose: () => void; }) {
  const [url, setUrl] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", width: 420, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 14, color: "#0f172a" }}>Embed YouTube Video</h3>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" }}>YouTube URL</label>
        <input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, marginBottom: 18, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button type="button" disabled={!url.trim()} onClick={() => { if (url.trim()) onInsert(url.trim()); }} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: url.trim() ? "linear-gradient(135deg,#0127FC,#2545FD)" : "#e2e8f0", color: url.trim() ? "#fff" : "#94a3b8", fontSize: 13, fontWeight: 700, cursor: url.trim() ? "pointer" : "not-allowed" }}>Embed</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────── table modal ── */
function TableModal({ onInsert, onClose }: { onInsert: (rows: number, cols: number) => void; onClose: () => void; }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", width: 320, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 14, color: "#0f172a" }}>Insert Table</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Rows</label>
            <input type="number" min={1} max={20} value={rows} onChange={(e) => setRows(+e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Columns</label>
            <input type="number" min={1} max={10} value={cols} onChange={(e) => setCols(+e.target.value)} style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, boxSizing: "border-box" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button type="button" onClick={() => onInsert(rows, cols)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#0127FC,#2545FD)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Insert</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────── colour picker button ── */
function ColourPicker({ title, icon, currentColor, onPick }: { title: string; icon: string; currentColor: string; onPick: (c: string) => void; }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <span title={title} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 7px", height: 28, borderRadius: 6, border: "none", cursor: "pointer", background: "transparent", color: "#374151", fontSize: 14, position: "relative" }}
      >
        <span>{icon}</span>
        <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 16, height: 3, borderRadius: 2, background: currentColor || "#000" }} />
      </button>
      <input
        ref={ref}
        type="color"
        value={currentColor || "#000000"}
        onChange={(e) => onPick(e.target.value)}
        style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        tabIndex={-1}
      />
    </span>
  );
}

/* ═══════════════════════════════════════ MAIN COMPONENT ══ */
export default function RichTextEditor({ value, onChange, placeholder = "Start writing your blog post…", minHeight = 420 }: RichTextEditorProps) {
  const [linkModal, setLinkModal] = useState<{ href: string; text: string; newTab: boolean } | null>(null);
  const [imageModal, setImageModal] = useState(false);
  const [ytModal, setYtModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#fef08a");
  // Track value internally to avoid infinite setContent loops
  const lastValueRef = useRef<string>("");

  /* ─── Build image HTML with optional caption ─── */
  function buildImageHtml(opts: ImageInsertOpts) {
    const alignStyle =
      opts.align === "center" ? "margin-left:auto;margin-right:auto;display:block;" :
      opts.align === "right"  ? "margin-left:auto;display:block;" :
      "display:block;";
    const imgTag = `<img src="${opts.src}" alt="${opts.alt || ""}" style="width:${opts.width || "100%"};max-width:100%;height:auto;border-radius:8px;${alignStyle}" loading="lazy" />`;
    return `<figure style="margin:0 0 1.25em;text-align:${opts.align};">${imgTag}${opts.caption ? `<figcaption style="font-size:13px;color:#64748b;margin-top:6px;font-style:italic;">${opts.caption}</figcaption>` : ""}</figure>`;
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        horizontalRule: {},
        code: {},
        codeBlock: {},
        blockquote: {},
      }),
      UnderlineExt,
      TextStyleExt,
      ColorExt,
      HighlightExt.configure({ multicolor: true }),
      TextAlignExt.configure({ types: ["heading", "paragraph"] }),
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      ImageExt.configure({ inline: false, allowBase64: false }),
      YoutubeExt.configure({ width: 640, height: 360, nocookie: true }),
      TableExt.configure({ resizable: true }),
      TableRowExt,
      TableHeaderExt,
      TableCellExt,
      SuperscriptExt,
      SubscriptExt,
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor: ed }) {
      const html = ed.getHTML();
      lastValueRef.current = html;
      onChange(html);
    },
  });

  /* Sync external value changes (e.g., loading saved blog) */
  useEffect(() => {
    if (!editor) return;
    // Only update if the incoming value is genuinely different from what the editor last emitted
    if (value !== lastValueRef.current) {
      lastValueRef.current = value || "";
      editor.commands.setContent(value || "");
    }
  // We intentionally only react to `value` changes — editor is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* ── Link helpers ── */
  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const attrs = editor.getAttributes("link");
    setLinkModal({ href: (attrs.href as string) || "", text: "", newTab: attrs.target === "_blank" });
  }, [editor]);

  const saveLink = useCallback((href: string, newTab: boolean) => {
    if (!editor) return;
    editor.chain().focus().setLink({ href, target: newTab ? "_blank" : undefined }).run();
    setLinkModal(null);
  }, [editor]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setLinkModal(null);
  }, [editor]);

  /* ── Image insert ── */
  const insertImage = useCallback((opts: ImageInsertOpts) => {
    if (!editor) return;
    editor.chain().focus().insertContent(buildImageHtml(opts)).run();
    setImageModal(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  /* ── YouTube insert ── */
  const insertYoutube = useCallback((url: string) => {
    if (!editor) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
    setYtModal(false);
  }, [editor]);

  /* ── Table insert ── */
  const insertTable = useCallback((rows: number, cols: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setTableModal(false);
  }, [editor]);

  if (!editor) return null;

  const isInTable = editor.isActive("table");

  return (
    <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

      {/* ═══════ TOOLBAR ═══════════════════════════ */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "8px 10px", borderBottom: "1.5px solid #e2e8f0", background: "#f8fafc" }}>

        {/* ── Heading / paragraph dropdown ── */}
        <select
          value={
            editor.isActive("heading", { level: 1 }) ? "h1" :
            editor.isActive("heading", { level: 2 }) ? "h2" :
            editor.isActive("heading", { level: 3 }) ? "h3" :
            editor.isActive("heading", { level: 4 }) ? "h4" :
            editor.isActive("heading", { level: 5 }) ? "h5" :
            editor.isActive("heading", { level: 6 }) ? "h6" : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level: parseInt(v.slice(1)) as 1|2|3|4|5|6 }).run();
            }
          }}
          style={{ padding: "4px 8px", borderRadius: 6, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#fff", height: 28 }}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        <Sep />

        {/* ── Text formatting ── */}
        <ToolBtn active={editor.isActive("bold")}       title="Bold (Ctrl+B)"    onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolBtn>
        <ToolBtn active={editor.isActive("italic")}     title="Italic (Ctrl+I)"  onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolBtn>
        <ToolBtn active={editor.isActive("underline")}  title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolBtn>
        <ToolBtn active={editor.isActive("strike")}     title="Strikethrough"    onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></ToolBtn>
        <ToolBtn active={editor.isActive("superscript")} title="Superscript"    onClick={() => editor.chain().focus().toggleSuperscript().run()}>x<sup>2</sup></ToolBtn>
        <ToolBtn active={editor.isActive("subscript")}   title="Subscript"      onClick={() => editor.chain().focus().toggleSubscript().run()}>x<sub>2</sub></ToolBtn>

        <Sep />

        {/* ── Colour pickers ── */}
        <ColourPicker title="Text colour"      icon="A" currentColor={textColor}      onPick={(c) => { setTextColor(c); editor.chain().focus().setColor(c).run(); }} />
        <ColourPicker title="Highlight colour" icon="▮" currentColor={highlightColor} onPick={(c) => { setHighlightColor(c); editor.chain().focus().setHighlight({ color: c }).run(); }} />

        <Sep />

        {/* ── Alignment ── */}
        <ToolBtn active={editor.isActive({ textAlign: "left" })}    title="Align left"    onClick={() => editor.chain().focus().setTextAlign("left").run()}>⟵</ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "center" })}  title="Align center"  onClick={() => editor.chain().focus().setTextAlign("center").run()}>≡</ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "right" })}   title="Align right"   onClick={() => editor.chain().focus().setTextAlign("right").run()}>⟶</ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "justify" })} title="Justify"       onClick={() => editor.chain().focus().setTextAlign("justify").run()}>☰</ToolBtn>

        <Sep />

        {/* ── Lists ── */}
        <ToolBtn active={editor.isActive("bulletList")}  title="Bullet list"   onClick={() => editor.chain().focus().toggleBulletList().run()}>•≡</ToolBtn>
        <ToolBtn active={editor.isActive("orderedList")} title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1≡</ToolBtn>

        <Sep />

        {/* ── Block elements ── */}
        <ToolBtn active={editor.isActive("blockquote")} title="Blockquote"   onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</ToolBtn>
        <ToolBtn active={editor.isActive("codeBlock")}  title="Code block"   onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</ToolBtn>
        <ToolBtn active={editor.isActive("code")}       title="Inline code"  onClick={() => editor.chain().focus().toggleCode().run()}>`</ToolBtn>
        <ToolBtn active={false}                         title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>─</ToolBtn>

        <Sep />

        {/* ── Link ── */}
        <ToolBtn active={editor.isActive("link")} title="Insert / edit link" onClick={openLinkModal}>🔗</ToolBtn>

        <Sep />

        {/* ── Media ── */}
        <ToolBtn active={false} title="Insert image"         onClick={() => setImageModal(true)}>🖼</ToolBtn>
        <ToolBtn active={false} title="Embed YouTube video"  onClick={() => setYtModal(true)}>▶</ToolBtn>

        <Sep />

        {/* ── Table ── */}
        <ToolBtn active={isInTable} title={isInTable ? "Table active" : "Insert table"} onClick={() => { if (!isInTable) setTableModal(true); }}>▦</ToolBtn>
        {isInTable && (
          <>
            <ToolBtn active={false} title="Add column before" onClick={() => editor.chain().focus().addColumnBefore().run()}>+←</ToolBtn>
            <ToolBtn active={false} title="Add column after"  onClick={() => editor.chain().focus().addColumnAfter().run()}>+→</ToolBtn>
            <ToolBtn active={false} title="Delete column"     onClick={() => editor.chain().focus().deleteColumn().run()}>×col</ToolBtn>
            <ToolBtn active={false} title="Add row before"    onClick={() => editor.chain().focus().addRowBefore().run()}>+↑</ToolBtn>
            <ToolBtn active={false} title="Add row after"     onClick={() => editor.chain().focus().addRowAfter().run()}>+↓</ToolBtn>
            <ToolBtn active={false} title="Delete row"        onClick={() => editor.chain().focus().deleteRow().run()}>×row</ToolBtn>
            <ToolBtn active={false} title="Delete table"      onClick={() => editor.chain().focus().deleteTable().run()}>×tbl</ToolBtn>
          </>
        )}

        <Sep />

        {/* ── Undo / redo ── */}
        <ToolBtn active={false} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>↩</ToolBtn>
        <ToolBtn active={false} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>↪</ToolBtn>
      </div>

      {/* ═══════ EDITOR CONTENT ════════════════════ */}
      <div style={{ padding: "16px 20px", minHeight, background: "#fff" }}>
        <EditorContent editor={editor} />
      </div>

      {/* ─── Bubble menu (appears on text selection) ─── */}
      <BubbleMenu editor={editor}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#1e293b", borderRadius: 8, padding: "4px 6px", boxShadow: "0 4px 20px rgba(0,0,0,0.28)" }}>
          {[
            { key: "bold",      label: "B", fn: () => editor.chain().focus().toggleBold().run() },
            { key: "italic",    label: "I", fn: () => editor.chain().focus().toggleItalic().run() },
            { key: "underline", label: "U", fn: () => editor.chain().focus().toggleUnderline().run() },
            { key: "strike",    label: "S", fn: () => editor.chain().focus().toggleStrike().run() },
            { key: "link",      label: "🔗", fn: openLinkModal },
          ].map(({ key, label, fn }) => (
            <button
              key={key}
              type="button"
              onClick={fn}
              style={{ padding: "4px 8px", borderRadius: 5, border: "none", cursor: "pointer", background: editor.isActive(key) ? "#3b82f6" : "transparent", color: "#f8fafc", fontSize: 12, fontWeight: 700 }}
            >
              {label}
            </button>
          ))}
        </div>
      </BubbleMenu>

      {/* ─── Modals ─── */}
      {linkModal  && <LinkModal initial={linkModal} onSave={saveLink} onRemove={removeLink} onClose={() => setLinkModal(null)} />}
      {imageModal && <ImageModal onInsert={insertImage} onClose={() => setImageModal(false)} />}
      {ytModal    && <YoutubeModal onInsert={insertYoutube} onClose={() => setYtModal(false)} />}
      {tableModal && <TableModal onInsert={insertTable} onClose={() => setTableModal(false)} />}

      {/* ─── Editor CSS ─── */}
      <style>{`
        .ProseMirror {
          outline: none;
          min-height: ${minHeight}px;
          line-height: 1.85;
          color: #0f172a;
          font-size: 15px;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder}";
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 { font-size: 2em;    font-weight: 800; line-height: 1.2;  margin: .75em 0 .4em;  color: #0f172a; font-family: 'Poppins', sans-serif; }
        .ProseMirror h2 { font-size: 1.6em;  font-weight: 700; line-height: 1.25; margin: .7em 0 .35em;  font-family: 'Poppins', sans-serif; }
        .ProseMirror h3 { font-size: 1.35em; font-weight: 700; line-height: 1.3;  margin: .65em 0 .3em;  font-family: 'Poppins', sans-serif; }
        .ProseMirror h4 { font-size: 1.15em; font-weight: 600; margin: .6em 0 .25em; }
        .ProseMirror h5 { font-size: 1.05em; font-weight: 600; margin: .5em 0 .2em;  }
        .ProseMirror h6 { font-size: .95em;  font-weight: 600; color: #475569; margin: .5em 0 .2em; }
        .ProseMirror p  { margin: 0 0 .9em; }
        .ProseMirror blockquote { border-left: 4px solid #0127FC; padding: 10px 16px; margin: 1em 0; color: #475569; background: #f1f5f9; border-radius: 0 8px 8px 0; font-style: italic; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.6em; margin: .5em 0 1em; }
        .ProseMirror li { margin-bottom: .25em; }
        .ProseMirror code { background: #f1f5f9; border-radius: 4px; padding: 2px 5px; font-size: .88em; font-family: 'Fira Mono', monospace; color: #0127FC; }
        .ProseMirror pre { background: #1e293b; color: #e2e8f0; border-radius: 8px; padding: 16px 20px; overflow-x: auto; margin: 1em 0; }
        .ProseMirror pre code { background: none; color: inherit; padding: 0; font-size: .9em; }
        .ProseMirror hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5em 0; }
        .ProseMirror a { color: #0127FC; text-decoration: underline; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; display: block; }
        .ProseMirror figure { margin: 0 0 1.25em; }
        .ProseMirror figcaption { font-size: 13px; color: #64748b; margin-top: 6px; font-style: italic; }
        .ProseMirror table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .ProseMirror th, .ProseMirror td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
        .ProseMirror th { background: #f1f5f9; font-weight: 700; }
        .ProseMirror mark { border-radius: 3px; padding: 1px 2px; }
        .ProseMirror iframe { max-width: 100%; border-radius: 8px; }
        .ProseMirror .selectedCell:after { background: rgba(1,39,252,0.08); content: ""; left:0; right:0; top:0; bottom:0; pointer-events:none; position:absolute; z-index:2; }
        .ProseMirror .column-resize-handle { background-color: #0127FC; bottom:-2px; pointer-events:none; position:absolute; right:-2px; top:0; width:4px; }
        .ProseMirror-focused { outline: none; }
      `}</style>
    </div>
  );
}
