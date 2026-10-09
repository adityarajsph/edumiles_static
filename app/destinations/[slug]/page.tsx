import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FilteredPackagesClient from "../../components/FilteredPackagesClient";
import connectDB from "../../../lib/mongodb";
import DestinationModel from "../../../lib/models/Destination";
import PackageModel from "../../../lib/models/Package";
import type { Package } from "../../lib/packages";

export const revalidate = 60;

// Pre-render all known destination slugs
export async function generateStaticParams() {
  try {
    await connectDB();
    const docs = await DestinationModel.find({}, { slug: 1 }).lean();
    return docs.map(d => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const dest = await DestinationModel.findOne({ slug }).lean();
    if (!dest) return { title: "Destination Not Found | EdumilesTravels" };
    return {
      title: `${dest.name} Tour Packages | EdumilesTravels`,
      description: dest.description || `Explore the best tour packages for ${dest.name}. Book your next adventure with EdumilesTravels.`,
      alternates: { canonical: `https://edumilestravels.com/destinations/${slug}` },
    };
  } catch {
    return { title: "Destination Packages | EdumilesTravels" };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDoc(doc: any): Package {
  return {
    id:            doc._id?.toString() || "",
    name:          doc.title || "",
    slug:          doc.slug || "",
    location:      doc.destination || "",
    image:         doc.featuredImage || "",
    images:        Array.isArray(doc.gallery) ? doc.gallery : [],
    price:         doc.price || 0,
    originalPrice: doc.discountPrice || doc.price || 0,
    rating:        doc.rating || 0,
    reviews:       doc.reviews || 0,
    duration:      doc.duration || "",
    groupSize:     doc.groupSize || "",
    badge:         doc.badge || "",
    badgeBg:       doc.badgeBg || "#FE8100",
    category:      doc.category || "",
    highlights:    Array.isArray(doc.highlights) ? doc.highlights : [],
    description:   doc.shortDescription || "",
    inclusions:    Array.isArray(doc.inclusions) ? doc.inclusions : [],
    exclusions:    Array.isArray(doc.exclusions) ? doc.exclusions : [],
    season:        {
      peak:         { months: Array.isArray(doc.season?.peak?.months) ? doc.season.peak.months.join(", ") : (doc.season?.peak?.months || ""), note: doc.season?.peak?.note || "" },
      offSeason:    { months: Array.isArray(doc.season?.offSeason?.months) ? doc.season.offSeason.months.join(", ") : (doc.season?.offSeason?.months || ""), note: doc.season?.offSeason?.note || "" },
      priceTendency: doc.season?.priceTendency || "",
      activeSeason:  (doc.season?.activeSeason === "off" ? "off" : "peak") as "peak" | "off",
    },
    faq:           (doc.faqs || []).map((f: { question: string; answer: string }) => ({ q: f.question || "", a: f.answer || "" })),
    itinerary:     Array.isArray(doc.itinerary) ? doc.itinerary : [],
    destinationSlug: doc.destinationSlug || "",
    featured:      doc.isFeatured || false,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    await connectDB();
  } catch {
    return notFound();
  }

  const dest = await DestinationModel.findOne({ slug }).lean();
  if (!dest) return notFound();

  // Server-side filtered, paginated at 50 — no frontend-side all-packages fetch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDocs = await PackageModel.find({ destinationSlug: slug, status: "published" })
    .sort({ order: 1, createdAt: -1 })
    .limit(50)
    .lean() as any[];

  const packages: Package[] = rawDocs.map(mapDoc);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",         item: "https://edumilestravels.com" },
      { "@type": "ListItem", position: 2, name: "Destinations", item: "https://edumilestravels.com/destinations" },
      { "@type": "ListItem", position: 3, name: dest.name,      item: `https://edumilestravels.com/destinations/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main style={{ background: "#f8fafc", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{
          position: "relative", overflow: "hidden",
          background: dest.image
            ? `linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.7) 100%)`
            : "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
          padding: "120px 24px 60px",
          minHeight: 320,
        }}>
          {/* Background image */}
          {dest.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dest.image}
              alt={dest.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
            />
          )}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1 }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
              <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.35)" }}>›</li>
                <li style={{ color: "#fff", fontWeight: 600 }}>Destinations</li>
                <li style={{ color: "rgba(255,255,255,0.35)" }}>›</li>
                <li style={{ color: "#FE8100", fontWeight: 700 }}>{dest.name}</li>
              </ol>
            </nav>

            {dest.tag && (
              <span style={{
                display: "inline-block",
                background: dest.tagColor || "#FE8100",
                color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "4px 14px", borderRadius: 9999, marginBottom: 12,
              }}>{dest.tag}</span>
            )}
            <h1 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 900,
              fontSize: "clamp(28px,4vw,52px)", color: "#fff",
              lineHeight: 1.2, marginBottom: 10,
            }}>{dest.name}</h1>
            {dest.description && (
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.65, maxWidth: 560, marginBottom: 16 }}>
                {dest.description}
              </p>
            )}
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: 0 }}>
              {packages.length} {packages.length === 1 ? "tour" : "tours"} available
            </p>
          </div>
        </section>

        {/* Packages grid */}
        <FilteredPackagesClient
          packages={packages}
          heading={`Tours in ${dest.name}`}
          emptyMessage={`No published tours for ${dest.name} yet.`}
        />
      </main>
      <Footer />
    </>
  );
}
