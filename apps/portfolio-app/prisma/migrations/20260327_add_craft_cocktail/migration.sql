CREATE TABLE IF NOT EXISTS "CraftCocktail" (
  "id" text PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "style" text NOT NULL,
  "spiritBase" text NOT NULL,
  "glassware" text NOT NULL,
  "garnish" text,
  "shortDescription" text NOT NULL,
  "imageUrl" text NOT NULL,
  "ingredients" jsonb NOT NULL,
  "method" jsonb NOT NULL,
  "notes" text,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "CraftCocktail_name_idx"
ON "CraftCocktail" ("name");

CREATE INDEX IF NOT EXISTS "CraftCocktail_createdAt_idx"
ON "CraftCocktail" ("createdAt");
