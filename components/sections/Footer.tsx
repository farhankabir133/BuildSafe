"use client";

import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "./ui/Logo";

const LINKS = [
  {
    title: "Product",
    items: ["Features", "Technology", "Architecture", "Dashboard"],
  },
  {
    title: "Developers",
    items: ["Documentation", "API Reference", "Status", "Changelog"],
  },
  {
    title: "Company",
    items: ["About", "Security", "Careers", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line px-4 py-12 sm:px-6 sm:py-14 md:px-8">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[12px] sm:text-[13px] leading-relaxed text-white/45">
              AI-powered construction operations decisions. Transform weather
              intelligence into real-time action.
            </p>
            <div className="mt-4 sm:mt-5 flex items-center gap-3 text-white/40">
              <a href="#github" className="transition-colors hover:text-white" aria-label="Github">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="transition-colors hover:text-white" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="transition-colors hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {LINKS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wide text-white/40">
                {col.title}
              </div>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5">
                {col.items.map((it) => (
                  <li key={it}>
                    <a
                      href="#"
                      className="text-[12px] sm:text-[13px] text-white/55 transition-colors hover:text-white"
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 sm:pt-6 text-[11px] sm:text-[12px] text-white/35 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} BuildSafe Intelligence. All rights reserved.</span>
          <div className="flex items-center gap-4 sm:gap-5">
            <a href="#" className="transition-colors hover:text-white/70">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white/70">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-white/70">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
