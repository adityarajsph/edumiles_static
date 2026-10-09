/* loading.tsx — shown by Next.js while the page streams in */
export default function PackageDetailLoading() {
  return (
    <>
      <div style={{
        background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
        padding: "120px 24px 48px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Breadcrumb skeleton */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[80, 14, 90, 14, 160].map((w, i) => (
              <div key={i} className="skel" style={{
                width: w, height: 14, borderRadius: 7,
                background: i % 2 === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.25)",
              }} />
            ))}
          </div>
          {/* Hero text skeleton */}
          <div className="skel" style={{ width: 100, height: 12, borderRadius: 6, background: "rgba(254,129,0,0.4)", marginBottom: 10 }} />
          <div className="skel" style={{ width: 280, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.2)" }} />
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 96px" }}>
        {/* Gallery skeleton */}
        <div style={{ marginBottom: 40 }}>
          <div className="skel" style={{ width: "100%", aspectRatio: "16/9", borderRadius: 20, marginBottom: 10 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="skel" style={{ aspectRatio: "4/3", borderRadius: 12 }} />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 40 }}
          className="skel-grid">
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Title */}
            <div className="skel" style={{ width: "70%", height: 36, borderRadius: 10 }} />
            <div style={{ display: "flex", gap: 10 }}>
              {[120, 100, 110, 90].map((w, i) => (
                <div key={i} className="skel" style={{ width: w, height: 16, borderRadius: 8 }} />
              ))}
            </div>
            {/* Description */}
            {[100, 95, 88, 92, 70].map((w, i) => (
              <div key={i} className="skel" style={{ width: `${w}%`, height: 14, borderRadius: 7 }} />
            ))}
            {/* Inclusions block */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="skel" style={{ height: 200, borderRadius: 20 }} />
              <div className="skel" style={{ height: 200, borderRadius: 20 }} />
            </div>
          </div>

          {/* Right column booking card */}
          <div>
            <div className="skel" style={{ height: 340, borderRadius: 24 }} />
          </div>
        </div>
      </div>

      <style>{`
        .skel {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (min-width: 1024px) {
          .skel-grid {
            grid-template-columns: minmax(0,1fr) 360px !important;
          }
        }
      `}</style>
    </>
  );
}
