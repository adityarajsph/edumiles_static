import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EdumilesTravels — Discover Your Next Adventure",
  description:
    "EdumilesTravels offers premium tour packages, honeymoon trips, family holidays, adventure tours and religious yatras across India. Book your dream trip with expert travel planners in New Delhi.",
  keywords: [
    "EdumilesTravels",
    "Edumiles Travels",
    "edumilestravel",
    "edumiles travel",
    "edumiles tour",
    "Edumiles",
    "travel packages India",
    "tour packages Delhi",
    "honeymoon packages India",
    "family holiday packages",
    "adventure tours India",
    "Rajasthan tour packages",
    "Kerala tour packages",
    "Goa trip packages",
    "Manali tour packages",
    "religious yatra packages",
    "Golden Triangle tour",
    "luxury travel India",
    "weekend getaways from Delhi",
    "best travel agency Delhi",
    "travel agency New Delhi",
    "Netaji Subhash Place travel",
    "affordable tour packages",
    "custom holiday packages India",
    "book tour package online",
  ],
  metadataBase: new URL("https://edumilestravels.com"),
  openGraph: {
    title: "EdumilesTravels — Discover Your Next Adventure",
    description:
      "Premium travel packages, honeymoon trips, family holidays and adventure tours across India. Curated by expert travel planners in New Delhi.",
    url: "https://edumilestravels.com",
    siteName: "EdumilesTravels",
    images: [
      {
        url: "/edumiles.png",
        width: 1200,
        height: 630,
        alt: "EdumilesTravels",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EdumilesTravels — Discover Your Next Adventure",
    description:
      "Premium travel packages, honeymoon trips, family holidays and adventure tours across India.",
    images: ["/edumiles.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://edumilestravels.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}
