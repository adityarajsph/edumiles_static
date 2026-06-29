"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const reviews = [
  { name: "Priya Sharma",    location: "Mumbai",    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",  rating: 5, trip: "Golden Triangle Tour", date: "March 2024",    text: "EdumilesTravels made our Rajasthan trip absolutely magical! The hotels were stunning, the itinerary was perfectly planned and the team was available 24/7. Will definitely book again!" },
  { name: "Rahul Verma",     location: "Delhi",     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",  rating: 5, trip: "Kerala Backwaters",   date: "January 2024",  text: "Our Kerala honeymoon was beyond dreams. The houseboat experience, the food, the sunsets — everything was curated to perfection. A trip we'll never forget." },
  { name: "Anjali & Rohan",  location: "Pune",      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali", rating: 5, trip: "Himachal Adventure",  date: "May 2024",      text: "Best family trip ever! Took our kids to Manali and the adventure activities were safe, fun and well-organised. The kids are already asking when we can go back!" },
  { name: "Karan Mehta",     location: "Bangalore", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",  rating: 5, trip: "Goa Solo Escape",     date: "February 2024", text: "Prices are genuinely unbeatable for the quality you get. The custom package they built for my solo Goa trip was exactly what I wanted. No regrets at all." },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation();
  const [cur, setCur]       = useState(0);
  const [fading, setFading] = useState(false);

  const go = useCallback((dir: "prev" | "next") => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setCur(c => dir === "next" ? (c + 1) % reviews.length : (c - 1 + reviews.length) % reviews.length);
      setFading(false);
    }, 280);
  }, [fading]);

  useEffect(() => {
    const t = setInterval(() => go("next"), 5000);
    return () => clearInterval(t);
  }, [go]);

  const r = reviews[cur];

  return (
    <section style={{ padding: "96px 24px", background: "linear-gradient(135deg, rgba(1,39,252,0.04) 0%, #fff 50%, rgba(254,129,0,0.04) 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div ref={ref} style={{
          textAlign: "center", marginBottom: 56,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease",
        }}>
          <span className="section-tag">Real Stories</span>
          <h2 className="section-title">What Our Travellers Say</h2>
          <div className="section-divider" />
        </div>

        <div style={{
          maxWidth: 760, margin: "0 auto",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          transition: "all 0.7s ease 0.2s",
        }}>
          {/* Card */}
          <div style={{
            background: "#fff", borderRadius: 28,
            boxShadow: "0 8px 48px rgba(0,0,0,0.1)",
            padding: "44px 40px 36px",
            border: "1px solid #f1f5f9",
            position: "relative",
          }}>
            {/* Quote icon */}
            <div style={{
              position: "absolute", top: -18, left: 36,
              width: 40, height: 40, borderRadius: 14,
              background: "linear-gradient(135deg,#FE8100,#FF9A2E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(254,129,0,0.35)",
            }}>
              <Quote size={18} color="#fff" fill="#fff" />
            </div>

            <div style={{ opacity: fading ? 0 : 1, transform: fading ? "translateX(12px)" : "translateX(0)", transition: "all 0.28s ease" }}>
              {/* Stars */}
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={18} fill="#FE8100" color="#FE8100" />
                ))}
              </div>

              {/* Text */}
              <p style={{ color: "#334155", fontSize: 17, lineHeight: 1.75, fontStyle: "italic", marginBottom: 28 }}>
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={r.avatar} alt={r.name} style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", border: "2px solid rgba(254,129,0,0.25)" }} />
                  <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "#0127FC", fontSize: 15 }}>{r.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>{r.location}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#FE8100", fontSize: 12, fontWeight: 600 }}>{r.trip}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{r.date}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 28 }}>
            <button onClick={() => go("prev")} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#FE8100"; e.currentTarget.style.color = "#FE8100"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
              <ChevronLeft size={18} />
            </button>

            <div style={{ display: "flex", gap: 8 }}>
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setCur(i)} style={{
                  height: 10, borderRadius: 9999, border: "none", cursor: "pointer",
                  background: i === cur ? "#FE8100" : "#e2e8f0",
                  width: i === cur ? 28 : 10,
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>

            <button onClick={() => go("next")} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#FE8100"; e.currentTarget.style.color = "#FE8100"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
