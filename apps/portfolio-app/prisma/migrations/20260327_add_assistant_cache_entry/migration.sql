CREATE TABLE IF NOT EXISTS "AssistantCacheEntry" (
  "id" text PRIMARY KEY,
  "cacheKey" text NOT NULL UNIQUE,
  "strategy" text NOT NULL,
  "intent" text,
  "normalizedQuestion" text,
  "responseText" text NOT NULL,
  "provider" text NOT NULL,
  "modelId" text NOT NULL,
  "contentVersion" text NOT NULL,
  "hitCount" integer NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "expiresAt" timestamptz NOT NULL,
  "lastHitAt" timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "AssistantCacheEntry_expiresAt_idx"
ON "AssistantCacheEntry" ("expiresAt");

CREATE INDEX IF NOT EXISTS "AssistantCacheEntry_intent_expiresAt_idx"
ON "AssistantCacheEntry" ("intent", "expiresAt");

CREATE INDEX IF NOT EXISTS "AssistantCacheEntry_createdAt_idx"
ON "AssistantCacheEntry" ("createdAt");
