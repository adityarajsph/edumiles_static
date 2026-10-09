"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Package, BookOpen, MessageSquare,
  Settings, LogOut, Menu, X, ChevronRight, Tag, Users, MapPin,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface UnreadCounts {
  [formSlug: string]: number;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread]           = useState<UnreadCounts>({});
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [allowedModules, setAllowedModules] = useState<string[] | null>(null); // null = not loaded yet
  const [modulesLoaded, setModulesLoaded]   = useState(false);

  // Don't show sidebar on the login page
  const isLoginPage = pathname === "/admin/login";

  // Fetch unread submission counts for sidebar badge + current admin role
  useEffect(() => {
    if (isLoginPage) return;
    fetch("/api/forms?status=new&limit=1")
      .then(r => r.json())
      .then(d => { if (d.success) setUnread(d.data.unreadCounts ?? {}); })
      .catch(() => {});
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const isSA = d.data.role === "superadmin";
          setIsSuperadmin(isSA);
          // superadmin => null means all allowed; editor => use their modules array
          setAllowedModules(isSA ? null : (d.data.modules ?? []));
        }
      })
      .catch(() => {})
      .finally(() => setModulesLoaded(true));
  }, [isLoginPage]);

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  /**
   * Returns true if this user can access a given module.
   * superadmin (allowedModules === null) always gets access.
   * editor gets access only if the module key is in their list.
   * Before modules are loaded, returns true to avoid flickering away items.
   */
  function canAccess(moduleKey: string): boolean {
    if (!modulesLoaded) return true;   // loading state — show everything until we know
    if (allowedModules === null) return true; // superadmin
    return allowedModules.includes(moduleKey);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const navItems: NavItem[] = [
    { href: "/admin",              label: "Dashboard",    icon: <LayoutDashboard size={18} /> },
    ...(canAccess("packages")    ? [{ href: "/admin/packages",    label: "Packages",    icon: <Package size={18} /> }] : []),
    ...(canAccess("categories")  ? [{ href: "/admin/categories",  label: "Categories",  icon: <Tag size={18} /> }] : []),
    ...(canAccess("destinations") ? [{ href: "/admin/destinations", label: "Destinations", icon: <MapPin size={18} /> }] : []),
    ...(canAccess("blogs")       ? [{ href: "/admin/blogs",       label: "Blog Posts",  icon: <BookOpen size={18} /> }] : []),
    ...(canAccess("submissions") ? [{ href: "/admin/submissions", label: "Submissions", icon: <MessageSquare size={18} />, badge: totalUnread || undefined }] : []),
    ...(isSuperadmin             ? [{ href: "/admin/users",       label: "Users",       icon: <Users size={18} /> }] : []),
    ...(canAccess("settings")    ? [{ href: "/admin/settings",    label: "Settings",    icon: <Settings size={18} /> }] : []),
  ];

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter',sans-serif", background: "#f8fafc" }}>

      {/* ── Mobile overlay ──────────────────────────── */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 240, background: "#0f172a",
        display: "flex", flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16 }}>
          <Image src="/edumiles.png" alt="EdumilesTravels" width={120} height={40} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>CMS Admin Panel</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 10,
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  background: active ? "rgba(254,129,0,0.15)" : "transparent",
                  fontWeight: active ? 600 : 400, fontSize: 14,
                  textDecoration: "none", transition: "all 0.15s",
                  borderLeft: active ? "3px solid #FE8100" : "3px solid transparent",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                <span style={{ color: active ? "#FE8100" : "rgba(255,255,255,0.4)" }}>{item.icon}</span>
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span style={{
                    marginLeft: "auto", background: "#ef4444", color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 9999,
                  }}>{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 14px", borderRadius: 10,
              background: "transparent", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.45)", fontSize: 14, transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)"; }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="admin-main">
        {/* Top bar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          background: "#fff", borderBottom: "1px solid #e2e8f0",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8" }}>
            <Link href="/admin" style={{ textDecoration: "none", color: "#64748b" }}>Admin</Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight size={13} />
                <span style={{ color: "#0f172a", fontWeight: 600 }}>
                  {pathname.split("/").slice(2).join(" / ").replace(/-/g, " ")}
                </span>
              </>
            )}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/"
              target="_blank"
              style={{ fontSize: 12, color: "#0127FC", fontWeight: 600, textDecoration: "none" }}
            >
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px 24px", maxWidth: 1400, width: "100%" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar { transform: translateX(0) !important; }
          .admin-main { margin-left: 240px; }
        }
      `}</style>
    </div>
  );
}
