"use client";

import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface CTAProps {
  onOpenContact: (subject?: string) => void;
}

export default function CTA({ onOpenContact }: CTAProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} style={{
          position: "relative", overflow: "hidden",
          borderRadius: 36,
          background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
          padding: "clamp(48px,6vw,80px) clamp(28px,5vw,80px)",
          textAlign: "center",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.96)",
          transition: "all 0.7s ease",
        }}>
          {/* Blobs */}
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, background: "radial-gradient(circle, rgba(254,129,0,0.22) 0%, transparent 70%)", borderRadius: "50%", transform: "translate(30%,-40%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 280, height: 280, background: "radial-gradient(circle, rgba(254,129,0,0.14) 0%, transparent 70%)", borderRadius: "50%", transform: "translate(-30%,40%)", pointerEvents: "none" }} />

          {/* Dot grids */}
          <div style={{ position: "absolute", top: 20, left: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, opacity: 0.2, pointerEvents: "none" }}>
            {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />)}
          </div>
          <div style={{ position: "absolute", bottom: 20, right: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, opacity: 0.2, pointerEvents: "none" }}>
            {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />)}
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 9999, marginBottom: 20, backdropFilter: "blur(8px)" }}>
              <Sparkles size={13} color="#FE8100" /> Limited time offers available
            </div>

            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4.5vw,52px)", color: "#fff", lineHeight: 1.12, marginBottom: 16 }}>
              Ready for Your
              <span style={{ display: "block", background: "linear-gradient(135deg,#FE8100,#FF9A2E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Next Adventure?
              </span>
            </h2>

            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 17, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 36px" }}>
              Join 50,000+ travellers who trust EdumilesTravels to turn their dream vacations into reality.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              <button onClick={() => onOpenContact("Explore Packages")} className="btn-primary">
                Explore Packages <ArrowRight size={17} />
              </button>
              <a
                href="tel:+919955892640"
                className="btn-outline"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <Phone size={16} /> Talk to an Expert
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
