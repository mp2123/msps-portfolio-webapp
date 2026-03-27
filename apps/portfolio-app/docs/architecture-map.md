# Portfolio App Architecture Map

## What This App Is

This project is primarily a public portfolio website, but it uses web-app architecture.

Why it behaves like a web app:

- It has interactive client-side state and motion-heavy UI.
- It has server routes for AI chat and analytics event ingestion.
- It tracks visitor sessions in the browser.
- It is wired to PostgreSQL through Prisma and `pg`.

## Public Routes

- `/`
  The main recruiter-first portfolio experience.
- `/cv`
  A web CV / printable resume route.
- `/api/chat`
  Server route for the recruiter assistant. It calls Gemini, applies retry logic, and uses layered caching.
- `/api/portfolio-events`
  Server route that receives analytics-style portfolio events such as resume downloads, contact clicks, and assistant interactions.
- `/opengraph-image`
  Dynamic social image route.
- `/twitter-image`
  Dynamic social image route for Twitter/X previews.

## Major Component Groups

### Shell and page composition

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

These assemble the homepage, load major sections, and define global styling tokens and scroll behavior.

### Homepage experience

- `src/components/ui/header-1.tsx`
- `src/components/ui/scroll-expansion-hero.tsx`
- `src/components/ui/roi-calculator.tsx`
- `src/components/ui/bento-grid.tsx`
- `src/components/ui/skills-matrix.tsx`
- `src/components/ui/hospitality-story.tsx`
- `src/components/ui/experience-globe.tsx`
- `src/components/ui/radial-orbital-timeline.tsx`
- `src/components/ui/recommendations.tsx`
- `src/components/ui/glowing-ai-chat-assistant.tsx`

### CV experience

- `src/components/cv/web-cv.tsx`
- `src/components/cv/print-toolbar.tsx`

### Shared UI primitives

- `src/components/ui/button.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/scroll-area.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/command.tsx`

## Content and Configuration

- `src/content/portfolio.ts`
  Core portfolio content model: hero, proof metrics, projects, recruiter prompts, contact info, recommendations, and skills.
- `src/content/portfolio-assistant.ts`
  Assistant retrieval knowledge built from the portfolio content and recruiter prompts.
- `src/lib/portfolio-site.ts`
  Canonical site URL and metadata helpers.
- `src/lib/portfolio-navigation.ts`
  Shared section navigation and anchor offset helpers.

## Active Features

- Recruiter-first homepage with explicit section navigation.
- Scroll-based hero reveal with animated proof handoff.
- ROI calculator and business-impact proof modules.
- Project case-study grid and artifact slots.
- Recruiter assistant backed by `/api/chat`.
- Web CV route.
- Analytics event posting from the client for selected recruiter actions.

## Database-Backed Features

### Active now

- `PortfolioEvent`
  Stores analytics-style portfolio events received by `/api/portfolio-events`.

### Added in this phase

- `AssistantCacheEntry`
  Stores durable assistant cache entries so repeated prompts can be reused across users, cold starts, and separate serverless instances.

## Dormant or Future-Scaffolded Models

- `User`
- `Question`
- `Score`

These models exist in the Prisma schema but are not part of the active public portfolio flow. They appear to be leftovers or future scaffolding for a quiz or assessment feature.

## Runtime Stack

- TypeScript / JavaScript
- React 19
- Next.js App Router
- Tailwind CSS + global CSS
- Prisma + PostgreSQL
- `pg` for low-level Postgres access in analytics ingestion
- Gemini via the Vercel server-side `/api/chat` route

Python is not part of the public site runtime. It only appears in external project references and tooling.

## Environment Variables

### Site and deployment

- `NEXT_PUBLIC_SITE_URL`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `VERCEL_URL`

### AI providers

- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `OPENAI_API_KEY` (optional secondary provider only if configured)

### Database

- `DATABASE_URL`
- `DIRECT_URL`

## Assistant Cache Layers

- `L0 client cache`
  Session-scoped assistant cache in the browser for repeated requests in one visitor session.
- `L1 server memory cache`
  Process-local in-memory cache in `/api/chat` for warm-instance reuse.
- `L2 durable database cache`
  Shared Postgres-backed cache through `AssistantCacheEntry`.

This layered design is needed because a memory `Map` alone is not reliable on Vercel serverless. Different requests can land on different warm or cold instances.
