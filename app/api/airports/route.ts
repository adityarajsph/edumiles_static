import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

/* ── Airport shape ──────────────────────────────────────────── */
export interface AirportRecord {
  iata:    string;
  icao:    string;
  name:    string;
  city:    string;
  country: string;
  type:    "large_airport" | "medium_airport" | "small_airport";
}

/* ── Module-level cache — parsed once per server cold start ── */
let _cache: AirportRecord[] | null = null;

function loadAirports(): AirportRecord[] {
  if (_cache) return _cache;

  const filePath = join(process.cwd(), "public", "airports.csv");
  const raw      = readFileSync(filePath, "utf-8");
  const lines    = raw.split("\n");

  // Parse header to find column indexes
  const header   = parseCsvLine(lines[0]);
  const idx = {
    type:     header.indexOf("type"),
    name:     header.indexOf("name"),
    country:  header.indexOf("iso_country"),
    region:   header.indexOf("iso_region"),
    city:     header.indexOf("municipality"),
    sched:    header.indexOf("scheduled_service"),
    iata:     header.indexOf("iata_code"),
    icao:     header.indexOf("icao_code"),
  };

  const airports: AirportRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols    = parseCsvLine(line);
    const type    = cols[idx.type]  ?? "";
    const iata    = (cols[idx.iata] ?? "").trim();
    const icao    = (cols[idx.icao] ?? "").trim();
    const name    = (cols[idx.name] ?? "").trim();
    const city    = (cols[idx.city] ?? "").trim();
    const country = (cols[idx.country] ?? "").trim();

    // Only keep large + medium airports that have a valid 3-letter IATA code
    if (
      (type === "large_airport" || type === "medium_airport") &&
      /^[A-Z]{3}$/.test(iata) &&
      name &&
      city &&
      country
    ) {
      airports.push({
        iata,
        icao,
        name,
        city,
        country,
        type: type as AirportRecord["type"],
      });
    }
  }

  // Sort: large airports first, then alphabetically by country then city
  airports.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "large_airport" ? -1 : 1;
    }
    const cmp = a.country.localeCompare(b.country);
    if (cmp !== 0) return cmp;
    return a.city.localeCompare(b.city);
  });

  _cache = airports;
  return airports;
}

/** Minimal CSV line parser that handles quoted fields */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      result.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

/* ── GET /api/airports?q=delhi&limit=20 ──────────────────────── */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q     = (searchParams.get("q") ?? "").toLowerCase().trim();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

  const all = loadAirports();

  if (!q) {
    // Return top large airports when no query
    const top = all.filter(a => a.type === "large_airport").slice(0, limit);
    return NextResponse.json(top, {
      headers: { "Cache-Control": "public, max-age=86400" }, // cache 24h
    });
  }

  const scored = all
    .map(a => {
      const iataMatch  = a.iata.toLowerCase() === q                   ? 100 : a.iata.toLowerCase().startsWith(q) ? 90 : 0;
      const cityMatch  = a.city.toLowerCase() === q                   ? 80  : a.city.toLowerCase().startsWith(q) ? 60 : a.city.toLowerCase().includes(q) ? 40 : 0;
      const nameMatch  = a.name.toLowerCase().includes(q)             ? 30  : 0;
      const countryMatch = a.country.toLowerCase().startsWith(q)      ? 20  : 0;
      const typeBonus  = a.type === "large_airport"                   ? 10  : 0;
      const score      = Math.max(iataMatch, cityMatch) + nameMatch + countryMatch + typeBonus;
      return { ...a, score };
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _s, ...a }) => a);   // strip internal score

  return NextResponse.json(scored, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
