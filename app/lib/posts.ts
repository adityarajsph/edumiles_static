/* ─────────────────────────────────────────────────────────────
   Single source of truth for all blog post data.
   Mirror of app/lib/packages.ts — same patterns, same exports.
────────────────────────────────────────────────────────────── */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogSection[];
  coverImage: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  publishedAt: string;   // ISO date string  "2025-04-15"
  readTime: number;      // minutes
  featured?: boolean;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogSection {
  heading?: string;
  body: string;
}

/* ── Shared authors ──────────────────────────────────── */
const AUTHORS: Record<string, BlogAuthor> = {
  rajiv: {
    name: "Rajiv Sharma",
    role: "Founder & Travel Expert",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80",
  },
  priya: {
    name: "Priya Nair",
    role: "Destination Specialist",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=80",
  },
  arjun: {
    name: "Arjun Mehta",
    role: "Adventure Travel Writer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=80",
  },
};

export const ALL_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Golden Triangle Tour: The Ultimate India First-Timer's Guide",
    slug: "golden-triangle-tour-guide",
    excerpt:
      "Delhi, Agra, and Jaipur form India's most iconic travel circuit. Here's everything you need to plan a perfect 6-day Golden Triangle journey — from the best time to visit to hidden gems most tourists miss.",
    coverImage:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85",
    author: AUTHORS.rajiv,
    category: "Heritage",
    tags: ["Golden Triangle", "Delhi", "Agra", "Jaipur", "Heritage", "First Timer"],
    publishedAt: "2025-03-10",
    readTime: 8,
    featured: true,
    content: [
      {
        heading: "Why the Golden Triangle?",
        body: "No trip to India is complete without witnessing the Taj Mahal at sunrise, the imposing ramparts of Amber Fort, and the labyrinthine lanes of Old Delhi. These three cities sit within 250 km of each other, making them the perfect introduction to India's architectural and cultural legacy. The circuit is well-connected by road, rail, and a growing network of expressways — so logistics are far simpler than most travellers expect.",
      },
      {
        heading: "The Best Time to Visit",
        body: "October through March is peak season — temperatures are pleasant (15–25°C), skies are clear, and visibility at the Taj Mahal is exceptional. Avoid May and June: temperatures in Agra and Jaipur regularly exceed 44°C. If you must travel in summer, book hotels with good air-conditioning well in advance and plan all sightseeing before 10 AM. Monsoon (July–September) brings relief from the heat but can make road travel unpredictable.",
      },
      {
        heading: "Delhi: More Than Just a Gateway",
        body: "Most travellers treat Delhi as an overnight stop, but the city deserves at least two full days. Humayun's Tomb — a Mughal masterpiece that inspired the Taj Mahal itself — is far less crowded and equally stunning. Qutub Minar, with its perfectly proportioned 73-metre tower, is best visited in the early morning light. For a contrast, spend an afternoon in Hauz Khas Village: a medieval reservoir now surrounded by design studios, cafes, and street art.",
      },
      {
        heading: "Agra: The City of the Taj",
        body: "Book the pre-dawn entry to the Taj Mahal — the monument turns a deep rose-gold at sunrise that no photograph fully captures. The Agra Fort, just 2 km away, offers a view of the Taj from Shah Jahan's marble prison chamber that is deeply moving. One often-overlooked gem: Itmad-ud-Daulah, nicknamed the 'Baby Taj', is a smaller but exquisite mausoleum that feels entirely personal in scale. Plan at least four hours in Agra beyond the Taj alone.",
      },
      {
        heading: "Jaipur: The Pink City",
        body: "Jaipur demands at least a day and a half. Start with Amber Fort in the early morning — the elephant ride is optional but memorable. The City Palace is still partially inhabited by the royal family and opens for public tours; the textile museum inside is among the finest in Rajasthan. For shopping, head to Johari Bazaar for jewellery and Bapu Bazaar for block-printed fabrics. End the day watching the sunset from Nahargarh Fort overlooking the city.",
      },
      {
        heading: "Practical Tips",
        body: "Pre-book all major monument tickets online — queue times for the Taj Mahal walk-in counter can exceed two hours. Hire a licensed Archaeological Survey of India (ASI) guide at each site rather than freelancers at the gate. Carry a reusable water bottle and refill at hotel lobbies. Dress modestly (covered shoulders and knees) to ensure smooth entry to all religious sites. Carry some cash — many smaller eateries and auto-rickshaws do not accept cards.",
      },
    ],
  },

  {
    id: 2,
    title: "Kerala Backwaters: A Complete Houseboat Survival Guide",
    slug: "kerala-backwaters-houseboat-guide",
    excerpt:
      "Spending a night on a traditional Kerala kettuvallam houseboat is a bucket-list experience. Here's everything you should know — from choosing the right boat class to what to eat on board.",
    coverImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85",
    author: AUTHORS.priya,
    category: "Luxury",
    tags: ["Kerala", "Backwaters", "Houseboat", "Alleppey", "Luxury Travel"],
    publishedAt: "2025-02-20",
    readTime: 7,
    featured: true,
    content: [
      {
        heading: "What Are the Kerala Backwaters?",
        body: "The backwaters are a network of brackish lagoons, lakes, rivers, and canals stretching 900 km along the Kerala coast. The most famous stretch runs between Kollam and Kottayam through Alleppey (Alappuzha) — a patchwork of narrow waterways fringed by coconut palms and paddy fields. Life on the banks moves at a pace that is almost impossible to find anywhere else in India.",
      },
      {
        heading: "Choosing Your Houseboat",
        body: "Kettuvallam (rice barges) are the traditional houseboat style — hand-built from bamboo, coir, and teak without a single nail. They range from basic one-bedroom boats to premium four-bedroom floating villas with air-conditioning, sun decks, and personal chefs. As a rough guide: a one-bedroom AC boat for two adults runs ₹8,000–12,000 per night including all meals. A premium three-bedroom boat with a Jacuzzi costs ₹25,000–35,000. Book at least three weeks ahead in peak season (November–February).",
      },
      {
        heading: "What to Eat on Board",
        body: "The highlight of any houseboat stay is the food. Expect karimeen (pearl spot fish) pollichathu, prawn moilee, and toddy-shop style tapioca with fish curry. Most houseboats include breakfast, lunch, evening snacks, and dinner in the tariff — the meals are cooked fresh on board using local produce. If you have dietary restrictions, communicate them at the time of booking; good operators accommodate vegetarian, vegan, and gluten-free diets without issue.",
      },
      {
        heading: "The Best Route",
        body: "The classic overnight route departs from Alleppey, navigates through Vembanad Lake, and moors for the night in a quiet canal away from other boats. Dawn on the backwaters — with mist rising off still water and egrets standing in the shallows — is genuinely magical. For a day cruise without the overnight stay, the two-hour trip between Alleppey and Kumarakom is perfectly adequate and far more affordable.",
      },
      {
        heading: "What to Pack",
        body: "Lightweight cottons and linens are ideal — the humidity is high. Bring reef-safe sunscreen (to protect the water ecosystem), insect repellent, and motion sickness tablets if you are sensitive. Leave large rolling suitcases at your hotel in Kochi; a soft duffel is far easier to manage on board. Mobile coverage varies — carry a book.",
      },
    ],
  },

  {
    id: 3,
    title: "Spiti Valley in June: The Road Less Travelled",
    slug: "spiti-valley-june-travel-guide",
    excerpt:
      "June is the sweet spot for Spiti — the roads have just opened after winter, the landscape is achingly beautiful, and the crowds that arrive in August are still weeks away. Here's why June deserves a second look.",
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85",
    author: AUTHORS.arjun,
    category: "Adventure",
    tags: ["Spiti Valley", "Himachal Pradesh", "Adventure", "Road Trip", "June Travel"],
    publishedAt: "2025-01-28",
    readTime: 9,
    featured: true,
    content: [
      {
        heading: "Why June Is Spiti's Hidden Season",
        body: "Spiti Valley opens to travellers in late May or early June when the Rohtang Pass snow clears enough for vehicles to cross. In June, you get the best of every world: the mountains still carry winter snow on their upper reaches, the rivers run fast and turquoise with snowmelt, wildflowers carpet every meadow, and — crucially — the tourist infrastructure hasn't yet reached capacity. Guesthouses in Kaza, Langza, and Chicham are available and at off-peak rates.",
      },
      {
        heading: "Acclimatisation Is Not Optional",
        body: "Kaza sits at 3,800m and Chandratal at 4,300m. Altitude sickness is real: symptoms include severe headache, nausea, and in extreme cases pulmonary oedema. The rule is simple — ascend gradually. Spend at least one full rest day in Shimla (2,200m) before continuing. Do not fly directly to Manali and drive straight to Kaza in one day. Drink four litres of water daily. Avoid alcohol for the first two days at altitude.",
      },
      {
        heading: "The Shimla–Spiti Route vs Manali–Spiti",
        body: "The Shimla route via Narkanda, Rekong Peo, Nako, and Tabo is gentler in altitude gain and passes through some of the most ancient Buddhist monasteries in the Himalayas. The Manali route via Rohtang and Kunzum passes is more dramatic but steeper and more prone to landslides in early June. If this is your first Spiti trip, ascend via Shimla and descend via Manali — you get both routes and acclimatise properly.",
      },
      {
        heading: "Must-Visit Places",
        body: "Key Monastery (4,166m) is a living monastery with around 300 monks and the most photogenic gompa in the valley. Chicham Bridge, the highest bridge in Asia, spans a deep gorge near Kibber village. Chandratal (Moon Lake) is a glacial lake at 4,300m — the reflection of the surrounding mountains in its still, deep-blue water is extraordinary. Do not leave without a quiet evening at Langza, where a giant Buddha statue watches over ancient fossil beds.",
      },
      {
        heading: "What to Pack",
        body: "Layer aggressively — June temperatures range from -5°C at night to 22°C at midday. Bring: a good down jacket, thermal base layers, waterproofs, UV-protection sunglasses (the UV at altitude is intense), SPF 50 sunscreen, and sturdy ankle-support hiking boots. A power bank is essential — electricity is unreliable in remote villages. Pack a small first-aid kit with Diamox (acetazolamide) for altitude sickness, ibuprofen, ORS sachets, and a basic bandage.",
      },
    ],
  },

  {
    id: 4,
    title: "Char Dham Yatra: A Pilgrim's Practical Handbook",
    slug: "char-dham-yatra-practical-guide",
    excerpt:
      "The four sacred shrines of Yamunotri, Gangotri, Kedarnath, and Badrinath are among Hinduism's most revered destinations. This guide covers registration, route order, fitness requirements, and the best time to go.",
    coverImage:
      "https://images.unsplash.com/photo-1609766857413-0f0d3c6e1b3a?w=1200&q=85",
    author: AUTHORS.rajiv,
    category: "Religious",
    tags: ["Char Dham", "Kedarnath", "Badrinath", "Pilgrimage", "Uttarakhand"],
    publishedAt: "2025-03-25",
    readTime: 10,
    featured: false,
    content: [
      {
        heading: "Understanding the Char Dham",
        body: "The Chota Char Dham refers to four Himalayan shrines — Yamunotri (source of the Yamuna), Gangotri (origin of the Ganga), Kedarnath (one of 12 Jyotirlingas), and Badrinath (one of the 108 Divya Desams). The traditional pilgrimage proceeds west to east: Yamunotri → Gangotri → Kedarnath → Badrinath. This ordering is considered auspicious. The temples are open only between May and November; they close for winter when priests carry the deities to lower-altitude villages.",
      },
      {
        heading: "Biometric Registration Is Mandatory",
        body: "The Uttarakhand government requires all Char Dham pilgrims to register at the official portal (registrationandtouristcare.uk.gov.in). You receive a slot-based entry time for each shrine. Walk-in entry is no longer permitted at Kedarnath; other dhams also have slot systems in peak months. Register as early as possible — slots for June fill within days of release. The registration is free and takes about ten minutes.",
      },
      {
        heading: "Kedarnath: The Most Demanding Dham",
        body: "Kedarnath sits at 3,583m and is accessible only on foot (22 km round trip from Gaurikund) or by helicopter. The trek is manageable for most people of average fitness but should not be underestimated — it involves significant altitude gain and can be slippery in rain. Ponies and dolis (palanquins) are available for those unable to trek. The helicopter route from Phata or Guptkashi takes seven minutes each way and costs ₹4,000–6,500 per person; book months in advance for peak season.",
      },
      {
        heading: "What to Carry",
        body: "Warm clothing is essential at all four dhams — temperatures drop sharply after sunset even in May and June. A sturdy walking pole is invaluable on the Kedarnath and Yamunotri treks. Carry your own water and snacks for treks; stalls exist but prices are steep. A small medical kit with altitude sickness tablets, paracetamol, and ORS sachets is wise. Keep official ID documents (Aadhaar or passport) accessible at all checkpoints.",
      },
      {
        heading: "A Note on Respect and Etiquette",
        body: "All four temples are active places of worship. Dress conservatively: cover shoulders and knees, and remove footwear before entering temple precincts. Mobile photography is restricted inside the sanctum sanctorum of most shrines. Avoid using intoxicants on the yatra route. The natural environment around the shrines is protected — do not litter and carry reusable bags.",
      },
    ],
  },

  {
    id: 5,
    title: "Kashmir in April: Tulips, Snow, and Zero Crowds",
    slug: "kashmir-april-tulips-travel-guide",
    excerpt:
      "April is Kashmir's most photogenic month — the Indira Gandhi Tulip Garden is in full bloom, Gulmarg still has skiing, and tourist numbers are a fraction of what they'll be in May. Here's how to plan it right.",
    coverImage:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85",
    author: AUTHORS.priya,
    category: "Honeymoon",
    tags: ["Kashmir", "Tulip Festival", "Srinagar", "Gulmarg", "April Travel"],
    publishedAt: "2025-02-05",
    readTime: 7,
    featured: true,
    content: [
      {
        heading: "Why April Is Kashmir's Best-Kept Secret",
        body: "Most Indian tourists plan Kashmir in May (school holidays) or July (summer break), when Dal Lake is ringed with a thousand houseboats and queues at the Gondola stretch for hours. April sits in a sweet spot: the Tulip Garden — Asia's largest — is in full bloom from late March through mid-April, Gulmarg still receives skiers (Phase 2 of the Gondola usually operates through April), and room rates are 30–40% lower than peak.",
      },
      {
        heading: "The Indira Gandhi Memorial Tulip Garden",
        body: "Spread across seven terraces on the slopes of Zabarwan mountain, the garden holds over 1.5 million tulips in more than 60 varieties. It opens in late March and typically peaks in the first two weeks of April, depending on the season. Entry costs ₹50 for adults. Visit early morning — the light is extraordinary and you'll have the paths nearly to yourself. The garden closes when tulips die, usually by mid-April.",
      },
      {
        heading: "Gulmarg in April",
        body: "Gulmarg at 2,650m still has excellent snow cover in April. The Gondola's Phase 1 (Gulmarg to Kongdori, 2,650m to 3,100m) and often Phase 2 (Kongdori to Afarwat, 4,200m) are operational. Skiing is available for beginners with rental equipment; the Ski School of Gulmarg offers two-hour beginner lessons at around ₹1,200 per person. If you are not a skier, the Gondola ride alone — with 360-degree views of the Himalayas — is worth the journey.",
      },
      {
        heading: "Dal Lake & Shikara Rides",
        body: "No Kashmir trip is complete without a Shikara ride on Dal Lake at dawn. The floating vegetable market begins around 6 AM — small wooden boats loaded with lotus roots, fresh greens, and tomatoes converge in a quiet corner of the lake. The entire experience is done by 8 AM. For sunset, hire a Shikara to the central lake and watch the light change on the Pir Panjal mountains. An hour-long Shikara ride costs ₹700–1,000, negotiated before boarding.",
      },
      {
        heading: "Staying on a Houseboat",
        body: "A premium houseboat on Dal Lake — carved walnut furniture, hand-woven Kashmiri carpets, a private deck with mountain views — is one of the great travel experiences in India. Prices range from ₹3,500 (standard, double occupancy) to ₹15,000+ per night (deluxe, with meals). In April, off-peak rates apply. Choose houseboats in the quieter Eastern Dal rather than on the main tourist boulevard for a more authentic stay.",
      },
    ],
  },

  {
    id: 6,
    title: "Goa Beyond the Beach: 8 Hidden Experiences Most Tourists Miss",
    slug: "goa-hidden-experiences-guide",
    excerpt:
      "Goa's beaches are world-famous, but the state offers far more — ancient churches, spice plantations, cashew fenny distilleries, Portuguese heritage villages, and wildlife sanctuaries that most tourists never discover.",
    coverImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85",
    author: AUTHORS.arjun,
    category: "Weekend Trips",
    tags: ["Goa", "Off-Beat", "Weekend Trip", "Heritage", "Nature"],
    publishedAt: "2025-01-15",
    readTime: 6,
    featured: false,
    content: [
      {
        heading: "Old Goa's Baroque Churches",
        body: "The Basilica of Bom Jesus, a UNESCO World Heritage Site, houses the preserved body of St. Francis Xavier. It's been nearly 500 years and the body remains intact — a fact that draws both devotees and the curious. Nearby, the Se Cathedral is the largest church in Asia and has extraordinary painted altarpieces. Old Goa is fifteen minutes from Panaji by road and receives a fraction of the footfall of North Goa beaches.",
      },
      {
        heading: "Fontainhas: Goa's Latin Quarter",
        body: "Fontainhas in Panaji is a grid of narrow streets lined with brightly painted Portuguese-era houses — ochre, indigo, lime green — their windows framed by carved wooden shutters. The neighbourhood has a handful of excellent cafes, independent bookshops, and art galleries. The best way to see it is on foot in the late afternoon when the light turns golden. Entry is free; no tour guide required.",
      },
      {
        heading: "Sahakari Spice Farm",
        body: "Forty kilometres from Panaji in Ponda, Sahakari Spice Farm offers a 90-minute guided walk through four acres of spice cultivation — pepper vines climbing areca palms, vanilla orchids, cardamom, cinnamon, and nutmeg. The tour ends with a traditional Goan lunch served on banana leaves. Booking in advance is recommended; entry with lunch is ₹850 per person.",
      },
      {
        heading: "Dudhsagar Waterfalls by Jeep",
        body: "The four-tiered Dudhsagar (Sea of Milk) waterfall drops 310 metres and is one of India's tallest. The only way in is a 45-minute jeep safari on forest tracks through Bhagwan Mahavir Wildlife Sanctuary. The entry point is Mollem National Park; shared jeeps depart from the forest check-post and cost approximately ₹1,200 per person. Swimming is permitted in the pool at the base, which is a rare thrill.",
      },
      {
        heading: "Feni: The Spirit of Goa",
        body: "Cashew fenny — distilled from the fermented juice of the cashew apple — is Goa's indigenous spirit and a GI-tagged product. Several small distilleries in Querim and Pernem welcome visitors during the cashew harvest season (March–May). Watching the extraction and double-distillation process, then tasting fresh fenny straight from the pot still, is an experience no food lover should pass up.",
      },
    ],
  },

  {
    id: 7,
    title: "Rajasthan Royal Circuit: How to Do It in 8 Days",
    slug: "rajasthan-8-day-circuit-guide",
    excerpt:
      "Jodhpur, Jaisalmer, and Udaipur are three of India's most visually striking cities. Done right, the circuit takes 8 days and packs in desert safaris, palace hotels, lake views, and some of the finest food in the country.",
    coverImage:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85",
    author: AUTHORS.rajiv,
    category: "Heritage",
    tags: ["Rajasthan", "Jodhpur", "Jaisalmer", "Udaipur", "Desert Safari", "Heritage"],
    publishedAt: "2025-03-01",
    readTime: 8,
    featured: false,
    content: [
      {
        heading: "Day 1–2: Jodhpur — The Blue City",
        body: "Arrive in Jodhpur and check in. Spend the afternoon at Mehrangarh Fort — the largest in Rajasthan, rising 125 metres above the city on a sheer rock face. The museum inside traces 500 years of Jodhpur's royal history. Wander through the Blue City lanes at the fort's base: the indigo-painted Brahmin houses create an optical illusion that seems to make the fort float above a blue sea. The next morning, visit Jaswant Thada, a marble cenotaph that glows pink in the morning light.",
      },
      {
        heading: "Day 3–4: Jaisalmer — The Golden City",
        body: "The five-hour drive (or train) from Jodhpur to Jaisalmer crosses the Thar Desert. Jaisalmer Fort is one of the few living forts in the world — families, guesthouses, and restaurants operate within its ramparts. The havelis of Patwon Ki Haveli and Salim Singh Ki Haveli have intricate stone latticework that rivals any carving in India. The essential experience: an overnight desert camp at Sam Sand Dunes — dinner by bonfire, folk music, and a night sky undiminished by light pollution.",
      },
      {
        heading: "Day 5–6: En Route & Udaipur Arrival",
        body: "The 7-hour drive from Jaisalmer to Udaipur rewards patience: the landscape transitions from desert to scrubland to the rolling Aravalli hills. A lunch break in Ranakpur — home to one of the most extraordinary Jain temples in India, with 1,444 individually carved marble pillars — is essential. Arrive in Udaipur by evening and take a sunset boat ride on Lake Pichola.",
      },
      {
        heading: "Day 7–8: Udaipur — The City of Lakes",
        body: "Udaipur deserves two full days. The City Palace complex, built over 400 years, is the largest in Rajasthan and houses an excellent museum and a rooftop that gives the best view of the lake. The Bagore Ki Haveli cultural show at 7 PM — traditional Rajasthani puppet shows, folk dances, and music — is genuinely excellent rather than tourist-trap. For dinner, book a rooftop table at Ambrai Ghat to watch the lights of the City Palace reflect on the water.",
      },
    ],
  },

  {
    id: 8,
    title: "10 Things Nobody Tells You Before Visiting the Andaman Islands",
    slug: "andaman-islands-travel-tips",
    excerpt:
      "The Andamans are India's most remote and pristine archipelago. Here's an honest guide to what the Instagram posts don't show you — from ferry logistics to permit requirements and the realities of scuba diving.",
    coverImage:
      "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=85",
    author: AUTHORS.priya,
    category: "Luxury",
    tags: ["Andaman Islands", "Beach", "Scuba Diving", "Island Travel", "Travel Tips"],
    publishedAt: "2025-01-05",
    readTime: 7,
    featured: false,
    content: [
      {
        heading: "1. The Ferry Schedule Is Everything",
        body: "There are no road connections between Port Blair, Havelock, and Neil Island — only boats. Government ferries are cheap but infrequent (twice daily) and require advance booking at the Directorate of Shipping Services in Port Blair. Private speedboats (Makruzz, Nautika, Green Ocean) run on schedule, take 60–90 minutes compared to 2.5–3 hours for the government ferry, and can be booked online. Speedboat tickets sell out 2–3 weeks in advance during December–January.",
      },
      {
        heading: "2. Port Blair Is Not the Destination",
        body: "Most travellers land in Port Blair and move on the same day or the next morning. The Cellular Jail National Memorial is worth three hours of your time — the son et lumière (sound and light) show each evening at 6 PM is remarkably moving. But the real Andamans begin when you board the boat to Havelock or Neil.",
      },
      {
        heading: "3. Radhanagar Beach Is Really That Good",
        body: "Time magazine's 'Best Beach in Asia' tag from 2004 still holds up. The beach stretches 2 km in a perfect arc of flour-white sand and turquoise water backed by dense forest. Arrive before 10 AM for the best light and before the day-trippers. Swimming is safe in the designated zones (watch for rip currents outside them). The beach closes at 5 PM due to saltwater crocodiles emerging from the mangroves at dusk — take this seriously.",
      },
      {
        heading: "4. Scuba Diving Is Worth Every Rupee",
        body: "The Andamans sit at the top of the Coral Triangle, one of the world's most biodiverse marine regions. Discover Scuba Diving (no certification required) at Elephant Beach, Havelock is around ₹3,500–4,500 for a 30-minute guided dive. A PADI Open Water certification course costs ₹18,000–22,000 and takes 3–4 days. The best dive sites — Lighthouse, Aquarium, Barracuda City — require certification. Book with a PADI-authorised dive centre.",
      },
      {
        heading: "5. Connectivity Is Minimal, and That Is the Point",
        body: "BSNL and BSNL postpaid have the most reliable coverage in the Andamans. Private network carriers (Airtel, Jio) have spotty 4G on Havelock and almost none on Neil Island. Embrace it. The Andamans are one of the last places in India where you can genuinely disconnect. Download your maps, books, and playlists offline before you go.",
      },
    ],
  },
];

/* ── Helpers ─────────────────────────────────────────── */

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find(p => p.slug === slug);
}

export function getRelatedPosts(
  category: string,
  excludeId: number,
  limit = 3
): BlogPost[] {
  return ALL_POSTS
    .filter(p => p.category === category && p.id !== excludeId)
    .slice(0, limit);
}

export function getFeaturedPosts(limit = 3): BlogPost[] {
  return ALL_POSTS.filter(p => p.featured).slice(0, limit);
}

export const BLOG_CATEGORIES = [
  "All",
  "Heritage",
  "Adventure",
  "Luxury",
  "Honeymoon",
  "Religious",
  "Weekend Trips",
];
