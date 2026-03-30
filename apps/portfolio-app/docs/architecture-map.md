# Portfolio App Architecture Map

## What This App Is

`portfolio-app` is the primary career-facing product in the repo.

It behaves like a web app because it combines:

- motion-heavy client-side UI
- route-aware shared shell navigation
- recruiter assistant behavior across multiple routes
- server routes for chat, analytics, hidden-wall messaging, and cocktails
- database-backed analytics and assistant caching

## Public Routes

- `/`
  Recruiter-first homepage.
- `/projects`
  Canonical project-depth route with equal-weight project treatment and proof surfaces.
- `/projects/[slug]`
  Individual project detail route.
- `/cv`
  Web CV plus the deeper visual layer.
- `/analytics`
  Read-only diagnostics surface for assistant cache and portfolio analytics health. Depending on environment, this may require `PORTFOLIO_DEBUG_TOKEN`.
- `/opengraph-image`
  Dynamic social image route.
- `/twitter-image`
  Dynamic social image route for Twitter/X previews.

## API Routes

- `/api/chat`
  Recruiter assistant route with layered caching and Gemini-backed responses.
- `/api/invisible-wall`
  Hidden "Invisible Ink" wall route with validation, sanitization, and cooldown behavior.
- `/api/portfolio-events`
  Analytics ingestion route for recruiter actions and app interactions.
- `/api/random-cocktail`
  Random cocktail generator route used by the hospitality section.

## Shared Shell

- `src/components/portfolio/public-page-shell.tsx`

This shell mounts:

- `src/components/ui/header-1.tsx`
- `src/components/portfolio/side-section-nav.tsx`
- `src/components/ui/glowing-ai-chat-assistant.tsx`

It is shared by:

- `src/app/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/cv/page.tsx`

## Route Composition

### Homepage

- `src/app/page.tsx`
- `src/components/ui/woven-light-hero.tsx`
- `src/components/ui/terminal-window.tsx`
- `src/components/portfolio/sections/proof-strip.tsx`
- `src/components/portfolio/sections/quick-recruiter-summary.tsx`
- `src/components/portfolio/sections/project-atlas.tsx`
- `src/components/portfolio/sections/skills-snapshot.tsx`
- `src/components/portfolio/sections/hospitality-story.tsx`
- `src/components/portfolio/sections/experience-preview.tsx`
- `src/components/portfolio/sections/contact-section.tsx`
- `src/components/ui/recommendations.tsx`

### Projects

- `src/app/projects/page.tsx`
- `src/components/portfolio/sections/projects-library.tsx`
- `src/components/portfolio/sections/project-impact-lab.tsx`
- `src/components/portfolio/sections/artifact-scanner.tsx`
- `src/components/portfolio/sections/artifact-gallery.tsx`

### CV

- `src/app/cv/page.tsx`
- `src/components/cv/web-cv.tsx`
- `src/components/cv/cv-deep-dive.tsx`
- `src/components/cv/print-toolbar.tsx`

## Graphics and Motion Modules

- `src/components/ui/woven-light-hero.tsx`
- `src/components/portfolio/graphics/spiral-signal.tsx`
- `src/components/portfolio/graphics/interactive-orb.tsx`
- `src/components/portfolio/graphics/experience-globe.tsx`
- `src/components/ui/radial-orbital-timeline.tsx`

Compatibility wrappers still exist in `src/components/ui` for some older imports, but canonical portfolio graphics now live under `src/components/portfolio/graphics`.

## Content and Configuration

- `src/content/portfolio.ts`
  Core content model for hero, proof, projects, recommendations, contact, and route copy.
- `src/content/portfolio-assistant.ts`
  Assistant-facing knowledge and recruiter prompt scaffolding.
- `src/content/craft-cocktails.ts`
  Seeded cocktail content.
- `src/lib/portfolio-site.ts`
  Canonical metadata and site URL helpers.
- `src/lib/portfolio-nav.ts`
  Route-aware navigation metadata for header, rail, and search surfaces.
- `src/lib/portfolio-analytics.ts`
  Client-side analytics instrumentation.
- `src/lib/request-context.ts`
  Privacy-safer request metadata helper with hashed visitor identity and coarse geo extraction.
- `src/lib/invisible-wall.ts`
  Hidden-wall sanitization and limit helpers.

## Active Features

- recruiter-first homepage with woven hero and proof handoff
- dedicated `/projects` library for equal-weight project depth
- impact lab and artifact vault on `/projects`
- translation-layer scanner with auto-scroll plus wheel-driven manual control
- `/cv` deep-dive route with globe, orbital timeline, hospitality/advantage modules, and skills matrix
- floating recruiter assistant mounted across all public routes
- hidden "Invisible Ink" wall in the contact section
- random cocktail generator in the hospitality section
- analytics diagnostics at `/analytics`
- client-side analytics events for recruiter actions, section navigation, assistant usage, globe usage, and hidden-wall interactions

## Database-Backed Features

### Active models

- `PortfolioEvent`
  Analytics events from `/api/portfolio-events`.
- `InvisibleInkMessage`
  Hidden wall notes with privacy-safe hashed visitor identity and coarse geo context.
- `AssistantCacheEntry`
  Durable assistant cache entries for cross-session reuse.
- `CraftCocktail`
  Cocktail persistence when the database is available, while the UI still keeps seeded fallback behavior.

### Dormant or future-scaffolded

- `User`
- `Question`
- `Score`

These are not part of the active public portfolio flow.

## Runtime Stack

- TypeScript
- React 19
- Next.js App Router
- Tailwind CSS
- Framer Motion
- Prisma + PostgreSQL
- `pg`
- Gemini via `/api/chat`

## Environment Variables

### Site and deployment

- `NEXT_PUBLIC_SITE_URL`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `VERCEL_URL`
- `PORTFOLIO_DEBUG_TOKEN`

### AI

- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `OPENAI_API_KEY` (optional / secondary)

### Database

- `DATABASE_URL`
- `DIRECT_URL` (legacy / optional; runtime uses `DATABASE_URL`)

## Source Material Workflow

`source-material/` is the local intake system for portfolio-proof upgrades.

Workflow:

1. Drop new material into `_incoming` or the correct project bucket.
2. Keep originals in `01-raw`.
3. Keep public-safe copies in `02-sanitized`.
4. Keep strongest publishable candidates in `03-selected-assets`.
5. Record provenance and publishing guidance in `04-notes`.
6. Update `docs/project-fact-sheets.md` before translating raw evidence into public content.

## Assistant Cache Layers

- `L0 client cache`
  Session-scoped browser cache.
- `L1 server memory cache`
  Warm-instance memory cache inside `/api/chat`.
- `L2 durable database cache`
  Shared Postgres-backed cache through `AssistantCacheEntry`.

## Privacy Notes

- Raw IPs are not stored in portfolio analytics or hidden-wall rows.
- The app derives a hashed `visitorHash` server-side for grouping and rate limiting.
- Geo data comes from coarse Vercel headers such as city, region, and country.
- Assistant response bodies are intentionally excluded from analytics and diagnostics displays.
