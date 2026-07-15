"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type Weather,
  type Rule,
  type RuleSeverity,
  type RecStatus,
  type Recommendation,
  type Snapshot,
  type Scenario,
  SCENARIOS,
  INITIAL,
  riskTier,
  snapshot,
  nextWeather,
} from "@/lib/engine";
import { fetchRisk } from "@/lib/api";

export type {
  Weather,
  Rule,
  RuleSeverity,
  RecStatus,
  Recommendation,
  Snapshot,
  Scenario,
};
export { SCENARIOS, INITIAL, riskTier };

/**
 * Default coordinates used by Live mode when geolocation is unavailable or
 * denied. Centered on Nairobi, KE (WeatherAI's reference city).
 */
export const DEFAULT_COORDS = {
  lat: -1.2921,
  lon: 36.8219,
  label: "Nairobi, KE",
};

type Coords = { lat: number; lon: number; label: string };

type Ctx = {
  snap: Snapshot;
  running: boolean;
  setRunning: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  scenario: Scenario;
  setScenario: (id: string) => void;
  loading: boolean;
  live: boolean;
  coords: Coords;
  setLive: (coords: Coords) => void;
  error: string | null;
};

const SimulationContext = createContext<Ctx | null>(null);

export function SimulationProvider({
  children,
  interval = 2100,
  autoStart = true,
}: {
  children: React.ReactNode;
  interval?: number;
  autoStart?: boolean;
}) {
  const [scenarioId, setScenarioId] = useState("clear");
  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId]
  );
  const [weather, setWeather] = useState<Weather>(scenario.weather);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(autoStart);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);

  const [live, setLiveState] = useState(false);
  const [coords, setCoords] = useState<Coords>(DEFAULT_COORDS);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef(weather);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const liveReq = useRef(0);

  // Restore persisted scenario + resolve initial loading state (client only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bsi:scenario");
      if (saved && SCENARIOS.some((s) => s.id === saved)) setScenarioId(saved);
    } catch {}
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  // Core loop: locally simulated mean-reverting walk, or live data from the
  // backend (/api/risk) when Live mode is enabled.
  useEffect(() => {
    if (!running) return;

    if (!live) {
      const id = setInterval(() => {
        const drift = scenario.drift * (1 + (speed - 1) * 0.5);
        const next = nextWeather(ref.current, scenario.weather, drift);
        ref.current = next;
        setWeather(next);
        setTick((t) => t + 1);
      }, interval / speed);
      return () => clearInterval(id);
    }

    let cancelled = false;
    const pull = async () => {
      const reqId = ++liveReq.current;
      try {
        const snap = await fetchRisk(coords.lat, coords.lon);
        if (cancelled || reqId !== liveReq.current) return;
        ref.current = snap.weather;
        setWeather(snap.weather);
        setTick((t) => t + 1);
        setError(null);
      } catch (e) {
        if (cancelled || reqId !== liveReq.current) return;
        setError(e instanceof Error ? e.message : "Live weather unavailable");
      } finally {
        if (!cancelled && reqId === liveReq.current) setLoading(false);
      }
    };

    pull();
    const id = setInterval(pull, interval / speed);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [running, speed, interval, scenario, live, coords]);

  const setScenario = useMemo(
    () => (id: string) => {
      const next = SCENARIOS.find((s) => s.id === id);
      if (!next) return;
      setLiveState(false);
      setScenarioId(id);
      ref.current = next.weather;
      setWeather(next.weather);
      setTick((t) => t + 1);
      try {
        localStorage.setItem("bsi:scenario", id);
      } catch {}
      setLoading(true);
      clearTimeout(loadTimer.current);
      loadTimer.current = setTimeout(() => setLoading(false), 650);
    },
    []
  );

  const setLive = useMemo(
    () => (next: Coords) => {
      setLiveState(true);
      setCoords(next);
      setLoading(true);
      setError(null);
      clearTimeout(loadTimer.current);
      loadTimer.current = setTimeout(() => setLoading(false), 650);
    },
    []
  );

  const snap = useMemo(() => snapshot(weather, tick), [weather, tick]);

  const value = useMemo<Ctx>(
    () =>
      ({
        snap,
        running,
        setRunning,
        speed,
        setSpeed,
        scenario,
        setScenario,
        loading,
        live,
        coords,
        setLive,
        error,
      }),
    [snap, running, speed, scenario, setScenario, setLive, loading, live, coords, error]
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx)
    throw new Error("useSimulation must be used within SimulationProvider");
  return ctx;
}
