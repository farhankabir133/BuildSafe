"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Radio } from "lucide-react";
import {
  useSimulation,
  SCENARIOS,
  DEFAULT_COORDS,
} from "../engine/SimulationProvider";
import { Tooltip } from "../engine/primitives";

const SCENARIO_DESC: Record<string, string> = {
  clear: "Calm, clear conditions. All systems nominal.",
  rain: "Sustained rainfall. Painting and pours at risk.",
  storm: "Severe front. Crane and heavy equipment stand-down.",
  heat: "High temperature and UV. Exterior coating restricted.",
  wind: "Sustained high wind. Crane operation unsafe.",
  live: "Live conditions from WeatherAI for your current location.",
};

const LIVE = { id: "live", label: "Live", emoji: "📡" };
const OPTIONS = [...SCENARIOS, LIVE];

export function ScenarioControl() {
  const { scenario, setScenario, loading, live, setLive, coords, error } =
    useSimulation();
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ids = OPTIONS.map((s) => s.id);
  const activeId = live ? "live" : scenario.id;
  const activeIndex = ids.indexOf(activeId);

  function enableLive() {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLive({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lon: Number(pos.coords.longitude.toFixed(4)),
            label: "My location",
          }),
        () => setLive(DEFAULT_COORDS),
        { timeout: 8000, maximumAge: 600000 }
      );
    } else {
      setLive(DEFAULT_COORDS);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = ids.length - 1;
    let next = activeIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = activeIndex >= last ? 0 : activeIndex + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = activeIndex <= 0 ? last : activeIndex - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    const id = ids[next];
    if (id === "live") enableLive();
    else setScenario(id);
    btnRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
          Scenario
        </span>
        <span
          className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wide text-white/40"
          aria-live="polite"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-accent-soft" />
              {live ? "Fetching live" : "Recalculating"}
            </>
          ) : live ? (
            <>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-pulseRing rounded-full bg-risk-safe" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-risk-safe" />
              </span>
              {coords.label}
            </>
          ) : (
            <>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-pulseRing rounded-full bg-risk-safe" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-risk-safe" />
              </span>
              Live
            </>
          )}
        </span>
      </div>

      {live && error && (
        <div className="mb-2 rounded-md border border-risk-danger/30 bg-risk-danger/5 px-2.5 py-1.5 text-[9px] sm:text-[10px] text-risk-danger/90">
          {error}
        </div>
      )}

      <div
        role="radiogroup"
        aria-label="Weather scenario"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1.5"
      >
        {OPTIONS.map((s, i) => {
          const active = s.id === activeId;
          return (
            <Tooltip key={s.id} label={SCENARIO_DESC[s.id]}>
              <button
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                role="radio"
                aria-checked={active}
                aria-label={`${s.label}. ${SCENARIO_DESC[s.id]}`}
                tabIndex={i === activeIndex ? 0 : -1}
                onClick={() => (s.id === "live" ? enableLive() : setScenario(s.id))}
                className="group relative rounded-full border border-line px-2.5 py-1.5 text-[11px] sm:text-[12px] font-medium outline-none transition-colors duration-200 hover:border-lineStrong hover:bg-white/[0.04] focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40 min-h-[36px] sm:min-h-[38px]"
              >
                {active && (
                  <motion.span
                    layoutId="scenario-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-1.5 transition-colors ${
                    active ? "text-ink-950" : "text-white/60 group-hover:text-white"
                  }`}
                >
                  {s.id === "live" ? (
                    <Radio className="h-3.5 w-3.5" />
                  ) : (
                    <span aria-hidden>{s.emoji}</span>
                  )}
                  {s.label}
                </span>
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
