"use client";

import type { Snapshot } from "@/lib/engine";

/**
 * Client helper that calls the backend `/api/risk` route, which is backed by
 * the real WeatherAI provider. Returns the full engine Snapshot so the
 * front-end visualization can render live, real-world decisions.
 */
export async function fetchRisk(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<Snapshot> {
  const res = await fetch(`/api/risk?lat=${lat}&lon=${lon}`, { signal });
  if (!res.ok) {
    let message = `Risk request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  const data = await res.json();
  return data.snapshot as Snapshot;
}
