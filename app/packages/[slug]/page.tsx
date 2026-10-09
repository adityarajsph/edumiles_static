import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ImageGallery from "./ImageGallery";
import PackageDetailClient from "./PackageDetailClient";
import RecentlyViewed from "./RecentlyViewed";
import {
  ALL_PACKAGES,
  getPackageBySlug as getStaticPackageBySlug,
  getSimilarPackages as getStaticSimilar,
  getRecommendedPackages as getStaticRecommended,
} from "../../lib/packages";
import {
  fetchPackageBySlug,
  fetchSimilarPackages,
  fetchPublishedPackageSlugs,
} from "../../lib/fetchers";
import type { Package } from "../../lib/packages";
import { Star, Clock, Users, MapPin, ArrowRight } from "lucide-react";

/* ── ISR: revalidate every 60 seconds ──────────────────────────── */
export const revalidate = 60;

/* ─────────────────────────────────────────────────────────────────
   generateStaticParams
   Uses static slugs as the guaranteed baseline.
   Merges DB slugs if available (so newly-added CMS packages get
   pre-rendered on next build without code changes).
────────────────────────────────────────────────────────────────── */
export async function generateStaticParams() {
  const staticSlugs  = ALL_PACKAGES.map(p => ({ slug: p.slug }));
  try {
    const { fetchPublishedPackageSlugs: fetchFn } = await import("../../lib/fetchers");
    const dbSlugs = await fetchFn();
    if (dbSlugs.length > 0) {
      const all = [...staticSlugs, ...dbSlugs];
      const seen = new Set<string>();
      return all.filter(s => { if (seen.has(s.slug)) return false; seen.add(s.slug); return true; });
    }
  } catch { /* use static only */ }
  return staticSlugs;
}

/* ─────────────────────────────────────────────────────────────────
   generateMetadata — tries DB first, falls back to static
────────────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Try DB first
  let pkg: Package | null = null;
  try {
    pkg = await fetchPackageBySlug(slug);
  } catch { /* ignore */ }

  // Fall back to static
  if (!pkg) pkg = getStaticPackageBySlug(slug) ?? null;

  if (!pkg) {
    return {
      title: "Package Not Found | EdumilesTravels",
      description: "The requested package could not be found.",
    };
  }

  const discountPct = pkg.price < pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  const titleStr = `${pkg.name} – ${pkg.duration} from ₹${pkg.price.toLocaleString("en-IN")}/person | EdumilesTravels`;
  const descStr  = `${(pkg.description || "").slice(0, 155)}… Book this ${pkg.category.toLowerCase()} package with EdumilesTravels. ₹${pkg.price.toLocaleString("en-IN")}/person${discountPct > 0 ? `, save ${discountPct}%` : ""}.`;

  return {
    title: titleStr,
    description: descStr,
    keywords: [pkg.name, pkg.location, pkg.category, "tour packages India", "EdumilesTravels", "travel packages Delhi", ...pkg.highlights],
    alternates: { canonical: `https://edumilestravels.com/packages/${pkg.slug}` },
    openGraph: {
      title: titleStr, description: descStr,
      url: `https://edumilestravels.com/packages/${pkg.slug}`,
      siteName: "EdumilesTravels",
      images: [{ url: pkg.images[0] || pkg.image || "", width: 1200, height: 630, alt: `${pkg.name} – EdumilesTravels` }],
      locale: "en_IN", type: "website",
    },
    twitter: { card: "summary_large_image", title: titleStr, description: descStr, images: [pkg.images[0] || pkg.image || ""] },
  };
}

/* ── Inline mini-card (unchanged) ──────────────────────────────── */
function MiniCard({
  slug, name, location, image, price, originalPrice,
  rating, reviews, duration, badge, badgeBg, highlights,
}: {
  slug: string; name: string; location: string; image: string;
  price: number; originalPrice: number; rating: number; reviews: number;
  duration: string; badge: string; badgeBg: string; highlights: string[];
}) {
  return (
    <div className="card">
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} className="mini-card-img" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.25),transparent)" }} />
        <span style={{ position: "absolute", top: 12, left: 12, background: badgeBg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 9999 }}>{badge}</span>
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 9999, color: "#1e293b" }}>
          <Star size={10} fill="#FE8100" color="#FE8100" />{rating}<span style={{ color: "#94a3b8", fontWeight: 400 }}>({reviews})</span>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#94a3b8", fontSize: 11, marginBottom: 6 }}>
          <MapPin size={11} color="#FE8100" />{location}
        </div>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15, color: "#0127FC", marginBottom: 8, lineHeight: 1.3 }}>{name}</h3>
        <div style={{ display: "flex", gap: 12, color: "#64748b", fontSize: 11, marginBottom: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} color="#FE8100" />{duration}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {highlights.slice(0, 2).map(h => (
            <span key={h} style={{ background: "#f1f5f9", color: "#475569", fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 9999 }}>{h}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
          <div>
            {originalPrice > price && <div style={{ color: "#94a3b8", fontSize: 11, textDecoration: "line-through" }}>₹{originalPrice.toLocaleString("en-IN")}</div>}
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 18, color: "#FE8100" }}>
              ₹{price.toLocaleString("en-IN")}<span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>/person</span>
            </div>
          </div>
          <Link href={`/packages/${slug}`} className="btn-primary" style={{ padding: "8px 16px", fontSize: 12 }} aria-label={`View details for ${name}`}>
            View <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Page — Server Component ────────────────────────────────────── */
export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* 1. Try DB first ─────────────────────────────── */
  let pkg: Package | null = null;
  try {
    pkg = await fetchPackageBySlug(slug);
  } catch { /* ignore */ }

  /* 2. Fall back to static ─────────────────────── */
  if (!pkg) pkg = getStaticPackageBySlug(slug) ?? null;

  if (!pkg) notFound();

  /* 3. Fetch similar packages ────────────────────
     Try DB, fall back to static. */
  let similar: Package[] = [];
  try {
    similar = await fetchSimilarPackages(pkg.category, pkg.slug, 4);
  } catch { /* ignore */ }
  if (similar.length === 0) {
    similar = getStaticSimilar(pkg.category, typeof pkg.id === "number" ? pkg.id : 0, 4);
  }

  /* 4. Recommended — use static (featured flag) ── */
  const recommended = getStaticRecommended(typeof pkg.id === "number" ? pkg.id : 0, 4);

  /* ── JSON-LD ──────────────────────────────────── */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: pkg.name,
        description: pkg.description || "",
        image: pkg.images,
        url: `https://edumilestravels.com/packages/${pkg.slug}`,
        touristType: pkg.category,
        offers: {
          "@type": "Offer",
          price: pkg.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `https://edumilestravels.com/packages/${pkg.slug}`,
          seller: { "@type": "TravelAgency", name: "EdumilesTravels", url: "https://edumilestravels.com" },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: pkg.rating || 0,
          reviewCount: pkg.reviews || 0,
          bestRating: 5,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",     item: "https://edumilestravels.com" },
          { "@type": "ListItem", position: 2, name: "Packages", item: "https://edumilestravels.com/packages" },
          { "@type": "ListItem", position: 3, name: pkg.name,   item: `https://edumilestravels.com/packages/${pkg.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: pkg.faq.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const similarCards = similar.length > 0 ? similar.map(p => (
    <MiniCard key={p.slug} slug={p.slug} name={p.name} location={p.location} image={p.image}
      price={p.price} originalPrice={p.originalPrice} rating={p.rating} reviews={p.reviews}
      duration={p.duration} badge={p.badge} badgeBg={p.badgeBg} highlights={p.highlights} />
  )) : null;

  const recommendedCards = recommended.length > 0 ? recommended.map(p => (
    <MiniCard key={p.slug} slug={p.slug} name={p.name} location={p.location} image={p.image}
      price={p.price} originalPrice={p.originalPrice} rating={p.rating} reviews={p.reviews}
      duration={p.duration} badge={p.badge} badgeBg={p.badgeBg} highlights={p.highlights} />
  )) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main style={{ background: "#f8fafc", minHeight: "100vh" }}>
        {/* ── Hero banner ────────────────────────── */}
        <section style={{ background: "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)", padding: "100px 24px 36px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(254,129,0,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />

          <nav aria-label="Breadcrumb" style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, marginBottom: 16 }}>
            <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <li><Link href="/"        className="breadcrumb-link">Home</Link></li>
              <li style={{ color: "rgba(255,255,255,0.35)" }}>›</li>
              <li><Link href="/packages" className="breadcrumb-link">Packages</Link></li>
              <li style={{ color: "rgba(255,255,255,0.35)" }}>›</li>
              <li style={{ color: "#fff", fontWeight: 600 }} aria-current="page">{pkg.name}</li>
            </ol>
          </nav>

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <span style={{ color: "#FE8100", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>{pkg.category}</span>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginTop: 6, maxWidth: 560, lineHeight: 1.6 }}>{pkg.location} &nbsp;·&nbsp; {pkg.duration}</p>
          </div>
        </section>

        {/* ── Gallery ────────────────────────────── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
          <ImageGallery images={pkg.images.length > 0 ? pkg.images : [pkg.image]} packageName={pkg.name} />
        </div>

        {/* ── Detail + booking card ──────────────── */}
        <PackageDetailClient
          pkg={pkg}
          galleryNode={null}
          similarCards={similarCards}
          recommendedCards={recommendedCards}
          recentlyViewedNode={<RecentlyViewed currentSlug={pkg.slug} />}
        />
      </main>

      <Footer />

      <style>{`
        .mini-card-img:hover { transform: scale(1.07); }
        @media (max-width: 1023px) { main { padding-bottom: 80px; } }
      `}</style>
    </>
  );
}
