# Deployment and Environment Map

This file is the source-of-truth checklist for the four production-facing web apps in this workspace.

## Vercel Projects

| App | Local path | GitHub repo | Vercel project | Root directory | Framework | Production branch | Public status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Portfolio | `apps/portfolio-app` | `mp2123/msps-portfolio-webapp` | `msps_portfolio_webapp` | `apps/portfolio-app` | Next.js | `main` | Public |
| Bartender / Mixology | `apps/mixology-app` | `mp2123/msps-portfolio-webapp` | `bartender_app` | `apps/mixology-app` | Next.js | `main` | Public |
| Life Insurance | `apps/insurance-app` | `mp2123/msps-portfolio-webapp` | `life-insurance-app` | `apps/insurance-app` | Next.js | `main` | Public |
| OSU Equivalency | `Interactive_Dashboard` | `mp2123/osu-equivalency-engine` | `osu-equivalency-engine` | `Interactive_Dashboard` | Static | `main` | Public |

## Runtime Baseline

- Vercel is configured for Node `24.x` on the Next.js projects.
- Each Next.js app has a local `.nvmrc` and `package.json#engines.node` aligned to Node `24.x`.
- Keep app-level environment variables in Vercel. Do not commit real `.env` files.

## Current Hardening Status

- Portfolio metadata resolves social images against `https://www.michaelspanico.com` unless `NEXT_PUBLIC_SITE_URL` intentionally overrides it.
- Bartender, life-insurance, and portfolio are on green production deployments from `main`.
- The GitHub Actions matrix runs `npm ci`, `npm run lint`, and `npm run build` for the three Next.js apps.
- `npm ci` reports `found 0 vulnerabilities` for portfolio, bartender/mixology, and life-insurance after the May 2026 dependency hardening pass.
- React is pinned to the patched 19.2 line and the Three.js stack is deduped through `@react-three/fiber` plus one app-level `three` package.
- The unused Spline runtime was removed from the Next.js apps to reduce client bundle weight and avoid loading two Three.js runtimes on the life-insurance home page.
- Source and seed-data Unsplash image URLs were checked on 2026-05-02; every referenced Unsplash URL returned HTTP 200.
- The bartender Vercel Preview environment has project-level `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Keep database URLs out of Preview until a separate preview database or schema boundary is intentionally configured.
- Supabase Security Advisor was rerun on 2026-05-02 after RLS hardening and reports no findings.
- Supabase Performance Advisor no longer reports the original missing `Favorite` foreign-key indexes or RLS initplan warnings after migration `20260502114040_harden_rls_and_indexes.sql`.
- Supabase Performance Advisor reports the two new `Favorite` indexes as unused immediately after creation; this is expected while the live `User` and `Favorite` tables have no rows and should be rechecked after authenticated bartender usage creates favorite rows.

## Preview Verification

On 2026-05-02, local build fixes were deployed through Vercel preview deployments:

| App | Preview URL | Deployment ID | Status |
| --- | --- | --- | --- |
| Bartender / Mixology | `https://bartender-p5sy2pqtl-michael-panicos-projects.vercel.app` | `dpl_FeRqD5XHgHkqx8kvTf93RUydHfUz` | `READY` |
| Life Insurance | `https://life-insurance-2px3m8y62-michael-panicos-projects.vercel.app` | `dpl_7UkeG8V66MK8Fv6yXhmKfb2E266v` | `READY` |

Notes:

- The original bartender preview used deployment-scoped placeholder Supabase values before project-level Preview env vars were fixed.
- On 2026-05-02, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were copied from Production into the bartender Preview environment through the Vercel REST API because the CLI repeatedly returned `git_branch_required`.
- The CLI preview deploys were run from the ecosystem repository root so Vercel would honor each project's configured Root Directory. Prefer GitHub-generated previews now that CI and Preview public env coverage are in place.
