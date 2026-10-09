"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Loader2, Users, Eye, EyeOff, Shield, Pen } from "lucide-react";

interface AdminUser {
  _id: string;
  email: string;
  role: "superadmin" | "editor";
  modules: string[];
  createdAt: string;
}

interface CurrentAdmin {
  adminId: string;
  email: string;
  role: string;
}

/* ── All available admin modules ─────────────────── */
const ALL_MODULES: { key: string; label: string; description: string }[] = [
  { key: "packages",    label: "Packages",    description: "Create, edit, delete tour packages" },
  { key: "categories",  label: "Categories",  description: "Manage package categories" },
  { key: "blogs",       label: "Blog Posts",  description: "Create, edit, delete blog posts" },
  { key: "submissions", label: "Submissions", description: "View and manage form submissions" },
  { key: "settings",    label: "Settings",    description: "Change account password" },
];

const EMPTY_FORM = {
  email: "",
  password: "",
  role: "editor" as "superadmin" | "editor",
  modules: ALL_MODULES.map(m => m.key),   // default: all modules ticked
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  superadmin: { bg: "#fef3c7", color: "#d97706" },
  editor:     { bg: "#eff6ff", color: "#1d4ed8" },
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  superadmin: <Shield size={11} />,
  editor:     <Pen size={11} />,
};

export default function UsersPage() {
  const [items, setItems]               = useState<AdminUser[]>([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [editItem, setEditItem]         = useState<AdminUser | null>(null);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [showPw, setShowPw]             = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [toast, setToast]               = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [refreshKey, setRefreshKey]     = useState(0);

  function refreshUsers() { setRefreshKey(k => k + 1); }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block",
  };

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  // Fetch current admin identity once on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!cancelled && d.success) {
          setCurrentAdmin(d.data);
          setIsSuperadmin(d.data.role === "superadmin");
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Fetch users whenever refreshKey changes
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch("/api/admin/users")
      .then(r => r.json())
      .then(d => {
        if (!cancelled) {
          if (d.success) setItems(d.data);
          else setItems([]);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  function toggleModule(key: string) {
    setForm(f => ({
      ...f,
      modules: f.modules.includes(key)
        ? f.modules.filter(m => m !== key)
        : [...f.modules, key],
    }));
  }

  function openAdd() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowPw(false);
    setShowForm(true);
  }

  function openEdit(user: AdminUser) {
    setEditItem(user);
    setForm({
      email:    user.email,
      password: "",
      role:     user.role,
      // If modules is empty (old record or superadmin), default to all modules
      modules:  user.modules?.length ? user.modules : ALL_MODULES.map(m => m.key),
    });
    setErrors({});
    setShowPw(false);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditItem(null);
    setErrors({});
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!editItem && !form.password) errs.password = "Password is required";
    else if (form.password && form.password.length < 8) errs.password = "Password must be at least 8 characters";
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        email:   form.email,
        role:    form.role,
        modules: form.modules,
      };
      if (form.password) payload.password = form.password;

      const url    = editItem ? `/api/admin/users/${editItem._id}` : "/api/admin/users";
      const method = editItem ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        showToast("error", data.message || "Failed to save");
        return;
      }
      showToast("success", editItem ? "User updated!" : "User created!");
      closeForm();
      refreshUsers();
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res  = await fetch(`/api/admin/users/${deleteId}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) showToast("error", data.message || "Failed to delete");
    else showToast("success", "User deleted");
    setDeleteId(null);
    refreshUsers();
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  /** Render a compact pill list of granted modules */
  function ModulePills({ modules, role }: { modules: string[]; role: string }) {
    if (role === "superadmin") {
      return <span style={{ fontSize: 11, color: "#d97706", fontWeight: 600 }}>All modules</span>;
    }
    const list = modules.length ? modules : [];
    if (!list.length) return <span style={{ fontSize: 11, color: "#94a3b8" }}>None</span>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {list.map(m => {
          const mod = ALL_MODULES.find(x => x.key === m);
          return (
            <span key={m} style={{ background: "#f1f5f9", color: "#475569", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6 }}>
              {mod?.label ?? m}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", margin: 0 }}>Admin Users</h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: "3px 0 0" }}>{items.length} admin accounts</p>
        </div>
        {isSuperadmin && (
          <button onClick={openAdd}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10,
              background: "linear-gradient(135deg,#FE8100,#FF9A2E)", color: "#fff",
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
            }}>
            <Plus size={16} /> Add User
          </button>
        )}
      </div>

      {!isSuperadmin && !loading && (
        <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 12, padding: "14px 18px", marginBottom: 20, color: "#92400e", fontSize: 14 }}>
          <Shield size={14} style={{ marginRight: 8, verticalAlign: "middle" }} />
          You need superadmin role to manage users.
        </div>
      )}

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
            <Users size={40} color="#cbd5e1" strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>No admin users found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                  {["Email", "Role", "Module Access", "Created", ...(isSuperadmin ? ["Actions"] : [])].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(user => (
                  <tr key={user._id} style={{ borderBottom: "1px solid #f8fafc" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#fafbfc")}
                    onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px", fontSize: 14, color: "#0f172a", fontWeight: 500 }}>
                      {user.email}
                      {currentAdmin?.adminId === user._id && (
                        <span style={{ marginLeft: 8, background: "#e0f2fe", color: "#0369a1", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 9999 }}>You</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 700,
                        ...ROLE_COLORS[user.role],
                      }}>
                        {ROLE_ICONS[user.role]} {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", maxWidth: 260 }}>
                      <ModulePills modules={user.modules ?? []} role={user.role} />
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>{fmtDate(user.createdAt)}</td>
                    {isSuperadmin && (
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEdit(user)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, color: "#475569", cursor: "pointer" }}>
                            <Edit2 size={12} /> Edit
                          </button>
                          {currentAdmin?.adminId !== user._id && (
                            <button onClick={() => setDeleteId(user._id)}
                              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", fontSize: 12, color: "#dc2626", cursor: "pointer" }}>
                              <Trash2 size={12} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit modal ──────────────────────────── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflowY: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", maxWidth: 520, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#0f172a", margin: 0 }}>
                {editItem ? "Edit User" : "Add Admin User"}
              </h3>
              <button onClick={closeForm} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Email */}
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} placeholder="admin@example.com" />
                {errors.email && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.email}</span>}
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>{editItem ? "New Password (leave blank to keep current)" : "Password *"}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    style={inputStyle}
                    placeholder={editItem ? "Leave blank to keep current" : "Min. 8 characters"}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <span style={{ color: "#dc2626", fontSize: 12 }}>{errors.password}</span>}
              </div>

              {/* Role */}
              <div>
                <label style={labelStyle}>Role *</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as "superadmin" | "editor" }))} style={inputStyle}>
                  <option value="editor">Editor — restricted by module access below</option>
                  <option value="superadmin">Superadmin — full access to everything</option>
                </select>
              </div>

              {/* Module Access — only relevant for editor role */}
              <div>
                <label style={{ ...labelStyle, marginBottom: 10 }}>
                  Module Access
                  {form.role === "superadmin" && (
                    <span style={{ marginLeft: 8, fontWeight: 400, fontSize: 12, color: "#94a3b8" }}>
                      (superadmin always has full access)
                    </span>
                  )}
                </label>
                <div style={{
                  border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden",
                  opacity: form.role === "superadmin" ? 0.45 : 1,
                  pointerEvents: form.role === "superadmin" ? "none" : "auto",
                }}>
                  {ALL_MODULES.map((mod, idx) => {
                    const checked = form.modules.includes(mod.key);
                    return (
                      <label key={mod.key} style={{
                        display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
                        padding: "11px 14px",
                        borderBottom: idx < ALL_MODULES.length - 1 ? "1px solid #f1f5f9" : "none",
                        background: checked ? "#fff8f0" : "#fff",
                        transition: "background 0.15s",
                      }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleModule(mod.key)}
                          style={{ marginTop: 2, width: 15, height: 15, accentColor: "#FE8100", flexShrink: 0 }}
                        />
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: checked ? 700 : 500, color: checked ? "#c2410c" : "#0f172a" }}>{mod.label}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{mod.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={closeForm}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#64748b" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FE8100,#FF9A2E)", cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                {editItem ? "Update" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a", marginBottom: 8 }}>Delete User?</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>This admin user will be permanently removed and will no longer be able to log in.</p>
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
