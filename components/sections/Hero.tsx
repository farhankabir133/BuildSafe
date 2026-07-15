"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { DecisionEngine } from "../engine/DecisionEngine";
import { MagneticButton } from "./ui/MagneticButton";

const LINES = ["Every Weather Forecast", "Should End", "With A Decision."];

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="top"
      className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 md:px-8 md:pb-24 md:pt-32 lg:pb-32 lg:pt-40"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,140,255,0.18),transparent_70%)] blur-3xl sm:h-[400px] sm:w-[600px] sm:top-[-12%] md:h-[560px] md:w-[920px]" />
        <div className="absolute right-[1%] top-[4%] h-[200px] w-[280px] rounded-full bg-[radial-gradient(closest-side,rgba(139,124,255,0.13),transparent_70%)] blur-3xl sm:h-[300px] sm:w-[400px] md:h-[440px] md:w-[560px]" />
        <div className="absolute left-1/2 bottom-[-18%] h-[250px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,140,255,0.08),transparent_70%)] blur-3xl sm:h-[350px] sm:w-[550px] sm:bottom-[-20%] md:h-[520px] md:w-[860px] md:bottom-[-22%]" />
        <div className="absolute inset-0 mask-fade-y bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:56px_56px] md:bg-[size:64px_64px] [mask-image:radial-gradient(60%_55%_at_50%_28%,#000,transparent)]" />
      </div>

      <div className="shell grid items-start gap-10 sm:gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
        <div className="lg:sticky lg:top-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-5 border-white/10 bg-white/[0.04] backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-pulseRing rounded-full bg-risk-safe" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-risk-safe shadow-[0_0_8px_#3DD68C]" />
            </span>
            Construction Intelligence Engine
          </motion.div>

          <h1 className="text-balance text-[clamp(2.2rem,5.5vw,4.9rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-white">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? { opacity: 0 } : { y: "110%" }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {i === LINES.length - 1 ? (
                    <span className="text-gradient-accent">{line}</span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-5 max-w-[32rem] text-balance text-[14px] leading-[1.7] text-white/60 sm:text-[15px] md:text-[15.5px]"
          >
            BuildSafe Intelligence continuously analyzes weather conditions and
            transforms them into operational decisions that keep construction
            projects safer, faster and more predictable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.74 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="#cta" variant="primary" size="lg">
              Start Risk Analysis
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#dashboard" variant="ghost" size="lg">
              <Play className="h-4 w-4" />
              Watch Live Simulation
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-9 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.16em] text-white/35"
          >
            <span>SOC 2 Type II</span>
            <span className="h-3 w-px bg-white/15" />
            <span>99.98% Uptime</span>
            <span className="h-3 w-px bg-white/15" />
            <span>42 Enterprise Sites</span>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="perspective"
        >
          <DecisionEngine className="[transform:rotateX(2deg)]" />
        </motion.div>
      </div>
    </section>
  );
}
