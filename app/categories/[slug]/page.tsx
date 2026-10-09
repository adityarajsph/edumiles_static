import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FilteredPackagesClient from "../../components/FilteredPackagesClient";
import connectDB from "../../../lib/mongodb";
import CategoryModel from "../../../lib/models/Category";
import PackageModel from "../../../lib/models/Package";
import type { Package } from "../../lib/packages";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    await connectDB();
    const docs = await CategoryModel.find({}, { slug: 1 }).lean();
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
    const cat = await CategoryModel.findOne({ slug }).lean();
    if (!cat) return { title: "Category Not Found | EdumilesTravels" };
    return {
      title: `${cat.name} Tour Packages | EdumilesTravels`,
      description: cat.description || `Explore the best ${cat.name.toLowerCase()} tour packages. Book your next adventure with EdumilesTravels.`,
      alternates: { canonical: `https://edumilestravels.com/categories/${slug}` },
    };
  } catch {
    return { title: "Category Packages | EdumilesTravels" };
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
    season: {
      peak:        { months: Array.isArray(doc.season?.peak?.months) ? doc.season.peak.months.join(", ") : (doc.season?.peak?.months || ""), note: doc.season?.peak?.note || "" },
      offSeason:   { months: Array.isArray(doc.season?.offSeason?.months) ? doc.season.offSeason.months.join(", ") : (doc.season?.offSeason?.months || ""), note: doc.season?.offSeason?.note || "" },
      priceTendency: doc.season?.priceTendency || "",
      activeSeason:  (doc.season?.activeSeason === "off" ? "off" : "peak") as "peak" | "off",
    },
    faq:       (doc.faqs || []).map((f: { question: string; answer: string }) => ({ q: f.question || "", a: f.answer || "" })),
    itinerary: Array.isArray(doc.itinerary) ? doc.itinerary : [],
    destinationSlug: doc.destinationSlug || "",
    featured:  doc.isFeatured || false,
  };
}

export default async function CategoryPage({
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

  const cat = await CategoryModel.findOne({ slug }).lean();
  if (!cat) return notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDocs = await PackageModel.find({ category: cat.name, status: "published" })
    .sort({ order: 1, createdAt: -1 })
    .limit(50)
    .lean() as any[];

  const packages: Package[] = rawDocs.map(mapDoc);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",       item: "https://edumilestravels.com" },
      { "@type": "ListItem", position: 2, name: "Categories", item: "https://edumilestravels.com/categories" },
      { "@type": "ListItem", position: 3, name: cat.name,     item: `https://edumilestravels.com/categories/${slug}` },
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
          background: cat.image
            ? "transparent"
            : "linear-gradient(135deg,#0127FC 0%,#0f1f8f 60%,#001060 100%)",
          padding: "120px 24px 60px",
          minHeight: 280,
        }}>
          {cat.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cat.image}
              alt={cat.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
            />
          )}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", zIndex: 1 }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
              <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                <li><Link href="/" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>Home</Link></li>
                <li style={{ color: "rgba(255,255,255,0.35)" }}>›</li>
                <li style={{ color: "#fff", fontWeight: 600 }}>Categories</li>
                <li style={{ color: "rgba(255,255,255,0.35)" }}>›</li>
                <li style={{ color: "#FE8100", fontWeight: 700 }}>{cat.name}</li>
              </ol>
            </nav>

            <h1 style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 900,
              fontSize: "clamp(28px,4vw,52px)", color: "#fff",
              lineHeight: 1.2, marginBottom: 10,
            }}>{cat.name} Tours</h1>
            {cat.description && (
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.65, maxWidth: 560, marginBottom: 16 }}>
                {cat.description}
              </p>
            )}
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: 0 }}>
              {packages.length} {packages.length === 1 ? "package" : "packages"} available
            </p>
          </div>
        </section>

        <FilteredPackagesClient
          packages={packages}
          heading={`${cat.name} Packages`}
          emptyMessage={`No published ${cat.name.toLowerCase()} packages yet.`}
        />
      </main>
      <Footer />
    </>
  );
}
