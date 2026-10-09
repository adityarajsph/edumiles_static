"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid credentials");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Inter',sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "#fff", borderRadius: 20,
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        padding: "40px 36px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image src="/edumiles.png" alt="EdumilesTravels" width={140} height={48} style={{ objectFit: "contain" }} />
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Email */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Email address</span>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@edumilestravels.com"
                style={{
                  width: "100%", padding: "10px 12px 10px 38px",
                  border: "1.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: 14, color: "#0f172a", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </label>

          {/* Password */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</span>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "10px 38px 10px 38px",
                  border: "1.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: 14, color: "#0f172a", outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>

          {error && (
            <p style={{
              background: "#fef2f2", border: "1px solid #fca5a5",
              color: "#dc2626", fontSize: 13, borderRadius: 8, padding: "9px 12px", margin: 0,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px", borderRadius: 10, border: "none",
              background: loading ? "#94a3b8" : "linear-gradient(135deg,#FE8100,#FF9A2E)",
              color: "#fff", fontFamily: "'Poppins',sans-serif",
              fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? <><Loader2 size={16} className="spin" /> Signing in…</> : "Sign In"}
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
