/**
 * Construction Intelligence Engine — pure logic core.
 *
 * This module is intentionally free of React so it can be shared by both the
 * client-side simulation (`SimulationProvider`) and the server-side API routes
 * (`/api/weather`, `/api/risk`). Every function keeps the same signature used
 * across the app.
 */

export type Weather = {
  wind: number; // km/h
  humidity: number; // %
  rain: number; // mm/h
  temp: number; // °C
  uv: number; // index
  visibility: number; // km
};

export type RuleSeverity = "low" | "medium" | "high";

export type Rule = {
  id: string;
  metric: keyof Weather;
  operator: ">" | "<";
  threshold: number;
  action: string;
  activity: string;
  severity: RuleSeverity;
  unit: string;
};

export type RecStatus = "ok" | "warn" | "blocked";

export type Recommendation = {
  id: string;
  label: string;
  status: RecStatus;
  note?: string;
};

export type Snapshot = {
  weather: Weather;
  triggered: Rule[];
  risk: number;
  recommendations: Recommendation[];
  seed: number;
};

export const RULES: Rule[] = [
  {
    id: "crane",
    metric: "wind",
    operator: ">",
    threshold: 35,
    action: "Crane Operation Unsafe",
    activity: "Crane Operation",
    severity: "high",
    unit: "km/h",
  },
  {
    id: "paint",
    metric: "humidity",
    operator: ">",
    threshold: 85,
    action: "Surface Painting Delayed",
    activity: "Painting",
    severity: "medium",
    unit: "%",
  },
  {
    id: "concrete",
    metric: "rain",
    operator: ">",
    threshold: 40,
    action: "Concrete Pouring Blocked",
    activity: "Concrete Pouring",
    severity: "high",
    unit: "mm/h",
  },
  {
    id: "coating",
    metric: "uv",
    operator: ">",
    threshold: 8,
    action: "Exterior Coating Restricted",
    activity: "Coating",
    severity: "low",
    unit: "",
  },
  {
    id: "frost",
    metric: "temp",
    operator: "<",
    threshold: 2,
    action: "Frost Hold — Masonry",
    activity: "Masonry",
    severity: "medium",
    unit: "°C",
  },
  {
    id: "visibility",
    metric: "visibility",
    operator: "<",
    threshold: 1,
    action: "Heavy Equipment Stand-down",
    activity: "Heavy Equipment",
    severity: "high",
    unit: "km",
  },
];

const REC_DEFS: {
  id: string;
  label: string;
  rules: ((w: Weather) => RecStatus)[];
  note?: string;
}[] = [
  {
    id: "excavation",
    label: "Excavation",
    rules: [(w) => (w.rain > 40 || w.wind > 35 ? "blocked" : "ok")],
  },
  {
    id: "masonry",
    label: "Masonry",
    rules: [
      (w) => (w.humidity > 85 || w.temp < 2 ? "warn" : "ok"),
      (w) => (w.rain > 40 ? "blocked" : "ok"),
    ],
  },
  {
    id: "roofing",
    label: "Roofing",
    rules: [
      (w) => (w.wind > 35 ? "warn" : "ok"),
      (w) => (w.rain > 40 ? "blocked" : "ok"),
    ],
    note: "until 1 PM",
  },
  {
    id: "crane",
    label: "Crane Operation",
    rules: [(w) => (w.wind > 35 || w.visibility < 1 ? "blocked" : "ok")],
  },
  {
    id: "concrete",
    label: "Concrete Pouring",
    rules: [
      (w) => (w.rain > 40 || w.temp < 2 ? "blocked" : "ok"),
      (w) => (w.humidity > 85 ? "warn" : "ok"),
    ],
  },
];

const SEVERITY_WEIGHT: Record<RuleSeverity, number> = {
  low: 12,
  medium: 22,
  high: 34,
};

function evaluate(w: Weather): Rule[] {
  return RULES.filter((r) => {
    if (r.operator === ">") return w[r.metric] > r.threshold;
    return w[r.metric] < r.threshold;
  });
}

function computeRisk(triggered: Rule[], w: Weather): number {
  const base = triggered.reduce((s, r) => s + SEVERITY_WEIGHT[r.severity], 0);
  // weather turbulence adds a small baseline
  const turbulence = Math.min(w.wind, 60) * 0.25 + Math.min(w.rain, 60) * 0.4;
  return Math.max(4, Math.min(99, Math.round(base + turbulence * 0.5)));
}

function computeRecommendations(w: Weather): Recommendation[] {
  return REC_DEFS.map((d) => {
    let status: RecStatus = "ok";
    for (const fn of d.rules) {
      const s = fn(w);
      if (s === "blocked") status = "blocked";
      else if (s === "warn" && status !== "blocked") status = "warn";
    }
    return { id: d.id, label: d.label, status, note: d.note };
  });
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function round1(v: number) {
  return Math.round(v * 10) / 10;
}

/**
 * Mean-reverting random walk: weather wanders around the active scenario
 * baseline so the engine stays "on scenario" yet visibly fluctuates every
 * cycle — the system feels alive without drifting off-scenario.
 */
function nextWeather(prev: Weather, base: Weather, drift: number): Weather {
  const rev = 0.1;
  const step = (cur: number, target: number, lo: number, hi: number, mag: number) =>
    clamp(
      Math.round((cur + (target - cur) * rev + (Math.random() - 0.5) * mag * drift) * 10) / 10,
      lo,
      hi
    );
  return {
    wind: step(prev.wind, base.wind, 3, 60, 16),
    humidity: step(prev.humidity, base.humidity, 28, 99, 13),
    rain: step(prev.rain, base.rain, 0, 64, 16),
    temp: step(prev.temp, base.temp, -4, 36, 7),
    uv: step(prev.uv, base.uv, 0, 12, 2.6),
    visibility: step(prev.visibility, base.visibility, 0.3, 14, 3.6),
  };
}

function snapshot(w: Weather, seed: number): Snapshot {
  const triggered = evaluate(w);
  return {
    weather: w,
    triggered,
    risk: computeRisk(triggered, w),
    recommendations: computeRecommendations(w),
    seed,
  };
}

export const INITIAL: Weather = {
  wind: 18,
  humidity: 62,
  rain: 8,
  temp: 14,
  uv: 4,
  visibility: 9,
};

export type Scenario = {
  id: string;
  label: string;
  emoji: string;
  weather: Weather;
  drift: number;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "clear",
    label: "Clear Sky",
    emoji: "☀️",
    drift: 1,
    weather: { wind: 9, humidity: 44, rain: 0, temp: 23, uv: 7, visibility: 13 },
  },
  {
    id: "rain",
    label: "Heavy Rain",
    emoji: "🌧",
    drift: 1,
    weather: { wind: 21, humidity: 91, rain: 36, temp: 14, uv: 2, visibility: 3.5 },
  },
  {
    id: "storm",
    label: "Storm Warning",
    emoji: "⛈",
    drift: 1.1,
    weather: { wind: 53, humidity: 97, rain: 56, temp: 10, uv: 1, visibility: 0.6 },
  },
  {
    id: "heat",
    label: "Extreme Heat",
    emoji: "🔥",
    drift: 1,
    weather: { wind: 7, humidity: 26, rain: 0, temp: 34, uv: 11, visibility: 14 },
  },
  {
    id: "wind",
    label: "High Wind",
    emoji: "💨",
    drift: 1.1,
    weather: { wind: 48, humidity: 54, rain: 6, temp: 16, uv: 4, visibility: 6 },
  },
];

export function riskTier(risk: number): {
  label: string;
  color: string;
  ring: string;
} {
  if (risk < 35) return { label: "Safe", color: "#3DD68C", ring: "rgba(61,214,140,0.5)" };
  if (risk < 70) return { label: "Elevated", color: "#F4B740", ring: "rgba(244,183,64,0.5)" };
  return { label: "Critical", color: "#FF5C5C", ring: "rgba(255,92,92,0.5)" };
}

export { evaluate, computeRisk, computeRecommendations, nextWeather, snapshot, clamp, round1 };
