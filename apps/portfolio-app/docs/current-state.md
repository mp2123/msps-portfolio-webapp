# Portfolio Current State

Snapshot date: `2026-03-29`

This document is the fast maintainer summary for the current `portfolio-app` implementation after the route split, UI stabilization work, mobile audit, and desktop audit closure.

## Route Model

- `/`
  Recruiter-first homepage.
- `/projects`
  Deeper project library and proof surfaces.
- `/projects/[slug]`
  Individual project detail pages inside the same public shell.
- `/cv`
  Web CV plus deeper visual modules.
- `/analytics`
  Internal diagnostics for assistant cache and portfolio analytics health.

## Shared Public Shell

The following public routes share the same shell:

- `/`
- `/projects`
- `/projects/[slug]`
- `/cv`

Shared shell responsibilities:

- route-aware header
- desktop left rail
- search / jump command surface
- floating recruiter assistant

Implementation:

- `src/components/portfolio/public-page-shell.tsx`

## Homepage Composition

The homepage is intentionally shorter and more recruiter-focused than the older one-page archive version.

Current flow:

1. `WovenLightHero`
2. proof handoff via `TerminalWindow`
3. `ProofStrip`
4. `QuickRecruiterSummary`
5. `ProjectAtlas`
6. `SkillsSnapshot`
7. `HospitalityStory`
8. `ExperiencePreview`
9. recommendations
10. contact

## Projects Surface

`/projects` is the canonical depth page for equal-weight project treatment.

Current core modules:

- projects hero
- `ProjectsLibrary`
- `ProjectImpactLab`
- `ArtifactScanner`
- `ArtifactGallery`

## CV Surface

`/cv` keeps the heavier visual layer that no longer belongs on the homepage.

Current core modules:

- `WebCv`
- `CvDeepDive`
- `ExperienceGlobe`
- `RadialOrbitalTimeline`
- hospitality / advantage section
- capabilities matrix

## Assistant

The recruiter assistant is mounted through the shared public shell so it remains available on:

- `/`
- `/projects`
- `/cv`

Current expectations:

- visible floating launcher on desktop and mobile
- recruiter-focused prompts
- typed questions
- route-consistent behavior
- analytics events for open/use flows

## Source Material Workflow

Public content remains derived from local-only intake material.

Primary rule:

- raw files stay in `source-material/`
- only sanitized/public-safe assets graduate into tracked portfolio content

Default intake flow:

1. drop new files into `_incoming`
2. sort into the right project bucket
3. keep originals in `01-raw`
4. create sanitized candidates in `02-sanitized`
5. promote strongest publishable artifacts into `03-selected-assets`
6. update notes/fact sheets before public copy changes

## Recent Stabilization Status

Recently completed:

- recruiter-first homepage plus dedicated `/projects`
- shared public shell across `/`, `/projects`, and `/cv`
- `WovenLightHero` replacing the older scroll-expansion hero
- assistant mounted consistently through the shared shell
- mobile optimization pass recorded in `CHANGELOG.md`
- desktop audit closure recorded in `CHANGELOG.md`
- analytics table hardening
- geo label decoding in analytics
- artifact vault desktop rebalance

## What Should Be True Right Now

- homepage is recruiter-first rather than archive-first
- `/projects` is the main project-depth route
- `/cv` carries the heavier visual modules
- `/analytics` is the active diagnostics route
- docs no longer treat `/internal/assistant-debug` as current
- docs no longer describe `scroll-expansion-hero.tsx` as the active homepage hero

## Canonical Maintainer Docs

- `README.md`
- `docs/README.md`
- `docs/architecture-map.md`
- `docs/component-inventory.md`
- `docs/qa-checklist.md`
- `CHANGELOG.md`
