"use client";

import { motion } from "framer-motion";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <motion.svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        initial={{ rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="shrink-0"
      >
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#7AA2FF" />
            <stop offset="100%" stopColor="#8B7CFF" />
          </linearGradient>
        </defs>
        <rect
          x="1.5"
          y="1.5"
          width="29"
          height="29"
          rx="8"
          stroke="url(#lg)"
          strokeWidth="1.5"
        />
        <motion.path
          d="M10 21 L16 11 L22 21"
          stroke="url(#lg)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.circle
          cx="10"
          cy="21"
          r="2.4"
          fill="#7AA2FF"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        />
        <motion.circle
          cx="16"
          cy="11"
          r="2.4"
          fill="#8B7CFF"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1, type: "spring" }}
        />
        <motion.circle
          cx="22"
          cy="21"
          r="2.4"
          fill="#7AA2FF"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        />
      </motion.svg>
      {!compact && (
        <div className="leading-none min-w-0 truncate">
          <div className="text-[15px] font-semibold tracking-tight text-white truncate">
            BuildSafe
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40 truncate">
            Intelligence
          </div>
        </div>
      )}
    </div>
  );
}
