-- Enable RLS for all tables exposed to the client
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Recipe" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AffiliateLink" ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Policies for "User" table
-- -----------------------------------------------------------------------------
-- Allow authenticated users to view their own profile
CREATE POLICY "Users can view their own profile"
ON "User" FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile"
ON "User" FOR UPDATE
TO authenticated
USING (auth.uid()::text = id);

-- -----------------------------------------------------------------------------
-- Policies for "Favorite" table
-- -----------------------------------------------------------------------------
-- Allow authenticated users to view their own favorites
CREATE POLICY "Users can view their own favorites"
ON "Favorite" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Allow authenticated users to insert their own favorites
CREATE POLICY "Users can insert their own favorites"
ON "Favorite" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Allow authenticated users to update their own favorites
CREATE POLICY "Users can update their own favorites"
ON "Favorite" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId");

-- Allow authenticated users to delete their own favorites
CREATE POLICY "Users can delete their own favorites"
ON "Favorite" FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- -----------------------------------------------------------------------------
-- Policies for "Recipe" table
-- -----------------------------------------------------------------------------
-- Allow anyone to view recipes (publicly available)
CREATE POLICY "Anyone can view recipes"
ON "Recipe" FOR SELECT
TO public
USING (true);

-- Restrict insert/update/delete on Recipe (handled via admin panel or Prisma service role)
-- No policies created for INSERT, UPDATE, DELETE means they are blocked by default for public/anon.

-- -----------------------------------------------------------------------------
-- Policies for "AffiliateLink" table
-- -----------------------------------------------------------------------------
-- Allow anyone to view affiliate links (publicly available)
CREATE POLICY "Anyone can view affiliate links"
ON "AffiliateLink" FOR SELECT
TO public
USING (true);

-- Restrict insert/update/delete on AffiliateLink (handled via admin panel or Prisma service role)
-- No policies created for INSERT, UPDATE, DELETE means they are blocked by default for public/anon.
