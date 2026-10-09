import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BookOpen, ArrowRight } from "lucide-react";

export default function BlogNotFound() {
  return (
    <>
      <Navbar />
      <main style={{
        background: "#f8fafc", minHeight: "calc(100vh - 76px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", textAlign: "center",
      }}>
        <div style={{
          position: "fixed", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(1,39,252,0.06) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", bottom: "20%", right: "10%", width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(254,129,0,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 500 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 22px",
            background: "linear-gradient(135deg,rgba(254,129,0,0.1),rgba(1,39,252,0.07))",
            border: "2px solid rgba(254,129,0,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BookOpen size={36} color="#FE8100" strokeWidth={1.5} />
          </div>

          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
            color: "#fff", fontFamily: "'Poppins',sans-serif",
            fontWeight: 900, fontSize: 12, letterSpacing: "0.08em",
            padding: "5px 16px", borderRadius: 9999, marginBottom: 18,
          }}>
            404 — ARTICLE NOT FOUND
          </span>

          <h1 style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 900,
            fontSize: "clamp(26px,4vw,38px)", color: "#0127FC",
            lineHeight: 1.2, marginBottom: 14,
          }}>
            This story doesn&apos;t exist yet
          </h1>

          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            The article you&apos;re looking for may have been removed or the link might be incorrect.
            Explore all our travel stories below.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Link href="/blog" className="btn-primary" style={{ textDecoration: "none" }} aria-label="Browse all articles">
              Browse All Articles <ArrowRight size={15} />
            </Link>
            <Link href="/" className="btn-navy-outline" style={{ textDecoration: "none" }} aria-label="Go home">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
