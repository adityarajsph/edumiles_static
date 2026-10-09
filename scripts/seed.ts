/**
 * scripts/seed.ts
 * Idempotent seed script — migrates hardcoded packages + blogs into MongoDB.
 * Uses upsert-by-slug so it NEVER duplicates and NEVER overwrites content
 * that has already been edited in the CMS.
 *
 * Run:  npx ts-node --project tsconfig.seed.json scripts/seed.ts
 *   or: MONGODB_URI=... npx ts-node scripts/seed.ts
 *
 * SAFE TO RUN MULTIPLE TIMES.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set. Create .env.local from .env.example first.");
  process.exit(1);
}

/* ── Inline model definitions (avoid next.js module resolution) ─ */
const SeasonSubSchema = new mongoose.Schema({
  peak:          { months: { type: String, default: "" }, note: { type: String, default: "" } },
  offSeason:     { months: { type: String, default: "" }, note: { type: String, default: "" } },
  priceTendency: { type: String, default: "" },
  activeSeason:  { type: String, enum: ["peak", "off"], default: "peak" },
}, { _id: false });

const PackageSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  slug:             { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, default: "" },
  fullDescription:  { type: String, default: "" },
  price:            { type: Number, required: true },
  discountPrice:    { type: Number, default: 0 },
  currency:         { type: String, default: "INR" },
  duration:         { type: String, default: "" },
  destination:      { type: String, default: "" },
  category:         { type: String, default: "" },
  featuredImage:    { type: String, default: "" },
  gallery:          [{ type: String }],
  highlights:       [{ type: String }],
  inclusions:       [{ type: String }],
  exclusions:       [{ type: String }],
  itinerary:        [{ day: Number, title: String, description: String }],
  faqs:             [{ question: String, answer: String }],
  season:           { type: SeasonSubSchema, default: () => ({}) },
  seo:              { type: Object, default: () => ({}) },
  isFeatured:       { type: Boolean, default: false },
  status:           { type: String, default: "published" },
  order:            { type: Number, default: 0 },
  badge:            { type: String, default: "" },
  badgeBg:          { type: String, default: "#FE8100" },
  groupSize:        { type: String, default: "" },
  rating:           { type: Number, default: 0 },
  reviews:          { type: Number, default: 0 },
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true, lowercase: true },
  excerpt:       { type: String, default: "" },
  content:       { type: String, default: "" },
  featuredImage: { type: String, default: "" },
  author:        { type: Object, default: () => ({}) },
  category:      { type: String, default: "" },
  tags:          [{ type: String }],
  readTime:      { type: Number, default: 5 },
  seo:           { type: Object, default: () => ({}) },
  status:        { type: String, default: "published" },
  publishedAt:   { type: Date, default: Date.now },
  isFeatured:    { type: Boolean, default: false },
}, { timestamps: true });

const Package = (mongoose.models.Package as mongoose.Model<mongoose.Document>) || mongoose.model("Package", PackageSchema);
const Blog    = (mongoose.models.Blog as mongoose.Model<mongoose.Document>)    || mongoose.model("Blog",    BlogSchema);

/* ── Package seed data ─────────────────────────────────────────── */
// These exactly match the existing static data so live URLs are preserved.
const PACKAGES = [
  {
    slug: "golden-triangle-tour",
    title: "Golden Triangle Tour",
    destination: "Delhi • Agra • Jaipur",
    category: "Heritage",
    price: 12999, discountPrice: 0, currency: "INR",
    duration: "6 Days / 5 Nights",
    groupSize: "2–12",
    badge: "Best Seller", badgeBg: "#FE8100",
    rating: 4.9, reviews: 312,
    isFeatured: true,
    featuredImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85",
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=700&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80",
    ],
    highlights: ["Taj Mahal Sunrise", "Amber Fort", "City Palace"],
    shortDescription: "Experience India's most iconic heritage circuit — Delhi's Mughal grandeur, Agra's timeless Taj Mahal, and Jaipur's regal Pink City.",
    fullDescription: "<p>Experience India's most iconic heritage circuit — Delhi's Mughal grandeur, Agra's timeless Taj Mahal, and Jaipur's regal Pink City. This expertly curated 6-day journey blends architectural marvels, royal culture, and authentic cuisine into an unforgettable adventure.</p>",
    inclusions: ["5-night accommodation in 3-star/4-star hotels", "Daily breakfast included", "All transfers in air-conditioned vehicle", "Professional English-speaking guide", "Taj Mahal sunrise visit", "Amber Fort guided tour", "All applicable taxes & service charges"],
    exclusions: ["International & domestic airfare", "Lunch and dinner (except where specified)", "Camera / video fees at monuments", "Personal expenses & tips", "Travel insurance"],
    faqs: [
      { question: "Is the Taj Mahal entry fee included?", answer: "Yes, the Taj Mahal entry (sunrise slot) is included. Camera fees are extra." },
      { question: "Can the group size be customised?", answer: "Absolutely. We accommodate solo travellers, couples, and larger groups up to 15." },
      { question: "What is the cancellation policy?", answer: "Free cancellation up to 14 days before departure; 50% refund within 7–14 days." },
    ],
    season: { peak: { months: "October – March", note: "Ideal weather — cool days and clear skies." }, offSeason: { months: "April – September", note: "Hot and monsoon months; lower tariffs and fewer crowds." }, priceTendency: "Prices rise ~30% in peak season.", activeSeason: "peak" },
    seo: { metaTitle: "Golden Triangle Tour | Delhi Agra Jaipur | EdumilesTravels", metaDescription: "6 Days / 5 Nights Golden Triangle Tour from ₹12,999/person. Taj Mahal, Amber Fort, City Palace.", ogImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85" },
    status: "published", order: 1,
  },
  {
    slug: "kerala-backwaters-bliss",
    title: "Kerala Backwaters Bliss",
    destination: "Kochi • Alleppey • Munnar",
    category: "Luxury",
    price: 15999, discountPrice: 0, currency: "INR",
    duration: "7 Days / 6 Nights",
    groupSize: "2–8",
    badge: "Premium", badgeBg: "#0127FC",
    rating: 4.8, reviews: 248,
    isFeatured: true,
    featuredImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85"],
    highlights: ["Houseboat Stay", "Spice Plantation", "Kathakali Show"],
    shortDescription: "Drift along Kerala's legendary backwaters on a traditional houseboat.",
    fullDescription: "<p>Drift along Kerala's legendary backwaters on a traditional houseboat, wander through emerald tea gardens in Munnar, and soak in the colonial charm of Fort Kochi.</p>",
    inclusions: ["6-night accommodation (2 nights houseboat + 4 nights boutique hotel)", "Daily breakfast and all meals on houseboat", "Kathakali cultural performance tickets", "Fort Kochi heritage walk", "All transfers in air-conditioned vehicle"],
    exclusions: ["Airfare to/from Kochi", "Dinner on hotel nights", "Personal shopping expenses", "Travel insurance"],
    faqs: [{ question: "Is the houseboat stay comfortable?", answer: "Our houseboats have air-conditioned bedrooms, attached bathrooms, and a private deck." }],
    season: { peak: { months: "September – February", note: "Post-monsoon greenery and cool temperatures." }, offSeason: { months: "March – August", note: "Monsoon season." }, priceTendency: "Houseboat rates spike in December–January.", activeSeason: "peak" },
    seo: { metaTitle: "Kerala Backwaters Bliss | Houseboat Tour | EdumilesTravels", metaDescription: "7 Days / 6 Nights Kerala Backwaters package from ₹15,999/person.", ogImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85" },
    status: "published", order: 2,
  },
  {
    slug: "himachal-adventure",
    title: "Himachal Adventure",
    destination: "Manali • Solang • Rohtang",
    category: "Adventure",
    price: 9999, discountPrice: 0, currency: "INR",
    duration: "5 Days / 4 Nights",
    groupSize: "4–15",
    badge: "Adventure", badgeBg: "#10b981",
    rating: 4.7, reviews: 187,
    isFeatured: false,
    featuredImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85"],
    highlights: ["Paragliding", "Snow Activities", "Hadimba Temple"],
    shortDescription: "Conquer the Himalayas on this adrenaline-packed 5-day escape to Manali.",
    fullDescription: "<p>Conquer the Himalayas on this adrenaline-packed 5-day escape to Manali. Glide over snow-capped peaks while paragliding at Solang Valley.</p>",
    inclusions: ["4-night accommodation in comfortable mountain lodges", "Daily breakfast and dinner", "Paragliding session", "Snow activity package at Rohtang Pass"],
    exclusions: ["Bus or flight to/from Manali", "Lunch", "Rohtang Pass permit fee", "Travel insurance"],
    faqs: [{ question: "Is paragliding safe for first-timers?", answer: "Yes. Tandem paragliding with a APPI-certified pilot is completely safe for beginners." }],
    season: { peak: { months: "December – February (snow) & June – September", note: "Winter for snow sports; summer for trekking." }, offSeason: { months: "March – May & October – November", note: "Transition months." }, priceTendency: "Prices peak in December–January.", activeSeason: "peak" },
    seo: { metaTitle: "Himachal Adventure Tour | Manali Package | EdumilesTravels", metaDescription: "5 Days / 4 Nights Himachal Adventure from ₹9,999/person.", ogImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85" },
    status: "published", order: 3,
  },
  {
    slug: "goa-beach-escape",
    title: "Goa Beach Escape",
    destination: "North Goa • South Goa",
    category: "Weekend Trips",
    price: 8499, discountPrice: 0, currency: "INR",
    duration: "4 Days / 3 Nights",
    groupSize: "2–20",
    badge: "Popular", badgeBg: "#FE8100",
    rating: 4.6, reviews: 421,
    isFeatured: false,
    featuredImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85"],
    highlights: ["Beach Shacks", "Water Sports", "Dudhsagar Falls"],
    shortDescription: "Sun, sand, and good vibes — Goa's ultimate beach escape awaits.",
    fullDescription: "<p>Sun, sand, and good vibes — Goa's ultimate beach escape awaits. Spend lazy mornings at pristine beaches, dive into thrilling water sports.</p>",
    inclusions: ["3-night stay in beach-facing resort", "Daily breakfast", "Dudhsagar Falls trip (jeep safari included)", "Water sports package", "All transfers"],
    exclusions: ["Flights to/from Goa", "Lunch and dinner", "Personal shopping", "Travel insurance"],
    faqs: [{ question: "Is Goa safe for solo female travellers?", answer: "Yes, Goa is generally safe." }],
    season: { peak: { months: "November – February", note: "Perfect weather and the famous Goa Carnival." }, offSeason: { months: "June – September", note: "Monsoon season — prices drop significantly." }, priceTendency: "New Year week prices can be 2x the base rate.", activeSeason: "peak" },
    seo: { metaTitle: "Goa Beach Escape Package | EdumilesTravels", metaDescription: "4 Days / 3 Nights Goa Beach Escape from ₹8,499/person.", ogImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85" },
    status: "published", order: 4,
  },
  {
    slug: "rajasthan-royal-journey",
    title: "Rajasthan Royal Journey",
    destination: "Jodhpur • Jaisalmer • Udaipur",
    category: "Luxury",
    price: 19999, discountPrice: 0, currency: "INR",
    duration: "8 Days / 7 Nights",
    groupSize: "2–10",
    badge: "Luxury", badgeBg: "#a855f7",
    rating: 4.9, reviews: 165,
    isFeatured: true,
    featuredImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85"],
    highlights: ["Desert Safari", "Palace Hotels", "Mehrangarh Fort"],
    shortDescription: "Step into Rajasthan's regal past — the land of maharajas, desert sunsets, and fortress palaces.",
    fullDescription: "<p>Step into Rajasthan's regal past — the land of maharajas, desert sunsets, and fortress palaces. This 8-day luxury journey takes you through the Blue City of Jodhpur, the Golden City of Jaisalmer, and the romantic lake city of Udaipur.</p>",
    inclusions: ["7-night stay in heritage palace/haveli hotels", "Daily breakfast and dinner", "Camel safari at Sam Sand Dunes", "Mehrangarh Fort guided tour", "Udaipur City Palace boat ride"],
    exclusions: ["Flights / train to/from Rajasthan", "Lunch", "Personal expenditure", "Travel insurance"],
    faqs: [{ question: "Are heritage hotels comfortable?", answer: "Yes. Our partner palace hotels are fully modernised." }],
    season: { peak: { months: "October – March", note: "Cool and pleasant — ideal for forts and safaris." }, offSeason: { months: "April – September", note: "Intense heat." }, priceTendency: "Heritage hotels charge premium rates in December.", activeSeason: "peak" },
    seo: { metaTitle: "Rajasthan Royal Journey | Jodhpur Jaisalmer Udaipur | EdumilesTravels", metaDescription: "8 Days / 7 Nights Rajasthan package from ₹19,999/person.", ogImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85" },
    status: "published", order: 5,
  },
  {
    slug: "char-dham-yatra",
    title: "Char Dham Yatra",
    destination: "Badrinath • Kedarnath • Gangotri • Yamunotri",
    category: "Religious",
    price: 24999, discountPrice: 0, currency: "INR",
    duration: "12 Days / 11 Nights",
    groupSize: "4–20",
    badge: "Religious", badgeBg: "#f97316",
    rating: 4.9, reviews: 209,
    isFeatured: true,
    featuredImage: "https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=1200&q=85"],
    highlights: ["Kedarnath Darshan", "Badrinath Temple", "Gangotri Aarti"],
    shortDescription: "Embark on Hinduism's most sacred pilgrimage — the Char Dham Yatra.",
    fullDescription: "<p>Embark on Hinduism's most sacred pilgrimage — the Char Dham Yatra. This deeply spiritual 12-day journey visits Yamunotri, Gangotri, Kedarnath, and Badrinath.</p>",
    inclusions: ["11-night accommodation in dharamshalas", "All meals throughout the yatra", "VIP darshan arrangements", "All transfers in dedicated Tempo Traveller", "Emergency medical kit"],
    exclusions: ["Train / flight to Haridwar", "Personal expenses and tips", "Travel insurance"],
    faqs: [{ question: "Is biometric registration mandatory?", answer: "Yes. Registration is mandatory and we handle the process for you." }],
    season: { peak: { months: "May – June & September – October", note: "Temples are open and weather is manageable." }, offSeason: { months: "November – April", note: "All four dhams are closed due to heavy snowfall." }, priceTendency: "Prices rise significantly in June.", activeSeason: "peak" },
    seo: { metaTitle: "Char Dham Yatra Package | EdumilesTravels", metaDescription: "12 Days / 11 Nights Char Dham Yatra from ₹24,999/person.", ogImage: "https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=1200&q=85" },
    status: "published", order: 6,
  },
  {
    slug: "andaman-island-retreat",
    title: "Andaman Island Retreat",
    destination: "Port Blair • Havelock • Neil Island",
    category: "Luxury",
    price: 21999, discountPrice: 0, currency: "INR",
    duration: "6 Days / 5 Nights",
    groupSize: "2–8",
    badge: "Premium", badgeBg: "#0127FC",
    rating: 4.8, reviews: 134,
    isFeatured: false,
    featuredImage: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85"],
    highlights: ["Scuba Diving", "Radhanagar Beach", "Cellular Jail"],
    shortDescription: "Escape to India's tropical paradise — the Andaman & Nicobar Islands.",
    fullDescription: "<p>Escape to India's tropical paradise — the Andaman & Nicobar Islands. Dive into crystal-clear waters teeming with coral reefs.</p>",
    inclusions: ["5-night stay in beach resort", "Daily breakfast", "Ferry transfers between islands", "Scuba diving experience", "Cellular Jail light & sound show"],
    exclusions: ["Flights to/from Port Blair", "Lunch and dinner", "Personal expenses", "Travel insurance"],
    faqs: [{ question: "Do I need prior experience for scuba diving?", answer: "No. Beginner scuba requires no prior experience." }],
    season: { peak: { months: "October – May", note: "Calm seas and excellent underwater visibility." }, offSeason: { months: "June – September", note: "Monsoon season restricts water activities." }, priceTendency: "December–February is most expensive.", activeSeason: "peak" },
    seo: { metaTitle: "Andaman Island Retreat | EdumilesTravels", metaDescription: "6 Days / 5 Nights Andaman package from ₹21,999/person.", ogImage: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85" },
    status: "published", order: 7,
  },
  {
    slug: "honeymoon-in-kashmir",
    title: "Honeymoon in Kashmir",
    destination: "Srinagar • Gulmarg • Pahalgam",
    category: "Honeymoon",
    price: 17999, discountPrice: 0, currency: "INR",
    duration: "7 Days / 6 Nights",
    groupSize: "2",
    badge: "Honeymoon", badgeBg: "#e11d48",
    rating: 4.9, reviews: 298,
    isFeatured: true,
    featuredImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85"],
    highlights: ["Shikara Ride", "Gondola Cable Car", "Dal Lake"],
    shortDescription: "Kashmir — Heaven on Earth — is the most romantic destination for newlyweds.",
    fullDescription: "<p>Kashmir — Heaven on Earth — is the most romantic destination for newlyweds. Glide across the shimmering Dal Lake on a private Shikara.</p>",
    inclusions: ["6-night accommodation (2N luxury houseboat + 4N premium hotel)", "Daily breakfast and dinner", "Private Shikara ride on Dal Lake", "Gondola Cable Car ride at Gulmarg", "Professional photographer for one session"],
    exclusions: ["Flights to/from Srinagar", "Lunch", "Horse riding (available at extra cost)", "Travel insurance"],
    faqs: [{ question: "Is Kashmir safe for tourists?", answer: "Yes. The major tourist areas are safe and well-policed." }],
    season: { peak: { months: "April – June & December – February", note: "Spring offers tulip blooms; winter offers snow." }, offSeason: { months: "July – September & November", note: "July–September brings pleasant weather but monsoon rains." }, priceTendency: "April–May tulip season and New Year are the priciest.", activeSeason: "peak" },
    seo: { metaTitle: "Honeymoon in Kashmir | EdumilesTravels", metaDescription: "7 Days / 6 Nights Kashmir Honeymoon package from ₹17,999/person.", ogImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85" },
    status: "published", order: 8,
  },
  {
    slug: "spiti-valley-expedition",
    title: "Spiti Valley Expedition",
    destination: "Shimla • Kaza • Chandratal",
    category: "Adventure",
    price: 13499, discountPrice: 0, currency: "INR",
    duration: "9 Days / 8 Nights",
    groupSize: "4–15",
    badge: "Adventure", badgeBg: "#10b981",
    rating: 4.7, reviews: 92,
    isFeatured: false,
    featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700&q=80",
    gallery: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85"],
    highlights: ["Key Monastery", "Chandratal Lake", "Himalayan Villages"],
    shortDescription: "Journey to one of Earth's most remote and mesmerising landscapes — the cold desert of Spiti Valley.",
    fullDescription: "<p>Journey to one of Earth's most remote and mesmerising landscapes — the cold desert of Spiti Valley. Cross high-altitude passes, visit ancient Buddhist monasteries.</p>",
    inclusions: ["8-night accommodation (guesthouses + camping)", "All meals throughout the trip", "Key Monastery guided tours", "Chandratal Lake camping with bonfire", "4WD transfers", "Emergency oxygen cylinder"],
    exclusions: ["Bus/train to Shimla", "Personal trekking gear", "Tips and gratuities", "Travel insurance (mandatory)"],
    faqs: [{ question: "How difficult is the Spiti Valley trip?", answer: "Moderate to challenging. Good physical fitness is essential." }],
    season: { peak: { months: "June – September", note: "The only window when roads are fully open." }, offSeason: { months: "October – May", note: "Roads are snow-blocked." }, priceTendency: "July–August is peak season; June offers best value.", activeSeason: "off" },
    seo: { metaTitle: "Spiti Valley Expedition | EdumilesTravels", metaDescription: "9 Days / 8 Nights Spiti Valley package from ₹13,499/person.", ogImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85" },
    status: "published", order: 9,
  },
];

/* ── Blog seed data ─────────────────────────────────────────────── */
const BLOGS = [
  {
    slug: "golden-triangle-tour-guide",
    title: "Golden Triangle Tour: The Ultimate India First-Timer's Guide",
    excerpt: "Delhi, Agra, and Jaipur form India's most iconic travel circuit. Here's everything you need to plan a perfect 6-day Golden Triangle journey.",
    featuredImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85",
    author: { name: "Rajiv Sharma", role: "Founder & Travel Expert", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80" },
    category: "Heritage", tags: ["Golden Triangle", "Delhi", "Agra", "Jaipur", "Heritage"],
    readTime: 8, isFeatured: true, status: "published", publishedAt: "2025-03-10",
    content: "<h2>Why the Golden Triangle?</h2><p>No trip to India is complete without witnessing the Taj Mahal at sunrise, the imposing ramparts of Amber Fort, and the labyrinthine lanes of Old Delhi.</p><h2>The Best Time to Visit</h2><p>October through March is peak season — temperatures are pleasant (15–25°C), skies are clear, and visibility at the Taj Mahal is exceptional.</p><h2>Delhi: More Than Just a Gateway</h2><p>Most travellers treat Delhi as an overnight stop, but the city deserves at least two full days. Humayun's Tomb is far less crowded and equally stunning.</p><h2>Agra: The City of the Taj</h2><p>Book the pre-dawn entry to the Taj Mahal — the monument turns a deep rose-gold at sunrise that no photograph fully captures.</p><h2>Jaipur: The Pink City</h2><p>Jaipur demands at least a day and a half. Start with Amber Fort in the early morning.</p><h2>Practical Tips</h2><p>Pre-book all major monument tickets online. Hire a licensed ASI guide at each site.</p>",
    seo: { metaTitle: "Golden Triangle Tour Guide | EdumilesTravels Blog", metaDescription: "Everything you need to plan a perfect 6-day Golden Triangle journey — Delhi, Agra, and Jaipur.", ogImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85" },
  },
  {
    slug: "kerala-backwaters-houseboat-guide",
    title: "Kerala Backwaters: A Complete Houseboat Survival Guide",
    excerpt: "Spending a night on a traditional Kerala kettuvallam houseboat is a bucket-list experience. Here's everything you should know.",
    featuredImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85",
    author: { name: "Priya Nair", role: "Destination Specialist", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=80" },
    category: "Luxury", tags: ["Kerala", "Backwaters", "Houseboat", "Alleppey"],
    readTime: 7, isFeatured: true, status: "published", publishedAt: "2025-02-20",
    content: "<h2>What Are the Kerala Backwaters?</h2><p>The backwaters are a network of brackish lagoons, lakes, rivers, and canals stretching 900 km along the Kerala coast.</p><h2>Choosing Your Houseboat</h2><p>Kettuvallam (rice barges) are the traditional houseboat style — hand-built from bamboo, coir, and teak without a single nail.</p><h2>What to Eat on Board</h2><p>The highlight of any houseboat stay is the food. Expect karimeen pollichathu, prawn moilee, and toddy-shop style tapioca with fish curry.</p>",
    seo: { metaTitle: "Kerala Backwaters Houseboat Guide | EdumilesTravels Blog", metaDescription: "Everything you need to know about spending a night on a Kerala houseboat.", ogImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85" },
  },
  {
    slug: "spiti-valley-june-travel-guide",
    title: "Spiti Valley in June: The Road Less Travelled",
    excerpt: "June is the sweet spot for Spiti — the roads have just opened, the landscape is achingly beautiful, and the August crowds are still weeks away.",
    featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85",
    author: { name: "Arjun Mehta", role: "Adventure Travel Writer", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=80" },
    category: "Adventure", tags: ["Spiti Valley", "Himachal Pradesh", "Adventure", "Road Trip"],
    readTime: 9, isFeatured: true, status: "published", publishedAt: "2025-01-28",
    content: "<h2>Why June Is Spiti's Hidden Season</h2><p>Spiti Valley opens to travellers in late May or early June when the Rohtang Pass snow clears enough for vehicles to cross.</p><h2>Acclimatisation Is Not Optional</h2><p>Kaza sits at 3,800m. Altitude sickness is real — ascend gradually.</p><h2>Must-Visit Places</h2><p>Key Monastery (4,166m) is a living monastery with around 300 monks. Chandratal (Moon Lake) is a glacial lake at 4,300m.</p>",
    seo: { metaTitle: "Spiti Valley in June | EdumilesTravels Blog", metaDescription: "Why June is the best month to visit Spiti Valley — road conditions, weather, and top places.", ogImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85" },
  },
  {
    slug: "char-dham-yatra-practical-guide",
    title: "Char Dham Yatra: A Pilgrim's Practical Handbook",
    excerpt: "The four sacred shrines of Yamunotri, Gangotri, Kedarnath, and Badrinath are among Hinduism's most revered destinations.",
    featuredImage: "https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=1200&q=85",
    author: { name: "Rajiv Sharma", role: "Founder & Travel Expert", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80" },
    category: "Religious", tags: ["Char Dham", "Kedarnath", "Badrinath", "Pilgrimage"],
    readTime: 10, isFeatured: false, status: "published", publishedAt: "2025-03-25",
    content: "<h2>Understanding the Char Dham</h2><p>The traditional pilgrimage proceeds west to east: Yamunotri → Gangotri → Kedarnath → Badrinath.</p><h2>Biometric Registration Is Mandatory</h2><p>Register at the official portal. Slots for June fill within days of release.</p>",
    seo: { metaTitle: "Char Dham Yatra Guide | EdumilesTravels Blog", metaDescription: "Practical handbook for Char Dham Yatra — registration, route, fitness, and best time.", ogImage: "https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=1200&q=85" },
  },
  {
    slug: "kashmir-april-tulips-travel-guide",
    title: "Kashmir in April: Tulips, Snow, and Zero Crowds",
    excerpt: "April is Kashmir's most photogenic month — the Tulip Garden is in full bloom, Gulmarg still has skiing, and tourist numbers are a fraction of May.",
    featuredImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85",
    author: { name: "Priya Nair", role: "Destination Specialist", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=80" },
    category: "Honeymoon", tags: ["Kashmir", "Tulip Festival", "Srinagar", "Gulmarg"],
    readTime: 7, isFeatured: true, status: "published", publishedAt: "2025-02-05",
    content: "<h2>Why April Is Kashmir's Best-Kept Secret</h2><p>Most Indian tourists plan Kashmir in May or July. April sits in a sweet spot: the Tulip Garden is in full bloom and room rates are 30–40% lower than peak.</p><h2>Dal Lake & Shikara Rides</h2><p>No Kashmir trip is complete without a Shikara ride on Dal Lake at dawn.</p>",
    seo: { metaTitle: "Kashmir in April | Tulip Festival Travel Guide | EdumilesTravels", metaDescription: "Why April is the best time to visit Kashmir — tulips, snow, and empty roads.", ogImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85" },
  },
  {
    slug: "goa-hidden-experiences-guide",
    title: "Goa Beyond the Beach: 8 Hidden Experiences Most Tourists Miss",
    excerpt: "Goa offers far more than beaches — ancient churches, spice plantations, cashew fenny distilleries, and wildlife sanctuaries.",
    featuredImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85",
    author: { name: "Arjun Mehta", role: "Adventure Travel Writer", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=80" },
    category: "Weekend Trips", tags: ["Goa", "Off-Beat", "Weekend Trip", "Heritage"],
    readTime: 6, isFeatured: false, status: "published", publishedAt: "2025-01-15",
    content: "<h2>Old Goa's Baroque Churches</h2><p>The Basilica of Bom Jesus, a UNESCO World Heritage Site, houses the preserved body of St. Francis Xavier.</p><h2>Fontainhas: Goa's Latin Quarter</h2><p>Fontainhas in Panaji is a grid of narrow streets lined with brightly painted Portuguese-era houses.</p>",
    seo: { metaTitle: "Goa Hidden Experiences | EdumilesTravels Blog", metaDescription: "8 off-beat Goa experiences most tourists miss — churches, spice farms, and waterfalls.", ogImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85" },
  },
  {
    slug: "rajasthan-8-day-circuit-guide",
    title: "Rajasthan Royal Circuit: How to Do It in 8 Days",
    excerpt: "Jodhpur, Jaisalmer, and Udaipur — three of India's most visually striking cities. Done right, the circuit takes 8 days.",
    featuredImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85",
    author: { name: "Rajiv Sharma", role: "Founder & Travel Expert", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80" },
    category: "Heritage", tags: ["Rajasthan", "Jodhpur", "Jaisalmer", "Udaipur", "Desert Safari"],
    readTime: 8, isFeatured: false, status: "published", publishedAt: "2025-03-01",
    content: "<h2>Day 1–2: Jodhpur — The Blue City</h2><p>Arrive in Jodhpur and check in. Spend the afternoon at Mehrangarh Fort.</p><h2>Day 3–4: Jaisalmer — The Golden City</h2><p>The drive from Jodhpur to Jaisalmer crosses the Thar Desert.</p>",
    seo: { metaTitle: "Rajasthan 8-Day Circuit Guide | EdumilesTravels Blog", metaDescription: "How to do the Jodhpur–Jaisalmer–Udaipur circuit in 8 days.", ogImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85" },
  },
  {
    slug: "andaman-islands-travel-tips",
    title: "10 Things Nobody Tells You Before Visiting the Andaman Islands",
    excerpt: "The Andamans are India's most remote and pristine archipelago. Here's an honest guide to what the Instagram posts don't show you.",
    featuredImage: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85",
    author: { name: "Priya Nair", role: "Destination Specialist", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=80" },
    category: "Luxury", tags: ["Andaman Islands", "Beach", "Scuba Diving", "Travel Tips"],
    readTime: 7, isFeatured: false, status: "published", publishedAt: "2025-01-05",
    content: "<h2>1. The Ferry Schedule Is Everything</h2><p>There are no road connections between Port Blair, Havelock, and Neil Island — only boats.</p><h2>2. Port Blair Is Not the Destination</h2><p>The real Andamans begin when you board the boat to Havelock or Neil.</p><h2>3. Radhanagar Beach Is Really That Good</h2><p>Time magazine's 'Best Beach in Asia' tag from 2004 still holds up.</p>",
    seo: { metaTitle: "Andaman Islands Travel Tips | EdumilesTravels Blog", metaDescription: "10 honest tips for visiting the Andaman Islands — ferries, diving, connectivity, and more.", ogImage: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85" },
  },
];

/* ── Main ───────────────────────────────────────────────────────── */
async function seed() {
  console.log("🌱 Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI!, {
    serverSelectionTimeoutMS: 10000,
    dbName: "edumiles_cms",
  });
  console.log("✅ Connected.");

  /* Packages — upsert by slug, never overwrite CMS-edited content */
  let pkgCreated = 0;
  let pkgSkipped = 0;
  for (const pkg of PACKAGES) {
    const existing = await Package.findOne({ slug: pkg.slug }).lean();
    if (existing) {
      pkgSkipped++;
      console.log(`  ↔  Package already exists, skipping: ${pkg.slug}`);
    } else {
      await Package.create(pkg);
      pkgCreated++;
      console.log(`  ✅ Package created: ${pkg.slug}`);
    }
  }

  /* Blogs — same pattern */
  let blogCreated = 0;
  let blogSkipped = 0;
  for (const blog of BLOGS) {
    const existing = await Blog.findOne({ slug: blog.slug }).lean();
    if (existing) {
      blogSkipped++;
      console.log(`  ↔  Blog already exists, skipping: ${blog.slug}`);
    } else {
      await Blog.create(blog);
      blogCreated++;
      console.log(`  ✅ Blog created: ${blog.slug}`);
    }
  }

  console.log(`\n📦 Packages: ${pkgCreated} created, ${pkgSkipped} skipped.`);
  console.log(`📝 Blogs:    ${blogCreated} created, ${blogSkipped} skipped.`);
  console.log("\n✅ Seed complete. No existing data was overwritten.");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
