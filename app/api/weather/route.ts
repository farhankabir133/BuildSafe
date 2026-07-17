import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather-ai";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { validateEnv } from "@/lib/env";
import { logger, generateRequestId } from "@/lib/logger";
import { WeatherQuerySchema } from "@/lib/validation";

validateEnv();

export const dynamic = "force-dynamic";

/**
 * GET /api/weather?lat=..&lon=..&units=metric
 *
 * Proxies the real WeatherAI provider and returns the normalized `Weather`
 * model consumed by the Construction Intelligence Engine.
 */
export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const start = Date.now();
  const ip = getClientIp(req);
  const limit = rateLimit(ip, 50, 60_000);

  if (!limit.allowed) {
    const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
    logger.warn("Rate limit exceeded", { requestId, ip, path: req.url });
    return NextResponse.json(
      { error: `Rate limit exceeded. Retry after ${retryAfter}s.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter), "X-RateLimit-Limit": "50", "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(limit.resetAt), "X-Request-ID": requestId },
      }
    );
  }

  const parseResult = WeatherQuerySchema.safeParse({
    lat: new URL(req.url).searchParams.get("lat"),
    lon: new URL(req.url).searchParams.get("lon"),
    units: new URL(req.url).searchParams.get("units"),
    ai: new URL(req.url).searchParams.get("ai"),
  });

  if (!parseResult.success) {
    logger.warn("Invalid weather query", { requestId, ip, path: req.url, errors: parseResult.error.flatten().fieldErrors });
    return NextResponse.json(
      { error: "Invalid query parameters.", details: parseResult.error.flatten().fieldErrors },
      { status: 400, headers: { "X-Request-ID": requestId } }
    );
  }

  const { lat, lon, units, ai } = parseResult.data;

  try {
    const weather = await fetchWeather(lat, lon, {
      units,
      ai,
    });
    const duration = Date.now() - start;
    logger.info("Weather fetched", { requestId, ip, path: req.url, status: 200, duration, source: "weather-ai" });
    return NextResponse.json(
      {
        weather,
        source: "weather-ai",
        lat,
        lon,
      },
      {
        headers: {
          "X-RateLimit-Limit": "50",
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(limit.resetAt),
          "X-Request-ID": requestId,
        },
      }
    );
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502;
    const duration = Date.now() - start;
    logger.error("Weather fetch failed", { requestId, ip, path: req.url, status, duration, error: e instanceof Error ? e.message : "unknown" });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Weather fetch failed" },
      { status, headers: { "X-Request-ID": requestId } }
    );
  }
}
