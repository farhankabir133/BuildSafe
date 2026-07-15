"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
  LayoutGroup,
  type MotionValue,
} from "framer-motion";
import { Check, AlertTriangle, X, Activity } from "lucide-react";
import {
  useSimulation,
  riskTier,
  type Rule,
  type Recommendation,
} from "./SimulationProvider";
import { AnimatedNumber, DataFlow, StatusDot, formatMetric, Tooltip } from "./primitives";
import { ScenarioControl } from "../sections/ScenarioSimulator";

const METRICS: { key: keyof import("./SimulationProvider").Weather; label: string }[] = [
  { key: "wind", label: "Wind" },
  { key: "humidity", label: "Humidity" },
  { key: "rain", label: "Rain" },
  { key: "temp", label: "Temp" },
  { key: "uv", label: "UV" },
  { key: "visibility", label: "Visibility" },
];

function NodeShell({
  index,
  label,
  title,
  explain,
  children,
  tone = "safe",
  pulse,
  phase = 0.5,
}: {
  index: number;
  label: string;
  title: string;
  explain?: string;
  children: React.ReactNode;
  tone?: "safe" | "warn" | "danger";
  pulse: MotionValue<number>;
  phase?: number;
}) {
  const reduce = useReducedMotion();
  const glow = useTransform(
    pulse,
    [phase - 0.12, phase, phase + 0.12],
    [0, 0.85, 0]
  );
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduce ? 0.3 : 0.7,
        delay: reduce ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      <div className="hero-card relative p-[18px]">
        <motion.div
          aria-hidden
          style={{ opacity: glow }}
          className="pointer-events-none absolute -inset-px z-10 rounded-2xl ring-1 ring-accent/70 shadow-[0_0_34px_-2px_rgba(91,140,255,0.55)]"
        />
        <div className="relative mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] text-white/30">
              {String(index).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
              {label}
            </span>
          </div>
          <StatusDot tone={tone} />
        </div>
        <div className="relative mb-3 text-[15px] font-semibold tracking-[-0.01em] text-white">
          {title}
        </div>
        {explain && (
          <div className="relative mb-3 text-[11px] leading-snug text-white/40">
            {explain}
          </div>
        )}
        <div className="relative">{children}</div>
      </div>
    </motion.div>
  );
}

function WeatherNode({ pulse, phase }: { pulse: MotionValue<number>; phase: number }) {
  const { snap } = useSimulation();
  return (
    <NodeShell index={1} label="Weather API" title="Live weather ingestion" explain="Ingests live, hyper-local atmospheric observations." tone="safe" pulse={pulse} phase={phase}>
      <ScenarioControl />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {METRICS.map((m) => {
          const v = snap.weather[m.key];
          const max =
            m.key === "wind"
              ? 60
              : m.key === "humidity"
              ? 100
              : m.key === "rain"
              ? 60
              : m.key === "temp"
              ? 35
              : m.key === "uv"
              ? 12
              : 14;
          const pct = Math.min(100, (v / max) * 100);
          const hot = pct > 65;
          return (
            <div
              key={m.key}
              className="rounded-lg border border-line bg-ink-900/60 px-2.5 py-2"
            >
              <div className="text-[10px] uppercase tracking-wide text-white/40">
                {m.label}
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <AnimatedNumber
                  value={v}
                  decimals={m.key === "uv" || m.key === "visibility" ? 1 : 0}
                  className="text-lg font-semibold tabular-nums text-white"
                />
                <span className="text-[10px] text-white/40">
                  {formatMetric(m.key)}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className={`h-full rounded-full ${
                    hot ? "bg-risk-danger" : "bg-accent"
                  }`}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </NodeShell>
  );
}

function NormalizationNode({ pulse, phase }: { pulse: MotionValue<number>; phase: number }) {
  const { snap } = useSimulation();
  const w = snap.weather;
  const rows: [string, number, string][] = [
    ["wind_speed", w.wind, "km/h"],
    ["relative_humidity", w.humidity, "%"],
    ["precipitation", w.rain, "mm/h"],
    ["ambient_temp", w.temp, "°C"],
    ["uv_index", w.uv, ""],
    ["visibility", w.visibility, "km"],
  ];
  return (
    <NodeShell index={2} label="Normalization" title="Standardizing the feed" explain="Standardizes every source into one structured model." tone="safe" pulse={pulse} phase={phase}>
      <div className="rounded-lg border border-line bg-ink-950/70 p-3 font-mono text-[11px] leading-relaxed">
        <div className="text-white/35">{"// standardized weather object"}</div>
        <span className="text-accent-soft">const</span>{" "}
        <span className="text-white/80">conditions</span> = {"{"}
        <div className="pl-3">
          {rows.map(([k, v, u], i) => (
            <div key={k} className="flex items-center gap-1">
              <span className="text-white/40">{k}</span>
              <span className="text-white/25">:</span>
              <AnimatedNumber
                value={v}
                decimals={u === "" && k === "uv_index" ? 1 : 0}
                className="text-risk-safe"
              />
              {u && <span className="text-white/30">{u}</span>},
            </div>
          ))}
        </div>
        {"}"}
      </div>
    </NodeShell>
  );
}

function RulesNode({ pulse, phase }: { pulse: MotionValue<number>; phase: number }) {
  const { snap } = useSimulation();
  const triggered = useMemo(
    () => new Set(snap.triggered.map((r) => r.id)),
    [snap.triggered]
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const list = snap.triggered;
  const rulesTone: "safe" | "warn" | "danger" = list.some(
    (r) => r.severity === "high"
  )
    ? "danger"
    : list.length
    ? "warn"
    : "safe";

  useEffect(() => {
    if (list.length === 0) return;
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % list.length),
      900
    );
    return () => clearInterval(id);
  }, [list.length]);

  return (
    <NodeShell index={3} label="Rules Engine" title="Construction rules firing" explain="Maps live conditions to trade- and task-specific rules." tone={rulesTone} pulse={pulse} phase={phase}>
      <div className="space-y-1.5">
        {snap.triggered.length === 0 && (
          <div className="flex items-center gap-2 rounded-md border border-risk-safe/25 bg-risk-safe/5 px-3 py-2 text-[11px] text-risk-safe/80">
            <Check className="h-3.5 w-3.5" />
            All systems nominal — no rule breaches.
          </div>
        )}
        <AnimatePresence initial={false}>
          {snap.triggered.map((r, i) => {
            const isActive = i === activeIdx % Math.max(list.length, 1);
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.35 }}
                className={`flex items-center justify-between rounded-md border px-3 py-2 transition-colors duration-500 ${
                  isActive
                    ? "border-accent/50 bg-accent/10"
                    : "border-line bg-ink-900/50"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-white/55">
                    {labelFor(r)}
                  </span>
                  <span className="text-white/30">→</span>
                  <span className="text-white/80">{r.action}</span>
                </div>
                <StatusDot
                  tone={
                    r.severity === "high"
                      ? "danger"
                      : r.severity === "medium"
                      ? "warn"
                      : "safe"
                  }
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NodeShell>
  );
}

function labelFor(r: Rule) {
  const sym = r.operator;
  const val =
    r.metric === "uv" || r.metric === "visibility"
      ? r.threshold
      : r.threshold;
  return `${r.metric} ${sym} ${val}`;
}

function RiskNode({ pulse, phase }: { pulse: MotionValue<number>; phase: number }) {
  const { snap } = useSimulation();
  const tier = riskTier(snap.risk);
  const size = 116;
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const reduce = useReducedMotion();
  return (
    <NodeShell index={4} label="Risk Engine" title="Composite risk score" explain="Scores composite, site-weighted operational risk." tone={tier.label === "Safe" ? "safe" : tier.label === "Elevated" ? "warn" : "danger"} pulse={pulse} phase={phase}>
      <div className="flex items-center gap-4">
        <div className="relative" style={{ width: size, height: size }}>
          <Tooltip label={`Composite risk: ${snap.risk} of 100 — ${tier.label}.`}>
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="8"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={tier.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={false}
                animate={{
                  strokeDashoffset: circ - (snap.risk / 100) * circ,
                  stroke: tier.color,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 60, damping: 16 }
                }
                style={{ filter: `drop-shadow(0 0 8px ${tier.ring})` }}
              />
            </svg>
          </Tooltip>
          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
            <AnimatedNumber
              value={snap.risk}
              className="text-3xl font-bold tabular-nums text-white"
            />
            <span className="text-[10px] uppercase tracking-wide text-white/45">
              risk
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div
            className="text-sm font-semibold"
            style={{ color: tier.color }}
          >
            {tier.label}
          </div>
          <div className="mt-1 text-[11px] leading-relaxed text-white/45">
            Weighted from {snap.triggered.length} active{" "}
            {snap.triggered.length === 1 ? "rule" : "rules"} across the site.
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/35">
            <Activity className="h-3 w-3" />
            recomputed every cycle
          </div>
        </div>
      </div>
    </NodeShell>
  );
}

function RecIcon({ status }: { status: Recommendation["status"] }) {
  if (status === "ok")
    return <Check className="h-3.5 w-3.5 text-risk-safe" />;
  if (status === "warn")
    return <AlertTriangle className="h-3.5 w-3.5 text-risk-warn" />;
  return <X className="h-3.5 w-3.5 text-risk-danger" />;
}

function RecommendationNode({ pulse, phase }: { pulse: MotionValue<number>; phase: number }) {
  const { snap } = useSimulation();
  const recTone: "safe" | "warn" | "danger" = snap.recommendations.some(
    (r) => r.status === "blocked"
  )
    ? "danger"
    : snap.recommendations.some((r) => r.status === "warn")
    ? "warn"
    : "safe";
  return (
    <NodeShell
      index={5}
      label="Recommendation"
      title="Operational directives"
      explain="Issues a Go, Caution, or Hold per activity."
      tone={recTone}
      pulse={pulse}
      phase={phase}
    >
      <div className="space-y-1">
        <AnimatePresence initial={false}>
          {snap.recommendations.map((rec) => {
            const palette =
              rec.status === "ok"
                ? { border: "rgba(61,214,140,0.3)", bg: "rgba(61,214,140,0.05)" }
                : rec.status === "warn"
                ? { border: "rgba(244,183,64,0.3)", bg: "rgba(244,183,64,0.05)" }
                : { border: "rgba(255,92,92,0.3)", bg: "rgba(255,92,92,0.05)" };
            return (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  borderColor: palette.border,
                  backgroundColor: palette.bg,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  layout: { duration: 0.35 },
                  default: { duration: 0.3 },
                  borderColor: { duration: 0.4 },
                  backgroundColor: { duration: 0.4 },
                }}
                className="flex items-center justify-between rounded-md border px-3 py-1.5"
              >
                <div className="flex items-center gap-2 text-[12px] text-white/80">
                  <RecIcon status={rec.status} />
                  {rec.label}
                  {rec.note && (
                    <span className="text-white/35">{rec.note}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium uppercase tracking-wide ${
                    rec.status === "ok"
                      ? "text-risk-safe"
                      : rec.status === "warn"
                      ? "text-risk-warn"
                      : "text-risk-danger"
                  }`}
                >
                  {rec.status === "ok"
                    ? "Go"
                    : rec.status === "warn"
                    ? "Caution"
                    : "Hold"}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NodeShell>
  );
}

function HeroTimeline() {
  const { snap } = useSimulation();
  const reduce = useReducedMotion();
  const colorFor = (s: Recommendation["status"]) =>
    s === "ok" ? "#3DD68C" : s === "warn" ? "#F4B740" : "#FF5C5C";
  const recs = snap.recommendations;
  const seg = 100 / recs.length;
  return (
    <div className="col-span-2 rounded-lg border border-line bg-ink-900/60 p-3">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-white/40">
        <span>Shift timeline</span>
        <span className="text-white/30">now</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        {recs.map((r, i) => (
          <motion.span
            key={r.id}
            className="absolute top-0 h-full"
            style={{ left: `${i * seg}%`, width: `${seg}%` }}
            animate={{ backgroundColor: colorFor(r.status) }}
            transition={{ duration: 0.5 }}
          />
        ))}
        {!reduce && (
          <motion.span
            className="absolute top-0 h-full w-0.5 bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]"
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}

function DashboardNode({ pulse, phase }: { pulse: MotionValue<number>; phase: number }) {
  const { snap } = useSimulation();
  const tier = riskTier(snap.risk);
  return (
    <NodeShell
      index={6}
      label="Dashboard"
      title="Operational surface"
      explain="Live operational surface for crews and managers."
      tone={tier.label === "Safe" ? "safe" : tier.label === "Elevated" ? "warn" : "danger"}
      pulse={pulse}
      phase={phase}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 rounded-lg border border-line bg-ink-900/60 p-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-white/40">
            <span>Site downtime</span>
            <span className="text-risk-danger">
              -{Math.round(snap.risk / 3)}h
            </span>
          </div>
          <MiniChart value={snap.risk} />
        </div>
        {[
          { k: "Active rules", v: snap.triggered.length },
          { k: "Risk tier", v: riskTier(snap.risk).label },
        ].map((c) => (
          <div
            key={c.k}
            className="rounded-lg border border-line bg-ink-900/60 px-3 py-2"
          >
            <div className="text-[10px] uppercase tracking-wide text-white/40">
              {c.k}
            </div>
            <div className="mt-0.5 text-base font-semibold text-white">
              {typeof c.v === "number" ? (
                <AnimatedNumber value={c.v} />
              ) : (
                c.v
              )}
            </div>
          </div>
        ))}
        <HeroTimeline />
        {snap.risk < 35 && (
          <div className="col-span-2 flex items-center gap-2 rounded-md border border-risk-safe/25 bg-risk-safe/5 px-3 py-2 text-[11px] text-risk-safe/80">
            <Check className="h-3.5 w-3.5" />
            No operational risk detected across the site.
          </div>
        )}
      </div>
    </NodeShell>
  );
}

function MiniChart({ value }: { value: number }) {
  const [pts, setPts] = useState<number[]>(() =>
    Array.from({ length: 24 }, (_, i) => 30 + Math.sin(i / 2) * 10)
  );
  const lastSeed = useRef(0);
  const { snap } = useSimulation();
  useEffect(() => {
    if (snap.seed === lastSeed.current) return;
    lastSeed.current = snap.seed;
    setPts((p) => [...p.slice(1), value]);
  }, [snap.seed, value]);

  const w = 260;
  const h = 44;
  const step = w / (pts.length - 1);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(
      h -
      (p / 100) * h
    ).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-11 w-full" preserveAspectRatio="none">
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(91,140,255,0.8)"
        strokeWidth="1.5"
        initial={false}
      />
    </svg>
  );
}

export function DecisionEngine({ className }: { className?: string }) {
  const pulse = useMotionValue(0);
  const { snap, scenario, loading } = useSimulation();
  const reduce = useReducedMotion();
  const seed = useRef(snap.seed);

  useEffect(() => {
    if (snap.seed === seed.current) return;
    seed.current = snap.seed;
    if (reduce) return;
    const controls = animate(pulse, 1, {
      duration: 1.4,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [snap.seed, pulse, reduce]);

  const PHASES = [0.14, 0.29, 0.43, 0.57, 0.71, 0.86];
  const tier = riskTier(snap.risk);

  return (
    <LayoutGroup>
      <div
        className={`relative ${className ?? ""}`}
        role="group"
        aria-label="Construction Intelligence Engine live simulation"
      >
        <div className="absolute inset-0 -z-10 rounded-[28px] bg-[radial-gradient(115%_70%_at_50%_-15%,rgba(91,140,255,0.14),transparent_62%),radial-gradient(80%_60%_at_85%_110%,rgba(139,124,255,0.10),transparent_60%)]" />
        <div className="sr-only" role="status" aria-live="polite">
          {`Scenario: ${scenario.label}. Risk: ${tier.label}, ${snap.triggered.length} active ${
            snap.triggered.length === 1 ? "rule" : "rules"
          }.`}
        </div>
        <div className="flex flex-col">
          <WeatherNode pulse={pulse} phase={PHASES[0]} />
          <DataFlow reduced={reduce ?? false} />
          <NormalizationNode pulse={pulse} phase={PHASES[1]} />
          <DataFlow reduced={reduce ?? false} />
          <RulesNode pulse={pulse} phase={PHASES[2]} />
          <DataFlow reduced={reduce ?? false} />
          <RiskNode pulse={pulse} phase={PHASES[3]} />
          <DataFlow reduced={reduce ?? false} />
          <RecommendationNode pulse={pulse} phase={PHASES[4]} />
          <DataFlow reduced={reduce ?? false} />
          <DashboardNode pulse={pulse} phase={PHASES[5]} />
        </div>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[28px]"
          >
            <div className="absolute inset-0 bg-ink-950/25" />
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}
