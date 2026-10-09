"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, BookOpen, MessageSquare, TrendingUp, Clock, ArrowRight, RefreshCw } from "lucide-react";

interface Stats {
  packages: number;
  blogs: number;
  newSubmissions: number;
  totalSubmissions: number;
}

interface Submission {
  _id: string;
  formName: string;
  formSlug: string;
  data: Record<string, string>;
  status: string;
  createdAt: string;
}

function StatCard({ icon, label, value, color, href }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "22px 24px", display: "flex", alignItems: "center", gap: 16,
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s",
        cursor: "pointer",
      }}
        onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)")}
        onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)")}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: color + "20", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 28, color: "#0f172a", margin: 0, lineHeight: 1 }}>
            {value}
          </p>
          <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>{label}</p>
        </div>
        <ArrowRight size={16} color="#94a3b8" style={{ marginLeft: "auto" }} />
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]               = useState<Stats | null>(null);
  const [submissions, setSubmissions]   = useState<Submission[]>([]);
  const [loading, setLoading]           = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const [pkgRes, blogRes, formRes] = await Promise.all([
        fetch("/api/packages?limit=1&status=published"),
        fetch("/api/blogs?limit=1&status=published"),
        fetch("/api/forms?limit=5"),
      ]);
      const [pkgData, blogData, formData] = await Promise.all([pkgRes.json(), blogRes.json(), formRes.json()]);

      setStats({
        packages:         pkgData.data?.total ?? 0,
        blogs:            blogData.data?.total ?? 0,
        newSubmissions:   Object.values(formData.data?.unreadCounts ?? {}).reduce((a: number, b) => a + (b as number), 0) as number,
        totalSubmissions: formData.data?.total ?? 0,
      });
      setSubmissions(formData.data?.items ?? []);
    } catch {
      // Dashboard failing to load stats should not crash
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 24, color: "#0f172a", margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>Welcome back to EdumilesTravels CMS</p>
        </div>
        <button
          onClick={fetchData}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 10, border: "1px solid #e2e8f0",
            background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b",
          }}
        >
          <RefreshCw size={13} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard icon={<Package size={22} />}      label="Published Packages"   value={loading ? "…" : stats?.packages ?? 0}         color="#FE8100"  href="/admin/packages" />
        <StatCard icon={<BookOpen size={22} />}     label="Published Blog Posts" value={loading ? "…" : stats?.blogs ?? 0}             color="#0127FC"  href="/admin/blogs" />
        <StatCard icon={<MessageSquare size={22} />} label="New Submissions"     value={loading ? "…" : stats?.newSubmissions ?? 0}    color="#ef4444"  href="/admin/submissions" />
        <StatCard icon={<TrendingUp size={22} />}   label="Total Submissions"    value={loading ? "…" : stats?.totalSubmissions ?? 0}  color="#10b981"  href="/admin/submissions" />
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 32 }}>
        {[
          { href: "/admin/packages/new", label: "Add New Package", color: "#FE8100" },
          { href: "/admin/blogs/new",    label: "Add New Blog Post", color: "#0127FC" },
          { href: "/admin/submissions",  label: "View Submissions",  color: "#10b981" },
        ].map(a => (
          <Link key={a.href} href={a.href}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px", borderRadius: 12, textDecoration: "none",
              background: a.color, color: "#fff",
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
              boxShadow: `0 4px 16px ${a.color}40`,
            }}
          >
            {a.label} <ArrowRight size={14} />
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#0f172a", margin: 0 }}>
            Recent Submissions
          </h2>
          <Link href="/admin/submissions" style={{ fontSize: 13, color: "#FE8100", fontWeight: 600, textDecoration: "none" }}>
            View all <ArrowRight size={12} style={{ verticalAlign: "middle" }} />
          </Link>
        </div>
        {submissions.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8" }}>
            {loading ? "Loading…" : "No submissions yet."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Form", "Name", "Email", "Status", "Date"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s._id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>
                    <span style={{
                      background: "#f1f5f9", color: "#475569",
                      fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                    }}>{s.formName}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>
                    {(s.data.name as string) || "—"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>
                    {(s.data.email as string) || "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999,
                      background: s.status === "new" ? "#fef2f2" : "#f0fdf4",
                      color: s.status === "new" ? "#dc2626" : "#15803d",
                    }}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>
                    <Clock size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
                    {fmtDate(s.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
