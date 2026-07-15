"use client";

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
      className="fixed inset-x-0 top-0 z-[60] h-0.5 sm:h-0.5 origin-left bg-gradient-to-r from-accent via-violet to-accent-soft"
    />
  );
}

export default function Page() {
  return (
    <SimulationProvider interval={2100}>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <Features />
        <Architecture />
        <Analytics />
        <DashboardShowcase />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </SimulationProvider>
  );
}
