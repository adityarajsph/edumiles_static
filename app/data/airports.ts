/**
 * app/data/airports.ts
 *
 * The definitive airport data layer.
 *
 * - AIRPORTS_STATIC  — small curated list for SSR / instant first render
 * - searchAirports() — searches the full CSV-backed /api/airports endpoint
 * - Airport          — shared type used across Hero, EnquiryModal, etc.
 */

export interface Airport {
  iata:    string;   // 3-letter IATA code  (was "code" in the old list)
  icao:    string;
  name:    string;   // full airport name
  city:    string;
  country: string;
  type?:   "large_airport" | "medium_airport" | "small_airport";
  // legacy alias so old code that reads .code still works
  code?:   string;
}

/** Normalise raw API records so `.code` equals `.iata` for backward compat */
function normalise(a: Airport): Airport {
  return { ...a, code: a.iata };
}

/**
 * Debounce-friendly async search.
 * Returns at most `limit` airports matching `query`.
 * Falls back to AIRPORTS_STATIC on any error.
 */
export async function searchAirports(
  query: string,
  limit = 20
): Promise<Airport[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (query.trim()) params.set("q", query.trim());
    const res = await fetch(`/api/airports?${params}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error("API error");
    const data: Airport[] = await res.json();
    return data.map(normalise);
  } catch {
    // Graceful fallback to the static list
    const q = query.toLowerCase();
    return AIRPORTS_STATIC.filter(a =>
      !q ||
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, limit);
  }
}

/* ─────────────────────────────────────────────────────────────
   STATIC CURATED LIST
   Used as instant placeholder data before the API responds,
   and as a fallback when the API is unavailable.
───────────────────────────────────────────────────────────── */
export const AIRPORTS_STATIC: Airport[] = [
  // ── India ──────────────────────────────────────────────────
  { iata: "DEL", icao: "VIDP", name: "Indira Gandhi International",               city: "New Delhi",          country: "India" },
  { iata: "BOM", icao: "VABB", name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai",             country: "India" },
  { iata: "BLR", icao: "VOBL", name: "Kempegowda International",                  city: "Bengaluru",          country: "India" },
  { iata: "MAA", icao: "VOMM", name: "Chennai International",                     city: "Chennai",            country: "India" },
  { iata: "CCU", icao: "VECC", name: "Netaji Subhas Chandra Bose International",  city: "Kolkata",            country: "India" },
  { iata: "HYD", icao: "VOHS", name: "Rajiv Gandhi International",                city: "Hyderabad",          country: "India" },
  { iata: "AMD", icao: "VAAH", name: "Sardar Vallabhbhai Patel International",    city: "Ahmedabad",          country: "India" },
  { iata: "PNQ", icao: "VAPO", name: "Pune Airport",                              city: "Pune",               country: "India" },
  { iata: "COK", icao: "VOCI", name: "Cochin International",                      city: "Kochi",              country: "India" },
  { iata: "JAI", icao: "VIJP", name: "Jaipur International",                      city: "Jaipur",             country: "India" },
  { iata: "GOI", icao: "VAGO", name: "Goa International (Dabolim)",               city: "Goa",                country: "India" },
  { iata: "SXR", icao: "VISR", name: "Sheikh ul Alam International",              city: "Srinagar",           country: "India" },
  { iata: "IXL", icao: "VILH", name: "Kushok Bakula Rimpochhe Airport",           city: "Leh",                country: "India" },
  { iata: "TRV", icao: "VOTV", name: "Trivandrum International",                  city: "Thiruvananthapuram", country: "India" },
  { iata: "VNS", icao: "VIBN", name: "Lal Bahadur Shastri International",         city: "Varanasi",           country: "India" },
  { iata: "LKO", icao: "VILK", name: "Chaudhary Charan Singh International",      city: "Lucknow",            country: "India" },
  { iata: "IDR", icao: "VAID", name: "Devi Ahilyabai Holkar Airport",             city: "Indore",             country: "India" },
  { iata: "ATQ", icao: "VIAR", name: "Sri Guru Ram Dass Jee International",       city: "Amritsar",           country: "India" },
  { iata: "GAU", icao: "VEGY", name: "Lokpriya Gopinath Bordoloi International",  city: "Guwahati",           country: "India" },
  { iata: "BBI", icao: "VEBS", name: "Biju Patnaik International",                city: "Bhubaneswar",        country: "India" },
  { iata: "IXC", icao: "VICG", name: "Chandigarh International",                  city: "Chandigarh",         country: "India" },
  { iata: "DED", icao: "VIDN", name: "Jolly Grant Airport",                       city: "Dehradun",           country: "India" },
  { iata: "AGR", icao: "VIAG", name: "Agra Airport",                              city: "Agra",               country: "India" },
  // ── UAE ─────────────────────────────────────────────────────
  { iata: "DXB", icao: "OMDB", name: "Dubai International",                       city: "Dubai",              country: "UAE" },
  { iata: "AUH", icao: "OMAA", name: "Abu Dhabi International",                   city: "Abu Dhabi",          country: "UAE" },
  { iata: "SHJ", icao: "OMSJ", name: "Sharjah International",                     city: "Sharjah",            country: "UAE" },
  // ── South / SE Asia ─────────────────────────────────────────
  { iata: "SIN", icao: "WSSS", name: "Changi International",                      city: "Singapore",          country: "Singapore" },
  { iata: "BKK", icao: "VTBS", name: "Suvarnabhumi International",                city: "Bangkok",            country: "Thailand" },
  { iata: "HKT", icao: "VTSP", name: "Phuket International",                      city: "Phuket",             country: "Thailand" },
  { iata: "KUL", icao: "WMKK", name: "Kuala Lumpur International",                city: "Kuala Lumpur",       country: "Malaysia" },
  { iata: "CMB", icao: "VCBI", name: "Bandaranaike International",                city: "Colombo",            country: "Sri Lanka" },
  { iata: "KTM", icao: "VNKT", name: "Tribhuvan International",                   city: "Kathmandu",          country: "Nepal" },
  { iata: "MLE", icao: "VRMM", name: "Velana International",                      city: "Malé",               country: "Maldives" },
  { iata: "DPS", icao: "WADD", name: "Ngurah Rai International",                  city: "Bali",               country: "Indonesia" },
  // ── Middle East ──────────────────────────────────────────────
  { iata: "DOH", icao: "OTHH", name: "Hamad International",                       city: "Doha",               country: "Qatar" },
  { iata: "RUH", icao: "OERK", name: "King Khalid International",                 city: "Riyadh",             country: "Saudi Arabia" },
  { iata: "JED", icao: "OEJN", name: "King Abdulaziz International",              city: "Jeddah",             country: "Saudi Arabia" },
  { iata: "MED", icao: "OEMA", name: "Prince Mohammad Bin Abdulaziz International",city: "Madinah",           country: "Saudi Arabia" },
  // ── Europe ──────────────────────────────────────────────────
  { iata: "LHR", icao: "EGLL", name: "Heathrow Airport",                          city: "London",             country: "UK" },
  { iata: "CDG", icao: "LFPG", name: "Charles de Gaulle International",           city: "Paris",              country: "France" },
  { iata: "FRA", icao: "EDDF", name: "Frankfurt Airport",                         city: "Frankfurt",          country: "Germany" },
  { iata: "AMS", icao: "EHAM", name: "Amsterdam Schiphol",                        city: "Amsterdam",          country: "Netherlands" },
  { iata: "IST", icao: "LTFM", name: "Istanbul Airport",                          city: "Istanbul",           country: "Turkey" },
  { iata: "BCN", icao: "LEBL", name: "Barcelona–El Prat Airport",                 city: "Barcelona",          country: "Spain" },
  { iata: "FCO", icao: "LIRF", name: "Leonardo da Vinci International",           city: "Rome",               country: "Italy" },
  // ── Americas ────────────────────────────────────────────────
  { iata: "JFK", icao: "KJFK", name: "John F. Kennedy International",             city: "New York",           country: "USA" },
  { iata: "LAX", icao: "KLAX", name: "Los Angeles International",                 city: "Los Angeles",        country: "USA" },
  { iata: "ORD", icao: "KORD", name: "O'Hare International",                      city: "Chicago",            country: "USA" },
  // ── Asia Pacific ────────────────────────────────────────────
  { iata: "NRT", icao: "RJAA", name: "Narita International",                      city: "Tokyo",              country: "Japan" },
  { iata: "ICN", icao: "RKSI", name: "Incheon International",                     city: "Seoul",              country: "South Korea" },
  { iata: "SYD", icao: "YSSY", name: "Sydney Kingsford Smith International",      city: "Sydney",             country: "Australia" },
  { iata: "HKG", icao: "VHHH", name: "Hong Kong International",                   city: "Hong Kong",          country: "Hong Kong" },
].map(a => ({ ...a, code: a.iata }));

/** Legacy alias — AIRPORTS used in EnquiryModal still works */
export const AIRPORTS = AIRPORTS_STATIC;
