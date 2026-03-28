import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { EXAMPLE_CRAFT_COCKTAILS, type CraftCocktailSeed } from "@/content/craft-cocktails";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "nodejs";

const getConnectionAvailable = () =>
  Boolean(process.env.DATABASE_URL?.trim() || process.env.DIRECT_URL?.trim());

const ensureCraftCocktailTable = async () => {
  const prisma = getPrismaClient();
  if (!prisma) {
    throw new Error("Missing cocktail database connection.");
  }

  await prisma.$executeRawUnsafe(`
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
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "CraftCocktail_name_idx"
    ON "CraftCocktail" ("name")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "CraftCocktail_createdAt_idx"
    ON "CraftCocktail" ("createdAt")
  `);
};

const createSeedPayload = (cocktail: CraftCocktailSeed, source: "database" | "seed") => ({
  ...cocktail,
  garnish: cocktail.garnish ?? null,
  notes: cocktail.notes ?? null,
  source,
});

const getRandomSeedCocktail = () =>
  EXAMPLE_CRAFT_COCKTAILS[Math.floor(Math.random() * EXAMPLE_CRAFT_COCKTAILS.length)];

const seedCocktailsIfNeeded = async () => {
  const prisma = getPrismaClient();
  if (!prisma) {
    return;
  }

  const count = await prisma.craftCocktail.count();
  if (count > 0) {
    return;
  }

  await prisma.craftCocktail.createMany({
    data: EXAMPLE_CRAFT_COCKTAILS.map((cocktail) => ({
      slug: cocktail.slug,
      name: cocktail.name,
      style: cocktail.style,
      spiritBase: cocktail.spiritBase,
      glassware: cocktail.glassware,
      garnish: cocktail.garnish ?? null,
      shortDescription: cocktail.shortDescription,
      imageUrl: cocktail.imageUrl,
      ingredients: cocktail.ingredients as Prisma.InputJsonValue,
      method: cocktail.method as Prisma.InputJsonValue,
      notes: cocktail.notes ?? null,
    })),
    skipDuplicates: true,
  });
};

export async function GET() {
  if (!getConnectionAvailable()) {
    return NextResponse.json({
      ok: true,
      cocktail: createSeedPayload(getRandomSeedCocktail(), "seed"),
    });
  }

  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json({
        ok: true,
        cocktail: createSeedPayload(getRandomSeedCocktail(), "seed"),
      });
    }

    await ensureCraftCocktailTable();
    await seedCocktailsIfNeeded();

    const total = await prisma.craftCocktail.count();
    if (total <= 0) {
      return NextResponse.json({
        ok: true,
        cocktail: createSeedPayload(getRandomSeedCocktail(), "seed"),
      });
    }

    const randomIndex = Math.floor(Math.random() * total);
    const [cocktail] = await prisma.craftCocktail.findMany({
      take: 1,
      skip: randomIndex,
      orderBy: { createdAt: "asc" },
    });

    if (!cocktail) {
      return NextResponse.json({
        ok: true,
        cocktail: createSeedPayload(getRandomSeedCocktail(), "seed"),
      });
    }

    return NextResponse.json({
      ok: true,
      cocktail: {
        slug: cocktail.slug,
        name: cocktail.name,
        style: cocktail.style,
        spiritBase: cocktail.spiritBase,
        glassware: cocktail.glassware,
        garnish: cocktail.garnish,
        shortDescription: cocktail.shortDescription,
        imageUrl: cocktail.imageUrl,
        ingredients: Array.isArray(cocktail.ingredients) ? cocktail.ingredients : [],
        method: Array.isArray(cocktail.method) ? cocktail.method : [],
        notes: cocktail.notes,
        source: "database",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[random-cocktail] fallback to seed:", error);
    }

    return NextResponse.json({
      ok: true,
      cocktail: createSeedPayload(getRandomSeedCocktail(), "seed"),
    });
  }
}
