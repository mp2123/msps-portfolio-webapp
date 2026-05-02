# Supabase Database Ownership

Supabase project `tozhwycrkpwvrmveykbm` is currently shared by the portfolio, bartender/mixology, and life-insurance apps.

## Current App Ownership

| App | Prisma schema | Known owned models |
| --- | --- | --- |
| Portfolio | `apps/portfolio-app/prisma/schema.prisma` | `User`, `Question`, `Score`, `PortfolioEvent`, `AssistantCacheEntry`, `InvisibleInkMessage`, `CraftCocktail` |
| Bartender / Mixology | `apps/mixology-app/prisma/schema.prisma` | `User`, `Favorite`, `Recipe`, `AffiliateLink` |
| Life Insurance | `apps/insurance-app/prisma/schema.prisma` | `User`, `Question`, `Score` |

## Live Database Inventory

Read-only inventories on 2026-05-02 found these app-owned `public` tables in Supabase:

| Table | RLS | Policies | Current owner signal |
| --- | --- | ---: | --- |
| `public.User` | Enabled | 3 | Mixology auth/profile policies |
| `public.Favorite` | Enabled | 1 | Mixology favorites |
| `public.Recipe` | Enabled | 1 | Mixology recipe catalog |
| `public.AffiliateLink` | Enabled | 1 | Mixology affiliate catalog |

The portfolio and life-insurance Prisma models were not present in the live `public` schema during this inventory. Treat those app schemas as local/contracts until a migration plan intentionally deploys them.

Additional read-only security checks on 2026-05-02 found:

- No public views.
- No public `security definer` functions.
- No extensions installed in the exposed `public` schema.
- No browser/client code references to service-role or secret Supabase keys.

## Rules

- Treat production database changes as migration-only changes. Do not rely on ad hoc `db push` against production.
- Before changing schema boundaries, export or back up the current database and inventory existing tables, policies, indexes, and migrations.
- Enable RLS on every table exposed through Supabase APIs, then add policies that match the app's actual access model.
- Never expose service-role or secret keys to browser code. `NEXT_PUBLIC_*` values must be safe client-side values.
- Long-term target: move from overlapping `public` tables toward explicit app boundaries, either separate Postgres schemas in this project or separate Supabase projects if release cycles diverge.

## Connector Status

Supabase project-level advisor tools were not exposed in the May 2026 Codex session. A connector authorization retry also failed with `OAuth authorization request does not exist`. Re-run Supabase security and performance advisors after refreshing Supabase auth from a fresh connector prompt.
