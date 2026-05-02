# Deployment and Environment Map

This file is the source-of-truth checklist for the four production-facing web apps in this workspace.

## Vercel Projects

| App | Local path | GitHub repo | Vercel project | Root directory | Framework | Production branch | Public status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Portfolio | `apps/portfolio-app` | `mp2123/msps-portfolio-webapp` | `msps_portfolio_webapp` | `apps/portfolio-app` | Next.js | `main` | Public |
| Bartender / Mixology | `apps/mixology-app` | `mp2123/msps-portfolio-webapp` | `bartender_app` | `apps/mixology-app` | Next.js | `main` | Protected until green |
| Life Insurance | `apps/insurance-app` | `mp2123/msps-portfolio-webapp` | `life-insurance-app` | `apps/insurance-app` | Next.js | `main` | Protected until green |
| OSU Equivalency | `Interactive_Dashboard` | `mp2123/osu-equivalency-engine` | `osu-equivalency-engine` | `Interactive_Dashboard` | Static | `main` | Public |

## Runtime Baseline

- Vercel is configured for Node `24.x` on the Next.js projects.
- Each Next.js app has a local `.nvmrc` and `package.json#engines.node` aligned to Node `24.x`.
- Keep app-level environment variables in Vercel. Do not commit real `.env` files.

## Required Follow-up Checks

- Portfolio metadata must resolve social images against `https://www.michaelspanico.com` unless `NEXT_PUBLIC_SITE_URL` intentionally overrides it.
- Bartender and life-insurance should stay behind Vercel Deployment Protection until production builds are green.
- If bartender or life-insurance become public, confirm intentional domains and noindex/robots behavior before disabling protection.

## Preview Verification

On 2026-05-02, local build fixes were deployed through Vercel preview deployments:

| App | Preview URL | Deployment ID | Status |
| --- | --- | --- | --- |
| Bartender / Mixology | `https://bartender-p5sy2pqtl-michael-panicos-projects.vercel.app` | `dpl_FeRqD5XHgHkqx8kvTf93RUydHfUz` | `READY` |
| Life Insurance | `https://life-insurance-2px3m8y62-michael-panicos-projects.vercel.app` | `dpl_7UkeG8V66MK8Fv6yXhmKfb2E266v` | `READY` |

Notes:

- The bartender preview was deployed with deployment-scoped preview-only Supabase placeholder values because the Vercel Preview environment did not have `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured at project level.
- Before relying on GitHub preview deployments, configure preview-safe Vercel environment variables for bartender and use a separate preview database before adding preview `DATABASE_URL` or `DIRECT_URL`.
- The CLI preview deploys were run from the ecosystem repository root so Vercel would honor each project's configured Root Directory. Prefer GitHub-generated previews after these changes are committed and pushed.
