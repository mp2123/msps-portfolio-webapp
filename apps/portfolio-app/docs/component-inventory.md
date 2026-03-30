# Portfolio Component Inventory

This inventory maps the current route surfaces to their canonical implementation files and clarifies which files are reusable primitives, portfolio-only sections, or compatibility wrappers.

## Homepage Sections

- `Hero`
  - `src/components/ui/woven-light-hero.tsx`
  - Classification: portfolio shell primitive
- `Proof strip`
  - `src/components/portfolio/sections/proof-strip.tsx`
  - Classification: portfolio-only section composition
- `Quick recruiter summary`
  - `src/components/portfolio/sections/quick-recruiter-summary.tsx`
  - Uses `src/components/portfolio/graphics/spiral-signal.tsx`
  - Classification: portfolio-only section composition + portfolio graphic
- `Project atlas`
  - `src/components/portfolio/sections/project-atlas.tsx`
  - Classification: recruiter briefing surface
- `Skills`
  - `src/components/portfolio/sections/skills-snapshot.tsx`
  - Classification: compact portfolio summary surface
- `Advantage / hospitality crossover`
  - `src/components/portfolio/sections/hospitality-story.tsx`
  - Classification: portfolio-only narrative section
- `Experience preview`
  - `src/components/portfolio/sections/experience-preview.tsx`
  - Classification: homepage preview surface
- `Recommendations`
  - `src/components/ui/recommendations.tsx`
  - Classification: reusable presentation component with portfolio data
- `Contact`
  - `src/components/portfolio/sections/contact-section.tsx`
  - Uses `src/components/portfolio/invisible-ink-wall.tsx`
  - Classification: portfolio-only section composition + hidden feature

## Projects Route Sections

- `Projects hero`
  - `src/app/projects/page.tsx`
  - Classification: route-level portfolio composition
- `Project library`
  - `src/components/portfolio/sections/projects-library.tsx`
  - Classification: equal-weight deep project surface
- `Impact lab`
  - `src/components/portfolio/sections/project-impact-lab.tsx`
  - Uses `src/components/ui/live-data-chart.tsx`
  - Uses `src/components/ui/roi-calculator.tsx`
  - Classification: portfolio-specific quantified proof surface
- `Translation layer`
  - `src/components/portfolio/sections/artifact-scanner.tsx`
  - Classification: portfolio-only interaction surface adapted from sibling-app inspiration
- `Artifact vault`
  - `src/components/portfolio/sections/artifact-gallery.tsx`
  - Classification: portfolio-only artifact surface

## CV Deep-Dive Sections

- `Web CV summary`
  - `src/components/cv/web-cv.tsx`
  - Classification: recruiter / print-oriented summary surface
- `Experience visuals`
  - `src/components/cv/cv-deep-dive.tsx`
  - Uses `src/components/portfolio/graphics/experience-globe.tsx`
  - Uses `src/components/ui/radial-orbital-timeline.tsx`
  - Uses `src/components/portfolio/sections/hospitality-story.tsx`
  - Uses `src/components/ui/skills-matrix.tsx`
  - Classification: deeper visual and narrative layer below the printable CV

## Persistent or Interactive Features

- `Shared public shell`
  - `src/components/portfolio/public-page-shell.tsx`
  - Uses `src/components/ui/header-1.tsx`
  - Uses `src/components/portfolio/side-section-nav.tsx`
  - Mounts `src/components/ui/glowing-ai-chat-assistant.tsx`
  - Classification: route-shell infrastructure for `/`, `/projects`, and `/cv`
- `Recruiter assistant`
  - `src/components/ui/glowing-ai-chat-assistant.tsx`
  - `src/app/api/chat/route.ts`
  - Classification: portfolio-specific product feature
- `Analytics diagnostics`
  - `src/app/analytics/page.tsx`
  - Classification: read-only internal diagnostics surface
- `Analytics tracking`
  - `src/lib/portfolio-analytics.ts`
  - `src/components/portfolio/section-analytics-tracker.tsx`
  - `src/app/api/portfolio-events/route.ts`
  - Classification: portfolio-specific instrumentation
- `Invisible Ink wall`
  - `src/components/portfolio/invisible-ink-wall.tsx`
  - `src/app/api/invisible-wall/route.ts`
  - `src/lib/invisible-wall.ts`
  - Classification: portfolio-specific easter egg + engagement feature
- `Random cocktail generator`
  - `src/components/portfolio/sections/random-craft-cocktail.tsx`
  - `src/app/api/random-cocktail/route.ts`
  - Classification: hospitality crossover feature

## Reusable UI Primitives

Keep these in `src/components/ui`:

- `badge.tsx`
- `button.tsx`
- `card.tsx`
- `dialog.tsx`
- `scroll-area.tsx`
- `input.tsx`
- `command.tsx`
- `menu-toggle-icon.tsx`

## Compatibility Wrappers

These files still exist to preserve old imports while the repo stays stable:

- `src/components/ui/spiral-signal.tsx`
- `src/components/ui/globe.tsx`
- `src/components/ui/experience-globe.tsx`
- `src/components/ui/hospitality-story.tsx`

Canonical rule:

- prefer `src/components/portfolio/graphics/*` for portfolio graphics
- prefer `src/components/portfolio/sections/*` for portfolio sections
- keep wrappers only for import stability

## Cleanup Guideline

- New reusable primitives go in `src/components/ui`.
- New recruiter-specific composites go in `src/components/portfolio/sections`.
- New portfolio-only graphics, canvas, or globe/orb modules go in `src/components/portfolio/graphics`.
- New content intake assets belong in `source-material/`, not `docs/` or `public/`, until they are selected and sanitized.
