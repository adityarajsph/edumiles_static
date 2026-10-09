"use client";

import { useState, FormEvent } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/admin/change-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || "Failed to change password."); return; }
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px 10px 40px",
    border: "1.5px solid #e2e8f0", borderRadius: 10,
    fontSize: 14, color: "#0f172a", outline: "none",
    boxSizing: "border-box", background: "#fff",
    fontFamily: "'Inter',sans-serif",
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 6 }}>
        Settings
      </h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Manage your admin account preferences.</p>

      {/* Change Password */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px 26px" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={16} color="#FE8100" /> Change Password
        </h2>

        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, color: "#15803d", fontSize: 14, fontWeight: 600 }}>
            <CheckCircle size={16} /> Password changed successfully.
          </div>
        )}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#dc2626", fontSize: 14, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Current password */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Current Password</span>
            <div style={{ position: "relative" }}>
              <Lock size={14} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type={showCurrent ? "text" : "password"}
                value={form.currentPassword}
                onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                required
                style={inputStyle}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>

          {/* New password */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>New Password</span>
            <div style={{ position: "relative" }}>
              <Lock size={14} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                required
                style={inputStyle}
                placeholder="Min. 8 characters"
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>

          {/* Confirm password */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Confirm New Password</span>
            <div style={{ position: "relative" }}>
              <Lock size={14} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                required
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px", borderRadius: 10, border: "none",
              background: loading ? "#94a3b8" : "linear-gradient(135deg,#FE8100,#FF9A2E)",
              color: "#fff", fontFamily: "'Poppins',sans-serif",
              fontWeight: 700, fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 4,
            }}
          >
            {loading ? <><Loader2 size={15} className="spin" /> Saving…</> : "Update Password"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
