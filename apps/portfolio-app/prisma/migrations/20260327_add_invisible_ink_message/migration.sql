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
);

CREATE INDEX IF NOT EXISTS "InvisibleInkMessage_createdAt_idx"
ON "InvisibleInkMessage" ("createdAt");

CREATE INDEX IF NOT EXISTS "InvisibleInkMessage_sessionId_createdAt_idx"
ON "InvisibleInkMessage" ("sessionId", "createdAt");

CREATE INDEX IF NOT EXISTS "InvisibleInkMessage_visitorHash_createdAt_idx"
ON "InvisibleInkMessage" ("visitorHash", "createdAt");
