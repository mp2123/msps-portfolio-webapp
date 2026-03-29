# Changelog

All notable changes to the **Portfolio App** are documented here.

---

## [1.2.0] — 2026-03-28

### 🐛 Bug Fixes
- **Cocktail dialog layout** — Removed `sm:max-w-lg` override from base `DialogContent` that was capping the cocktail dialog at ~512px. Dialog now uses `max-w-4xl` for a proper two-column layout on desktop.
- **Cocktail dialog mobile** — Image panel hidden on mobile; recipe displays in a single scrollable column. Grid breakpoint changed from `lg` to `md` for earlier column collapse.
- **Chatbot scroll containment** — Added `overscroll-behavior: contain` on both the dialog container and ScrollArea to prevent main page scroll bleed when scrolling inside the chat panel.
- **CV experience section** — Added `items-start` to the grid to eliminate empty black space at the bottom when content heights differ between columns.
- **Dialog height** — Changed `92vh` to `92dvh` for better mobile Safari viewport consistency.

### 🎨 Assets
- Generated and integrated 6 professional cocktail images (Negroni, Paper Plane, Last Word, Old Fashioned, Margarita, Espresso Martini) as local assets in `public/cocktails/`.
- Replaced external Unsplash image dependencies with locally-hosted versions for reliability and performance.

### 📄 Documentation
- Added `CHANGELOG.md` for version tracking.
- Updated `README.md` with architecture overview and current status.

---

## [1.1.0] — 2026-03-28

### ♻️ Responsive Overhaul
- **Header alignment** — Unified desktop nav and hamburger menu to `lg` (1024px) breakpoint.
- **Hero section** — Updated `WovenLightHero` to use `100dvh` for Safari compatibility.
- **Terminal window** — Granular responsive padding (`p-2 sm:p-3 md:p-4 lg:p-6`).
- **Grids** — Optimized `ProofStrip` and `QuickRecruiterSummary` for mobile-first transitions.

### ⚡ Performance
- **Code splitting** — Dynamically imported `WovenLightHero` (Three.js) with skeleton loader.
- **Modularization** — Extracted `ProofStrip`, `QuickRecruiterSummary`, and `ContactSection` from monolithic `page.tsx`, reducing file by ~70%.

### 🧹 Cleanup
- Added semantic `<footer>` element.
- Removed unused exports and fixed formatting inconsistencies.

---

## [1.0.0] — 2026-03-27

### 🚀 Initial Release
- Full portfolio app with Next.js 16 (App Router), TailwindCSS v4, Framer Motion.
- **WovenLightHero** — Three.js particle field with scroll-expanding animation.
- **Glass Terminal UI** — Glassmorphic content shell with OKLCH design tokens.
- **BentoGrid Project Showcase** — 6 featured projects with impact metrics.
- **ExperienceGlobe** — Interactive COBE globe with career path arcs (Chicago → Iowa City → Phoenix).
- **GlowingAiAssistant (Michael-Bot)** — AI chatbot trained on portfolio data with guided prompts.
- **RandomCraftCocktail** — Cocktail generator easter egg demonstrating hospitality background.
- **ROI Calculator** — Interactive savings estimator for recruiters.
- **Live Data Dashboard** — Recharts visualization of project financial impact.
- **Web CV** — Comprehensive `/cv` page with skills, experience, recommendations.
- **Vercel CI/CD** — GitHub-to-Vercel deployment pipeline.
