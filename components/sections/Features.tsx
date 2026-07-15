"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  CloudSun,
  CalendarClock,
  BarChart3,
  BellRing,
  GitBranch,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

function FeatureCard({
  icon: Icon,
  title,
  desc,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  className?: string;
  children: (active: boolean) => React.ReactNode;
}) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "group surface relative flex flex-col overflow-hidden p-4 sm:p-5 outline-none transition-shadow duration-300",
        "hover:border-lineStrong hover:shadow-glow focus-visible:border-lineStrong",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-3 sm:mb-4 flex items-center gap-2.5 sm:gap-3">
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-line bg-ink-900/60 text-accent-soft">
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
        </div>
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-white/90">{title}</h3>
      </div>
      <p className="text-[13px] sm:text-[13px] leading-relaxed text-white/50">
        {desc}
      </p>
      <div className="mt-auto pt-4 sm:pt-5">{children(active)}</div>
    </motion.div>
  );
}

function MiniPipeline({ active }: { active: boolean }) {
  const nodes = [0, 1, 2];
  return (
    <div className="flex items-center gap-1.5">
      {nodes.map((n, i) => (
        <div key={n} className="flex flex-1 items-center gap-1.5">
          <motion.div
            animate={{
              backgroundColor: active
                ? i === 2
                  ? "rgba(61,214,140,0.18)"
                  : "rgba(91,140,255,0.18)"
                : "rgba(255,255,255,0.04)",
              borderColor: active ? "rgba(91,140,255,0.4)" : "rgba(255,255,255,0.08)",
              scale: active ? 1.04 : 1,
            }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className="h-7 flex-1 rounded-md border"
          />
          {i < nodes.length - 1 && (
            <motion.span
              className="h-1 w-1 rounded-full bg-accent-soft"
              animate={{ opacity: active ? [0.2, 1, 0.2] : 0.2 }}
              transition={{ duration: 1, delay: i * 0.12, repeat: active ? Infinity : 0 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function MiniGauge({ active }: { active: boolean }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#F4B740"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: active ? c * 0.42 : c * 0.86 }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
        />
      </svg>
      <div>
        <div className="text-2xl font-bold tabular-nums text-white">
          {active ? "58" : "14"}
        </div>
        <div className="text-[11px] text-white/45">risk predicted</div>
      </div>
    </div>
  );
}

function MiniWeather({ active }: { active: boolean }) {
  const tiles = ["26°", "18km/h", "62%", "0mm"];
  const tiles2 = ["31°", "41km/h", "88%", "12mm"];
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {tiles.map((t, i) => (
        <div
          key={i}
          className="rounded-md border border-line bg-ink-900/60 py-1.5 text-center font-mono text-[11px] text-white/70"
        >
          <motion.span
            key={active ? "b" : "a"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="block"
          >
            {active ? tiles2[i] : t}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function MiniTimeline({ active }: { active: boolean }) {
  return (
    <div className="relative h-9 rounded-md border border-line bg-ink-900/60 px-3">
      <div className="absolute inset-y-2 left-3 right-3">
        <div className="relative h-px w-full bg-white/10" />
        {[0.15, 0.45, 0.75].map((p, i) => (
          <span
            key={i}
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/25"
            style={{ left: `${p * 100}%` }}
          />
        ))}
        <motion.span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(91,140,255,0.6)]"
          animate={{ left: active ? ["12%", "82%"] : "12%" }}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: active ? Infinity : 0, repeatType: "reverse" }}
        />
      </div>
    </div>
  );
}

function MiniBars({ active }: { active: boolean }) {
  const bars = [40, 65, 30, 80, 55, 70];
  const bars2 = [70, 35, 85, 45, 90, 60];
  return (
    <div className="flex h-10 items-end gap-1.5">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-accent/40 to-accent-soft"
          initial={false}
          animate={{ height: `${active ? bars2[i] : b}%` }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function MiniAlert({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-10 items-center gap-3 overflow-hidden rounded-md border border-line bg-ink-900/60 px-3">
      <span className="relative flex h-5 w-5 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-risk-danger/40"
          animate={{ scale: active ? [1, 2.2] : 1, opacity: active ? [0.6, 0] : 0 }}
          transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
        />
        <BellRing className="relative h-4 w-4 text-risk-danger" />
      </span>
      <motion.span
        initial={false}
        animate={{ opacity: active ? 1 : 0.4, x: active ? 0 : -4 }}
        className="text-[12px] text-white/70"
      >
        {active ? "Wind > 35 — Crane Hold" : "Monitoring…"}
      </motion.span>
    </div>
  );
}

function MiniDecision({ active }: { active: boolean }) {
  const states = active
    ? ["Go", "Caution", "Hold"]
    : ["Go", "Go", "Go"];
  const colors = ["#3DD68C", "#F4B740", "#FF5C5C"];
  return (
    <div className="flex flex-wrap gap-1.5">
      {states.map((s, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ backgroundColor: `${colors[i]}1f`, color: colors[i], borderColor: `${colors[i]}55` }}
          className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}

function MiniShield({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-10 items-center justify-center overflow-hidden rounded-md border border-line bg-ink-900/60">
      <ShieldCheck className="h-5 w-5 text-risk-safe" />
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-risk-safe to-transparent"
        animate={{ top: active ? ["0%", "100%"] : "50%", opacity: active ? [0, 1, 0] : 0.3 }}
        transition={{ duration: 1.6, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32">
      <div className="shell">
        <div className="mb-10 max-w-prose2">
          <span className="eyebrow mb-4">Capabilities</span>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.6rem] md:leading-[1.05]">
            One engine. Every operational decision.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
            Hover any capability to see it think. BuildSafe is not a dashboard —
            it is a system that reasons about your site in real time.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Brain}
            title="Construction Intelligence"
            desc="A reasoning layer that maps weather to the specific trades, tasks, and tolerances of your site."
            className="lg:col-span-2 lg:row-span-2"
          >
            {() => (
              <div className="space-y-3">
                <MiniPipeline active />
                <p className="text-[12px] text-white/40">
                  Atmospheric data → operational reasoning → directives.
                </p>
              </div>
            )}
          </FeatureCard>

          <FeatureCard
            icon={TrendingUp}
            title="Risk Prediction"
            desc="Composite, site-specific risk scored continuously and weighted by business impact."
          >
            {(active) => <MiniGauge active={active} />}
          </FeatureCard>

          <FeatureCard
            icon={CloudSun}
            title="Weather Integration"
            desc="Hyper-local streams normalized into one structured model."
          >
            {(active) => <MiniWeather active={active} />}
          </FeatureCard>

          <FeatureCard
            icon={CalendarClock}
            title="Operational Planning"
            desc="Shift-level planning that adapts as conditions move through the day."
          >
            {(active) => <MiniTimeline active={active} />}
          </FeatureCard>

          <FeatureCard
            icon={BarChart3}
            title="Analytics"
            desc="Downtime, safety, and risk trends you can defend to leadership."
            className="lg:col-span-2"
          >
            {(active) => <MiniBars active={active} />}
          </FeatureCard>

          <FeatureCard
            icon={BellRing}
            title="Alerts"
            desc="Threshold breaches pushed to the right crew, the moment they happen."
          >
            {(active) => <MiniAlert active={active} />}
          </FeatureCard>

          <FeatureCard
            icon={GitBranch}
            title="Decision Engine"
            desc="Every activity gets a Go, Caution, or Hold — with rationale."
          >
            {(active) => <MiniDecision active={active} />}
          </FeatureCard>

          <FeatureCard
            icon={ShieldCheck}
            title="Safety Monitoring"
            desc="Continuous site-wide safety posture, always observable."
            className="lg:col-span-2"
          >
            {(active) => <MiniShield active={active} />}
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
