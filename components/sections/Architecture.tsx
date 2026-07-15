"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Network,
  Database,
  Server,
  Cpu,
  Activity,
  Sparkles,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

type Node = {
  icon: LucideIcon;
  name: string;
  desc: string;
  meta: string;
};

type Layer = { label: string; nodes: Node[] };

const ARCH: Layer[] = [
  {
    label: "Ingest",
    nodes: [
      {
        icon: Cloud,
        name: "Weather AI",
        desc: "Hyper-local atmospheric models and station networks.",
        meta: "Streams",
      },
    ],
  },
  {
    label: "Gateway",
    nodes: [
      {
        icon: Network,
        name: "API Layer",
        desc: "Authenticated, rate-limited ingestion with schema validation.",
        meta: "REST · gRPC",
      },
      {
        icon: Database,
        name: "Caching",
        desc: "Edge-cached observations for sub-second reads across sites.",
        meta: "TTL 30s",
      },
      {
        icon: Server,
        name: "Weather Service",
        desc: "Normalizes every source into one structured conditions object.",
        meta: "Normalized",
      },
    ],
  },
  {
    label: "Engine",
    nodes: [
      {
        icon: Cpu,
        name: "Construction Engine",
        desc: "Applies trade- and task-specific rules to live conditions.",
        meta: "Rules",
      },
      {
        icon: Activity,
        name: "Risk Engine",
        desc: "Scores composite, site-weighted operational risk in real time.",
        meta: "Scored",
      },
      {
        icon: Sparkles,
        name: "Recommendation Engine",
        desc: "Generates Go / Caution / Hold directives per activity.",
        meta: "Directives",
      },
    ],
  },
  {
    label: "Surface",
    nodes: [
      {
        icon: LayoutDashboard,
        name: "Dashboard",
        desc: "Live operational surface for crews, managers, and leadership.",
        meta: "Realtime",
      },
    ],
  },
];

export function Architecture() {
  const allNodes = ARCH.flatMap((l) => l.nodes);
  let seen = 0;
  return (
    <section id="architecture" className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[250px] w-[350px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,124,255,0.10),transparent)] blur-2xl sm:h-[300px] sm:w-[450px] md:h-[400px] md:w-[700px]" />
      </div>
      <div className="shell">
        <div className="mb-10 lg:mb-14 max-w-prose2">
          <span className="eyebrow mb-4">Architecture</span>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.6rem] md:leading-[1.05]">
            A distributed intelligence system, not a widget.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
            Every component animates into the pipeline as data flows from the
            atmosphere to the crew. Watch the system think.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* central spine */}
          <div className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-lineStrong to-transparent sm:left-[24px] md:left-1/2 md:-translate-x-1/2" />
          {ARCH.map((layer, li) => (
            <div key={layer.label} className="relative mb-8 sm:mb-10">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="mb-4 flex items-center gap-2 pl-1"
              >
                <span className="rounded-full border border-line bg-ink-900/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  {layer.label}
                </span>
                <span className="h-px flex-1 bg-line" />
              </motion.div>

              <div className="space-y-3">
                {layer.nodes.map((node) => {
                  const idx = seen++;
                  const Icon = node.icon;
                  const offset = idx;
                  return (
                    <div key={node.name} className="relative">
                      {/* node dot on spine */}
                      <motion.span
                        className="absolute left-[16px] sm:left-[18px] md:left-[20px] top-5 sm:top-6 z-10 h-2.5 w-2.5 sm:h-3 sm:w-3 -translate-x-1/2 rounded-full border-2 border-ink-900 bg-accent shadow-[0_0_12px_2px_rgba(91,140,255,0.6)] md:left-1/2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: offset * 0.08, type: "spring" }}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          duration: 0.55,
                          delay: offset * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="surface ml-9 sm:ml-10 md:ml-[calc(50%+1.5rem)] p-3 sm:p-4 transition-colors hover:border-lineStrong"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink-900/60 text-accent-soft">
                            <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 sm:gap-3">
                              <h4 className="text-[14px] sm:text-[15px] font-semibold text-white/90">
                                {node.name}
                              </h4>
                              <span className="shrink-0 rounded-full border border-line px-1.5 py-0.5 sm:px-2 sm:py-0.5 font-mono text-[9px] sm:text-[10px] text-white/45">
                                {node.meta}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[12px] sm:text-[13px] leading-relaxed text-white/50">
                              {node.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <motion.div
            className="mt-2 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full border border-risk-safe/30 bg-risk-safe/5 px-3 py-1.5 sm:px-4 sm:py-1.5 text-[11px] sm:text-[12px] font-medium text-risk-safe">
              Output → Safer, faster, more predictable sites
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
