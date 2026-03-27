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
- `ROI calculator`
  - `src/components/ui/roi-calculator.tsx`
  - Classification: reusable-ish portfolio feature
- `Projects`
  - `src/components/ui/bento-grid.tsx`
  - `src/components/ui/live-data-chart.tsx`
  - Classification: reusable shell + portfolio-specific data/content
- `Skills`
  - `src/components/ui/skills-matrix.tsx`
  - Classification: reusable presentation component
- `Artifacts`
  - `src/app/page.tsx` (`ArtifactGallery`)
  - Classification: portfolio-only section composition
- `Advantage`
  - `src/components/portfolio/sections/hospitality-story.tsx`
  - Uses `src/components/portfolio/graphics/interactive-orb.tsx`
  - Classification: portfolio-only section + portfolio graphic
- `Experience`
  - `src/components/portfolio/graphics/experience-globe.tsx`
  - `src/components/ui/radial-orbital-timeline.tsx`
  - Classification: portfolio-specific feature components
- `Recommendations`
  - `src/components/ui/recommendations.tsx`
  - Classification: reusable presentation component with portfolio data
- `Contact`
  - `src/app/page.tsx` (`ContactSection`)
  - `src/components/portfolio/invisible-ink-wall.tsx`
  - Classification: portfolio-only section composition + portfolio feature

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
- New portfolio-only graphics, canvas, or R3F pieces go in `src/components/portfolio/graphics`.
