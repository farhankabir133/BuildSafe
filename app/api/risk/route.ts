import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather-ai";
import { snapshot, type Weather } from "@/lib/engine";

export const dynamic = "force-dynamic";

/**
 * GET /api/risk?lat=..&lon=..        -> live weather from WeatherAI + engine
 * POST /api/risk  { weather }        -> run engine on supplied conditions
 * POST /api/risk  { lat, lon }       -> live weather + engine
 *
 * Returns the full engine Snapshot (weather, triggered rules, risk score,
 * recommendations) computed by the shared, backend-safe engine core.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon || Number.isNaN(parseFloat(lat)) || Number.isNaN(parseFloat(lon))) {
    return NextResponse.json(
      { error: "Missing or invalid required query parameters: lat, lon (numbers)." },
      { status: 400 }
    );
  }

  try {
    const weather = await fetchWeather(parseFloat(lat), parseFloat(lon));
    return NextResponse.json({
      snapshot: snapshot(weather, Date.now()),
      source: "weather-ai",
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Risk computation failed" },
      { status }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: { weather?: Weather; lat?: number; lon?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let weather: Weather;
  try {
    if (body.weather) {
      weather = body.weather;
    } else if (typeof body.lat === "number" && typeof body.lon === "number") {
      weather = await fetchWeather(body.lat, body.lon);
    } else {
      return NextResponse.json(
        { error: "Provide either `weather` or `lat` and `lon` in the request body." },
        { status: 400 }
      );
    }
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Weather fetch failed" },
      { status }
    );
  }

  return NextResponse.json({
    snapshot: snapshot(weather, Date.now()),
    source: body.weather ? "provided" : "weather-ai",
  });
}
