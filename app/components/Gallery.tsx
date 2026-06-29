"use client";

import { useScrollAnimation } from "../hooks/useScrollAnimation";

const imgs = [
  { src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80", alt: "Goa beach" },
  { src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80", alt: "Rajasthan fort" },
  { src: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80", alt: "Kerala backwaters" },
  { src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80", alt: "Manali mountains" },
  { src: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&q=80", alt: "Varanasi ghats" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", alt: "Andaman beach" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", alt: "Nature sunset" },
  { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80", alt: "Mountain lake" },
];

export default function Gallery() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section style={{ padding: "96px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease",
        }}>
          <span className="section-tag">Travel Moments</span>
          <h2 className="section-title">Captured Journeys</h2>
          <div className="section-divider" />
          <p className="section-sub">Every picture tells a story. Here are some of our favourite moments from the road.</p>
        </div>

        {/* Masonry grid via CSS columns */}
        <div style={{
          columns: "4 240px", columnGap: 16,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          {imgs.map((img, i) => (
            <div key={i} style={{
              breakInside: "avoid", marginBottom: 16,
              borderRadius: 18, overflow: "hidden",
              position: "relative", cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }} className="gal-item">
              <img
                src={img.src} alt={img.alt}
                style={{ width: "100%", display: "block", transition: "transform 0.6s ease" }}
                className="gal-img"
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                opacity: 0, transition: "opacity 0.35s ease",
                display: "flex", alignItems: "flex-end", padding: 14,
              }} className="gal-overlay">
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{img.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .gal-item:hover .gal-img { transform: scale(1.06); }
        .gal-item:hover .gal-overlay { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
