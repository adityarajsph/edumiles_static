import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MapPin, ArrowRight } from "lucide-react";

export default function PackageNotFound() {
  return (
    <>
      <Navbar />
      <main style={{
        background: "#f8fafc", minHeight: "calc(100vh - 76px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", textAlign: "center",
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: "fixed", top: "20%", left: "10%",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(1,39,252,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", bottom: "20%", right: "10%",
          width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(254,129,0,0.08) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
          {/* Icon */}
          <div style={{
            width: 88, height: 88, borderRadius: "50%", margin: "0 auto 24px",
            background: "linear-gradient(135deg,rgba(254,129,0,0.12),rgba(1,39,252,0.08))",
            border: "2px solid rgba(254,129,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MapPin size={40} color="#FE8100" strokeWidth={1.5} />
          </div>

          {/* 404 badge */}
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
            color: "#fff", fontFamily: "'Poppins',sans-serif",
            fontWeight: 900, fontSize: 13, letterSpacing: "0.08em",
            padding: "6px 18px", borderRadius: 9999,
            marginBottom: 20,
          }}>
            404 — PACKAGE NOT FOUND
          </span>

          <h1 style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 900,
            fontSize: "clamp(28px,4vw,42px)", color: "#0127FC",
            lineHeight: 1.2, marginBottom: 16,
          }}>
            Oops! This destination&nbsp;doesn&apos;t exist
          </h1>

          <p style={{
            color: "#64748b", fontSize: 16, lineHeight: 1.7, marginBottom: 36,
          }}>
            The package you&apos;re looking for may have been removed or the link might be incorrect.
            Explore our full range of curated travel packages below.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Link
              href="/packages"
              className="btn-primary"
              style={{ textDecoration: "none" }}
              aria-label="Browse all packages"
            >
              Browse All Packages <ArrowRight size={16} />
            </Link>

            <Link
              href="/"
              className="btn-navy-outline"
              style={{ textDecoration: "none" }}
              aria-label="Go to homepage"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
