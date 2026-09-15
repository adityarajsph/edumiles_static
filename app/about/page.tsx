"use client";

import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import {
  Award, MapPin, Users, TrendingUp,
  Heart, Shield, Star, Headphones,
  Mountain, Compass, CheckCircle, ArrowRight,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/* ─── Data ──────────────────────────────────────────── */
const stats = [
  { Icon: Users,      num: "2000+", label: "Happy Travellers", bg: "#fff7ed", iconBg: "#FE8100" },
  { Icon: MapPin,     num: "500+",  label: "Destinations",     bg: "#eff6ff", iconBg: "#0127FC" },
  { Icon: Award,      num: "7+",    label: "Years Experience", bg: "#f5f3ff", iconBg: "#7c3aed" },
  { Icon: TrendingUp, num: "4.9",  label: "Customer Rating",  bg: "#f0fdf4", iconBg: "#059669" },
];

const values = [
  { Icon: Heart,      title: "Passion for Travel",  desc: "We don't just plan trips — we craft memories that last a lifetime. Every itinerary is designed with genuine care.", grad: "linear-gradient(135deg,#FE8100,#FF9A2E)" },
  { Icon: Shield,     title: "Trust & Transparency", desc: "No hidden costs, no surprises. We believe in complete honesty with every package and price we offer.", grad: "linear-gradient(135deg,#0127FC,#2545FD)" },
  { Icon: Star,       title: "Quality First",        desc: "Only verified hotels, licensed guides and tried-and-tested routes make it into an EdumilesTravels package.", grad: "linear-gradient(135deg,#a855f7,#7c3aed)" },
  { Icon: Headphones, title: "24/7 Support",         desc: "Our travel experts are always a call or message away — before, during and after your journey.", grad: "linear-gradient(135deg,#10b981,#059669)" },
];

const team = [
  { name: "Rajiv Sharma",   role: "Founder & CEO",           image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Priya Mehta",    role: "Head of Operations",       image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Arjun Kapoor",   role: "Lead Travel Designer",     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Neha Agarwal",   role: "Customer Experience Lead", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
];

const milestones = [
  { year: "2019", title: "Founded in Delhi", desc: "Started with a small team and a big dream — to make quality travel accessible to every Indian." },
  { year: "2020", title: "500 Happy Travellers", desc: "Despite a challenging year, we stayed committed and helped 500 families plan safe, memorable trips." },
  { year: "2021", title: "Expanded Destinations", desc: "Launched 100+ new itineraries covering North-East India, Kashmir and religious circuits." },
  { year: "2022", title: "Award-Winning Service", desc: "Recognised as one of Delhi's most trusted travel agencies by multiple travel bodies." },
  { year: "2023", title: "Digital Transformation", desc: "Launched our digital platform, making it easier than ever to explore and book your dream trip." },
  { year: "2024", title: "2000+ Travellers & Beyond", desc: "Crossed 2,000 happy travellers with a 4.9-star average rating and growing team of experts." },
];

/* ─── Section wrappers ──────────────────────────────── */
function AnimatedSection({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(32px)",
      transition: "all 0.7s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────── */
export default function AboutPage() {
  const [modalOpen, setModalOpen]   = useState(false);
  const [modalSubject, setModalSubject] = useState<string | undefined>();

  const openContact = useCallback((subject?: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  }, []);

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section style={{
          background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
          padding: "140px 24px 80px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.25) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <span className="section-tag" style={{ color: "#FE8100" }}>Our Story</span>
            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(32px,5vw,60px)", color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
              About EdumilesTravels
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
              Making travel dreams come true since 2019. A team that believes every journey should be extraordinary.
            </p>
          </div>
        </section>

        {/* ── Story ── */}
        <section style={{ padding: "96px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 64, alignItems: "center" }}>

              {/* Image */}
              <AnimatedSection style={{ position: "relative" }}>
                <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=85"
                    alt="About EdumilesTravels"
                    style={{ width: "100%", height: 460, objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(1,39,252,0.3),transparent)", borderRadius: 28 }} />
                </div>
                {/* Badge */}
                <div style={{ position: "absolute", bottom: -20, right: -16, background: "#fff", borderRadius: 20, padding: "16px 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.14)", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#FE8100,#FF9A2E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Award size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Awarded</div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 13, color: "#0127FC" }}>Best Travel Agency 2024</div>
                  </div>
                </div>
                {/* Experience tag */}
                <div style={{ position: "absolute", top: -14, left: -14, background: "linear-gradient(135deg,#0127FC,#2545FD)", color: "#fff", borderRadius: 20, padding: "16px 18px", textAlign: "center", boxShadow: "0 8px 32px rgba(1,39,252,0.35)" }}>
                  <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>7+</div>
                  <div style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.3, marginTop: 4 }}>Years of<br />Excellence</div>
                </div>
              </AnimatedSection>

              {/* Text */}
              <AnimatedSection>
                <span className="section-tag">Who We Are</span>
                <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.5vw,42px)", color: "#0127FC", lineHeight: 1.15, marginBottom: 12 }}>
                  Making Travel Dreams<br />
                  <span style={{ color: "#FE8100" }}>Come True Since 2019</span>
                </h2>
                <div style={{ width: 56, height: 5, background: "linear-gradient(90deg,#FE8100,#FF9A2E)", borderRadius: 3, marginBottom: 24 }} />
                <p style={{ color: "#475569", lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
                  EdumilesTravels was born from a simple idea — everyone deserves a perfect holiday, no matter their budget.
                  Founded in 2019 and based in New Delhi, we&apos;ve grown into one of India&apos;s most trusted travel companies.
                </p>
                <p style={{ color: "#475569", lineHeight: 1.8, marginBottom: 32, fontSize: 15 }}>
                  From mountain treks to beach retreats, religious yatras to luxury escapes — we craft experiences that go beyond the ordinary.
                  Our expert team personally verifies every hotel, route and partner for a seamless journey.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {stats.map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: "16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                        <s.Icon size={18} color={s.iconBg} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 18, color: s.iconBg, lineHeight: 1, display: "flex", alignItems: "center", gap: 2 }}>
                          {s.num}{s.Icon === TrendingUp && <Star size={13} fill={s.iconBg} color={s.iconBg} />}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section style={{ padding: "96px 24px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <AnimatedSection>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <span className="section-tag">What Drives Us</span>
                <h2 className="section-title">Our Core Values</h2>
                <div className="section-divider" />
                <p className="section-sub">The principles that guide every trip we plan and every experience we create.</p>
              </div>
            </AnimatedSection>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
              {values.map((v, i) => (
                <AnimatedSection key={v.title} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="card" style={{ padding: "32px 28px", height: "100%" }}>
                    <div style={{ width: 54, height: 54, borderRadius: 16, background: v.grad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                      <v.Icon size={24} color="#fff" />
                    </div>
                    <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: "#0127FC", marginBottom: 10 }}>{v.title}</h3>
                    <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 14 }}>{v.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Journey / Timeline ── */}
        <section style={{ padding: "96px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <AnimatedSection>
              <div style={{ textAlign: "center", marginBottom: 64 }}>
                <span className="section-tag">Our Journey</span>
                <h2 className="section-title">Milestones That Define Us</h2>
                <div className="section-divider" />
              </div>
            </AnimatedSection>
            <div style={{ position: "relative" }}>
              {/* Centre line */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#FE8100,#0127FC)", transform: "translateX(-50%)" }} className="timeline-line" />
              <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                {milestones.map((m, i) => (
                  <AnimatedSection key={m.year} style={{ transitionDelay: `${i * 100}ms` }}>
                    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexDirection: i % 2 === 0 ? "row" : "row-reverse" }} className="timeline-row">
                      <div style={{ flex: 1, textAlign: i % 2 === 0 ? "right" : "left" }} className="timeline-content">
                        <div className="card" style={{ padding: "24px 28px", display: "inline-block", textAlign: "left", maxWidth: 340 }}>
                          <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 13, color: "#FE8100", marginBottom: 4 }}>{m.year}</div>
                          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16, color: "#0127FC", marginBottom: 8 }}>{m.title}</h3>
                          <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>{m.desc}</p>
                        </div>
                      </div>
                      {/* Dot */}
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: i % 2 === 0 ? "linear-gradient(135deg,#FE8100,#FF9A2E)" : "linear-gradient(135deg,#0127FC,#2545FD)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                        <CheckCircle size={18} color="#fff" />
                      </div>
                      <div style={{ flex: 1 }} className="timeline-spacer" />
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section style={{ padding: "96px 24px", background: "#f8fafc" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <AnimatedSection>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <span className="section-tag">The People Behind the Magic</span>
                <h2 className="section-title">Meet Our Team</h2>
                <div className="section-divider" />
                <p className="section-sub">Passionate travellers who turned their love for exploration into a career.</p>
              </div>
            </AnimatedSection>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 28 }}>
              {team.map((member, i) => (
                <AnimatedSection key={member.name} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="card" style={{ textAlign: "center", padding: "32px 24px" }}>
                    <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", margin: "0 auto 18px", border: "3px solid #FE8100", boxShadow: "0 4px 20px rgba(254,129,0,0.25)" }}>
                      <img src={member.image} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16, color: "#0127FC", marginBottom: 4 }}>{member.name}</h3>
                    <p style={{ color: "#64748b", fontSize: 13 }}>{member.role}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section style={{ padding: "96px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 64, alignItems: "center" }}>
              <AnimatedSection>
                <span className="section-tag">Why EdumilesTravels</span>
                <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.5vw,40px)", color: "#0127FC", lineHeight: 1.15, marginBottom: 12 }}>
                  The Smart Way<br />
                  <span style={{ color: "#FE8100" }}>to Travel India</span>
                </h2>
                <div style={{ width: 56, height: 5, background: "linear-gradient(90deg,#FE8100,#FF9A2E)", borderRadius: 3, marginBottom: 28 }} />
                {[
                  "Personalised itineraries tailored to your budget and interests",
                  "Verified hotels, guides and transport — zero compromise on quality",
                  "Transparent pricing with no hidden charges ever",
                  "Dedicated travel manager assigned to every group",
                  "24/7 on-trip emergency support",
                  "Easy EMI and flexible payment options available",
                ].map(point => (
                  <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#FE8100,#FF9A2E)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <CheckCircle size={13} color="#fff" />
                    </div>
                    <span style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
                <button onClick={() => openContact("General Enquiry")} className="btn-primary" style={{ marginTop: 12 }}>
                  Plan My Trip <ArrowRight size={16} />
                </button>
              </AnimatedSection>

              <AnimatedSection>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  {[
                    { Icon: Compass,  title: "Expert Planning",  desc: "Every detail mapped out so you can focus on enjoying the journey.", bg: "#fff7ed" },
                    { Icon: Shield,   title: "Safe Travels",      desc: "Comprehensive safety protocols and 24/7 support for peace of mind.", bg: "#eff6ff" },
                    { Icon: Mountain, title: "Adventure Ready",   desc: "From easy leisure trips to challenging treks — we cover it all.", bg: "#f0fdf4" },
                    { Icon: Heart,    title: "Crafted With Love", desc: "Every package reflects our genuine passion for travel.", bg: "#fdf4ff" },
                  ].map((c, i) => (
                    <div key={c.title} style={{ background: c.bg, borderRadius: 20, padding: "24px 20px", transition: "transform 0.3s ease", transitionDelay: `${i * 80}ms` }} className="why-card">
                      <c.Icon size={28} color="#0127FC" style={{ marginBottom: 12 }} />
                      <h4 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 6 }}>{c.title}</h4>
                      <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6 }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "80px 24px", background: "linear-gradient(135deg,#0127FC 0%,#001060 100%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.28) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <span className="section-tag" style={{ color: "#FF9A2E" }}>Let&apos;s Connect</span>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(24px,4vw,44px)", color: "#fff", marginBottom: 16 }}>
              Ready to Start Your<br />Next Adventure?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 16, marginBottom: 32 }}>
              Reach out to our travel experts and let&apos;s craft the perfect journey for you.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => openContact("Adventure Package Enquiry")} className="btn-primary">
                Book a Trip <ArrowRight size={16} />
              </button>
              <a href="/contact" className="btn-outline">
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} subject={modalSubject} />

      <style>{`
        .why-card:hover { transform: scale(1.04); }
        @media (max-width: 767px) {
          .timeline-line { display: none; }
          .timeline-row { flex-direction: column !important; gap: 12px !important; }
          .timeline-content { text-align: left !important; }
          .timeline-spacer { display: none; }
        }
      `}</style>
    </>
  );
}
