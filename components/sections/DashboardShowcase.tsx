"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  AlertTriangle,
  X,
  Wind,
  Droplets,
  Thermometer,
  Sun,
  Eye,
  Gauge,
  ShieldAlert,
  Clock,
  Layers,
} from "lucide-react";
import { useSimulation, riskTier } from "../engine/SimulationProvider";
import { AnimatedNumber, StatusDot } from "../engine/primitives";

function useRolling(value: number, cap = 40) {
  const [pts, setPts] = useState<number[]>(() =>
    Array.from({ length: cap }, (_, i) => 40 + Math.sin(i / 3) * 12)
  );
  const seed = useRef(-1);
  const { snap } = useSimulation();
  useEffect(() => {
    if (snap.seed === seed.current) return;
    seed.current = snap.seed;
    setPts((p) => [...p.slice(1), value]);
  }, [snap.seed, value]);
  return pts;
}

function RiskChart() {
  const { snap } = useSimulation();
  const pts = useRolling(snap.risk, 48);
  const W = 520;
  const H = 150;
  const max = 100;
  const step = W / (pts.length - 1);
  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)} ${(H - (p / max) * H).toFixed(1)}`)
    .join(" ");
  const tier = riskTier(snap.risk);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tier.color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={tier.color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#dg)" />
      <motion.path
        d={line}
        fill="none"
        stroke={tier.color}
        strokeWidth="2"
        initial={false}
      />
    </svg>
  );
}

function WeatherStrip() {
  const { snap } = useSimulation();
  const items = [
    { icon: Wind, label: "Wind", v: snap.weather.wind, u: "km/h" },
    { icon: Droplets, label: "Humidity", v: snap.weather.humidity, u: "%" },
    { icon: Droplets, label: "Rain", v: snap.weather.rain, u: "mm/h" },
    { icon: Thermometer, label: "Temp", v: snap.weather.temp, u: "°C" },
    { icon: Sun, label: "UV", v: snap.weather.uv, u: "" },
    { icon: Eye, label: "Vis", v: snap.weather.visibility, u: "km" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className="rounded-lg border border-line bg-ink-900/50 px-2.5 py-2 transition-colors hover:border-lineStrong"
          >
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
              <Icon className="h-3 w-3" /> {it.label}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-white">
              <AnimatedNumber
                value={it.v}
                decimals={it.label === "UV" || it.label === "Vis" ? 1 : 0}
              />
              <span className="ml-0.5 text-[10px] text-white/40">{it.u}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Recommendations() {
  const { snap } = useSimulation();
  const Icon = (s: string) =>
    s === "ok" ? <Check className="h-3.5 w-3.5 text-risk-safe" /> : s === "warn" ? <AlertTriangle className="h-3.5 w-3.5 text-risk-warn" /> : <X className="h-3.5 w-3.5 text-risk-danger" />;
  return (
    <div className="space-y-1.5">
      <AnimatePresence initial={false}>
        {snap.recommendations.map((r) => {
          const tone =
            r.status === "ok"
              ? "border-risk-safe/25 bg-risk-safe/5"
              : r.status === "warn"
              ? "border-risk-warn/25 bg-risk-warn/5"
              : "border-risk-danger/25 bg-risk-danger/5";
          return (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 ${tone}`}
            >
              <span className="flex items-center gap-2 text-[13px] text-white/85">
                {Icon(r.status)} {r.label}
                {r.note && <span className="text-white/35">{r.note}</span>}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase ${
                  r.status === "ok"
                    ? "text-risk-safe"
                    : r.status === "warn"
                    ? "text-risk-warn"
                    : "text-risk-danger"
                }`}
              >
                {r.status === "ok" ? "Go" : r.status === "warn" ? "Caution" : "Hold"}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

const ACTIVITY = [
  { t: "06:12", m: "Morning conditions ingested", k: "ok" },
  { t: "07:45", m: "Crane operation cleared", k: "ok" },
  { t: "09:30", m: "Wind threshold approaching", k: "warn" },
  { t: "10:15", m: "Concrete pour scheduled", k: "ok" },
  { t: "11:48", m: "Humidity breach — painting hold", k: "blocked" },
  { t: "13:05", m: "Roofing caution until 1 PM", k: "warn" },
  { t: "14:20", m: "Front arrival predicted", k: "warn" },
  { t: "15:40", m: "Crew re-tasked automatically", k: "ok" },
];

export function DashboardShowcase() {
  const { snap } = useSimulation();
  const tier = riskTier(snap.risk);
  const [now, setNow] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="dashboard" className="relative px-6 py-24 md:px-8 md:py-32">
      <div className="shell">
        <div className="mb-12 max-w-prose2">
          <span className="eyebrow mb-4">Live Dashboard</span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-[2.6rem] md:leading-[1.05]">
            The operational surface your crews actually use.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            Not a screenshot. A real, live interface — synchronized with the
            engine above. Scroll the activity log and watch it think.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="surface overflow-hidden p-0"
        >
          {/* top bar */}
          <div className="flex items-center justify-between border-b border-line bg-ink-900/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet text-ink-950">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white/90">
                  Tower B — Operations
                </div>
                <div className="text-[11px] text-white/40">
                  BuildSafe Control
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[12px] text-white/50 sm:inline">
                {now}
              </span>
              <span
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                style={{ borderColor: `${tier.color}55`, color: tier.color }}
              >
                <StatusDot
                  tone={
                    snap.risk < 35 ? "safe" : snap.risk < 70 ? "warn" : "danger"
                  }
                />
                {tier.label}
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <WeatherStrip />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Gauge, label: "Risk score", value: snap.risk, node: tier.color },
                  { icon: ShieldAlert, label: "Active rules", value: snap.triggered.length, node: "#FF5C5C" },
                  { icon: Clock, label: "Downtime saved", value: Math.round(snap.risk / 3), node: "#3DD68C" },
                  { icon: Layers, label: "Sites", value: 42, node: "#5B8CFF" },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={kpi.label}
                      className="rounded-xl border border-line bg-ink-900/50 p-3 transition-colors hover:border-lineStrong"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-white/40">
                        <Icon className="h-3 w-3" /> {kpi.label}
                      </div>
                      <div
                        className="mt-1 text-2xl font-semibold tabular-nums"
                        style={{ color: kpi.node }}
                      >
                        <AnimatedNumber value={kpi.value} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-line bg-ink-900/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white/85">
                    Composite risk — live
                  </span>
                  <span className="text-[11px] text-white/40">rolling 48 cycles</span>
                </div>
                <RiskChart />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-line bg-ink-900/40 p-4">
                <div className="mb-3 text-[13px] font-semibold text-white/85">
                  Recommendations
                </div>
                <Recommendations />
              </div>

              <div className="flex max-h-64 flex-col rounded-xl border border-line bg-ink-900/40 p-4">
                <div className="mb-2 text-[13px] font-semibold text-white/85">
                  Activity timeline
                </div>
                <div className="mask-fade-y flex-1 space-y-0 overflow-y-auto pr-1">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="flex gap-3 py-1.5">
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-1 h-2 w-2 rounded-full ${
                            a.k === "ok"
                              ? "bg-risk-safe"
                              : a.k === "warn"
                              ? "bg-risk-warn"
                              : "bg-risk-danger"
                          }`}
                        />
                        {i < ACTIVITY.length - 1 && (
                          <span className="my-0.5 w-px flex-1 bg-line" />
                        )}
                      </div>
                      <div className="pb-1">
                        <div className="font-mono text-[10px] text-white/35">
                          {a.t}
                        </div>
                        <div className="text-[12px] text-white/70">{a.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
