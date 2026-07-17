"use client";

import { Suspense } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SimulationProvider } from "@/components/engine/SimulationProvider";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection, SolutionSection } from "@/components/sections/Story";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { Analytics } from "@/components/sections/Analytics";
import { DashboardShowcase } from "@/components/sections/DashboardShowcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { ErrorBoundary } from "@/components/error-boundary";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-violet to-accent-soft"
    />
  );
}

function SectionFallback() {
  return (
    <div className="shell py-24">
      <div className="flex animate-pulse flex-col gap-3">
        <div className="h-6 w-48 rounded bg-white/10" />
        <div className="h-4 w-96 rounded bg-white/10" />
        <div className="h-4 w-64 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <SimulationProvider interval={2100}>
        <ScrollProgress />
        <Navbar />
        <main>
          <Suspense fallback={<SectionFallback />}>
            <Hero />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ProblemSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <SolutionSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Features />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Architecture />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Analytics />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <DashboardShowcase />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Testimonials />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <CTA />
          </Suspense>
        </main>
        <Footer />
      </SimulationProvider>
    </ErrorBoundary>
  );
}
