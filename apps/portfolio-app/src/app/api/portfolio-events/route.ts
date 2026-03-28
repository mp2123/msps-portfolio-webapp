import { NextResponse } from "next/server";
import { Pool } from "pg";

import type { PortfolioEventPayload, PortfolioEventType } from "@/lib/portfolio-analytics";
import { buildRequestMetadata } from "@/lib/request-context";

export const runtime = "nodejs";

type PortfolioEventRequest = PortfolioEventPayload & {
  sessionId?: string;
};

const ALLOWED_EVENT_TYPES = new Set<PortfolioEventType>([
  "resume_download",
  "contact_click",
  "section_navigation",
  "section_impression",
  "section_active",
  "assistant_prompt_click",
  "assistant_message_submit",
  "assistant_open",
  "assistant_close",
  "search_open",
  "search_select",
  "globe_stage_select",
  "globe_drag",
  "project_action_click",
  "cocktail_spin",
  "cocktail_recipe_view",
  "wall_open",
  "wall_submit",
  "wall_reveal",
  "print_cv_open",
]);

let pool: Pool | null = null;
let tableEnsured = false;

function getConnectionString() {
  return process.env.DATABASE_URL?.trim() || process.env.DIRECT_URL?.trim() || "";
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error("Missing analytics database connection string.");
    }

    const isLocalDatabase =
      connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

    pool = new Pool({
      connectionString,
      ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
    });
  }

  return pool;
}

function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function ensurePortfolioEventsTable() {
  if (tableEnsured) {
    return;
  }

  await getPool().query(`
    CREATE TABLE IF NOT EXISTS "PortfolioEvent" (
      "id" text PRIMARY KEY,
      "eventType" text NOT NULL,
      "label" text,
      "href" text,
      "section" text,
      "sessionId" text NOT NULL,
      "metadata" jsonb,
      "createdAt" timestamptz NOT NULL DEFAULT NOW()
    )
  `);

  await getPool().query(`
    CREATE INDEX IF NOT EXISTS "PortfolioEvent_eventType_createdAt_idx"
    ON "PortfolioEvent" ("eventType", "createdAt")
  `);

  await getPool().query(`
    CREATE INDEX IF NOT EXISTS "PortfolioEvent_sessionId_createdAt_idx"
    ON "PortfolioEvent" ("sessionId", "createdAt")
  `);

  tableEnsured = true;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PortfolioEventRequest;

    if (!body.sessionId || !ALLOWED_EVENT_TYPES.has(body.eventType)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const metadata =
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? {
            ...body.metadata,
            ...buildRequestMetadata(req),
          }
        : buildRequestMetadata(req);

    await ensurePortfolioEventsTable();

    await getPool().query(
      `
        INSERT INTO "PortfolioEvent" ("id", "eventType", "label", "href", "section", "sessionId", "metadata", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())
      `,
      [
        createEventId(),
        body.eventType,
        body.label ?? null,
        body.href ?? null,
        body.section ?? null,
        body.sessionId,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[portfolio-events] analytics skipped:", error);
    }

    // Do not let analytics failures break the public site.
    return NextResponse.json({ ok: false, skipped: true }, { status: 202 });
  }
}
