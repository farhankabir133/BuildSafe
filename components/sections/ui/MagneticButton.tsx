"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "md" | "lg";

export function MagneticButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * 0.35);
    y.set(my * 0.35);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 will-change-transform";
  const variants: Record<Variant, string> = {
    primary:
      "bg-white text-ink-950 hover:bg-white/90 shadow-[0_8px_30px_-8px_rgba(255,255,255,0.4)]",
    ghost:
      "border border-lineStrong bg-white/[0.03] text-white/90 hover:bg-white/[0.07]",
    outline:
      "border border-line bg-transparent text-white/80 hover:text-white hover:border-lineStrong",
  };
  const sizes: Record<Size, string> = {
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-[15px]",
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        "outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
        className
      )}
    >
      {children}
    </motion.a>
  );
}
