import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050608",
          900: "#080A0E",
          850: "#0B0E13",
          800: "#10141B",
          700: "#171C25",
          600: "#222934",
        },
        line: "rgba(255,255,255,0.08)",
        lineStrong: "rgba(255,255,255,0.14)",
        accent: {
          DEFAULT: "#5B8CFF",
          soft: "#7AA2FF",
          deep: "#3A63D8",
        },
        violet: {
          DEFAULT: "#8B7CFF",
        },
        risk: {
          safe: "#3DD68C",
          warn: "#F4B740",
          danger: "#FF5C5C",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        shell: "1200px",
        prose2: "720px",
      },
      boxShadow: {
        soft: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 60px -20px rgba(0,0,0,0.7)",
        glow: "0 0 60px -15px rgba(91,140,255,0.45)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        pulseRing: "pulseRing 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
