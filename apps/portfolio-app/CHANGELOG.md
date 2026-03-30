# Changelog

All notable changes to the **Portfolio App** are documented here.

---

## [1.3.3] — 2026-03-29

### 🧾 Proof Promotion and Assistant Hardening
- **Typed project evidence layer added** — Introduced `src/content/project-evidence.ts` as the runtime projection of the fact-sheet layer for all seven major projects.
- **First-wave proof promotion completed** — Command Center BI, Gemini/Codex Workflow Automation, Ticket Reassignment Prediction, and TJIX Net Sales Drivers now surface project-specific proof cards instead of generic placeholder artifacts.
- **Second-wave proof promotion started** — Relational Database Design and Yelp Review Rating / Sentiment Modeling now have live project-specific artifact cards and sanitized project-page copy aligned with the fact-sheet layer.
- **Artifact model extended** — Added `publicationState` (`live`, `request-only`, `planned`) so the artifact vault and assistant can distinguish between public proof and recruiter-only disclosure paths.
- **Artifact vault reordered by proof readiness** — Live and request-only proof now leads the vault, while truly planned proof sinks to the bottom.
- **Artifact generator corrected** — Sanitized markdown in `source-material/*/02-sanitized/artifact.md` is now treated as the source of truth for generated runtime artifact content.
- **Assistant retrieval sharpened** — Added per-project evidence docs plus cross-project role-fit, business-impact, automation-proof, and comparison docs to improve recruiter-focused answers.
- **Assistant prompt style tightened** — Answers now bias toward recruiter-briefing tone, explicit proof availability, and exact published proof paths only.
- **Assistant cache invalidated for stronger answers** — Bumped the cache version so older, weaker assistant responses do not persist after the retrieval update.
- **Framer runtime regression fixed** — Removed `LazyMotion strict` after local browser QA exposed a client-side runtime issue in the shared shell flow.

---

## [1.3.2] — 2026-03-29

### 📚 Documentation and Repo Orientation Refresh
- **Root README rewritten** — Replaced the old scroll-expansion-era overview with a current map of routes, shared shell behavior, assistant/analytics surfaces, and source-material workflow.
- **Architecture docs synchronized** — Updated the architecture map to reflect the active routes (`/`, `/projects`, `/projects/[slug]`, `/cv`, `/analytics`), shared shell, Woven Light hero, current API surfaces, and active data models.
- **Component inventory corrected** — Re-mapped the homepage, projects, CV, diagnostics, and shared chrome to the current implementation files instead of outdated monolithic page references.
- **QA checklist refreshed** — Replaced stale references like `/internal/assistant-debug`, `CV companion`, and the old hero assumptions with the current verification flow.
- **Documentation index added** — Added a single index file so routes, features, verification, and intake workflow have an obvious entry point for future maintenance.

---

## [1.3.1] — 2026-03-29

### 🖥️ Desktop Audit Closure
- **Analytics geo labels decoded** — Vercel geo metadata is now safely decoded during analytics summary aggregation, so locations render as `San Jose, CA` instead of URL-encoded values.
- **Analytics tables hardened** — Wrapped all diagnostics tables in horizontal overflow shells with explicit inner min-widths to prevent brittle column collapse on narrower desktop widths.
- **Artifact vault desktop rebalance** — The projects artifact gallery now uses 3 columns at `xl` desktop widths while preserving the 2-column `lg` layout for smaller laptops.
- **Regression check retained** — Verified the Projects side-nav hover label does not collide with the hero at current desktop widths, so no nav change was needed in this pass.

---

## [1.3.0] — 2026-03-29

### 📱 Mobile Optimization — Comprehensive Audit & Fix (14 bugs)

#### Critical Layout Fixes
- **Mobile menu fully opaque** — Replaced `bg-background backdrop-blur-lg` with hardcoded `bg-[#0a0a0f]` to eliminate all content bleed-through from the DynamicSiteBackground.
- **Project badges stacked on mobile** — Status badges (`Live`, `sanitized`, `High confidence`) now stack below the title on small screens instead of crowding beside it. Grid breakpoint moved from `xl` to `lg`.
- **Cocktail dialog opaque** — Changed dialog bg from `bg-[#04070d]/95` to fully opaque `bg-[#04070d]` to prevent ghost text bleed-through.
- **AI button clearance** — Added `pb-24`/`pb-32` to homepage and projects page to prevent the floating AI assistant from overlapping page content.
- **Projects hero sizing** — Reduced h1 from `text-4xl` to `text-3xl sm:text-4xl` for mobile readability.

#### Responsive Component Fixes
- **Cocktail orbit scaled for mobile** — Orbit container reduced to `14rem` (from `20rem`) with radius `82px` (from `118px`) on mobile to prevent right-side clipping.
- **Cocktail image on mobile** — Added a compact `h-48` image header visible on mobile (previously `hidden md:block`).
- **Command dialog mobile layout** — Dialog uses near-full-screen positioning on mobile with `inset-3` and `top-[4.5rem]`. CommandList max-height increased to `50dvh` on mobile.
- **"Open Web CV" discoverable** — Added to `HOME_LINKS` so it appears in the Jump group of the search command on the homepage.
- **Prompt chips optimized** — Limited to 2 starter prompts on screens <400px to give more room to the message area.

#### Touch & Scroll Fixes
- **Chatbot touch scroll containment** — Added `touchstart`/`touchmove` event handlers alongside existing `wheel` handler to prevent iOS Safari scroll bleed. Body scroll locked when chat is open on mobile.
- **Viewport zoom lock** — Added `maximumScale: 1, userScalable: false` viewport export to prevent iOS pinch-zoom jank on input focus.

#### Analytics Access
- **Analytics 404 resolved** — Replaced `notFound()` with a graceful "Access requires debug token" message when the token is missing.

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
