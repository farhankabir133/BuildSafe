"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedNumber } from "../engine/primitives";

const STATS = [
  { label: "Enterprise sites", value: 42, suffix: "" },
  { label: "Unplanned downtime", value: 1.1, suffix: "h", decimals: 1, prefix: "-" },
  { label: "Weather incidents", value: 38, suffix: "%", prefix: "-" },
  { label: "Forecast-to-decision", value: 0.4, suffix: "s", decimals: 1 },
];

function areaPath(points: number[], w: number, h: number, pad = 2) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => [
    pad + i * step,
    h - pad - ((p - min) / range) * (h - pad * 2),
  ]);
  const line = coords.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" ");
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)} ${h} L${coords[0][0].toFixed(1)} ${h} Z`;
  return { line, area, coords };
}

function AreaChart({
  data,
  color = "#5B8CFF",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const W = 320;
  const H = 130;
  const { line, area } = areaPath(data, W, H);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#ag)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

function BarChart({
  data,
  labels,
  color = "#8B7CFF",
}: {
  data: number[];
  labels: string[];
  color?: string;
}) {
  return (
    <div className="flex h-32 items-end gap-2.5">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <motion.div
              className="w-full rounded-t-md"
              style={{
                background: `linear-gradient(to top, ${color}55, ${color})`,
              }}
              initial={{ height: 0 }}
              whileInView={{ height: `${d}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="text-[10px] text-white/40">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color = "#3DD68C" }: { data: number[]; color?: string }) {
  const W = 320;
  const H = 110;
  const { line } = areaPath(data, W, H);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none">
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function Analytics() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const riskHistory = [22, 30, 18, 44, 38, 62, 51, 70, 58, 81, 66, 74];
  const downtime = [62, 48, 35, 28, 18];
  const weatherTrend = [40, 55, 48, 70, 60, 82, 75, 90];
  const safetyTrend = [60, 64, 71, 73, 80, 84, 88];

  return (
    <section id="analytics" className="relative px-6 py-24 md:px-8 md:py-32">
      <div className="shell">
        <div className="mb-12 max-w-prose2">
          <span className="eyebrow mb-4">Analytics</span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-[2.6rem] md:leading-[1.05]">
            Measure what weather actually costs.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            Every decision is logged, scored, and visualized — so leadership can
            see the compounding value of operating to conditions.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="surface p-5"
            >
              <div className="text-3xl font-semibold tracking-tight text-white">
                <span className="text-white/60">{s.prefix ?? ""}</span>
                <AnimatedNumber value={s.value} decimals={s.decimals ?? 0} />
                <span className="text-lg text-white/50">{s.suffix}</span>
              </div>
              <div className="mt-1 text-[12px] text-white/45">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface p-5 lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white/90">
                  Risk history
                </div>
                <div className="text-[12px] text-white/45">
                  Composite site risk, 12 cycles
                </div>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-white/35">
                Live
              </span>
            </div>
            <AreaChart data={riskHistory} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="surface p-5"
          >
            <div className="mb-4 text-sm font-semibold text-white/90">
              Weather incidents
            </div>
            <div className="text-[12px] text-white/45">YoY reduction</div>
            <LineChart data={safetyTrend} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface p-5"
          >
            <div className="mb-4 text-sm font-semibold text-white/90">
              Operational downtime
            </div>
            <div className="text-[12px] text-white/45">Hours / week by quarter</div>
            <BarChart
              data={downtime}
              labels={["Q1", "Q2", "Q3", "Q4", "Now"]}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="surface p-5 lg:col-span-2"
          >
            <div className="mb-4 text-sm font-semibold text-white/90">
              Weather trend vs. activity
            </div>
            <div className="text-[12px] text-white/45">
              Severity correlation across the program
            </div>
            <AreaChart data={weatherTrend} color="#8B7CFF" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
