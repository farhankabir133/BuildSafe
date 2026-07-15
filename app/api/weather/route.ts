import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather-ai";

export const dynamic = "force-dynamic";

/**
 * GET /api/weather?lat=..&lon=..&units=metric
 *
 * Proxies the real WeatherAI provider and returns the normalized `Weather`
 * model consumed by the Construction Intelligence Engine.
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
    const weather = await fetchWeather(parseFloat(lat), parseFloat(lon), {
      units: (searchParams.get("units") as "metric" | "imperial") ?? "metric",
      ai: searchParams.get("ai") === "true",
    });
    return NextResponse.json({
      weather,
      source: "weather-ai",
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502;
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Weather fetch failed" },
      { status }
    );
  }
}
