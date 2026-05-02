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

## Advisor Remediation

Supabase Security Advisor and Performance Advisor were accessible on 2026-05-02 and were run against project `tozhwycrkpwvrmveykbm`.

Before remediation, the advisors reported:

- Security warning: `public.User` policy `Allow individual inserts` used `WITH CHECK true`.
- Performance info: `public.Favorite` foreign keys `Favorite_userId_fkey` and `Favorite_recipeId_fkey` had no covering indexes.
- Performance warnings: `public.User` and `public.Favorite` RLS policies called `auth.uid()` directly instead of using the Supabase-recommended `(select auth.uid())` initplan form.

Migration `apps/mixology-app/supabase/migrations/20260502114040_harden_rls_and_indexes.sql` remediates those findings by:

- Restricting `public.User` inserts to authenticated self-insert only: `((select auth.uid())::text) = id`.
- Recreating user and favorite owner policies with `(select auth.uid())::text`.
- Adding `Favorite_userId_idx` and `Favorite_recipeId_idx`.
- Preserving public `SELECT` policies for `Recipe` and `AffiliateLink`.

After remediation:

- Security Advisor reports no findings.
- Performance Advisor no longer reports the original unindexed foreign-key or RLS initplan findings.
- Performance Advisor reports the two new `Favorite` indexes as unused. This is expected immediately after creation because the `User` and `Favorite` tables were empty during the inventory; keep these indexes because they are the required covering indexes for the declared foreign keys.

## Current Live Policies

| Table | Policy | Command | Role | Access model |
| --- | --- | --- | --- | --- |
| `public.User` | `Users can only see their own profile` | `SELECT` | `authenticated` | Auth user id must match `User.id` |
| `public.User` | `Allow individual inserts` | `INSERT` | `authenticated` | Inserted `User.id` must match auth user id |
| `public.User` | `Allow individual updates` | `UPDATE` | `authenticated` | Existing and updated `User.id` must match auth user id |
| `public.Favorite` | `Users can only see their own favorites` | `SELECT` | `authenticated` | Auth user id must match `Favorite.userId` |
| `public.Favorite` | `Users can insert their own favorites` | `INSERT` | `authenticated` | Inserted `Favorite.userId` must match auth user id |
| `public.Favorite` | `Users can update their own favorites` | `UPDATE` | `authenticated` | Existing and updated `Favorite.userId` must match auth user id |
| `public.Favorite` | `Users can delete their own favorites` | `DELETE` | `authenticated` | Auth user id must match `Favorite.userId` |
| `public.Recipe` | `Public Read Recipes` | `SELECT` | `public` | Public recipe catalog read |
| `public.AffiliateLink` | `Public Read Links` | `SELECT` | `public` | Public affiliate catalog read |

## Rules

- Treat production database changes as migration-only changes. Do not rely on ad hoc `db push` against production.
- Before changing schema boundaries, export or back up the current database and inventory existing tables, policies, indexes, and migrations.
- Enable RLS on every table exposed through Supabase APIs, then add policies that match the app's actual access model.
- Never expose service-role or secret keys to browser code. `NEXT_PUBLIC_*` values must be safe client-side values.
- Long-term target: move from overlapping `public` tables toward explicit app boundaries, either separate Postgres schemas in this project or separate Supabase projects if release cycles diverge.

## Connector Status

Supabase project-level advisor tools are accessible in the current Codex session. The earlier `OAuth authorization request does not exist` browser page was a stale one-time authorization flow and should not be retried; start a fresh connector authorization request if auth is needed again.
