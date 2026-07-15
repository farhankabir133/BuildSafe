"use client";

import { useEffect, useRef } from "react";
import { useId } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import type { Weather } from "./SimulationProvider";

export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(value);
  const spring = useSpring(mv, reduce ? { duration: 0 } : {
    stiffness: 110,
    damping: 22,
    mass: 0.6,
  });

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useMotionValueEvent(spring, "change", (v) => {
    if (ref.current) {
      ref.current.textContent =
        decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    }
  });

  return (
    <span ref={ref} className={className}>
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
    </span>
  );
}

/**
 * A connector between engine nodes. Renders a soft line plus a traveling
 * data pulse that communicates "information flows downstream".
 */
export function DataFlow({
  active = true,
  reduced = false,
  className,
}: {
  active?: boolean;
  reduced?: boolean;
  className?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const path = "M50 0 C 50 14, 50 18, 50 24 S 50 34, 50 48";
  return (
    <div
      className={`relative h-12 w-full ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 48"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(91,140,255,0)" />
            <stop offset="50%" stopColor="rgba(91,140,255,0.55)" />
            <stop offset="100%" stopColor="rgba(139,124,255,0.9)" />
          </linearGradient>
        </defs>
        <path
          d={path}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d={path}
          stroke={`url(#${gid})`}
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="6 10"
          className={active && !reduced ? "flow-line" : ""}
        />
        {active && !reduced && (
          <motion.circle
            r="1.7"
            fill="#7AA2FF"
            style={{
              offsetPath: `path('${path}')`,
              offsetRotate: "0deg",
              filter: "drop-shadow(0 0 3px rgba(122,162,255,0.9))",
            }}
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        )}
      </svg>
    </div>
  );
}

export function StatusDot({
  tone,
}: {
  tone: "safe" | "warn" | "danger";
}) {
  const color =
    tone === "safe"
      ? "#3DD68C"
      : tone === "warn"
      ? "#F4B740"
      : "#FF5C5C";
  const alert = tone !== "safe";
  return (
    <span className="relative inline-flex h-2 w-2">
      {alert && (
        <span
          className="absolute inset-0 rounded-full animate-pulseRing"
          style={{ background: color }}
        />
      )}
      <span
        className="relative inline-block h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
    </span>
  );
}

export function formatMetric(metric: keyof Weather) {
  switch (metric) {
    case "wind":
      return "km/h";
    case "humidity":
      return "%";
    case "rain":
      return "mm/h";
    case "temp":
      return "°C";
    case "uv":
      return "";
    case "visibility":
      return "km";
  }
}

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-line bg-ink-900/95 px-2.5 py-1.5 text-center text-[11px] leading-snug text-white/80 opacity-0 shadow-soft backdrop-blur-xl transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-line bg-ink-900/95" />
      </span>
    </span>
  );
}
