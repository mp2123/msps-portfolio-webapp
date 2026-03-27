import { NextResponse } from "next/server";

import {
  INVISIBLE_WALL_COOLDOWN_MS,
  INVISIBLE_WALL_FETCH_LIMIT,
  INVISIBLE_WALL_MAX_POSTS_PER_WINDOW,
  INVISIBLE_WALL_WINDOW_MS,
  isInvisibleInkMessageAllowed,
  normalizeInvisibleInkAlias,
  normalizeInvisibleInkMessage,
} from "@/lib/invisible-wall";
import { getPrismaClient } from "@/lib/prisma";
import { buildRequestMetadata } from "@/lib/request-context";

export const runtime = "nodejs";

type InvisibleInkWallRequest = {
  sessionId?: string;
  alias?: string;
  message?: string;
};

const inMemoryCooldowns = new Map<string, number>();

const getConnectionAvailable = () =>
  Boolean(process.env.DATABASE_URL?.trim() || process.env.DIRECT_URL?.trim());

const ensureInvisibleInkTable = async () => {
  const prisma = getPrismaClient();
  if (!prisma) {
    throw new Error("Missing invisible wall database connection.");
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "InvisibleInkMessage" (
      "id" text PRIMARY KEY,
      "sessionId" text NOT NULL,
      "visitorHash" text,
      "alias" text,
      "message" text NOT NULL,
      "createdFromCity" text,
      "createdFromRegion" text,
      "createdFromCountry" text,
      "createdAt" timestamptz NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "InvisibleInkMessage_createdAt_idx"
    ON "InvisibleInkMessage" ("createdAt")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "InvisibleInkMessage_sessionId_createdAt_idx"
    ON "InvisibleInkMessage" ("sessionId", "createdAt")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "InvisibleInkMessage_visitorHash_createdAt_idx"
    ON "InvisibleInkMessage" ("visitorHash", "createdAt")
  `);
};

const createResponse = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status });

export async function GET() {
  if (!getConnectionAvailable()) {
    return createResponse({ ok: false, messages: [] }, 200);
  }

  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return createResponse({ ok: false, messages: [] }, 200);
    }

    await ensureInvisibleInkTable();

    const rows = await prisma.invisibleInkMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: INVISIBLE_WALL_FETCH_LIMIT,
      select: {
        id: true,
        alias: true,
        message: true,
        createdAt: true,
      },
    });

    return createResponse({
      ok: true,
      messages: rows.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[invisible-wall] read failed:", error);
    }

    return createResponse({ ok: false, messages: [] }, 200);
  }
}

export async function POST(req: Request) {
  if (!getConnectionAvailable()) {
    return createResponse({ ok: false, message: "wall unavailable" }, 503);
  }

  try {
    const body = (await req.json()) as InvisibleInkWallRequest;
    const sessionId = body.sessionId?.trim();
    const alias = normalizeInvisibleInkAlias(body.alias ?? "");
    const message = normalizeInvisibleInkMessage(body.message ?? "");

    if (!sessionId || !message) {
      return createResponse({ ok: false, message: "missing required fields" }, 400);
    }

    if (!isInvisibleInkMessageAllowed(message) || (alias && !isInvisibleInkMessageAllowed(alias))) {
      return createResponse(
        { ok: false, message: "Please keep wall messages short, plain, and link-free." },
        400
      );
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return createResponse({ ok: false, message: "wall unavailable" }, 503);
    }

    await ensureInvisibleInkTable();

    const requestMetadata = buildRequestMetadata(req);
    const rateKey = requestMetadata.visitorHash ?? sessionId;
    const now = Date.now();
    const lastSeen = inMemoryCooldowns.get(rateKey) ?? 0;

    if (now - lastSeen < INVISIBLE_WALL_COOLDOWN_MS) {
      return createResponse(
        { ok: false, message: "Invisible ink dries slowly. Try again in a minute." },
        429
      );
    }

    const since = new Date(now - INVISIBLE_WALL_WINDOW_MS);
    const recentMessages = await prisma.invisibleInkMessage.findMany({
      where: {
        createdAt: { gte: since },
        OR: [
          { sessionId },
          ...(requestMetadata.visitorHash
            ? [{ visitorHash: requestMetadata.visitorHash }]
            : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      take: INVISIBLE_WALL_MAX_POSTS_PER_WINDOW,
      select: {
        id: true,
        createdAt: true,
      },
    });

    const latestMessage = recentMessages[0];
    if (latestMessage && now - latestMessage.createdAt.getTime() < INVISIBLE_WALL_COOLDOWN_MS) {
      return createResponse(
        { ok: false, message: "Invisible ink dries slowly. Try again in a minute." },
        429
      );
    }

    if (recentMessages.length >= INVISIBLE_WALL_MAX_POSTS_PER_WINDOW) {
      return createResponse(
        { ok: false, message: "Too much ink at once. Try again later." },
        429
      );
    }

    const created = await prisma.invisibleInkMessage.create({
      data: {
        sessionId,
        visitorHash: requestMetadata.visitorHash,
        alias: alias || null,
        message,
        createdFromCity: requestMetadata.requestCity,
        createdFromRegion: requestMetadata.requestRegion,
        createdFromCountry: requestMetadata.requestCountry,
      },
      select: {
        id: true,
        alias: true,
        message: true,
        createdAt: true,
      },
    });

    inMemoryCooldowns.set(rateKey, now);

    return createResponse({
      ok: true,
      message: {
        ...created,
        createdAt: created.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[invisible-wall] write failed:", error);
    }

    return createResponse({ ok: false, message: "Unable to write invisible ink right now." }, 500);
  }
}
