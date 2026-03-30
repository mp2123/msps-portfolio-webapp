# Portfolio Current State

Snapshot date: `2026-03-29`

This document is the fast maintainer summary for the current `portfolio-app` implementation after the route split, UI stabilization work, mobile audit, desktop audit closure, and proof-promotion pass.

## Proof Layer

The public proof layer is no longer placeholder-first.

Current implementation:

- `docs/project-fact-sheets.md` remains the human source of truth
- `src/content/project-evidence.ts` is the typed runtime projection of those fact sheets
- `source-material/*/02-sanitized/artifact.md` is the source of truth for generated proof-page markdown
- `src/content/artifacts.ts` is generated from sanitized markdown, not manually authored
- `/projects/[slug]` remains the canonical public proof page for each promoted project

Current first-wave promoted proof:

- `avnet-command-center`
- `gemini-codex-workflow`
- `ticket-routing-prediction`
- `tjix-net-sales-drivers`

Current second-wave promoted proof:

- `relational-database-design`
- `yelp-review-modeling`

Important nuance:

- `command-center-bi` is still primarily fact-sheet / sanitized-brief driven because no full raw artifact bundle has been added yet
- `ai-workflow-automation` uses the public Gemini/Codex docs repo plus local notes as the canonical proof source

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
- retrieval grounded in `project-evidence.ts`, project docs, artifact docs, and cross-project positioning docs
- exact published proof paths only; no invented URLs

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

## Proof Model

The public proof layer is now split into three levels:

- `docs/project-fact-sheets.md`
  Human-maintained canonical project facts and confidence framing.
- `src/content/project-evidence.ts`
  Typed runtime projection of the fact-sheet layer for role fit, impact, automation proof, comparisons, aliases, and public proof availability.
- `source-material/*/02-sanitized/artifact.md`
  Sanitized artifact source for generated deep-proof content in `src/content/artifacts.ts`.

Current promoted proof status:

- First-wave promoted proof:
  - Command Center BI Infrastructure
  - Gemini/Codex Workflow Automation
  - Ticket Reassignment Prediction
  - TJIX Net Sales Drivers
- Second-wave promoted proof:
  - Relational Database Design
  - Yelp Review Rating / Sentiment Modeling

Important nuance:

- most major projects now have real `01-raw` source material behind them
- `command-center-bi` is still primarily fact-sheet / resume / narrative-driven
- `ai-workflow-automation` is still note-driven plus a live public docs repo, not a full raw-asset drop

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
- typed project evidence layer for all seven major projects
- first-wave and second-wave proof promotion into the artifact vault and project-detail pages
- assistant retrieval/ranking hardening for role-fit, business-impact, automation-proof, and comparison questions

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
