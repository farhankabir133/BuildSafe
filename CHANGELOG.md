# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Production-grade error boundaries and global error handling
- Request timeouts (10s) for all external API calls
- Rate limiting for API routes (100 req/min for `/api/risk`, 50 req/min for `/api/weather`)
- Runtime environment validation with Zod
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection)
- Structured logging with request IDs for all API routes
- Zod validation schemas for all API route inputs
- React Suspense boundaries for async components
- Comprehensive test suite with Vitest and Testing Library
- Unit tests for `lib/engine.ts` (29 test cases)
- Integration tests for API routes (validation, error handling, rate limiting)
- Pre-commit hooks with Husky and lint-staged
- Bundle analysis with `@next/bundle-analyzer`
- CI/CD pipeline with GitHub Actions
- `CONTRIBUTING.md` documentation

### Changed
- Enhanced `lib/weather-ai.ts` with timeout handling and improved error messages
- Refactored API routes to include rate limiting, validation, and logging
- Improved mobile navbar to prevent horizontal overflow on narrow viewports
- Updated `tailwind.config.ts` with extended breakpoints and responsive utilities
- Enhanced `app/globals.css` with mobile-first base styles and safe area support

### Fixed
- Navbar horizontal overflow issue on mobile devices (Pixel 7 and similar)
- Environment variable validation to catch missing/invalid config at startup

## [1.0.0] - Initial Release

### Added
- Construction Intelligence Engine core logic
- Interactive simulation with 5 scenarios
- Live dashboard with real-time risk scoring
- Responsive marketing/showcase frontend
- WeatherAI integration for live weather data
- Backend API routes (`/api/weather`, `/api/risk`)
