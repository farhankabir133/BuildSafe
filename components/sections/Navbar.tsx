"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./ui/Logo";
import { MagneticButton } from "./ui/MagneticButton";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Architecture", href: "#architecture" },
  { label: "Dashboard", href: "#dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-4 py-3 transition-all duration-500 sm:px-6 md:px-8",
          scrolled
            ? "my-2 rounded-2xl border border-line bg-ink-900/70 backdrop-blur-xl shadow-soft"
            : "border border-transparent bg-transparent"
        )}
        style={{ maxWidth: scrolled ? 1180 : "100%" }}
      >
        <a href="#top" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative rounded-full px-3.5 py-2 text-sm text-white/65 transition-colors hover:text-white"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#github"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm text-white/65 transition-colors hover:text-white"
          >
            <Github className="h-4 w-4" />
            Github
          </a>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="#demo"
            className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm text-white/65 transition-colors hover:text-white"
          >
            Demo
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <MagneticButton href="#cta" variant="primary" size="md">
            Start Analysis
          </MagneticButton>
        </div>

        <button
          className="lg:hidden flex items-center justify-center rounded-lg border border-line p-2.5 text-white/80 min-h-[44px] min-w-[44px]"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-3 mt-2 rounded-2xl border border-line bg-ink-900/95 p-4 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {[...NAV, { label: "Github", href: "#github" }, { label: "Demo", href: "#demo" }].map(
                (n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3.5 text-sm text-white/70 hover:bg-white/5 min-h-[44px] flex items-center"
                  >
                    {n.label}
                  </a>
                )
              )}
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-white px-4 py-3.5 text-center text-sm font-medium text-ink-950 min-h-[44px] flex items-center justify-center"
              >
                Start Analysis
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
