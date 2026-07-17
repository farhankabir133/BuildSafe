# BuildSafe Intelligence

**Construction Intelligence Engine** — an AI-powered, real-time decision system that turns live weather intelligence into construction operational decisions.

> Every weather forecast should end with a decision.

BuildSafe Intelligence continuously analyzes atmospheric conditions and transforms them into actionable, trade-specific directives — keeping construction projects safer, faster, and more predictable. This repository contains the marketing/showcase front-end for the platform, including a fully interactive, live-simulated **Construction Intelligence Engine** with ultra-responsive design across all devices.

**Live Demo:** https://build-safe-three.vercel.app/  
**GitHub:** https://github.com/farhankabir133/BuildSafe

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Author](#author)
- [License](#license)

---

## Overview

Traditional weather dashboards stop at "it might rain." BuildSafe Intelligence goes further: it ingests hyper-local weather, normalizes it into a structured model, evaluates it against construction rules, computes a composite site risk score, and issues a **Go / Caution / Hold** directive per activity — all in real time.

The showcase site demonstrates this with a **live simulation engine** running in the browser. You can switch between scenarios (Clear Sky, Heavy Rain, Storm Warning, Extreme Heat, High Wind) and watch the engine re-evaluate risk, fire rules, and update operational directives on every cycle.

### Ultra-Responsive Design

The front-end is built with a **mobile-first, device-agnostic approach** ensuring optimal viewing across all screen sizes:

- **Custom Breakpoints**: `xs` (475px), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px), `3xl` (1920px), `ultra` (2560px)
- **Fluid Typography**: Base font scales smoothly between 14px and 16px using `clamp()`
- **Touch Optimizations**: 44px minimum tap targets, safe area inset support for notched devices
- **Responsive Components**: All sections adapt with mobile-first spacing, typography, and grid layouts
- **Accessibility**: `prefers-reduced-motion` support, keyboard navigation, ARIA labels
- **Cross-Device**: Optimized for phones, tablets, laptops, desktops, and ultra-wide displays

---

## Features

- **Construction Intelligence** — A reasoning layer that maps weather to the specific trades, tasks, and tolerances of a site.
- **Risk Prediction** — Composite, site-specific, business-impact-weighted risk scored continuously (0–100).
- **Weather Integration** — Hyper-local atmospheric streams normalized into one structured model.
- **Operational Planning** — Shift-level planning that adapts as conditions move through the day.
- **Analytics** — Downtime, safety, and risk trends you can defend to leadership.
- **Alerts** — Threshold breaches pushed to the right crew the moment they happen.
- **Decision Engine** — Every activity receives a Go, Caution, or Hold — with rationale.
- **Safety Monitoring** — Continuous, always-observable site-wide safety posture.

### Interactive Simulation

- Six-stage engine visualization: Weather API → Normalization → Rules Engine → Risk Engine → Recommendation → Dashboard.
- Five selectable scenarios with mean-reverting random-walk weather for lifelike fluctuation.
- Play / pause and speed controls, persisted scenario selection (localStorage).
- Accessibility-first: keyboard-navigable scenarios, `aria-live` status announcements, and `prefers-reduced-motion` support.

---

## How It Works

The engine runs as a deterministic, in-browser simulation defined in `components/engine/SimulationProvider.tsx`:

1. **Weather ingestion** — A `Weather` model with `wind`, `humidity`, `rain`, `temp`, `uv`, and `visibility` is driven by a mean-reverting random walk anchored to the active scenario baseline, so it stays "on scenario" yet visibly fluctuates.
2. **Normalization** — Raw observations are mapped to a single standardized structure (`wind_speed`, `relative_humidity`, `precipitation`, `ambient_temp`, `uv_index`, `visibility`).
3. **Rules Engine** — A set of trade/task-specific `RULES` (e.g. *Crane Operation Unsafe* when `wind > 35 km/h`, *Concrete Pouring Blocked* when `rain > 40 mm/h`) fire when thresholds are breached.
4. **Risk Engine** — A composite `risk` score (0–100) weighted by rule severity (low/medium/high) plus weather turbulence, mapped to **Safe / Elevated / Critical** tiers.
5. **Recommendation** — Per-activity directives (`Excavation`, `Masonry`, `Roofing`, `Crane Operation`, `Concrete Pouring`) resolve to **Go / Caution / Hold**.
6. **Dashboard** — A live operational surface (downtime estimate, active rules, risk tier, shift timeline) for crews and managers.

---

## Architecture

The front-end is a single-page Next.js application. The page (`app/page.tsx`) wraps everything in a `SimulationProvider` and composes the section components in scroll order.

```
app/
  layout.tsx          Root layout, fonts (Inter + JetBrains Mono), metadata
  page.tsx            Page composition + scroll progress + SimulationProvider
  globals.css         Design tokens, base styles
components/
  engine/             The Construction Intelligence Engine (simulation core)
    SimulationProvider.tsx   State, scenarios, weather model, risk + rec logic
    DecisionEngine.tsx       Rendered 6-node pipeline visualization
    primitives.tsx           AnimatedNumber, DataFlow, StatusDot, Tooltip
  sections/           Page sections (Hero, Story, Features, Architecture, ...)
    ui/               Logo, MagneticButton primitives
lib/
  utils.ts            cn() className helper (clsx + tailwind-merge)
```

---

## Backend API

The platform ships with a real backend: Next.js Route Handlers that run the
**same** engine functions on **real weather data** from
[WeatherAI](https://weather-ai.co). The pure engine logic lives in
`lib/engine.ts` (no React) so it is shared, unchanged, between the client
simulation and the server routes.

### `GET /api/weather?lat=<n>&lon=<n>`
Proxies `https://api.weather-ai.co/v1/current`, maps the response into the
normalized `Weather` model, and returns `{ weather, source, lat, lon }`.

### `GET /api/risk?lat=<n>&lon=<n>`
Fetches live conditions from WeatherAI, then runs `snapshot(weather)` from
`lib/engine.ts` and returns the full engine `Snapshot`:

```json
{
  "snapshot": {
    "weather":     { "wind": 18, "humidity": 62, "rain": 8, "temp": 14, "uv": 4, "visibility": 9 },
    "triggered":   [ { "id": "crane", "action": "Crane Operation Unsafe", "severity": "high", ... } ],
    "risk":        42,
    "recommendations": [ { "id": "crane", "label": "Crane Operation", "status": "blocked" } ],
    "seed":        1717977600000
  },
  "source": "weather-ai",
  "lat": -1.2921,
  "lon": 36.8219
}
```

### `POST /api/risk`
Run the engine on supplied conditions, or resolve coordinates server-side:

```bash
# Use provided conditions
curl -X POST https://your-host/api/risk \
  -H "Content-Type: application/json" \
  -d '{ "weather": { "wind": 40, "humidity": 60, "rain": 12, "temp": 15, "uv": 3, "visibility": 8 } }'

# Or resolve live weather from coordinates
curl -X POST https://your-host/api/risk \
  -H "Content-Type: application/json" \
  -d '{ "lat": -1.2921, "lon": 36.8219 }'
```

### Live mode (front-end)
The interactive simulator has a **Live** scenario. Selecting it requests the
browser's geolocation (falling back to Nairobi, KE) and switches the engine
loop to poll `/api/risk` on every cycle, so the visualization renders real
world decisions instead of the simulated random walk.

## Environment Variables

Copy `.env.example` to `.env.local` and add your WeatherAI key:

```bash
cp .env.example .env.local
# then set WEATHERAI_API_KEY=wai_...
```

Without a key, the API routes return a clear 500 and the front-end keeps
running against its built-in simulation.

## Tech Stack

| Layer        | Technology |
| ------------ | ---------- |
| Framework    | [Next.js 15](https://nextjs.org/) (App Router) |
| UI Library  | [React 19](https://react.dev/) |
| Styling      | [Tailwind CSS 3](https://tailwindcss.com/) with custom design tokens, ultra-responsive utilities, and mobile-first breakpoints |
| Animation    | [Framer Motion 11](https://www.framer.com/motion/) |
| Icons        | [lucide-react](https://lucide.dev/) + [react-icons](https://react-icons.github.io/react-icons/) |
| Validation   | [Zod](https://zod.dev/) for runtime schema validation |
| Language     | [TypeScript 5](https://www.typescriptlang.org/) |
| Linting      | ESLint 9 + `eslint-config-next` |
| Backend      | Next.js Route Handlers (API routes) + [WeatherAI](https://weather-ai.co) provider |

---

## Project Structure

```
Construction Intelligence Engine/
├── app/
│   ├── api/
│   │   ├── weather/route.ts   # GET /api/weather — live conditions from WeatherAI
│   │   └── risk/route.ts      # GET|POST /api/risk — engine snapshot from real data
│   ├── layout.tsx             # Root layout, fonts, metadata
│   ├── page.tsx               # Page composition + SimulationProvider + ErrorBoundary
│   └── globals.css            # Design tokens, base styles
├── components/
│   ├── engine/                # Construction Intelligence Engine (UI + context)
│   │   ├── SimulationProvider.tsx  # React context; sim + Live mode
│   │   ├── DecisionEngine.tsx      # Rendered 6-node pipeline visualization
│   │   └── primitives.tsx          # AnimatedNumber, DataFlow, StatusDot, Tooltip
│   └── sections/              # Landing-page sections + ui primitives
├── lib/
│   ├── engine.ts              # Pure engine core: types + evaluate/computeRisk/computeRecommendations/riskTier
│   ├── weather-ai.ts          # Server WeatherAI client + response mapping + timeout
│   ├── api.ts                 # Client helper: fetchRisk(lat, lon)
│   ├── env.ts                 # Runtime environment validation with Zod
│   ├── logger.ts              # Structured logging with request IDs
│   ├── rate-limit.ts          # In-memory rate limiting for API routes
│   ├── validation.ts          # Zod schemas for API route inputs
│   └── utils.ts               # cn() className helper
├── .env.example               # WeatherAI API key template
├── next.config.mjs            # Next.js configuration + security headers
├── postcss.config.mjs         # PostCSS (Tailwind + autoprefixer)
├── tailwind.config.ts         # Tailwind theme, tokens, animations, breakpoints
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.18+ (tested on Node 25)
- **npm** (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/farhankabir133/BuildSafe.git
cd BuildSafe

# Install dependencies
npm install

# Configure environment (required for live weather via WeatherAI)
cp .env.example .env.local
# then edit .env.local and set WEATHERAI_API_KEY=wai_...
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Available Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the development server         |
| `npm run build`  | Create an optimized production build |
| `npm run start`  | Run the production server            |
| `npm run lint`   | Lint the codebase with ESLint        |

---

## Weather-AI Integration

This project integrates with Weather-AI's API through two backend endpoints:

### `/api/weather` — Live Conditions
- Proxies `https://api.weather-ai.co/v1/current`
- Maps response to normalized `Weather` model with defensive field detection
- Handles multiple response shapes (`current`, `data`, `hourly`, `daily`)
- 10-second timeout with `AbortController`
- Safe fallbacks for missing metrics

### `/api/risk` — Risk Computation
- Fetches live conditions and runs engine snapshot
- Returns: `weather`, `triggered` rules, `risk` score (0-100), `recommendations`
- Supports both `GET` (lat/lon query params) and `POST` (weather body or lat/lon)
- Rate limited: 100 req/min for risk, 50 req/min for weather

### Key Implementation Details
- **Field Mapping**: Searches multiple response containers for candidate field names
- **Bounds Checking**: All values clamped to engine-accepted ranges
- **Error Handling**: Custom `WeatherAIError` class with status codes (401, 403, 429, 502, 504)
- **Input Validation**: Zod schemas validate all query parameters and request bodies
- **Logging**: Structured JSON logs with request IDs for every API call
- **Security**: Security headers, rate limiting, and environment validation

---

## Configuration

- **`tailwind.config.ts`** — Custom color tokens (`ink`, `accent`, `violet`, `risk`), fonts, shadows, animations (`shimmer`, `pulseRing`), and ultra-responsive breakpoints (`xs` through `ultra`).
- **`next.config.mjs`** — React Strict Mode enabled, security headers configured (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`).
- **`lib/utils.ts`** — `cn()` helper combining `clsx` and `tailwind-merge` for conditional class names.
- **`lib/env.ts`** — Runtime environment validation with Zod (validates `WEATHERAI_API_KEY` format at startup).
- **`lib/validation.ts`** — Zod schemas for API route input validation (`WeatherQuerySchema`, `RiskBodySchema`).
- **`lib/rate-limit.ts`** — In-memory rate limiting: 100 req/min for `/api/risk`, 50 req/min for `/api/weather`.
- **`lib/logger.ts`** — Structured JSON logging with request IDs for all API routes.
- **Scenarios** — Defined in `components/engine/SimulationProvider.tsx` via the `SCENARIOS` and `RULES` arrays. Adjust baselines, thresholds, and severities to model your own site conditions.

---

## Author

**Farhan Kabir**

- GitHub: [@farhankabir133](https://github.com/farhankabir133)
- Email: [farhankabir133@gmail.com](mailto:farhankabir133@gmail.com)

---

## License

This project is provided for demonstration and educational purposes. See the repository for license details.
