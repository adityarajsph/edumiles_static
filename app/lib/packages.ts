/* ─────────────────────────────────────────────────────────────────
   Single source of truth for all package data.
   All fields present in the original ALL_PACKAGES array are kept
   exactly as-is so the listing page and home section stay intact.
   New fields (slug, description, images, inclusions, exclusions,
   season, faq, featured) are added with safe defaults.
────────────────────────────────────────────────────────────────── */

export interface PackageSeason {
  peak: { months: string; note: string };
  offSeason: { months: string; note: string };
  priceTendency: string;
  activeSeason: "peak" | "off";
}

export interface PackageFAQ {
  q: string;
  a: string;
}

export interface PackageItinerary {
  day: number;
  title: string;
  description: string;
}

export interface Package {
  id: number | string;
  name: string;
  slug: string;
  location: string;
  /** Primary card image (Unsplash URL) */
  image: string;
  /** Additional gallery images; index 0 is always the main image */
  images: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  duration: string;
  groupSize: string;
  badge: string;
  badgeBg: string;
  category: string;
  highlights: string[];
  description: string;
  /** Full rich-text description from the CMS (shortDescription is the card excerpt) */
  fullDescription?: string;
  inclusions: string[];
  exclusions: string[];
  season: PackageSeason;
  faq: PackageFAQ[];
  itinerary?: PackageItinerary[];
  destinationSlug?: string;
  featured?: boolean;
}

/** Derive a URL-safe slug from a package name */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const ALL_PACKAGES: Package[] = [
  {
    id: 1,
    name: "Golden Triangle Tour",
    slug: "golden-triangle-tour",
    location: "Delhi • Agra • Jaipur",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85",
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=700&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=700&q=80",
    ],
    price: 12999,
    originalPrice: 18999,
    rating: 4.9,
    reviews: 312,
    duration: "6 Days / 5 Nights",
    groupSize: "2–12",
    badge: "Best Seller",
    badgeBg: "#FE8100",
    category: "Heritage",
    highlights: ["Taj Mahal Sunrise", "Amber Fort", "City Palace"],
    description:
      "Experience India's most iconic heritage circuit — Delhi's Mughal grandeur, Agra's timeless Taj Mahal, and Jaipur's regal Pink City. This expertly curated 6-day journey blends architectural marvels, royal culture, and authentic cuisine into an unforgettable adventure across three of India's most celebrated destinations.",
    inclusions: [
      "5-night accommodation in 3-star or 4-star hotels",
      "Daily breakfast included",
      "All transfers in air-conditioned vehicle",
      "Professional English-speaking guide",
      "Taj Mahal sunrise visit (skip-the-line entry)",
      "Amber Fort guided tour",
      "Qutub Minar & India Gate sightseeing",
      "City Palace Jaipur tour",
      "Complimentary bottled water throughout",
      "All applicable taxes & service charges",
    ],
    exclusions: [
      "International & domestic airfare",
      "Lunch and dinner (except where specified)",
      "Camera / video fees at monuments",
      "Personal expenses & tips",
      "Travel insurance",
      "Any activity not listed in the itinerary",
    ],
    season: {
      peak: {
        months: "October – March",
        note:
          "Ideal weather — cool days and clear skies perfect for sightseeing.",
      },
      offSeason: {
        months: "April – September",
        note:
          "Hot and monsoon months; lower tariffs and fewer crowds but heat can be intense.",
      },
      priceTendency: "Prices rise ~30% in peak season; book early for best rates.",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "Is the Taj Mahal entry fee included?",
        a: "Yes, the Taj Mahal entry (sunrise slot) is included. Camera fees are extra.",
      },
      {
        q: "Can the group size be customised?",
        a: "Absolutely. We accommodate solo travellers, couples, and larger groups up to 15.",
      },
      {
        q: "What is the cancellation policy?",
        a: "Free cancellation up to 14 days before departure; 50% refund within 7–14 days.",
      },
      {
        q: "Is this suitable for senior travellers?",
        a: "Yes. We keep the pace relaxed, choose accessible hotels, and can arrange wheelchairs on request.",
      },
    ],
    featured: true,
  },

  {
    id: 2,
    name: "Kerala Backwaters Bliss",
    slug: "kerala-backwaters-bliss",
    location: "Kochi • Alleppey • Munnar",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=700&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=700&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=700&q=80",
    ],
    price: 15999,
    originalPrice: 22999,
    rating: 4.8,
    reviews: 248,
    duration: "7 Days / 6 Nights",
    groupSize: "2–8",
    badge: "Premium",
    badgeBg: "#0127FC",
    category: "Luxury",
    highlights: ["Houseboat Stay", "Spice Plantation", "Kathakali Show"],
    description:
      "Drift along Kerala's legendary backwaters on a traditional houseboat, wander through emerald tea gardens in Munnar, and soak in the colonial charm of Fort Kochi. This premium 7-day retreat is a sensory journey through God's Own Country — tranquil waters, fragrant spices, and vibrant Kathakali performances.",
    inclusions: [
      "6-night accommodation (2 nights houseboat + 4 nights boutique hotel)",
      "Daily breakfast and all meals on houseboat",
      "Kathakali cultural performance tickets",
      "Spice plantation guided tour",
      "Fort Kochi heritage walk",
      "All transfers in air-conditioned vehicle",
      "Scenic Munnar tea garden visit",
      "Professional guide throughout",
      "Complimentary Ayurvedic welcome drink",
      "All taxes and service charges",
    ],
    exclusions: [
      "Airfare to/from Kochi",
      "Dinner on hotel nights",
      "Parasailing or water sports (available at extra cost)",
      "Personal shopping expenses",
      "Travel insurance",
    ],
    season: {
      peak: {
        months: "September – February",
        note: "Post-monsoon greenery and cool temperatures — the best time to visit.",
      },
      offSeason: {
        months: "March – August",
        note: "Monsoon season brings lush landscapes but rough backwater conditions.",
      },
      priceTendency: "Houseboat rates spike in December–January; early booking advised.",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "Is the houseboat stay comfortable?",
        a: "Our houseboats have air-conditioned bedrooms, attached bathrooms, and a private deck with sun loungers.",
      },
      {
        q: "Can vegetarian / vegan meals be arranged?",
        a: "Yes. All dietary preferences (vegetarian, vegan, Jain, gluten-free) can be accommodated.",
      },
      {
        q: "Is swimming allowed in the backwaters?",
        a: "Swimming is not recommended in the backwaters. The pool at our Munnar hotel is available.",
      },
      {
        q: "What is the best season for Munnar?",
        a: "September to May is ideal; the tea gardens are at their greenest right after the monsoon.",
      },
    ],
    featured: true,
  },

  {
    id: 3,
    name: "Himachal Adventure",
    slug: "himachal-adventure",
    location: "Manali • Solang • Rohtang",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=700&q=80",
    ],
    price: 9999,
    originalPrice: 14999,
    rating: 4.7,
    reviews: 187,
    duration: "5 Days / 4 Nights",
    groupSize: "4–15",
    badge: "Adventure",
    badgeBg: "#10b981",
    category: "Adventure",
    highlights: ["Paragliding", "Snow Activities", "Hadimba Temple"],
    description:
      "Conquer the Himalayas on this adrenaline-packed 5-day escape to Manali. Glide over snow-capped peaks while paragliding at Solang Valley, zoom down icy slopes at Rohtang Pass, and find serenity at the ancient Hadimba Temple nestled in a cedar forest. The perfect trip for thrill-seekers and nature lovers alike.",
    inclusions: [
      "4-night accommodation in comfortable mountain lodges",
      "Daily breakfast and dinner",
      "Paragliding session (Solang Valley)",
      "Snow activity package at Rohtang Pass",
      "Hadimba Temple and Vashisht visit",
      "Old Manali market heritage walk",
      "All transfers in Tempo Traveller",
      "Certified adventure safety gear",
      "First-aid trained guide",
      "All applicable taxes",
    ],
    exclusions: [
      "Bus or flight to/from Manali",
      "Lunch",
      "Rohtang Pass permit fee (₹800 approx, subject to change)",
      "Any additional snow activities beyond package",
      "Travel insurance (strongly recommended)",
    ],
    season: {
      peak: {
        months: "December – February (snow) & June – September (trekking)",
        note: "Winter for snow sports; summer/monsoon for trekking and waterfalls.",
      },
      offSeason: {
        months: "March – May & October – November",
        note: "Transition months — fewer crowds but unpredictable road conditions.",
      },
      priceTendency: "Prices peak in December–January and May–June school holidays.",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "Is paragliding safe for first-timers?",
        a: "Yes. Tandem paragliding with a APPI-certified pilot is completely safe for beginners.",
      },
      {
        q: "Is Rohtang Pass always accessible?",
        a: "The pass is closed late November to May due to heavy snowfall. We offer alternatives like Solang Valley.",
      },
      {
        q: "What fitness level is required?",
        a: "Moderate fitness is sufficient. No prior mountaineering experience needed.",
      },
      {
        q: "Can children participate?",
        a: "Children above 8 years can do snow activities. Paragliding requires participants to be 16+.",
      },
    ],
    featured: false,
  },

  {
    id: 4,
    name: "Goa Beach Escape",
    slug: "goa-beach-escape",
    location: "North Goa • South Goa",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85",
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=700&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=700&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80",
    ],
    price: 8499,
    originalPrice: 12999,
    rating: 4.6,
    reviews: 421,
    duration: "4 Days / 3 Nights",
    groupSize: "2–20",
    badge: "Popular",
    badgeBg: "#FE8100",
    category: "Weekend Trips",
    highlights: ["Beach Shacks", "Water Sports", "Dudhsagar Falls"],
    description:
      "Sun, sand, and good vibes — Goa's ultimate beach escape awaits. Spend lazy mornings at pristine beaches, dive into thrilling water sports, feast at legendary beachside shacks, and marvel at the thundering Dudhsagar Waterfalls. Whether you're with friends, family, or your partner, Goa always delivers the good times.",
    inclusions: [
      "3-night stay in beach-facing resort or hotel",
      "Daily breakfast",
      "Dudhsagar Falls trip (jeep safari included)",
      "Water sports package: parasailing, jet ski, banana boat",
      "North & South Goa sightseeing",
      "Old Goa churches guided tour",
      "All transfers in air-conditioned cab",
      "Welcome drink on arrival",
      "All taxes and service fees",
    ],
    exclusions: [
      "Flights to/from Goa",
      "Lunch and dinner",
      "Casino entry (available at extra cost)",
      "Personal shopping",
      "Travel insurance",
    ],
    season: {
      peak: {
        months: "November – February",
        note: "Perfect weather, vibrant nightlife and the famous Goa Carnival.",
      },
      offSeason: {
        months: "June – September",
        note: "Monsoon season — many shacks close but prices drop significantly.",
      },
      priceTendency: "New Year week prices can be 2x the base rate; book 3 months in advance.",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "Is Goa safe for solo female travellers?",
        a: "Yes, Goa is generally safe. We recommend staying in well-lit beach areas and using our pre-booked cabs.",
      },
      {
        q: "Are water sports safe?",
        a: "All water sports operators we partner with are government-certified with life jackets provided.",
      },
      {
        q: "Can we extend the package?",
        a: "Yes. Additional nights can be added at an extra ₹2,500 per person per night.",
      },
      {
        q: "Is Dudhsagar Falls accessible year-round?",
        a: "The falls are at their best in October–January post-monsoon. Jeep entry may be restricted in peak rains.",
      },
    ],
    featured: false,
  },

  {
    id: 5,
    name: "Rajasthan Royal Journey",
    slug: "rajasthan-royal-journey",
    location: "Jodhpur • Jaisalmer • Udaipur",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700&q=80",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=700&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700&q=80",
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=700&q=80",
    ],
    price: 19999,
    originalPrice: 28999,
    rating: 4.9,
    reviews: 165,
    duration: "8 Days / 7 Nights",
    groupSize: "2–10",
    badge: "Luxury",
    badgeBg: "#a855f7",
    category: "Luxury",
    highlights: ["Desert Safari", "Palace Hotels", "Mehrangarh Fort"],
    description:
      "Step into Rajasthan's regal past — the land of maharajas, desert sunsets, and fortress palaces. This 8-day luxury journey takes you through the Blue City of Jodhpur, the Golden City of Jaisalmer, and the romantic lake city of Udaipur. Stay in heritage palace hotels, ride camels over golden dunes, and witness living history.",
    inclusions: [
      "7-night stay in heritage palace / haveli hotels",
      "Daily breakfast and dinner",
      "Camel safari at Sam Sand Dunes, Jaisalmer",
      "Mehrangarh Fort and Jaswant Thada guided tour",
      "Udaipur City Palace boat ride",
      "Cultural folk dance performance",
      "All transfers in luxury air-conditioned vehicle",
      "Expert heritage guide throughout",
      "Welcome garland and traditional Rajasthani thali dinner",
      "All taxes and service charges",
    ],
    exclusions: [
      "Flights / train to/from Rajasthan",
      "Lunch",
      "Horse or elephant rides (available at extra cost)",
      "Personal expenditure",
      "Travel insurance",
    ],
    season: {
      peak: {
        months: "October – March",
        note: "Cool and pleasant — ideal for forts, safaris, and outdoor dining.",
      },
      offSeason: {
        months: "April – September",
        note: "Intense heat (up to 48°C in May). Suitable only for heritage interiors and early mornings.",
      },
      priceTendency: "Heritage hotels charge premium rates in December and during Pushkar Fair (Oct/Nov).",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "Are heritage hotels comfortable for modern travellers?",
        a: "Yes. Our partner palace hotels are fully modernised with air-conditioning, Wi-Fi, and en-suite bathrooms while retaining their historic charm.",
      },
      {
        q: "Is the camel safari suitable for children?",
        a: "Yes, camel safaris are gentle and suitable for families with children aged 5 and above.",
      },
      {
        q: "Can this be customised as a honeymoon package?",
        a: "Absolutely. We offer a romantic upgrade with flower decoration, candle-lit dinner, and private heritage suite.",
      },
      {
        q: "What is the ideal duration for Rajasthan?",
        a: "8 days covers the three cities well. A 10–12 day extension can include Jaipur and the Ranthambore wildlife reserve.",
      },
    ],
    featured: true,
  },

  {
    id: 6,
    name: "Char Dham Yatra",
    slug: "char-dham-yatra",
    location: "Badrinath • Kedarnath • Gangotri • Yamunotri",
    image:
      "https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=1200&q=85",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
    ],
    price: 24999,
    originalPrice: 34999,
    rating: 4.9,
    reviews: 209,
    duration: "12 Days / 11 Nights",
    groupSize: "4–20",
    badge: "Religious",
    badgeBg: "#f97316",
    category: "Religious",
    highlights: ["Kedarnath Darshan", "Badrinath Temple", "Gangotri Aarti"],
    description:
      "Embark on Hinduism's most sacred pilgrimage — the Char Dham Yatra. This deeply spiritual 12-day journey visits Yamunotri, Gangotri, Kedarnath, and Badrinath, the four abodes of the divine nestled in the Garhwal Himalayas. Experience breathtaking Himalayan scenery, divine rituals, and the profound peace of India's holiest shrines.",
    inclusions: [
      "11-night accommodation in dharamshalas and comfortable guesthouses near each dham",
      "All meals (breakfast, lunch, dinner) throughout the yatra",
      "Puja materials and temple arrangements",
      "Helicopter transfer to Kedarnath (both ways) — optional upgrade available",
      "All transfers in a dedicated Tempo Traveller",
      "Experienced religious guide and yatra manager",
      "VIP darshan arrangements at all four dhams",
      "Rishikesh / Haridwar Ganga Aarti visit included",
      "Emergency medical kit and oxygen cylinder",
      "All taxes and levies",
    ],
    exclusions: [
      "Train / flight to Haridwar/Rishikesh",
      "Personal expenses and tips",
      "Pony or palanquin (available on request)",
      "Travel insurance (strongly recommended)",
      "Any force majeure delays due to weather",
    ],
    season: {
      peak: {
        months: "May – June & September – October",
        note: "Temples are open and weather is manageable — the ideal pilgrimage window.",
      },
      offSeason: {
        months: "November – April",
        note: "All four dhams are closed due to heavy snowfall from November to April/May.",
      },
      priceTendency: "Prices rise significantly in June due to summer pilgrimage rush. Book March–April for best rates.",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "What is the best age for Char Dham Yatra?",
        a: "Suitable for pilgrims of all ages. We advise a medical check-up for those over 60 due to high-altitude trekking.",
      },
      {
        q: "Is the Kedarnath trek mandatory?",
        a: "The 22km trek is the traditional route. Helicopter service and pony/palanquin options are available for those unable to trek.",
      },
      {
        q: "When do the temples open and close each year?",
        a: "Temples open in April/May (Akshaya Tritiya) and close in October/November (Diwali) — exact dates depend on the Hindu calendar.",
      },
      {
        q: "Do we need to register for the yatra?",
        a: "Yes. Biometric registration is mandatory. We handle the entire registration process on your behalf.",
      },
    ],
    featured: true,
  },

  {
    id: 7,
    name: "Andaman Island Retreat",
    slug: "andaman-island-retreat",
    location: "Port Blair • Havelock • Neil Island",
    image:
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=700&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&q=80",
    ],
    price: 21999,
    originalPrice: 31999,
    rating: 4.8,
    reviews: 134,
    duration: "6 Days / 5 Nights",
    groupSize: "2–8",
    badge: "Premium",
    badgeBg: "#0127FC",
    category: "Luxury",
    highlights: ["Scuba Diving", "Radhanagar Beach", "Cellular Jail"],
    description:
      "Escape to India's tropical paradise — the Andaman & Nicobar Islands. Dive into crystal-clear waters teeming with coral reefs and exotic marine life, unwind on Radhanagar Beach (voted Asia's best beach), and discover the haunting history of the Cellular Jail. A pristine island getaway that feels worlds apart.",
    inclusions: [
      "5-night stay in beach resort (3N Port Blair + 2N Havelock)",
      "Daily breakfast",
      "Ferry transfers between islands (speedboat)",
      "Scuba diving experience at Elephant Beach",
      "Cellular Jail light & sound show",
      "Neil Island day excursion",
      "Ross Island visit",
      "All transfers on islands",
      "Snorkelling equipment included",
      "All government port taxes and ferry fees",
    ],
    exclusions: [
      "Flights to/from Port Blair",
      "Lunch and dinner",
      "PADI certification course (available at extra cost)",
      "Personal expenses",
      "Travel insurance",
    ],
    season: {
      peak: {
        months: "October – May",
        note: "Calm seas and excellent underwater visibility — perfect for diving and beach stays.",
      },
      offSeason: {
        months: "June – September",
        note: "Monsoon season; rough seas restrict ferry services and water activities.",
      },
      priceTendency: "December–February is most popular and most expensive. Budget travellers should aim for March–May.",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "Do I need prior experience for scuba diving?",
        a: "No. Beginner scuba (Discover Scuba Diving) requires no prior experience and is supervised by a PADI instructor.",
      },
      {
        q: "Is it safe to swim at Radhanagar Beach?",
        a: "Yes, designated swimming zones are marked and lifeguards are present during peak hours.",
      },
      {
        q: "How do we travel between islands?",
        a: "We arrange speedboat transfers between Port Blair, Havelock, and Neil Island — included in the package.",
      },
      {
        q: "Do we need a permit for the Andamans?",
        a: "Indian nationals do not need a permit. Foreign nationals require a Restricted Area Permit, which we arrange.",
      },
    ],
    featured: false,
  },

  {
    id: 8,
    name: "Honeymoon in Kashmir",
    slug: "honeymoon-in-kashmir",
    location: "Srinagar • Gulmarg • Pahalgam",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=700&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700&q=80",
    ],
    price: 17999,
    originalPrice: 25999,
    rating: 4.9,
    reviews: 298,
    duration: "7 Days / 6 Nights",
    groupSize: "2",
    badge: "Honeymoon",
    badgeBg: "#e11d48",
    category: "Honeymoon",
    highlights: ["Shikara Ride", "Gondola Cable Car", "Dal Lake"],
    description:
      "Kashmir — Heaven on Earth — is the most romantic destination for newlyweds. Glide across the shimmering Dal Lake on a private Shikara, ride the world's highest gondola over Gulmarg's snow-clad peaks, and stroll through fragrant tulip gardens in Pahalgam. Every moment in Kashmir feels like a love story.",
    inclusions: [
      "6-night accommodation (2N luxury houseboat on Dal Lake + 4N premium hotel)",
      "Daily breakfast and dinner with candlelight dinner on houseboat",
      "Private Shikara ride on Dal Lake (morning & evening)",
      "Gondola Cable Car ride at Gulmarg (Phase 1 & 2)",
      "Betaab Valley and Aru Valley scenic trip, Pahalgam",
      "Shalimar Bagh and Nishat Bagh Mughal gardens",
      "All private transfers with decorated car",
      "Welcome flower bouquet and honeymoon cake",
      "Professional photographer for one session",
      "All taxes and service charges",
    ],
    exclusions: [
      "Flights to/from Srinagar",
      "Lunch",
      "Horse riding in Pahalgam (available at extra cost)",
      "Pony/adventure activities",
      "Travel insurance",
    ],
    season: {
      peak: {
        months: "April – June (tulips & mild weather) & December – February (snow)",
        note: "Spring offers tulip blooms; winter offers a snow-covered fairy-tale Kashmir.",
      },
      offSeason: {
        months: "July – September & November",
        note: "July–September brings pleasant weather but monsoon rains; November can be very cold.",
      },
      priceTendency: "April–May tulip season and New Year are the priciest; book 3 months early.",
      activeSeason: "peak",
    },
    faq: [
      {
        q: "Is Kashmir safe for tourists?",
        a: "Yes. The major tourist areas — Srinagar, Gulmarg, and Pahalgam — are safe and well-policed. We monitor conditions daily.",
      },
      {
        q: "What is a houseboat stay like?",
        a: "Our partner luxury houseboats on Dal Lake have en-suite bedrooms, sit-out balconies, and include full board meals.",
      },
      {
        q: "Can we see snow in Kashmir?",
        a: "Yes — Gulmarg receives heavy snowfall from December to March. Light snowfall can occur in Srinagar from January.",
      },
      {
        q: "Is the Gondola cable car always open?",
        a: "The Gondola operates year-round except during heavy snowstorms or technical maintenance. We check availability before your trip.",
      },
    ],
    featured: true,
  },

  {
    id: 9,
    name: "Spiti Valley Expedition",
    slug: "spiti-valley-expedition",
    location: "Shimla • Kaza • Chandratal",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=700&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
    ],
    price: 13499,
    originalPrice: 19499,
    rating: 4.7,
    reviews: 92,
    duration: "9 Days / 8 Nights",
    groupSize: "4–15",
    badge: "Adventure",
    badgeBg: "#10b981",
    category: "Adventure",
    highlights: ["Key Monastery", "Chandratal Lake", "Himalayan Villages"],
    description:
      "Journey to one of Earth's most remote and mesmerising landscapes — the cold desert of Spiti Valley. Cross high-altitude passes, visit ancient Buddhist monasteries perched on clifftops, camp beside the breathtaking Chandratal (Moon Lake), and experience the raw, untouched beauty of Himalayan villages. A true expedition for the adventurous soul.",
    inclusions: [
      "8-night accommodation (mix of guesthouses and one night camping)",
      "All meals (breakfast, lunch, dinner) throughout the trip",
      "Key Monastery, Tabo Monastery and Ki Gompa guided tours",
      "Chandratal Lake camping with bonfire",
      "Kaza market and local village visit",
      "4WD transfers through mountain terrain",
      "Experienced mountain guide and support driver",
      "Emergency oxygen cylinder and first-aid kit",
      "All permits (inner line permit if required)",
      "All applicable taxes",
    ],
    exclusions: [
      "Bus / train to Shimla",
      "Personal trekking gear (list provided on booking)",
      "Tips and gratuities",
      "Satellite phone rental (recommended)",
      "Travel insurance (mandatory for adventure routes)",
    ],
    season: {
      peak: {
        months: "June – September",
        note: "The only window when both the Shimla–Spiti and Manali–Spiti roads are fully open.",
      },
      offSeason: {
        months: "October – May",
        note: "Roads are snow-blocked and temperatures drop to –30°C. Only winter expeditions run Nov–Feb.",
      },
      priceTendency: "July–August is peak expedition season with slightly higher prices; June offers best value.",
      activeSeason: "off",
    },
    faq: [
      {
        q: "How difficult is the Spiti Valley trip?",
        a: "Moderate to challenging. Altitude sickness, rough roads, and basic facilities mean good physical fitness and mental preparedness are essential.",
      },
      {
        q: "What altitude does the route reach?",
        a: "The highest point is Kunzum Pass at approximately 4,551m (14,928 ft). Acclimatisation days are built into the itinerary.",
      },
      {
        q: "Is there mobile / internet connectivity?",
        a: "BSNL has patchy coverage in Kaza. For most of the route, connectivity is unavailable — this is part of the experience!",
      },
      {
        q: "What is the cancellation policy for adventure trips?",
        a: "Free cancellation up to 21 days before departure. Within 21 days: 50% refund. Within 7 days: no refund due to pre-bookings.",
      },
    ],
    featured: false,
  },
];

/** Find a package by its slug */
export function getPackageBySlug(slug: string): Package | undefined {
  return ALL_PACKAGES.find((p) => p.slug === slug);
}

/** Get packages in the same category, excluding the given id */
export function getSimilarPackages(
  category: string,
  excludeId: number,
  limit = 4
): Package[] {
  return ALL_PACKAGES.filter(
    (p) => p.category === category && p.id !== excludeId
  ).slice(0, limit);
}

/** Get featured/popular packages, excluding the given id */
export function getRecommendedPackages(
  excludeId: number,
  limit = 4
): Package[] {
  return ALL_PACKAGES.filter(
    (p) => p.featured && p.id !== excludeId
  ).slice(0, limit);
}
