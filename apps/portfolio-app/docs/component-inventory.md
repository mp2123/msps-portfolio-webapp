# Portfolio Component Inventory

This inventory maps the homepage experience to its implementation and notes whether a component is reusable or portfolio-specific.

## Homepage Sections

- `Hero`
  - `src/components/ui/scroll-expansion-hero.tsx`
  - Classification: portfolio shell primitive
- `Proof strip`
  - `src/app/page.tsx` (`ProofStrip`)
  - Classification: portfolio-only section composition
- `Quick recruiter summary`
  - `src/app/page.tsx` (`QuickRecruiterSummary`)
  - Uses `src/components/portfolio/graphics/spiral-signal.tsx`
  - Classification: portfolio-only section composition + portfolio graphic
- `Project atlas`
  - `src/components/portfolio/sections/project-atlas.tsx`
  - Classification: portfolio-only recruiter briefing surface
- `Skills`
  - `src/components/portfolio/sections/skills-snapshot.tsx`
  - Classification: compact portfolio-only summary surface
- `Advantage`
  - `src/components/portfolio/sections/advantage-preview.tsx`
  - Classification: portfolio-only summary section
- `Experience`
  - `src/components/portfolio/sections/experience-preview.tsx`
  - Classification: portfolio-only summary section
- `Recommendations`
  - `src/components/ui/recommendations.tsx`
  - Classification: reusable presentation component with portfolio data
- `Contact`
  - `src/app/page.tsx` (`ContactSection`)
  - `src/components/portfolio/invisible-ink-wall.tsx`
  - Classification: portfolio-only section composition + portfolio feature

## Projects Route Sections

- `Projects hero`
  - `src/app/projects/page.tsx`
  - Classification: route-level portfolio composition
- `Project library`
  - `src/components/portfolio/sections/projects-library.tsx`
  - Classification: portfolio-only deep project surface
- `Translation layer`
  - `src/components/portfolio/sections/artifact-scanner.tsx`
  - Classification: portfolio-only section composition adapted from an internal sibling-app pattern
- `Artifact vault`
  - `src/components/portfolio/sections/artifact-gallery.tsx`
  - Classification: portfolio-only section composition

## Persistent or Interactive Features

- `Recruiter assistant`
  - `src/components/ui/glowing-ai-chat-assistant.tsx`
  - `src/app/api/chat/route.ts`
  - Classification: portfolio-specific product feature
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

These currently re-export portfolio-specific implementations to avoid breaking imports while the repo is being cleaned up:

- `src/components/ui/spiral-signal.tsx`
- `src/components/ui/globe.tsx`
- `src/components/ui/experience-globe.tsx`
- `src/components/ui/hospitality-story.tsx`

## Cleanup Guideline

- New reusable primitives go in `src/components/ui`.
- New homepage sections or recruiter-specific composites go in `src/components/portfolio/sections`.
- Project-library sections and proof surfaces also live in `src/components/portfolio/sections`.
- New portfolio-only graphics, canvas, or R3F pieces go in `src/components/portfolio/graphics`.
- New content intake assets belong in `source-material/`, not `docs/` or `public/`, until they are selected and sanitized.
