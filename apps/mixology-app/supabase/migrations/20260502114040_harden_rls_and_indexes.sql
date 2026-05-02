-- Harden Supabase RLS policies and add indexes for foreign-key lookups.
-- This migration reconciles the original checked-in policy names with the
-- current live policy names so fresh databases and production converge.

-- User policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public."User";
DROP POLICY IF EXISTS "Users can update their own profile" ON public."User";
DROP POLICY IF EXISTS "Users can only see their own profile" ON public."User";
DROP POLICY IF EXISTS "Allow individual updates" ON public."User";
DROP POLICY IF EXISTS "Allow individual inserts" ON public."User";

CREATE POLICY "Users can only see their own profile"
ON public."User"
FOR SELECT
TO authenticated
USING (((select auth.uid())::text) = id);

CREATE POLICY "Allow individual inserts"
ON public."User"
FOR INSERT
TO authenticated
WITH CHECK (((select auth.uid())::text) = id);

CREATE POLICY "Allow individual updates"
ON public."User"
FOR UPDATE
TO authenticated
USING (((select auth.uid())::text) = id)
WITH CHECK (((select auth.uid())::text) = id);

-- Favorite policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON public."Favorite";
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public."Favorite";
DROP POLICY IF EXISTS "Users can update their own favorites" ON public."Favorite";
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public."Favorite";
DROP POLICY IF EXISTS "Users can only see their own favorites" ON public."Favorite";

CREATE POLICY "Users can only see their own favorites"
ON public."Favorite"
FOR SELECT
TO authenticated
USING (((select auth.uid())::text) = "userId");

CREATE POLICY "Users can insert their own favorites"
ON public."Favorite"
FOR INSERT
TO authenticated
WITH CHECK (((select auth.uid())::text) = "userId");

CREATE POLICY "Users can update their own favorites"
ON public."Favorite"
FOR UPDATE
TO authenticated
USING (((select auth.uid())::text) = "userId")
WITH CHECK (((select auth.uid())::text) = "userId");

CREATE POLICY "Users can delete their own favorites"
ON public."Favorite"
FOR DELETE
TO authenticated
USING (((select auth.uid())::text) = "userId");

-- Public read policies
DROP POLICY IF EXISTS "Anyone can view recipes" ON public."Recipe";
DROP POLICY IF EXISTS "Public Read Recipes" ON public."Recipe";
DROP POLICY IF EXISTS "Anyone can view affiliate links" ON public."AffiliateLink";
DROP POLICY IF EXISTS "Public Read Links" ON public."AffiliateLink";

CREATE POLICY "Public Read Recipes"
ON public."Recipe"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Public Read Links"
ON public."AffiliateLink"
FOR SELECT
TO public
USING (true);

-- Foreign-key indexes recommended by Supabase Performance Advisor.
CREATE INDEX IF NOT EXISTS "Favorite_userId_idx"
ON public."Favorite" ("userId");

CREATE INDEX IF NOT EXISTS "Favorite_recipeId_idx"
ON public."Favorite" ("recipeId");
