"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  HelpCircle,
  XCircle,
  Clock,
  TrendingDown,
  Cpu,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  title: string;
  desc: string;
  meta?: string;
};

function StepCard({
  step,
  index,
  tone,
  i,
}: {
  step: Step;
  index: string;
  tone: "bad" | "good";
  i: number;
}) {
  const Icon = step.icon;
  const accent =
    tone === "bad"
      ? "text-risk-danger border-risk-danger/30 bg-risk-danger/5"
      : "text-accent-soft border-accent/30 bg-accent/5";
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-3 sm:gap-4"
    >
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border ${accent}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="relative my-1 h-10 sm:h-12 w-px flex-1 overflow-hidden bg-line">
          <motion.div
            className={`absolute inset-x-0 top-0 h-5 sm:h-6 ${
              tone === "bad" ? "bg-risk-danger/40" : "bg-accent/40"
            }`}
            initial={{ y: "-100%" }}
            whileInView={{ y: "200%" }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: i * 0.12 + 0.3,
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: "easeIn",
            }}
          />
        </div>
      </div>
      <div className="pb-6 sm:pb-8 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] sm:text-[10px] text-white/35">{index}</span>
          <h4 className="text-[14px] sm:text-[15px] font-semibold text-white/90">
            {step.title}
          </h4>
        </div>
        <p className="mt-1 text-[13px] sm:text-sm leading-relaxed text-white/50">
          {step.desc}
        </p>
        {step.meta && (
          <span
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide ${
              tone === "bad"
                ? "bg-risk-danger/10 text-risk-danger"
                : "bg-risk-safe/10 text-risk-safe"
            }`}
          >
            {step.meta}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`mb-12 ${align === "center" ? "text-center mx-auto max-w-prose2 px-2 sm:px-0" : "max-w-prose2"}`}
    >
      <span className="eyebrow mb-4">{eyebrow}</span>
      <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.6rem] md:leading-[1.05]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

const PROBLEM: Step[] = [
  {
    icon: Cloud,
    title: "Manager checks the weather",
    desc: "A glance at a consumer app before the 7 AM stand-up. No context for the site, the trade, or the task.",
    meta: "Manual",
  },
  {
    icon: HelpCircle,
    title: "Makes a guess",
    desc: "Experience and instinct fill the gap between a forecast and a safe operational call.",
    meta: "Uncertain",
  },
  {
    icon: XCircle,
    title: "Wrong decision goes live",
    desc: "A crane lifts in 38 km/h gusts. Concrete is poured before the front arrives.",
    meta: "Risk",
  },
  {
    icon: Clock,
    title: "Project slips",
    desc: "Rework, inspections, and idle crews compound across the week.",
    meta: "Delay",
  },
  {
    icon: TrendingDown,
    title: "Financial loss",
    desc: "Each lost day on a $2M/week tower site erodes margin and the delivery承诺.",
    meta: "$-$-$",
  },
];

const SOLUTION: Step[] = [
  {
    icon: Cloud,
    title: "Weather AI ingestion",
    desc: "Continuous, hyper-local weather streams normalized into a single structured model.",
    meta: "Live",
  },
  {
    icon: Cpu,
    title: "Construction Intelligence Engine",
    desc: "Proprietary rules map atmospheric conditions to the reality of each trade and task.",
    meta: "Engine",
  },
  {
    icon: ShieldCheck,
    title: "Risk Engine",
    desc: "Composite, site-specific risk scored in real time and weighted by operational impact.",
    meta: "Scored",
  },
  {
    icon: CheckCircle2,
    title: "Recommendations",
    desc: "Every activity receives a Go, Caution, or Hold directive with a clear rationale.",
    meta: "Directives",
  },
  {
    icon: ShieldCheck,
    title: "Safe operations",
    desc: "Crews work to the conditions. Decisions are logged, auditable, and defensible.",
    meta: "Outcome",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div>
          <SectionHeading
            eyebrow="The old way"
            title="Guessing is expensive."
            subtitle="Construction still runs on a forecast someone read once and a decision someone hoped was right. The gap between weather and action is where projects lose time, money, and safety."
          />
          <div className="mt-6 rounded-2xl border border-risk-danger/15 bg-risk-danger/[0.03] p-4 sm:p-5">
            <div className="text-xs uppercase tracking-wide text-risk-danger/70">
              Average unplanned downtime
            </div>
            <div className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
               6.2 hours <span className="text-base text-white/40">/ week</span>
            </div>
            <div className="mt-1 text-sm text-white/45">
              per site, driven by weather-driven miscalls.
            </div>
          </div>
        </div>
        <div className="border-l border-line pl-3 sm:pl-4 lg:pl-6">
          {PROBLEM.map((s, i) => (
            <StepCard
              key={i}
              step={s}
              index={String(i + 1).padStart(2, "0")}
              tone="bad"
              i={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section id="technology" className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="The BuildSafe way"
          title="From weather to a decision, automatically."
          subtitle="The Construction Intelligence Engine closes the gap. It watches the atmosphere, reasons about your site, and tells each crew exactly what they can safely do — every cycle."
          align="center"
        />
        <div className="mx-auto mt-4 max-w-2xl border-l border-line pl-3 sm:pl-4 md:pl-6">
          {SOLUTION.map((s, i) => (
            <StepCard
              key={i}
              step={s}
              index={String(i + 1).padStart(2, "0")}
              tone="good"
              i={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
