"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, PlaneTakeoff, PlaneLanding, Calendar, Users,
  User, Mail, Phone, ChevronDown, Send, CheckCircle,
  Loader2, Baby, UserCheck, Plane, MapPin,
} from "lucide-react";

/* ─── Airport list ───────────────────────────────────────────── */
const AIRPORTS = [
  // ── India ──
  { code: "DEL", name: "Indira Gandhi International",               city: "New Delhi",          country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai",              country: "India" },
  { code: "BLR", name: "Kempegowda International",                  city: "Bengaluru",           country: "India" },
  { code: "MAA", name: "Chennai International",                     city: "Chennai",             country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International",  city: "Kolkata",             country: "India" },
  { code: "HYD", name: "Rajiv Gandhi International",                city: "Hyderabad",           country: "India" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International",    city: "Ahmedabad",           country: "India" },
  { code: "PNQ", name: "Pune Airport",                              city: "Pune",                country: "India" },
  { code: "COK", name: "Cochin International",                      city: "Kochi",               country: "India" },
  { code: "JAI", name: "Jaipur International",                      city: "Jaipur",              country: "India" },
  { code: "GOI", name: "Goa International (Dabolim)",               city: "Goa",                 country: "India" },
  { code: "IXC", name: "Chandigarh International",                  city: "Chandigarh",          country: "India" },
  { code: "LKO", name: "Chaudhary Charan Singh International",      city: "Lucknow",             country: "India" },
  { code: "PAT", name: "Jay Prakash Narayan International",         city: "Patna",               country: "India" },
  { code: "BHO", name: "Raja Bhoj Airport",                         city: "Bhopal",              country: "India" },
  { code: "NAG", name: "Dr. Babasaheb Ambedkar International",      city: "Nagpur",              country: "India" },
  { code: "SXR", name: "Sheikh ul Alam International",              city: "Srinagar",            country: "India" },
  { code: "IXB", name: "Bagdogra Airport",                          city: "Siliguri",            country: "India" },
  { code: "TRV", name: "Trivandrum International",                  city: "Thiruvananthapuram",  country: "India" },
  { code: "VTZ", name: "Visakhapatnam Airport",                     city: "Visakhapatnam",       country: "India" },
  { code: "IXZ", name: "Veer Savarkar International",               city: "Port Blair",          country: "India" },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi International",  city: "Guwahati",            country: "India" },
  { code: "IXR", name: "Birsa Munda Airport",                       city: "Ranchi",              country: "India" },
  { code: "BBI", name: "Biju Patnaik International",                city: "Bhubaneswar",         country: "India" },
  { code: "VNS", name: "Lal Bahadur Shastri International",         city: "Varanasi",            country: "India" },
  { code: "ATQ", name: "Sri Guru Ram Dass Jee International",       city: "Amritsar",            country: "India" },
  { code: "UDR", name: "Maharana Pratap Airport",                   city: "Udaipur",             country: "India" },
  { code: "JDH", name: "Jodhpur Airport",                           city: "Jodhpur",             country: "India" },
  { code: "IXJ", name: "Jammu Airport",                             city: "Jammu",               country: "India" },
  { code: "DED", name: "Jolly Grant Airport",                       city: "Dehradun",            country: "India" },
  { code: "KUU", name: "Kullu Manali Airport",                      city: "Kullu",               country: "India" },
  { code: "IXL", name: "Kushok Bakula Rimpochhe Airport",           city: "Leh",                 country: "India" },
  { code: "SHL", name: "Shillong Airport",                          city: "Shillong",            country: "India" },
  { code: "IMF", name: "Imphal International",                      city: "Imphal",              country: "India" },
  { code: "AGX", name: "Agatti Aerodrome",                          city: "Lakshadweep",         country: "India" },
  { code: "HBX", name: "Hubli Airport",                             city: "Hubli",               country: "India" },
  { code: "IXE", name: "Mangalore International",                   city: "Mangalore",           country: "India" },
  { code: "CJB", name: "Coimbatore International",                  city: "Coimbatore",          country: "India" },
  { code: "TIR", name: "Tirupati Airport",                          city: "Tirupati",            country: "India" },
  { code: "MDU", name: "Madurai Airport",                           city: "Madurai",             country: "India" },
  { code: "IXM", name: "Madurai Airport",                           city: "Madurai",             country: "India" },
  { code: "TRZ", name: "Tiruchirappalli International",             city: "Tiruchirappalli",     country: "India" },
  { code: "RPR", name: "Swami Vivekananda Airport",                 city: "Raipur",              country: "India" },
  { code: "JLR", name: "Jabalpur Airport",                          city: "Jabalpur",            country: "India" },
  { code: "IDR", name: "Devi Ahilyabai Holkar Airport",             city: "Indore",              country: "India" },
  { code: "KNU", name: "Kanpur Airport",                            city: "Kanpur",              country: "India" },
  { code: "AGR", name: "Agra Airport",                              city: "Agra",                country: "India" },
  // ── UAE ──
  { code: "DXB", name: "Dubai International",                       city: "Dubai",               country: "UAE" },
  { code: "AUH", name: "Abu Dhabi International",                   city: "Abu Dhabi",           country: "UAE" },
  { code: "SHJ", name: "Sharjah International",                     city: "Sharjah",             country: "UAE" },
  // ── South Asia / SE Asia ──
  { code: "SIN", name: "Changi International",                      city: "Singapore",           country: "Singapore" },
  { code: "KUL", name: "Kuala Lumpur International",                city: "Kuala Lumpur",        country: "Malaysia" },
  { code: "BKK", name: "Suvarnabhumi International",                city: "Bangkok",             country: "Thailand" },
  { code: "DMK", name: "Don Mueang International",                  city: "Bangkok",             country: "Thailand" },
  { code: "HKT", name: "Phuket International",                      city: "Phuket",              country: "Thailand" },
  { code: "CNX", name: "Chiang Mai International",                  city: "Chiang Mai",          country: "Thailand" },
  { code: "CMB", name: "Bandaranaike International",                city: "Colombo",             country: "Sri Lanka" },
  { code: "KTM", name: "Tribhuvan International",                   city: "Kathmandu",           country: "Nepal" },
  { code: "DAC", name: "Hazrat Shahjalal International",            city: "Dhaka",               country: "Bangladesh" },
  { code: "MLE", name: "Velana International",                      city: "Malé",                country: "Maldives" },
  { code: "RGN", name: "Yangon International",                      city: "Yangon",              country: "Myanmar" },
  { code: "REP", name: "Siem Reap International",                   city: "Siem Reap",           country: "Cambodia" },
  { code: "HAN", name: "Noi Bai International",                     city: "Hanoi",               country: "Vietnam" },
  { code: "SGN", name: "Tan Son Nhat International",                city: "Ho Chi Minh City",    country: "Vietnam" },
  { code: "DPS", name: "Ngurah Rai International",                  city: "Bali",                country: "Indonesia" },
  { code: "CGK", name: "Soekarno–Hatta International",              city: "Jakarta",             country: "Indonesia" },
  { code: "MNL", name: "Ninoy Aquino International",                city: "Manila",              country: "Philippines" },
  { code: "CEB", name: "Mactan–Cebu International",                 city: "Cebu",                country: "Philippines" },
  // ── Middle East ──
  { code: "DOH", name: "Hamad International",                       city: "Doha",                country: "Qatar" },
  { code: "BAH", name: "Bahrain International",                     city: "Manama",              country: "Bahrain" },
  { code: "MCT", name: "Muscat International",                      city: "Muscat",              country: "Oman" },
  { code: "RUH", name: "King Khalid International",                 city: "Riyadh",              country: "Saudi Arabia" },
  { code: "JED", name: "King Abdulaziz International",              city: "Jeddah",              country: "Saudi Arabia" },
  { code: "MED", name: "Prince Mohammad Bin Abdulaziz International", city: "Madinah",           country: "Saudi Arabia" },
  { code: "TLV", name: "Ben Gurion International",                  city: "Tel Aviv",            country: "Israel" },
  { code: "AMM", name: "Queen Alia International",                  city: "Amman",               country: "Jordan" },
  { code: "BEY", name: "Rafic Hariri International",                city: "Beirut",              country: "Lebanon" },
  // ── Africa ──
  { code: "MUS", name: "Sir Seewoosagur Ramgoolam International",   city: "Mauritius",           country: "Mauritius" },
  { code: "NBO", name: "Jomo Kenyatta International",               city: "Nairobi",             country: "Kenya" },
  { code: "CPT", name: "Cape Town International",                   city: "Cape Town",           country: "South Africa" },
  { code: "JNB", name: "O.R. Tambo International",                  city: "Johannesburg",        country: "South Africa" },
  { code: "CAI", name: "Cairo International",                       city: "Cairo",               country: "Egypt" },
  { code: "HRE", name: "Robert Gabriel Mugabe International",       city: "Harare",              country: "Zimbabwe" },
  { code: "ADD", name: "Bole International",                        city: "Addis Ababa",         country: "Ethiopia" },
  // ── Europe ──
  { code: "LHR", name: "Heathrow Airport",                          city: "London",              country: "UK" },
  { code: "LGW", name: "Gatwick Airport",                           city: "London",              country: "UK" },
  { code: "MAN", name: "Manchester Airport",                        city: "Manchester",          country: "UK" },
  { code: "CDG", name: "Charles de Gaulle International",           city: "Paris",               country: "France" },
  { code: "ORY", name: "Paris Orly Airport",                        city: "Paris",               country: "France" },
  { code: "NCE", name: "Nice Côte d'Azur International",            city: "Nice",                country: "France" },
  { code: "FRA", name: "Frankfurt Airport",                         city: "Frankfurt",           country: "Germany" },
  { code: "MUC", name: "Munich Airport",                            city: "Munich",              country: "Germany" },
  { code: "BER", name: "Berlin Brandenburg Airport",                city: "Berlin",              country: "Germany" },
  { code: "AMS", name: "Amsterdam Schiphol",                        city: "Amsterdam",           country: "Netherlands" },
  { code: "ZRH", name: "Zurich Airport",                            city: "Zurich",              country: "Switzerland" },
  { code: "GVA", name: "Geneva Airport",                            city: "Geneva",              country: "Switzerland" },
  { code: "BCN", name: "Barcelona–El Prat Airport",                 city: "Barcelona",           country: "Spain" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas",              city: "Madrid",              country: "Spain" },
  { code: "FCO", name: "Leonardo da Vinci International (Fiumicino)", city: "Rome",              country: "Italy" },
  { code: "MXP", name: "Milan Malpensa International",              city: "Milan",               country: "Italy" },
  { code: "VCE", name: "Venice Marco Polo Airport",                 city: "Venice",              country: "Italy" },
  { code: "ATH", name: "Athens International (Eleftherios Venizelos)", city: "Athens",           country: "Greece" },
  { code: "HER", name: "Heraklion International",                   city: "Crete",               country: "Greece" },
  { code: "IST", name: "Istanbul Airport",                          city: "Istanbul",            country: "Turkey" },
  { code: "SAW", name: "Istanbul Sabiha Gökçen International",      city: "Istanbul",            country: "Turkey" },
  { code: "PRG", name: "Václav Havel Airport Prague",               city: "Prague",              country: "Czech Republic" },
  { code: "VIE", name: "Vienna International Airport",              city: "Vienna",              country: "Austria" },
  { code: "BUD", name: "Budapest Ferenc Liszt International",        city: "Budapest",            country: "Hungary" },
  { code: "WAW", name: "Warsaw Chopin Airport",                     city: "Warsaw",              country: "Poland" },
  { code: "ARN", name: "Stockholm Arlanda Airport",                 city: "Stockholm",           country: "Sweden" },
  { code: "CPH", name: "Copenhagen Airport",                        city: "Copenhagen",          country: "Denmark" },
  { code: "HEL", name: "Helsinki-Vantaa Airport",                   city: "Helsinki",            country: "Finland" },
  { code: "OSL", name: "Oslo Gardermoen Airport",                   city: "Oslo",                country: "Norway" },
  { code: "DUB", name: "Dublin Airport",                            city: "Dublin",              country: "Ireland" },
  { code: "LIS", name: "Lisbon Humberto Delgado Airport",           city: "Lisbon",              country: "Portugal" },
  { code: "OPO", name: "Francisco de Sá Carneiro Airport",          city: "Porto",               country: "Portugal" },
  { code: "BRU", name: "Brussels Airport",                          city: "Brussels",            country: "Belgium" },
  // ── Russia ──
  { code: "SVO", name: "Sheremetyevo International",                city: "Moscow",              country: "Russia" },
  { code: "DME", name: "Domodedovo International",                  city: "Moscow",              country: "Russia" },
  { code: "VKO", name: "Vnukovo International",                     city: "Moscow",              country: "Russia" },
  { code: "ZIA", name: "Zhukovsky International",                   city: "Moscow",              country: "Russia" },
  { code: "LED", name: "Pulkovo Airport",                           city: "St. Petersburg",      country: "Russia" },
  { code: "OVB", name: "Tolmachevo Airport",                        city: "Novosibirsk",         country: "Russia" },
  { code: "SVX", name: "Koltsovo International",                    city: "Yekaterinburg",       country: "Russia" },
  { code: "KZN", name: "Kazan International",                       city: "Kazan",               country: "Russia" },
  { code: "ROV", name: "Platov International",                      city: "Rostov-on-Don",       country: "Russia" },
  { code: "AER", name: "Sochi International",                       city: "Sochi",               country: "Russia" },
  { code: "KRR", name: "Krasnodar Pashkovsky International",        city: "Krasnodar",           country: "Russia" },
  { code: "UFA", name: "Ufa International",                         city: "Ufa",                 country: "Russia" },
  { code: "VVO", name: "Vladivostok International",                 city: "Vladivostok",         country: "Russia" },
  { code: "IKT", name: "Irkutsk International",                     city: "Irkutsk",             country: "Russia" },
  { code: "KHV", name: "Khabarovsk Novy Airport",                   city: "Khabarovsk",          country: "Russia" },
  { code: "CEK", name: "Chelyabinsk Balandino Airport",             city: "Chelyabinsk",         country: "Russia" },
  { code: "GOJ", name: "Nizhny Novgorod International",             city: "Nizhny Novgorod",     country: "Russia" },
  { code: "SAM", name: "Kurumoch International",                    city: "Samara",              country: "Russia" },
  { code: "PEE", name: "Perm Airport",                              city: "Perm",                country: "Russia" },
  { code: "VOZ", name: "Voronezh International",                    city: "Voronezh",            country: "Russia" },
  { code: "VOG", name: "Volgograd International",                   city: "Volgograd",           country: "Russia" },
  { code: "TJM", name: "Roshchino International",                   city: "Tyumen",              country: "Russia" },
  { code: "OMS", name: "Tsentralny Airport",                        city: "Omsk",                country: "Russia" },
  { code: "KRO", name: "Kurgan Airport",                            city: "Kurgan",              country: "Russia" },
  { code: "MMK", name: "Murmansk Airport",                          city: "Murmansk",            country: "Russia" },
  { code: "ARH", name: "Talagi Airport",                            city: "Arkhangelsk",         country: "Russia" },
  { code: "ULY", name: "Ulyanovsk Baratayevka Airport",             city: "Ulyanovsk",           country: "Russia" },
  { code: "GDX", name: "Sokol Airport",                             city: "Magadan",             country: "Russia" },
  { code: "PKC", name: "Yelizovo Airport",                          city: "Petropavlovsk-Kamchatsky", country: "Russia" },
  { code: "BTK", name: "Bratsk Airport",                            city: "Bratsk",              country: "Russia" },
  { code: "YKS", name: "Yakutsk Airport",                           city: "Yakutsk",             country: "Russia" },
  { code: "UUS", name: "Yuzhno-Sakhalinsk Airport",                 city: "Yuzhno-Sakhalinsk",   country: "Russia" },
  { code: "HTA", name: "Kadala Airport",                            city: "Chita",               country: "Russia" },
  { code: "KGD", name: "Khrabrovo Airport",                         city: "Kaliningrad",         country: "Russia" },
  { code: "ASF", name: "Astrakhan Airport",                         city: "Astrakhan",           country: "Russia" },
  { code: "MRV", name: "Mineralnyye Vody Airport",                  city: "Mineralnye Vody",     country: "Russia" },
  { code: "STW", name: "Stavropol Shpakovskoye Airport",            city: "Stavropol",           country: "Russia" },
  { code: "NAL", name: "Nalchik Airport",                           city: "Nalchik",             country: "Russia" },
  { code: "MCX", name: "Uytash Airport",                            city: "Makhachkala",         country: "Russia" },
  { code: "GRV", name: "Grozny Airport",                            city: "Grozny",              country: "Russia" },
  { code: "IGT", name: "Sunzhenskiy Airport",                       city: "Ingushetia",          country: "Russia" },
  // ── Americas ──
  { code: "JFK", name: "John F. Kennedy International",             city: "New York",            country: "USA" },
  { code: "EWR", name: "Newark Liberty International",              city: "New York",            country: "USA" },
  { code: "LAX", name: "Los Angeles International",                 city: "Los Angeles",         country: "USA" },
  { code: "ORD", name: "O'Hare International",                      city: "Chicago",             country: "USA" },
  { code: "MIA", name: "Miami International",                       city: "Miami",               country: "USA" },
  { code: "SFO", name: "San Francisco International",               city: "San Francisco",       country: "USA" },
  { code: "ATL", name: "Hartsfield–Jackson Atlanta International",  city: "Atlanta",             country: "USA" },
  { code: "DFW", name: "Dallas/Fort Worth International",           city: "Dallas",              country: "USA" },
  { code: "YYZ", name: "Toronto Pearson International",             city: "Toronto",             country: "Canada" },
  { code: "YVR", name: "Vancouver International",                   city: "Vancouver",           country: "Canada" },
  { code: "GRU", name: "São Paulo/Guarulhos International",         city: "São Paulo",           country: "Brazil" },
  { code: "GIG", name: "Rio de Janeiro/Galeão International",       city: "Rio de Janeiro",      country: "Brazil" },
  { code: "MEX", name: "Mexico City International",                 city: "Mexico City",         country: "Mexico" },
  { code: "BOG", name: "El Dorado International",                   city: "Bogotá",              country: "Colombia" },
  // ── Asia Pacific ──
  { code: "NRT", name: "Narita International",                      city: "Tokyo",               country: "Japan" },
  { code: "HND", name: "Haneda Airport",                            city: "Tokyo",               country: "Japan" },
  { code: "KIX", name: "Kansai International",                      city: "Osaka",               country: "Japan" },
  { code: "ICN", name: "Incheon International",                     city: "Seoul",               country: "South Korea" },
  { code: "GMP", name: "Gimpo International",                       city: "Seoul",               country: "South Korea" },
  { code: "PEK", name: "Beijing Capital International",             city: "Beijing",             country: "China" },
  { code: "PKX", name: "Beijing Daxing International",              city: "Beijing",             country: "China" },
  { code: "PVG", name: "Shanghai Pudong International",             city: "Shanghai",            country: "China" },
  { code: "SHA", name: "Shanghai Hongqiao International",           city: "Shanghai",            country: "China" },
  { code: "CAN", name: "Guangzhou Baiyun International",            city: "Guangzhou",           country: "China" },
  { code: "CTU", name: "Chengdu Shuangliu International",           city: "Chengdu",             country: "China" },
  { code: "HKG", name: "Hong Kong International",                   city: "Hong Kong",           country: "Hong Kong" },
  { code: "TPE", name: "Taiwan Taoyuan International",              city: "Taipei",              country: "Taiwan" },
  { code: "SYD", name: "Sydney Kingsford Smith International",      city: "Sydney",              country: "Australia" },
  { code: "MEL", name: "Melbourne Airport",                         city: "Melbourne",           country: "Australia" },
  { code: "BNE", name: "Brisbane Airport",                          city: "Brisbane",            country: "Australia" },
  { code: "PER", name: "Perth Airport",                             city: "Perth",               country: "Australia" },
  { code: "AKL", name: "Auckland Airport",                          city: "Auckland",            country: "New Zealand" },
];

const WEB3FORMS_KEY = "c8845256-7de7-475d-a9ec-4f5a046fec6d";

interface EnquiryModalProps { open: boolean; onClose: () => void; }
interface AirportOption { code: string; name: string; city: string; country: string; }

/* ─── AirportCombobox ─────────────────────────────────────────── */
function AirportCombobox({
  label, icon: Icon, value, onChange, placeholder, excludeCode, error,
}: {
  label: string; icon: React.ElementType;
  value: AirportOption | null; onChange: (a: AirportOption | null) => void;
  placeholder: string; excludeCode?: string; error?: string;
}) {
  const [query, setQuery]   = useState("");
  const [open,  setOpen]    = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = AIRPORTS.filter(
    (a) => a.code !== excludeCode &&
      (query.length === 0 ||
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.country.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 25);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCustomMode(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayVal = customMode
    ? (value?.name ?? "")
    : value ? `${value.city} (${value.code})` : "";

  const handleCustomSave = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onChange({ code: "CUSTOM", name: trimmed, city: trimmed, country: "Custom" });
    setCustomMode(false);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="ap-wrap" ref={ref}>
      <label className="em-label">{label}</label>
      <div style={{ position: "relative" }}>
        {/* Dropdown list — renders above */}
        {open && (
          <div className="ap-dropdown">
            {/* Custom entry option */}
            {query.trim().length > 0 && (
              <button
                type="button"
                className="ap-item ap-item--custom"
                onClick={handleCustomSave}
              >
                <MapPin size={13} color="#0127FC" style={{ flexShrink: 0 }} />
                <span>
                  Use &ldquo;<strong>{query.trim()}</strong>&rdquo; as airport name
                </span>
              </button>
            )}
            {filtered.length === 0 && query.trim().length === 0 && (
              <div className="ap-empty">Start typing to search airports…</div>
            )}
            {filtered.length === 0 && query.trim().length > 0 && (
              <div className="ap-empty">No matching airports — use the option above to enter manually.</div>
            )}
            {filtered.map((a) => (
              <button
                key={a.code}
                type="button"
                className="ap-item"
                onClick={() => { onChange(a); setQuery(""); setOpen(false); setCustomMode(false); }}
              >
                <span className="ap-item__code">{a.code}</span>
                <span className="ap-item__city">
                  {a.city}
                  <span className="ap-item__name"> · {a.name}</span>
                </span>
                <span className="ap-item__country">{a.country}</span>
              </button>
            ))}
          </div>
        )}

        <span className="em-icon-wrap"><Icon size={15} color="#FE8100" /></span>
        <input
          value={open ? query : displayVal}
          placeholder={placeholder}
          onFocus={() => { setQuery(""); setOpen(true); setCustomMode(false); }}
          onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true); }}
          className="em-input"
          style={{
            paddingLeft: 38,
            borderColor: error ? "#ef4444" : open ? "#0127FC" : "#e2e8f0",
            boxShadow: open ? "0 0 0 3px rgba(1,39,252,0.12)" : "none",
          }}
          autoComplete="off"
        />
        <span className="em-chevron">
          <ChevronDown size={14} color="#94a3b8" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </span>
      </div>
      {value?.code === "CUSTOM" && !open && (
        <p className="em-hint">✏️ Custom airport entered — our team will confirm availability.</p>
      )}
      {error && <p className="em-error">{error}</p>}
    </div>
  );
}

/* ─── Counter ─────────────────────────────────────────────────── */
function Counter({
  label, sublabel, icon: Icon, value, onChange, min = 0, max = 20,
}: {
  label: string; sublabel?: string; icon: React.ElementType;
  value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="cnt-row">
      <div className="cnt-row__left">
        <Icon size={16} color="#FE8100" />
        <div>
          <div className="cnt-row__label">{label}</div>
          {sublabel && <div className="cnt-row__sub">{sublabel}</div>}
        </div>
      </div>
      <div className="cnt-row__ctrl">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="cnt-btn" data-disabled={value <= min}>−</button>
        <span className="cnt-val">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="cnt-btn" data-disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

/* ─── Main Modal ─────────────────────────────────────────────── */
export default function EnquiryModal({ open, onClose }: EnquiryModalProps) {
  const [step, setStep]             = useState<1 | 2>(1);
  const [from, setFrom]             = useState<AirportOption | null>(null);
  const [to, setTo]                 = useState<AirportOption | null>(null);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType]     = useState<"one-way" | "round-trip">("round-trip");
  const [adults, setAdults]         = useState(1);
  const [children, setChildren]     = useState(0);
  const [infants, setInfants]       = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [message, setMessage]       = useState("");
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [sending, setSending]       = useState(false);
  const [done, setDone]             = useState(false);
  const [apiError, setApiError]     = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const today      = new Date().toISOString().split("T")[0];
  const totalTravellers = adults + children + infants;

  useEffect(() => {
    if (open) {
      setStep(1); setFrom(null); setTo(null);
      setDepartDate(""); setReturnDate(""); setTripType("round-trip");
      setAdults(1); setChildren(0); setInfants(0); setTravelClass("Economy");
      setName(""); setEmail(""); setPhone(""); setMessage("");
      setErrors({}); setSending(false); setDone(false); setApiError("");
    }
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validateStep1 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!from) e.from = "Please select departure airport";
    if (!to) e.to = "Please select arrival airport";
    if (!departDate) e.departDate = "Please select departure date";
    if (tripType === "round-trip" && !returnDate) e.returnDate = "Please select return date";
    if (adults < 1) e.adults = "At least 1 adult required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [from, to, departDate, returnDate, tripType, adults]);

  const validateStep2 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!phone.trim() || !/^[+\d\s\-()]{7,}$/.test(phone)) e.phone = "Valid phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, email, phone]);

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setSending(true); setApiError("");
    const body = {
      access_key: WEB3FORMS_KEY,
      subject: `Flight Enquiry: ${from?.city} → ${to?.city}`,
      name, email, phone,
      from_airport: `${from?.city} (${from?.code}) – ${from?.name}`,
      to_airport:   `${to?.city} (${to?.code}) – ${to?.name}`,
      trip_type: tripType,
      departure_date: departDate,
      return_date: tripType === "round-trip" ? returnDate : "N/A",
      travel_class: travelClass,
      adults, children, infants,
      total_travellers: totalTravellers,
      message: message || "—",
    };
    try {
      const res  = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else setApiError(data.message || "Submission failed. Please try again.");
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  /* ── Success ── */
  if (done) {
    return (
      <div ref={overlayRef} className="em-overlay" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
        <div className="em-panel em-panel--success">
          <div className="em-success-icon">
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h2 className="em-success-title">Enquiry Sent!</h2>
          <p className="em-success-body">
            Thank you, <strong style={{ color: "#FE8100" }}>{name}</strong>. Our team will get back to you shortly with the best options for your journey.
          </p>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%" }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={overlayRef} className="em-overlay" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="em-panel">

        {/* Header */}
        <div className="em-header">
          <div>
            <h2 className="em-header__title"><PlaneTakeoff size={18} /> Send Your Enquiry</h2>
            <p className="em-header__sub">Step {step} of 2 — {step === 1 ? "Flight Details" : "Your Information"}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="em-close"><X size={18} /></button>
        </div>

        {/* Step bar */}
        <div className="em-steps">
          {[1, 2].map((s) => (
            <div key={s} className="em-step" style={{ background: s <= step ? "linear-gradient(90deg,#FE8100,#FF9A2E)" : "#e2e8f0" }} />
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="em-body">

            {/* ══ STEP 1 ══ */}
            {step === 1 && (
              <>
                {/* Trip type */}
                <div className="em-trip-btns">
                  {(["round-trip", "one-way"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripType(t)}
                      className="em-trip-btn"
                      style={{
                        borderColor: tripType === t ? "#0127FC" : "#e2e8f0",
                        background:  tripType === t ? "#0127FC" : "#fff",
                        color:       tripType === t ? "#fff"    : "#64748b",
                      }}
                    >
                      {t === "round-trip" ? "↔ Round Trip" : "→ One Way"}
                    </button>
                  ))}
                </div>

                {/* From / To */}
                <div className="em-row">
                  <AirportCombobox label="From" icon={PlaneTakeoff} value={from} onChange={setFrom} placeholder="Departure city or airport" excludeCode={to?.code} error={errors.from} />
                  <AirportCombobox label="To"   icon={PlaneLanding} value={to}   onChange={setTo}   placeholder="Arrival city or airport"   excludeCode={from?.code} error={errors.to} />
                </div>

                {/* Dates */}
                <div className="em-row">
                  <div className="em-field">
                    <label className="em-label">Departure Date</label>
                    <div style={{ position: "relative" }}>
                      <span className="em-icon-wrap"><Calendar size={15} color="#FE8100" /></span>
                      <input type="date" min={today} value={departDate} onChange={(e) => setDepartDate(e.target.value)}
                        className="em-input" style={{ paddingLeft: 38, borderColor: errors.departDate ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.departDate && <p className="em-error">{errors.departDate}</p>}
                  </div>
                  {tripType === "round-trip" && (
                    <div className="em-field">
                      <label className="em-label">Return Date</label>
                      <div style={{ position: "relative" }}>
                        <span className="em-icon-wrap"><Calendar size={15} color="#FE8100" /></span>
                        <input type="date" min={departDate || today} value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                          className="em-input" style={{ paddingLeft: 38, borderColor: errors.returnDate ? "#ef4444" : "#e2e8f0" }} />
                      </div>
                      {errors.returnDate && <p className="em-error">{errors.returnDate}</p>}
                    </div>
                  )}
                </div>

                {/* Class */}
                <div className="em-field">
                  <label className="em-label">Travel Class</label>
                  <div style={{ position: "relative" }}>
                    <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}
                      className="em-input" style={{ paddingLeft: 14, appearance: "none" }}>
                      {["Economy", "Premium Economy", "Business", "First Class"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="em-chevron"><ChevronDown size={14} color="#94a3b8" /></span>
                  </div>
                </div>

                {/* Travellers */}
                <div className="em-field">
                  <label className="em-label em-label--row">
                    <Users size={14} color="#FE8100" /> Travellers
                    <span className="em-label__count">{totalTravellers} total</span>
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Counter label="Adults"   sublabel="12+ years"      icon={UserCheck} value={adults}   onChange={setAdults}   min={1} max={9} />
                    <Counter label="Children" sublabel="2–11 years"     icon={User}      value={children} onChange={setChildren} min={0} max={9} />
                    <Counter label="Infants"  sublabel="Under 2 years"  icon={Baby}      value={infants}  onChange={setInfants}  min={0} max={adults} />
                  </div>
                  {errors.adults && <p className="em-error">{errors.adults}</p>}
                </div>

                <button type="button" onClick={handleNext} className="btn-primary em-submit-btn">
                  Next: Your Details →
                </button>
              </>
            )}

            {/* ══ STEP 2 ══ */}
            {step === 2 && (
              <>
                {/* Summary */}
                <div className="em-summary">
                  <span className="em-summary__item"><Plane size={13} color="#0127FC" /> <strong style={{ color: "#0127FC" }}>{from?.city} ({from?.code})</strong> → <strong style={{ color: "#0127FC" }}>{to?.city} ({to?.code})</strong></span>
                  <span className="em-summary__item"><Calendar size={13} color="#475569" /> {departDate}{tripType === "round-trip" ? ` – ${returnDate}` : ""}</span>
                  <span className="em-summary__item"><Users size={13} color="#475569" /> {totalTravellers} traveller{totalTravellers !== 1 ? "s" : ""} · {travelClass}</span>
                </div>

                {/* Name */}
                <div className="em-field">
                  <label className="em-label">Full Name *</label>
                  <div style={{ position: "relative" }}>
                    <span className="em-icon-wrap"><User size={15} color="#FE8100" /></span>
                    <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)}
                      className="em-input" style={{ paddingLeft: 38, borderColor: errors.name ? "#ef4444" : "#e2e8f0" }} />
                  </div>
                  {errors.name && <p className="em-error">{errors.name}</p>}
                </div>

                {/* Email + Phone */}
                <div className="em-row">
                  <div className="em-field">
                    <label className="em-label">Email *</label>
                    <div style={{ position: "relative" }}>
                      <span className="em-icon-wrap"><Mail size={15} color="#FE8100" /></span>
                      <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="em-input" style={{ paddingLeft: 38, borderColor: errors.email ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.email && <p className="em-error">{errors.email}</p>}
                  </div>
                  <div className="em-field">
                    <label className="em-label">Phone *</label>
                    <div style={{ position: "relative" }}>
                      <span className="em-icon-wrap"><Phone size={15} color="#FE8100" /></span>
                      <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="em-input" style={{ paddingLeft: 38, borderColor: errors.phone ? "#ef4444" : "#e2e8f0" }} />
                    </div>
                    {errors.phone && <p className="em-error">{errors.phone}</p>}
                  </div>
                </div>

                {/* Message */}
                <div className="em-field">
                  <label className="em-label">Additional Notes (optional)</label>
                  <textarea placeholder="Any special requests, preferred airlines, meal preferences…" value={message}
                    onChange={(e) => setMessage(e.target.value)} rows={3}
                    className="em-input" style={{ paddingLeft: 14, paddingTop: 10, resize: "vertical", minHeight: 80 }} />
                </div>

                {apiError && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: 0 }}>{apiError}</p>}

                <div className="em-actions">
                  <button type="button" onClick={() => setStep(1)} className="em-back-btn">← Back</button>
                  <button type="submit" disabled={sending} className={`em-submit-btn ${sending ? "em-submit-btn--sending" : "btn-primary"}`} style={{ flex: 1 }}>
                    {sending
                      ? <span className="em-sending"><Loader2 size={16} className="em-spin" /> Sending…</span>
                      : <span className="em-sending"><Send size={15} /> Send Enquiry</span>}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>

      <style>{`
        /* ── overlay ── */
        .em-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 12px;
          overflow-y: auto;
        }

        /* ── panel ── */
        .em-panel {
          width: 100%; max-width: 640px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          animation: modalIn 0.28s ease both;
          max-height: 92dvh;
          overflow-y: auto;
        }
        .em-panel--success {
          max-width: 420px;
          text-align: center;
          padding: 48px 32px;
        }
        .em-success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg,#d1fae5,#a7f3d0);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .em-success-title { font-family:'Poppins',sans-serif; font-weight:800; font-size:22px; color:#0f172a; margin-bottom:10px; }
        .em-success-body  { color:#64748b; font-size:14px; line-height:1.75; margin-bottom:24px; }

        /* ── header ── */
        .em-header {
          background: linear-gradient(135deg,#0127FC 0%,#001060 100%);
          border-radius: 20px 20px 0 0;
          padding: 20px 24px 18px;
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .em-header__title {
          font-family:'Poppins',sans-serif; font-weight:800; font-size:18px;
          color:#fff; margin:0; display:flex; align-items:center; gap:8px;
        }
        .em-header__sub { color:rgba(255,255,255,0.6); font-size:12px; margin:5px 0 0; }
        .em-close {
          background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2);
          border-radius:8px; color:#fff; cursor:pointer; padding:6px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
          transition:background 0.2s;
        }
        .em-close:hover { background:rgba(255,255,255,0.2); }

        /* ── step bar ── */
        .em-steps { display:flex; gap:6px; padding:14px 24px 0; }
        .em-step  { flex:1; height:4px; border-radius:9999px; transition:background 0.3s; }

        /* ── body ── */
        .em-body {
          padding: 18px 24px 24px;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* trip type buttons */
        .em-trip-btns { display:flex; gap:8px; }
        .em-trip-btn {
          flex:1; padding:9px 0; border-radius:9999px;
          border:2px solid; font-weight:700; font-size:13px; cursor:pointer;
          transition:all 0.2s; font-family:'Poppins',sans-serif;
        }

        /* two-col rows */
        .em-row { display:flex; gap:12px; }
        .em-field { flex:1; min-width:0; }

        /* label */
        .em-label {
          display:block; font-size:12px; font-weight:700; color:#475569;
          margin-bottom:6px; letter-spacing:0.04em; text-transform:uppercase;
        }
        .em-label--row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .em-label__count { margin-left:auto; color:#FE8100; font-weight:700; }

        /* input */
        .em-input {
          width:100%; padding:11px 36px 11px 14px;
          background:#fff; border:1.5px solid #e2e8f0; border-radius:10px;
          color:#0f172a; font-size:14px; outline:none; box-sizing:border-box;
          transition:border-color 0.2s, box-shadow 0.2s; font-family:inherit;
        }
        .em-input:focus { border-color:#0127FC; box-shadow:0 0 0 3px rgba(1,39,252,0.1); }

        /* icon + chevron */
        .em-icon-wrap {
          position:absolute; left:12px; top:50%; transform:translateY(-50%);
          pointer-events:none; display:flex; align-items:center; z-index:1;
        }
        .em-chevron {
          position:absolute; right:10px; top:50%; transform:translateY(-50%);
          pointer-events:none;
        }

        /* errors / hints */
        .em-error { color:#ef4444; font-size:11px; margin:4px 0 0; }
        .em-hint  { color:#0127FC; font-size:11px; margin:4px 0 0; }

        /* ── airport dropdown ── */
        .ap-wrap { flex:1; min-width:0; }
        .ap-dropdown {
          position:absolute; bottom:calc(100% + 4px); left:0; right:0; z-index:200;
          background:#fff; border:1.5px solid #e2e8f0; border-radius:12px;
          max-height:220px; overflow-y:auto;
          box-shadow:0 -8px 32px rgba(0,0,0,0.12);
        }
        .ap-item {
          width:100%; display:flex; align-items:center; padding:9px 13px;
          background:transparent; border:none; border-bottom:1px solid #f1f5f9;
          cursor:pointer; text-align:left; transition:background 0.12s; gap:6px;
        }
        .ap-item:hover { background:#fff5eb; }
        .ap-item--custom {
          color:#0127FC; font-size:13px; font-weight:600;
          border-bottom:1.5px solid #e2e8f0; background:#f0f4ff;
          gap:8px;
        }
        .ap-item--custom:hover { background:#e0eaff; }
        .ap-item__code  { font-weight:700; color:#FE8100; font-size:13px; flex-shrink:0; min-width:38px; }
        .ap-item__city  { color:#0f172a; font-size:13px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
        .ap-item__name  { color:#94a3b8; font-size:12px; }
        .ap-item__country { font-size:11px; color:#94a3b8; flex-shrink:0; padding-left:6px; }
        .ap-empty { padding:14px 16px; color:#94a3b8; font-size:13px; text-align:center; }

        /* ── counter row ── */
        .cnt-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 14px; background:#f8fafc; border-radius:10px;
          border:1px solid #e2e8f0;
        }
        .cnt-row__left { display:flex; align-items:center; gap:10px; }
        .cnt-row__label { font-size:13px; color:#0f172a; font-weight:600; }
        .cnt-row__sub   { font-size:11px; color:#94a3b8; }
        .cnt-row__ctrl  { display:flex; align-items:center; gap:10px; }
        .cnt-val { min-width:20px; text-align:center; color:#0f172a; font-weight:700; font-size:15px; }
        .cnt-btn {
          width:28px; height:28px; border-radius:6px; border:1.5px solid;
          font-size:16px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center; transition:all 0.15s;
        }
        .cnt-btn[data-disabled="false"] { border-color:#FE8100; background:#fff5eb; color:#FE8100; }
        .cnt-btn[data-disabled="true"]  { border-color:#e2e8f0; background:#f8fafc; color:#cbd5e1; cursor:not-allowed; }

        /* ── summary strip ── */
        .em-summary {
          background:linear-gradient(135deg,rgba(1,39,252,0.06),rgba(1,39,252,0.03));
          border:1px solid rgba(1,39,252,0.15); border-radius:12px;
          padding:12px 16px; display:flex; flex-wrap:wrap; gap:8px 16px;
        }
        .em-summary__item { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#334155; }

        /* ── actions ── */
        .em-actions { display:flex; gap:10px; }
        .em-back-btn {
          flex:0 0 auto; padding:12px 18px; border-radius:10px;
          border:2px solid #e2e8f0; background:#fff; color:#64748b;
          font-weight:700; font-size:14px; cursor:pointer; font-family:inherit;
          transition:border-color 0.2s, color 0.2s;
        }
        .em-back-btn:hover { border-color:#0127FC; color:#0127FC; }
        .em-submit-btn { width:100%; border-radius:10px; padding:12px; font-weight:700; font-size:15px; }
        .em-submit-btn--sending {
          background:linear-gradient(135deg,#FE8100,#FF9A2E); border:none;
          color:#fff; font-family:inherit; cursor:not-allowed; opacity:0.65;
        }
        .em-sending { display:flex; align-items:center; justify-content:center; gap:8px; }
        .em-spin { animation:spin 1s linear infinite; }

        /* ── keyframes ── */
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes modalIn  {
          from { opacity:0; transform:translateY(20px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        /* ── MOBILE ── */
        @media (max-width: 600px) {
          .em-overlay { padding: 0; align-items: flex-end; }
          .em-panel {
            border-radius: 20px 20px 0 0;
            max-height: 96dvh;
            max-width: 100%;
          }
          .em-header { padding: 18px 18px 16px; }
          .em-header__title { font-size: 16px; }
          .em-steps { padding: 12px 18px 0; }
          .em-body { padding: 16px 18px 20px; gap: 14px; }
          .em-row { flex-direction: column; gap: 14px; }
          .em-trip-btns { gap: 6px; }
          .em-trip-btn { font-size: 12px; padding: 8px 0; }
          .ap-dropdown { max-height: 180px; }
          .em-actions { flex-direction: column; }
          .em-back-btn { width: 100%; text-align: center; }
          .em-summary { font-size: 12px; }
        }
        @media (max-width: 380px) {
          .em-header__title { font-size: 15px; }
          .cnt-row { padding: 9px 10px; }
        }
      `}</style>
    </div>
  );
}
