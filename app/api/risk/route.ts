import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather-ai";
import { snapshot, type Weather } from "@/lib/engine";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { validateEnv } from "@/lib/env";
import { logger, generateRequestId } from "@/lib/logger";
import { WeatherQuerySchema, RiskBodySchema } from "@/lib/validation";

validateEnv();

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
  const requestId = generateRequestId();
  const start = Date.now();
  const ip = getClientIp(req);
  const limit = rateLimit(ip, 100, 60_000);

  if (!limit.allowed) {
    const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
    logger.warn("Rate limit exceeded", { requestId, ip, path: req.url });
    return NextResponse.json(
      { error: `Rate limit exceeded. Retry after ${retryAfter}s.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter), "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(limit.resetAt), "X-Request-ID": requestId },
      }
    );
  }

  const parseResult = WeatherQuerySchema.safeParse({
    lat: new URL(req.url).searchParams.get("lat"),
    lon: new URL(req.url).searchParams.get("lon"),
  });

  if (!parseResult.success) {
    logger.warn("Invalid risk query", { requestId, ip, path: req.url, errors: parseResult.error.flatten().fieldErrors });
    return NextResponse.json(
      { error: "Invalid query parameters.", details: parseResult.error.flatten().fieldErrors },
      { status: 400, headers: { "X-Request-ID": requestId } }
    );
  }

  const { lat, lon } = parseResult.data;

  try {
    const weather = await fetchWeather(lat, lon);
    const duration = Date.now() - start;
    logger.info("Risk computed", { requestId, ip, path: req.url, status: 200, duration, source: "weather-ai" });
    return NextResponse.json(
      {
        snapshot: snapshot(weather, Date.now()),
        source: "weather-ai",
        lat,
        lon,
      },
      {
        headers: {
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(limit.resetAt),
          "X-Request-ID": requestId,
        },
      }
    );
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502;
    const duration = Date.now() - start;
    logger.error("Risk computation failed", { requestId, ip, path: req.url, status, duration, error: e instanceof Error ? e.message : "unknown" });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Risk computation failed" },
      { status, headers: { "X-Request-ID": requestId } }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const start = Date.now();
  const ip = getClientIp(req);

  let body: { weather?: Weather; lat?: number; lon?: number };
  try {
    body = await req.json();
  } catch {
    logger.warn("Invalid JSON body", { requestId, ip, path: req.url });
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400, headers: { "X-Request-ID": requestId } });
  }

  const parseResult = RiskBodySchema.safeParse(body);
  if (!parseResult.success) {
    logger.warn("Invalid risk body", { requestId, ip, path: req.url, errors: parseResult.error.flatten().fieldErrors });
    return NextResponse.json(
      { error: "Invalid request body.", details: parseResult.error.flatten().fieldErrors },
      { status: 400, headers: { "X-Request-ID": requestId } }
    );
  }

  const { weather, lat, lon } = parseResult.data;

  let finalWeather: Weather;
  try {
    if (weather) {
      finalWeather = weather;
    } else if (typeof lat === "number" && typeof lon === "number") {
      finalWeather = await fetchWeather(lat, lon);
    } else {
      return NextResponse.json(
        { error: "Provide either `weather` or `lat` and `lon` in the request body." },
        { status: 400, headers: { "X-Request-ID": requestId } }
      );
    }
  } catch (e) {
    const status = (e as { status?: number }).status ?? 502;
    const duration = Date.now() - start;
    logger.error("Weather fetch failed", { requestId, ip, path: req.url, status, duration, error: e instanceof Error ? e.message : "unknown" });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Weather fetch failed" },
      { status, headers: { "X-Request-ID": requestId } }
    );
  }

  const duration = Date.now() - start;
  logger.info("Risk computed via POST", { requestId, ip, path: req.url, status: 200, duration, source: weather ? "provided" : "weather-ai" });
  return NextResponse.json(
    {
      snapshot: snapshot(finalWeather, Date.now()),
      source: weather ? "provided" : "weather-ai",
    },
    { headers: { "X-Request-ID": requestId } }
  );
}
