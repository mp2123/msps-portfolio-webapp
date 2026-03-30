# Portfolio App

`portfolio-app` is the public recruiter-facing portfolio for Michael Panico inside the `MPs_Web-App_Ecosystem` monorepo.

It is intentionally built as an interactive web app rather than a static site:
- recruiter-first homepage with guided navigation
- dedicated project library
- web CV with deeper visual modules
- floating recruiter assistant
- analytics diagnostics surface
- local-only source-material intake system for future proof upgrades

## Current Routes

- `/`
  Recruiter briefing surface with the Woven Light hero, proof strip, project atlas, advantage story, experience preview, recommendations, and contact.
- `/projects`
  Equal-weight project library with the impact lab, translation-layer scanner, and artifact vault.
- `/projects/[slug]`
  Individual project detail pages.
- `/cv`
  Printable web CV plus deeper experience visuals, hospitality/advantage context, timeline/orbital systems visuals, and skills.
- `/analytics`
  Read-only diagnostics surface for assistant cache, analytics events, and invisible-ink activity.
- `/api/chat`
  Recruiter assistant route with layered caching.
- `/api/portfolio-events`
  Analytics event ingestion.
- `/api/invisible-wall`
  Hidden wall note ingestion and retrieval.
- `/api/random-cocktail`
  Random cocktail generator endpoint used by the hospitality section.

## Current Product Structure

### Shared shell

- `src/components/portfolio/public-page-shell.tsx`
  Shared public wrapper for the header, left rail, and floating assistant across `/`, `/projects`, `/cv`, and project detail pages.

### Homepage

- `src/app/page.tsx`
- `src/components/ui/woven-light-hero.tsx`
- `src/components/portfolio/sections/proof-strip.tsx`
- `src/components/portfolio/sections/quick-recruiter-summary.tsx`
- `src/components/portfolio/sections/project-atlas.tsx`
- `src/components/portfolio/sections/skills-snapshot.tsx`
- `src/components/portfolio/sections/hospitality-story.tsx`
- `src/components/portfolio/sections/experience-preview.tsx`
- `src/components/portfolio/sections/contact-section.tsx`

### Projects surface

- `src/app/projects/page.tsx`
- `src/components/portfolio/sections/projects-library.tsx`
- `src/components/portfolio/sections/project-impact-lab.tsx`
- `src/components/portfolio/sections/artifact-scanner.tsx`
- `src/components/portfolio/sections/artifact-gallery.tsx`

### CV surface

- `src/app/cv/page.tsx`
- `src/components/cv/web-cv.tsx`
- `src/components/cv/cv-deep-dive.tsx`
- `src/components/portfolio/graphics/experience-globe.tsx`
- `src/components/ui/radial-orbital-timeline.tsx`
- `src/components/ui/skills-matrix.tsx`

### Assistant and analytics

- `src/components/ui/glowing-ai-chat-assistant.tsx`
- `src/content/portfolio-assistant.ts`
- `src/lib/portfolio-analytics.ts`
- `src/app/analytics/page.tsx`

## Current Visual / Interaction Direction

- dark cinematic surfaces
- cyan/blue luminous accents
- orbital and systems-thinking visuals
- glassy shell framing
- subtle motion where it adds atmosphere
- shared floating assistant on all public pages

## Source Material Workflow

All future project-proof upgrades start in `source-material/`.

Working order:
1. Drop unsorted files into `source-material/_incoming/`.
2. Move originals into `01-raw`.
3. Create public-safe copies in `02-sanitized`.
4. Promote likely publishable candidates to `03-selected-assets`.
5. Capture provenance, impact, and publishing notes in `04-notes`.

Important rule:
- Nothing in `source-material/` should be treated as public-safe by default.

## Documentation Map

Start here when orienting yourself:

- `docs/README.md`
  Central guide to the app docs and where to look first.
- `docs/current-state.md`
  Fast implementation snapshot for the current route architecture and recent stabilization work.
- `docs/architecture-map.md`
  Routes, major systems, runtime stack, environment, and data flows.
- `docs/component-inventory.md`
  Current section/component ownership map.
- `docs/qa-checklist.md`
  Breakpoint and interaction verification checklist.
- `docs/source-material-map.md`
  Intake buckets mapped to live site surfaces.
- `docs/project-fact-sheets.md`
  Canonical derived project facts for public-safe copy and assistant behavior.
- `CHANGELOG.md`
  Versioned history of recent implementation passes.

## Local Development

From `apps/portfolio-app`:

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
```

## Working Notes

- The app currently uses `WovenLightHero`, not the older scroll-expansion hero, on the homepage.
- The assistant is mounted via the shared public shell to prevent route drift.
- `/analytics` is the active diagnostics surface; older references to `/internal/assistant-debug` are historical and should not be treated as current.
- `source-material/` is local-only working state. Public portfolio content should always be derived and sanitized first.
