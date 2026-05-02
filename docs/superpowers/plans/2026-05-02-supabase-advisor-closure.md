# Supabase Advisor Closure Execution

## Objective

Close the remaining Supabase advisor findings for project `tozhwycrkpwvrmveykbm`, keep the database change reproducible through a checked-in migration, verify the four-app ecosystem, then commit and push the final hardening pass.

## Pre-Change Findings

- Security Advisor reported `rls_policy_always_true` for `public.User` policy `Allow individual inserts` because it used `WITH CHECK true`.
- Performance Advisor reported missing covering indexes for `public.Favorite` foreign keys `Favorite_userId_fkey` and `Favorite_recipeId_fkey`.
- Performance Advisor reported `auth_rls_initplan` warnings for:
  - `public.User` policy `Users can only see their own profile`
  - `public.User` policy `Allow individual updates`
  - `public.Favorite` policy `Users can only see their own favorites`
- Read-only inventory found no live rows in `public.User` or `public.Favorite`, with 5 recipes and 6 affiliate links present.

## Changes Applied

- Added migration `apps/mixology-app/supabase/migrations/20260502114040_harden_rls_and_indexes.sql`.
- Recreated mixology owner policies with `(select auth.uid())::text` comparisons.
- Replaced unrestricted user insert policy with authenticated self-insert only.
- Added `Favorite_userId_idx` and `Favorite_recipeId_idx`.
- Preserved public read policies for `Recipe` and `AffiliateLink`.
- Added a server-side mixology profile upsert before creating favorites so authenticated favorite creation has a matching `User` row.

## Post-Change Verification

- Security Advisor reports no findings.
- Performance Advisor no longer reports the original missing foreign-key index findings.
- Performance Advisor no longer reports the original RLS initplan warnings.
- Performance Advisor now reports the two new `Favorite` indexes as unused, which is expected until the empty favorite table receives production traffic.

## Closeout Checklist

- Run local checks for portfolio, mixology, and insurance.
- Run the OSU static smoke check.
- Verify public URLs and browser routes after push.
- Commit and push only intended migration, code, and docs changes.
- Leave unrelated `gemini.md` changes out of the hardening commit.
