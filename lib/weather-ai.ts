/**
 * Server-side WeatherAI client.
 *
 * Talks to https://api.weather-ai.co/v1/current (current conditions) and maps
 * the response into the app's `Weather` model used by the Construction
 * Intelligence Engine. The official docs do not publish an exact response
 * schema for /v1/current, so mapping is defensive: it searches the top-level
 * object and common nested containers (`current`, `data`) for a set of
 * candidate field names. Adjust `FIELDS` if a real sample response differs.
 *
 * Requires `WEATHERAI_API_KEY` in the environment (key format: wai_…).
 */

import type { Weather } from "@/lib/engine";

import { getEnv } from "@/lib/env";

const BASE_URL = "https://api.weather-ai.co";
const API_VERSION = "v1";

const env = getEnv();

/**
 * Candidate field names per metric, in priority order. Metric units assumed
 * (request uses units=metric): wind km/h, humidity %, rain mm/h, temp °C,
 * uv index, visibility km.
 *
 * The WeatherAI free `current` payload follows the Open-Meteo shape and only
 * carries `temperature` + `windspeed` (+ `weathercode`); `precipitation` lives
 * on the `hourly`/`daily` arrays, and humidity/uv/visibility are not provided
 * on the free plan. Missing metrics fall back to the SAFE values in DEFAULTS.
 */
const FIELDS: Record<keyof Weather, string[]> = {
  wind: ["windspeed", "wind_kph", "wind_speed", "windSpeed", "wind", "wind_kmh"],
  humidity: ["humidity", "humidity_pct", "relative_humidity"],
  rain: ["precipitation", "precip_mm", "precip", "rain_mm", "rain"],
  temp: ["temperature", "temp_c", "temp", "temp_celsius", "feelslike_c"],
  uv: ["uv", "uv_index", "uvIndex"],
  visibility: ["vis_km", "visibility_km", "vis", "visibility"],
};

// Clamp to the bounds the engine expects so a bad sample can't skew risk.
const BOUNDS: Record<keyof Weather, [number, number]> = {
  wind: [0, 60],
  humidity: [0, 100],
  rain: [0, 64],
  temp: [-10, 40],
  uv: [0, 12],
  visibility: [0, 20],
};

// Safe fallbacks for metrics the free payload does not return. Critically,
// visibility defaults HIGH (not 0) so a missing value never falsely triggers
// a Heavy Equipment stand-down.
const DEFAULTS: Weather = {
  wind: 0,
  humidity: 50,
  rain: 0,
  temp: 15,
  uv: 0,
  visibility: 10,
};

class WeatherAIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "WeatherAIError";
    this.status = status;
  }
}

function searchContainers(root: any): any[] {
  if (!root || typeof root !== "object") return [];
  return [
    root,
    root.current,
    root.data,
    root.data?.current,
    // Free payload keeps precipitation on these arrays (first element ≈ now).
    Array.isArray(root.hourly) ? root.hourly[0] : undefined,
    Array.isArray(root.daily) ? root.daily[0] : undefined,
  ].filter((c) => c && typeof c === "object");
}

function pick(root: any, names: string[]): number | undefined {
  for (const container of searchContainers(root)) {
    for (const name of names) {
      const v = container[name];
      if (typeof v === "number" && !Number.isNaN(v)) return v;
      if (typeof v === "string" && !Number.isNaN(parseFloat(v))) return parseFloat(v);
    }
  }
  return undefined;
}

function round(value: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

function clamp(value: number, [lo, hi]: [number, number]) {
  return Math.max(lo, Math.min(hi, value));
}

export type FetchWeatherOptions = {
  units?: "metric" | "imperial";
  ai?: boolean;
  signal?: AbortSignal;
};

export async function fetchWeather(
  lat: number,
  lon: number,
  opts: FetchWeatherOptions = {}
): Promise<Weather> {
  const key = env.WEATHERAI_API_KEY;
  if (!key) {
    throw new WeatherAIError(
      "WEATHERAI_API_KEY is not configured on the server. Add it to your environment to enable live weather.",
      500
    );
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units: opts.units ?? "metric",
    ai: String(opts.ai ?? false),
  });

  const url = `${BASE_URL}/${API_VERSION}/current?${params.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
      signal: opts.signal ? AbortSignal.any([opts.signal, controller.signal]) : controller.signal,
      cache: "no-store",
    });
  } catch (e) {
    clearTimeout(timeoutId);
    const message = e instanceof Error ? e.message : "Weather fetch failed";
    throw new WeatherAIError(
      message.includes("aborted") ? "WeatherAI request timed out (10s)." : message,
      e instanceof DOMException && e.name === "AbortError" ? 504 : 502
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const status = res.status;
    let message = `WeatherAI responded with ${status}`;
    if (status === 401) message = "WeatherAI unauthorized — check WEATHERAI_API_KEY.";
    else if (status === 403) message = "WeatherAI forbidden — plan does not allow this endpoint.";
    else if (status === 429) message = "WeatherAI quota exceeded for this month.";
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new WeatherAIError(message, status);
  }

  const json = await res.json();
  return mapWeather(json);
}

export function mapWeather(json: any): Weather {
  const out = {} as Weather;
  (Object.keys(FIELDS) as (keyof Weather)[]).forEach((metric) => {
    const raw = pick(json, FIELDS[metric]);
    if (raw === undefined) {
      // Fall back to a safe default so the engine still produces output and
      // never falsely flags a missing metric as a hazard.
      out[metric] = DEFAULTS[metric];
      return;
    }
    const decimals = metric === "humidity" || metric === "wind" ? 0 : 1;
    out[metric] = clamp(round(raw, decimals), BOUNDS[metric]);
  });
  return out;
}

export { WeatherAIError };
