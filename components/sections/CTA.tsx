"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { MagneticButton } from "./ui/MagneticButton";

const GITHUB_URL = "https://github.com/farhankabir133/BuildSafe";

export function CTA() {
  return (
    <section id="cta" className="relative px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-28 lg:py-36">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,140,255,0.16),transparent)] blur-3xl sm:h-[360px] sm:w-[640px] md:h-[460px] md:w-[820px]" />
      </div>
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <h2 className="text-balance text-[clamp(2rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-tightest text-white">
            Ready to build{" "}
            <span className="text-gradient-accent">smarter construction sites?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-prose2 text-[14px] leading-relaxed text-white/55 sm:text-[15px] md:text-base">
            Watch the Construction Intelligence Engine reason about your site in
            real time. No demo theatre — a live system thinking out loud.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="#dashboard" variant="primary" size="lg">
              Live Demo
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={GITHUB_URL} variant="ghost" size="lg">
              <Github className="h-4 w-4" />
              Github
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
