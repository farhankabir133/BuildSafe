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
    <section id="customers" className="relative px-6 py-24 md:px-8 md:py-32">
      <div className="shell">
        <div className="mb-12 max-w-prose2">
          <span className="eyebrow mb-4">Trusted at scale</span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-[2.6rem] md:leading-[1.05]">
            Built for the teams that can&apos;t afford to guess.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
                className="surface flex flex-col p-6"
              >
                <Icon className="h-6 w-6 text-white/30" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-white/75">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <div className="text-[14px] font-semibold text-white/90">
                    {q.name}
                  </div>
                  <div className="text-[12px] text-white/45">
                    {q.role} · {q.company}
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
