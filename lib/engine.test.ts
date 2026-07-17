import { describe, it, expect } from "vitest";
import {
  evaluate,
  computeRisk,
  computeRecommendations,
  riskTier,
  snapshot,
  nextWeather,
  INITIAL,
  SCENARIOS,
} from "@/lib/engine";

describe("evaluate", () => {
  it("returns no rules for calm weather", () => {
    const weather = { wind: 10, humidity: 50, rain: 5, temp: 20, uv: 3, visibility: 10 };
    const triggered = evaluate(weather);
    expect(triggered).toHaveLength(0);
  });

  it("triggers crane rule when wind exceeds threshold", () => {
    const weather = { wind: 40, humidity: 50, rain: 5, temp: 20, uv: 3, visibility: 10 };
    const triggered = evaluate(weather);
    expect(triggered).toHaveLength(1);
    expect(triggered[0].id).toBe("crane");
  });

  it("triggers multiple rules when multiple thresholds are breached", () => {
    const weather = { wind: 50, humidity: 95, rain: 50, temp: -5, uv: 10, visibility: 0.5 };
    const triggered = evaluate(weather);
    expect(triggered.length).toBeGreaterThan(1);
  });
});

describe("computeRisk", () => {
  it("returns low risk for no triggered rules", () => {
    const risk = computeRisk([], INITIAL);
    expect(risk).toBeGreaterThanOrEqual(4);
    expect(risk).toBeLessThanOrEqual(20);
  });

  it("returns higher risk for high-severity rules", () => {
    const rules = [
      { id: "crane", metric: "wind", operator: ">", threshold: 35, action: "Crane Operation Unsafe", activity: "Crane Operation", severity: "high", unit: "km/h" },
    ];
    const risk = computeRisk(rules, { wind: 50, humidity: 50, rain: 5, temp: 20, uv: 3, visibility: 10 });
    expect(risk).toBeGreaterThanOrEqual(30);
  });

  it("clamps risk between 4 and 99", () => {
    const rules = [
      { id: "crane", metric: "wind", operator: ">", threshold: 35, action: "Crane Operation Unsafe", activity: "Crane Operation", severity: "high", unit: "km/h" },
      { id: "concrete", metric: "rain", operator: ">", threshold: 40, action: "Concrete Pouring Blocked", activity: "Concrete Pouring", severity: "high", unit: "mm/h" },
      { id: "visibility", metric: "visibility", operator: "<", threshold: 1, action: "Heavy Equipment Stand-down", activity: "Heavy Equipment", severity: "high", unit: "km" },
    ];
    const risk = computeRisk(rules, { wind: 60, humidity: 99, rain: 64, temp: 40, uv: 12, visibility: 0 });
    expect(risk).toBeLessThanOrEqual(99);
  });
});

describe("computeRecommendations", () => {
  it("returns all recommendations with ok status for good weather", () => {
    const recs = computeRecommendations(INITIAL);
    expect(recs.length).toBeGreaterThan(0);
    recs.forEach((r) => {
      expect(["ok", "warn", "blocked"]).toContain(r.status);
    });
  });

  it("returns blocked status for crane operation in high wind", () => {
    const weather = { wind: 40, humidity: 50, rain: 5, temp: 20, uv: 3, visibility: 10 };
    const recs = computeRecommendations(weather);
    const crane = recs.find((r) => r.label === "Crane Operation");
    expect(crane?.status).toBe("blocked");
  });
});

describe("riskTier", () => {
  it("returns Safe for risk below 35", () => {
    const tier = riskTier(20);
    expect(tier.label).toBe("Safe");
    expect(tier.color).toBe("#3DD68C");
  });

  it("returns Elevated for risk between 35 and 70", () => {
    const tier = riskTier(50);
    expect(tier.label).toBe("Elevated");
    expect(tier.color).toBe("#F4B740");
  });

  it("returns Critical for risk above 70", () => {
    const tier = riskTier(85);
    expect(tier.label).toBe("Critical");
    expect(tier.color).toBe("#FF5C5C");
  });
});

describe("snapshot", () => {
  it("returns a valid snapshot with all required fields", () => {
    const snap = snapshot(INITIAL, Date.now());
    expect(snap.weather).toEqual(INITIAL);
    expect(snap.triggered).toBeInstanceOf(Array);
    expect(typeof snap.risk).toBe("number");
    expect(snap.recommendations).toBeInstanceOf(Array);
    expect(typeof snap.seed).toBe("number");
  });
});

describe("nextWeather", () => {
  it("returns weather within bounds", () => {
    const next = nextWeather(INITIAL, INITIAL, 1);
    expect(next.wind).toBeGreaterThanOrEqual(0);
    expect(next.wind).toBeLessThanOrEqual(60);
    expect(next.temp).toBeGreaterThanOrEqual(-4);
    expect(next.temp).toBeLessThanOrEqual(36);
  });

  it("evolves weather over time", () => {
    const first = nextWeather(INITIAL, INITIAL, 1);
    const second = nextWeather(first, INITIAL, 1);
    expect(second.wind).not.toBe(first.wind);
  });
});

describe("INITIAL and SCENARIOS", () => {
  it("INITIAL has all required weather metrics", () => {
    expect(INITIAL.wind).toBeDefined();
    expect(INITIAL.humidity).toBeDefined();
    expect(INITIAL.rain).toBeDefined();
    expect(INITIAL.temp).toBeDefined();
    expect(INITIAL.uv).toBeDefined();
    expect(INITIAL.visibility).toBeDefined();
  });

  it("SCENARIOS includes all expected scenarios", () => {
    const ids = SCENARIOS.map((s) => s.id);
    expect(ids).toContain("clear");
    expect(ids).toContain("rain");
    expect(ids).toContain("storm");
    expect(ids).toContain("heat");
    expect(ids).toContain("wind");
  });
});
