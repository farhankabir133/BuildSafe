"use client";

import { motion } from "framer-motion";
import { SiSamsung, SiSap, SiNvidia, SiAccenture } from "react-icons/si";

const QUOTES = [
  {
    quote:
      "BuildSafe turned our daily weather gamble into a defensible, logged decision. Downtime on the tower program dropped by a third in the first quarter.",
    name: "Helena Vasquez",
    role: "VP, Operations",
    company: "Meridian Infrastructure",
    Icon: SiSap,
  },
  {
    quote:
      "The risk engine reasons about our actual trades, not a generic forecast. Our site managers trust it because it speaks their language.",
    name: "Daniel Okafor",
    role: "Head of Safety",
    company: "Northbridge Construction",
    Icon: SiAccenture,
  },
  {
    quote:
      "We replaced three spreadsheets and a group chat with one live surface. Leadership finally sees what weather really costs us.",
    name: "Priya Raman",
    role: "Director of Delivery",
    company: "Atlas Build Group",
    Icon: SiNvidia,
  },
];

export function Testimonials() {
  return (
    <section id="customers" className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:py-32">
      <div className="shell">
        <div className="mb-10 max-w-prose2">
          <span className="eyebrow mb-4">Trusted at scale</span>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.6rem] md:leading-[1.05]">
            Built for the teams that can&apos;t afford to guess.
          </h2>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {QUOTES.map((q, i) => {
            const Icon = q.Icon;
            return (
              <motion.figure
                key={q.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="surface flex flex-col p-5 sm:p-6"
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white/30" />
                <blockquote className="mt-3 sm:mt-4 flex-1 text-[14px] sm:text-[15px] leading-relaxed text-white/75">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 sm:mt-6 border-t border-line pt-3 sm:pt-4">
                  <div className="text-[13px] sm:text-[14px] font-semibold text-white/90">
                    {q.name}
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-white/45">
                    {q.role} &middot; {q.company}
                  </div>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
