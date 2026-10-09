export default function BlogDetailLoading() {
  return (
    <>
      {/* Hero banner skeleton */}
      <div style={{
        background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
        padding: "100px 24px 0",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[60, 12, 50, 12, 180].map((w, i) => (
              <div key={i} className="skel" style={{
                width: w, height: 13, borderRadius: 7,
                background: i % 2 === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.22)",
              }} />
            ))}
          </div>
          {/* Tags row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {[80, 110, 90, 80].map((w, i) => (
              <div key={i} className="skel" style={{ width: w, height: 22, borderRadius: 9999, background: "rgba(255,255,255,0.18)" }} />
            ))}
          </div>
          {/* Title */}
          <div className="skel" style={{ width: "75%", height: 44, borderRadius: 10, marginBottom: 12, background: "rgba(255,255,255,0.22)" }} />
          <div className="skel" style={{ width: "50%", height: 44, borderRadius: 10, marginBottom: 20, background: "rgba(255,255,255,0.16)" }} />
          {/* Excerpt */}
          {[100, 90, 70].map((w, i) => (
            <div key={i} className="skel" style={{ width: `${w}%`, height: 14, borderRadius: 7, marginBottom: 8, background: "rgba(255,255,255,0.15)" }} />
          ))}
          {/* Cover image */}
          <div className="skel" style={{ width: "100%", height: 420, borderRadius: "16px 16px 0 0", marginTop: 20, background: "rgba(255,255,255,0.1)" }} />
        </div>
      </div>

      {/* Content skeleton */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 40 }} className="skel-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="skel" style={{ height: 80, borderRadius: 14 }} />
          {[100, 90, 95, 88, 80, 85, 92, 75].map((w, i) => (
            <div key={i} className="skel" style={{ width: `${w}%`, height: 15, borderRadius: 8 }} />
          ))}
          <div className="skel" style={{ width: "55%", height: 22, borderRadius: 10, marginTop: 8 }} />
          {[100, 94, 88, 96, 80].map((w, i) => (
            <div key={i} className="skel" style={{ width: `${w}%`, height: 15, borderRadius: 8 }} />
          ))}
        </div>
        <div>
          <div className="skel" style={{ height: 280, borderRadius: 16 }} />
        </div>
      </div>

      <style>{`
        .skel {
          background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (min-width: 1024px) {
          .skel-grid { grid-template-columns: minmax(0,1fr) 300px !important; }
        }
      `}</style>
    </>
  );
}
