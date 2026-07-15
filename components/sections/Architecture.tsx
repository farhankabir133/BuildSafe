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
    <section id="architecture" className="relative px-6 py-24 md:px-8 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,124,255,0.10),transparent)] blur-2xl" />
      </div>
      <div className="shell">
        <div className="mb-14 max-w-prose2">
          <span className="eyebrow mb-4">Architecture</span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-[2.6rem] md:leading-[1.05]">
            A distributed intelligence system, not a widget.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            Every component animates into the pipeline as data flows from the
            atmosphere to the crew. Watch the system think.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* central spine */}
          <div className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-lineStrong to-transparent md:left-1/2 md:-translate-x-1/2" />
          {ARCH.map((layer, li) => (
            <div key={layer.label} className="relative mb-10">
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
                        className="absolute left-[20px] top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-ink-900 bg-accent shadow-[0_0_12px_2px_rgba(91,140,255,0.6)] md:left-1/2"
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
                        className="surface ml-12 p-4 transition-colors hover:border-lineStrong md:ml-[calc(50%+1.5rem)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink-900/60 text-accent-soft">
                            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="text-[15px] font-semibold text-white/90">
                                {node.name}
                              </h4>
                              <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-white/45">
                                {node.meta}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[13px] leading-relaxed text-white/50">
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
            <span className="rounded-full border border-risk-safe/30 bg-risk-safe/5 px-4 py-1.5 text-[12px] font-medium text-risk-safe">
              Output → Safer, faster, more predictable sites
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
