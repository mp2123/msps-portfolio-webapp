// notFound import removed — replaced with inline access-denied UI
import type { Metadata } from 'next';
import { ASSISTANT_CACHE_VERSION } from '@/lib/assistant-cache';
import { getPrismaClient } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Analytics',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParamValue = string | string[] | undefined;

type PageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>>;
};

type AssistantCacheSummary = {
  totalEntries: number;
  activeEntries: number;
  expiredEntries: number;
  totalHits: number;
  byStrategy: Array<{ label: string; count: number }>;
  byIntent: Array<{ label: string; count: number }>;
  recentEntries: Array<{
    id: string;
    strategy: string;
    intent: string | null;
    normalizedQuestion: string | null;
    provider: string;
    modelId: string;
    hitCount: number;
    createdAt: Date;
    lastHitAt: Date;
    expiresAt: Date;
  }>;
};

type PortfolioAnalyticsSummary = {
  totalEvents: number;
  recentEvents: number;
  uniqueSessions: number;
  byEventType: Array<{ label: string; count: number }>;
  bySection: Array<{ label: string; count: number }>;
  byLabel: Array<{ label: string; count: number }>;
  byHref: Array<{ label: string; count: number }>;
  byPath: Array<{ label: string; count: number }>;
  byBrowser: Array<{ label: string; count: number }>;
  byDevice: Array<{ label: string; count: number }>;
  byCity: Array<{ label: string; count: number }>;
  recentRows: Array<{
    id: string;
    eventType: string;
    label: string | null;
    href: string | null;
    section: string | null;
    sessionId: string;
    createdAt: Date;
    metadata: Record<string, unknown> | null;
  }>;
};

type InvisibleInkSummary = {
  totalMessages: number;
  recentMessages: number;
  recentEntries: Array<{
    id: string;
    alias: string | null;
    message: string;
    createdAt: Date;
    createdFromCity: string | null;
    createdFromRegion: string | null;
    createdFromCountry: string | null;
  }>;
};

type DebugSnapshot = {
  databaseConfigured: boolean;
  databaseReachable: boolean;
  generatedAt: Date;
  cacheVersion: string;
  debugTokenRequired: boolean;
  assistantCache: AssistantCacheSummary;
  analytics: PortfolioAnalyticsSummary;
  invisibleInk: InvisibleInkSummary;
  notes: string[];
};

const DEFAULT_ASSISTANT_CACHE_SUMMARY: AssistantCacheSummary = {
  totalEntries: 0,
  activeEntries: 0,
  expiredEntries: 0,
  totalHits: 0,
  byStrategy: [],
  byIntent: [],
  recentEntries: [],
};

const DEFAULT_ANALYTICS_SUMMARY: PortfolioAnalyticsSummary = {
  totalEvents: 0,
  recentEvents: 0,
  uniqueSessions: 0,
  byEventType: [],
  bySection: [],
  byLabel: [],
  byHref: [],
  byPath: [],
  byBrowser: [],
  byDevice: [],
  byCity: [],
  recentRows: [],
};

const DEFAULT_INVISIBLE_INK_SUMMARY: InvisibleInkSummary = {
  totalMessages: 0,
  recentMessages: 0,
  recentEntries: [],
};

const getSingleSearchParam = (value: SearchParamValue) =>
  Array.isArray(value) ? value[0] : value;

const formatTimestamp = (value: Date | string | null) => {
  if (!value) return 'n/a';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'n/a';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const truncate = (value: string | null, length = 96) => {
  if (!value) return 'n/a';
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1)}…`;
};

const formatPercent = (numerator: number, denominator: number) => {
  if (denominator <= 0) {
    return '0%';
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
};

const safeDecodeLabel = (value: string | null | undefined) => {
  if (!value) return null;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const countTopValues = (
  values: Array<string | null | undefined>,
  limit = 6
): Array<{ label: string; count: number }> =>
  Array.from(
    values.reduce((map, value) => {
      const normalized = value?.trim();
      if (!normalized) return map;

      map.set(normalized, (map.get(normalized) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));

const readMetadataString = (
  metadata: Record<string, unknown> | null | undefined,
  key: string
) => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return null;
  }

  const value = metadata[key];
  return typeof value === 'string' && value.trim() ? value : null;
};

const normalizeMetadata = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const ensureDebugTables = async () => {
  const prisma = getPrismaClient();
  if (!prisma) {
    return;
  }

  await prisma.$executeRawUnsafe(`
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
    )
  `);

  await prisma.$executeRawUnsafe(`
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
};

const getDebugSnapshot = async (): Promise<DebugSnapshot> => {
  const prisma = getPrismaClient();
  const databaseConfigured = Boolean(
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  );
  const debugTokenRequired = Boolean(process.env.PORTFOLIO_DEBUG_TOKEN?.trim());
  const notes: string[] = [];

  if (!databaseConfigured || !prisma) {
    notes.push(
      'Database is not configured in this environment, so analytics and durable cache metrics are unavailable.'
    );

    return {
      databaseConfigured,
      databaseReachable: false,
      generatedAt: new Date(),
      cacheVersion: ASSISTANT_CACHE_VERSION,
      debugTokenRequired,
      assistantCache: DEFAULT_ASSISTANT_CACHE_SUMMARY,
      analytics: DEFAULT_ANALYTICS_SUMMARY,
      invisibleInk: DEFAULT_INVISIBLE_INK_SUMMARY,
      notes,
    };
  }

  try {
    await ensureDebugTables();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);

    const [
      totalEntries,
      activeEntries,
      expiredEntries,
      cacheHits,
      cacheByStrategy,
      cacheByIntent,
      recentEntries,
      totalEvents,
      recentEvents,
      analyticsRows,
      totalWallMessages,
      recentWallMessages,
      recentWallEntries,
    ] = await Promise.all([
      prisma.assistantCacheEntry.count(),
      prisma.assistantCacheEntry.count({
        where: { expiresAt: { gt: now } },
      }),
      prisma.assistantCacheEntry.count({
        where: { expiresAt: { lte: now } },
      }),
      prisma.assistantCacheEntry.aggregate({
        _sum: { hitCount: true },
      }),
      prisma.assistantCacheEntry.groupBy({
        by: ['strategy'],
        _count: { _all: true },
        orderBy: {
          _count: { strategy: 'desc' },
        },
      }),
      prisma.assistantCacheEntry.groupBy({
        by: ['intent'],
        where: {
          expiresAt: { gt: now },
          intent: { not: null },
        },
        _count: { _all: true },
        orderBy: {
          _count: { intent: 'desc' },
        },
      }),
      prisma.assistantCacheEntry.findMany({
        orderBy: { lastHitAt: 'desc' },
        take: 10,
        select: {
          id: true,
          strategy: true,
          intent: true,
          normalizedQuestion: true,
          provider: true,
          modelId: true,
          hitCount: true,
          createdAt: true,
          lastHitAt: true,
          expiresAt: true,
        },
      }),
      prisma.portfolioEvent.count(),
      prisma.portfolioEvent.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.portfolioEvent.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
        take: 500,
        select: {
          id: true,
          eventType: true,
          label: true,
          href: true,
          section: true,
          sessionId: true,
          createdAt: true,
          metadata: true,
        },
      }),
      prisma.invisibleInkMessage.count(),
      prisma.invisibleInkMessage.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.invisibleInkMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          alias: true,
          message: true,
          createdAt: true,
          createdFromCity: true,
          createdFromRegion: true,
          createdFromCountry: true,
        },
      }),
    ]);

    const totalHits = cacheHits._sum.hitCount ?? 0;

    const uniqueSessions = new Set(analyticsRows.map((row) => row.sessionId)).size;
    const byEventType = countTopValues(analyticsRows.map((row) => row.eventType));
    const bySection = countTopValues(analyticsRows.map((row) => row.section));
    const byLabel = countTopValues(analyticsRows.map((row) => row.label));
    const byHref = countTopValues(analyticsRows.map((row) => row.href));
    const byPath = countTopValues(
      analyticsRows.map((row) =>
        readMetadataString(row.metadata as Record<string, unknown> | null, 'path')
      )
    );
    const byBrowser = countTopValues(
      analyticsRows.map((row) =>
        readMetadataString(row.metadata as Record<string, unknown> | null, 'browser')
      )
    );
    const byDevice = countTopValues(
      analyticsRows.map((row) =>
        readMetadataString(row.metadata as Record<string, unknown> | null, 'device')
      )
    );
    const byCity = countTopValues(
      analyticsRows.map((row) => {
        const metadata = row.metadata as Record<string, unknown> | null;
        const city = safeDecodeLabel(readMetadataString(metadata, 'requestCity'));
        const region = safeDecodeLabel(readMetadataString(metadata, 'requestRegion'));
        if (city && region) return `${city}, ${region}`;
        return city ?? region ?? safeDecodeLabel(readMetadataString(metadata, 'requestCountry'));
      })
    );

    notes.push(
      'Recent assistant rows omit response bodies on purpose. This page is meant for cache and analytics health only.'
    );
    notes.push(
      'Analytics store privacy-safer context such as path, device, browser, viewport, referrer, and Vercel geo headers. Raw IP addresses are not persisted.'
    );

    return {
      databaseConfigured,
      databaseReachable: true,
      generatedAt: now,
      cacheVersion: ASSISTANT_CACHE_VERSION,
      debugTokenRequired,
      assistantCache: {
        totalEntries,
        activeEntries,
        expiredEntries,
        totalHits,
        byStrategy: cacheByStrategy.map((entry) => ({
          label: entry.strategy,
          count: entry._count._all,
        })),
        byIntent: cacheByIntent.map((entry) => ({
          label: entry.intent ?? 'unknown',
          count: entry._count._all,
        })),
        recentEntries,
      },
      analytics: {
        totalEvents,
        recentEvents,
        uniqueSessions,
        byEventType,
        bySection,
        byLabel,
        byHref,
        byPath,
        byBrowser,
        byDevice,
        byCity,
        recentRows: analyticsRows.slice(0, 12).map((row) => ({
          ...row,
          metadata: normalizeMetadata(row.metadata),
        })),
      },
      invisibleInk: {
        totalMessages: totalWallMessages,
        recentMessages: recentWallMessages,
        recentEntries: recentWallEntries,
      },
      notes,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    notes.push(`Database query failed: ${message}`);

    return {
      databaseConfigured,
      databaseReachable: false,
      generatedAt: new Date(),
      cacheVersion: ASSISTANT_CACHE_VERSION,
      debugTokenRequired,
      assistantCache: DEFAULT_ASSISTANT_CACHE_SUMMARY,
      analytics: DEFAULT_ANALYTICS_SUMMARY,
      invisibleInk: DEFAULT_INVISIBLE_INK_SUMMARY,
      notes,
    };
  }
};

const StatCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    {helper ? <p className="mt-2 text-sm text-white/60">{helper}</p> : null}
  </div>
);

export default async function AssistantDebugPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (searchParams ? await searchParams : {}) as Record<
    string,
    SearchParamValue
  >;
  const requiredToken = process.env.PORTFOLIO_DEBUG_TOKEN?.trim();
  const providedToken = getSingleSearchParam(resolvedSearchParams.token);

  if (requiredToken && providedToken !== requiredToken) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-4 py-32 text-white">
        <div className="mx-auto max-w-lg rounded-[28px] border border-white/10 bg-black/40 p-8 text-center backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Internal Diagnostics</p>
          <h1 className="mt-4 text-2xl font-semibold">Access requires debug token</h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Append <code className="rounded bg-white/10 px-2 py-0.5 text-cyan-200">?token=YOUR_TOKEN</code> to the URL to access this page.
          </p>
        </div>
      </main>
    );
  }

  const snapshot = await getDebugSnapshot();
  const activeRate = formatPercent(
    snapshot.assistantCache.activeEntries,
    snapshot.assistantCache.totalEntries
  );

  return (
    <main className="relative min-h-screen px-4 py-32 text-white md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="rounded-[28px] border border-cyan-400/20 bg-black/40 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Internal Diagnostics
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Assistant cache and portfolio analytics health
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-white/70">
            This page is intentionally read-only. It summarizes assistant cache health,
            analytics ingestion, and database availability without exposing saved response
            bodies.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Generated: {formatTimestamp(snapshot.generatedAt)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Cache version: {snapshot.cacheVersion}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              DB configured: {snapshot.databaseConfigured ? 'yes' : 'no'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              DB reachable: {snapshot.databaseReachable ? 'yes' : 'no'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Debug token required: {snapshot.debugTokenRequired ? 'yes' : 'no'}
            </span>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="Assistant cache"
            value={snapshot.assistantCache.totalEntries.toLocaleString('en-US')}
            helper="Durable cache rows in Postgres"
          />
          <StatCard
            label="Active cache"
            value={snapshot.assistantCache.activeEntries.toLocaleString('en-US')}
            helper={`${activeRate} of cache entries are still live`}
          />
          <StatCard
            label="Cache hits"
            value={snapshot.assistantCache.totalHits.toLocaleString('en-US')}
            helper="Total durable-cache hits recorded"
          />
          <StatCard
            label="Analytics events"
            value={snapshot.analytics.totalEvents.toLocaleString('en-US')}
            helper={`${snapshot.analytics.recentEvents.toLocaleString('en-US')} in the last 7 days`}
          />
          <StatCard
            label="Tracked sessions"
            value={snapshot.analytics.uniqueSessions.toLocaleString('en-US')}
            helper="Unique browser sessions seen in the last 7 days"
          />
          <StatCard
            label="Wall messages"
            value={snapshot.invisibleInk.totalMessages.toLocaleString('en-US')}
            helper={`${snapshot.invisibleInk.recentMessages.toLocaleString('en-US')} in the last 7 days`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                  Assistant Cache Breakdown
                </p>
                <h2 className="mt-2 text-xl font-semibold">Strategy and intent usage</h2>
              </div>
              <div className="text-sm text-white/60">
                Expired rows: {snapshot.assistantCache.expiredEntries.toLocaleString('en-US')}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-white/80">By strategy</h3>
                <div className="mt-3 space-y-3">
                  {snapshot.assistantCache.byStrategy.length === 0 ? (
                    <p className="text-sm text-white/50">No durable cache rows yet.</p>
                  ) : (
                    snapshot.assistantCache.byStrategy.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-white/5"
                      >
                        <span className="text-sm font-medium text-white/90">{item.label}</span>
                        <span className="text-sm font-bold text-cyan-400">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white/80">By intent</h3>
                <div className="mt-3 space-y-3">
                  {snapshot.assistantCache.byIntent.length === 0 ? (
                    <p className="text-sm text-white/50">No active intent cache rows yet.</p>
                  ) : (
                    snapshot.assistantCache.byIntent.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="text-sm text-white/80">{item.label}</span>
                        <span className="text-sm font-medium text-cyan-200">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
              Portfolio Analytics
            </p>
            <h2 className="mt-2 text-xl font-semibold">Recent event types and sections</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/80">By event type</h3>
                {snapshot.analytics.byEventType.length === 0 ? (
                  <p className="text-sm text-white/50">No analytics rows recorded in the last 7 days.</p>
                ) : (
                  snapshot.analytics.byEventType.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-sm text-white/80">{item.label}</span>
                      <span className="text-sm font-medium text-cyan-200">{item.count}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/80">By section</h3>
                {snapshot.analytics.bySection.length === 0 ? (
                  <p className="text-sm text-white/50">No section labels recorded yet.</p>
                ) : (
                  snapshot.analytics.bySection.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-sm text-white/80">{item.label}</span>
                      <span className="text-sm font-medium text-cyan-200">{item.count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Top labels</p>
                <div className="mt-3 space-y-2 text-sm text-white/75">
                  {snapshot.analytics.byLabel.length === 0 ? (
                    <p className="text-white/50">No labels recorded yet.</p>
                  ) : (
                    snapshot.analytics.byLabel.slice(0, 6).map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="truncate">{truncate(item.label, 26)}</span>
                        <span className="text-cyan-200">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Outbound hrefs</p>
                <div className="mt-3 space-y-2 text-sm text-white/75">
                  {snapshot.analytics.byHref.length === 0 ? (
                    <p className="text-white/50">No outbound href metadata yet.</p>
                  ) : (
                    snapshot.analytics.byHref.slice(0, 6).map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="truncate">{truncate(item.label, 26)}</span>
                        <span className="text-cyan-200">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
              Recent Cache Rows
            </p>
            <h2 className="mt-2 text-xl font-semibold">Latest durable assistant entries</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[1.1fr,0.8fr,0.7fr,0.6fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/50">
                  <span className="min-w-0">Question</span>
                  <span className="min-w-0">Strategy</span>
                  <span className="min-w-0">Model</span>
                  <span className="min-w-0">Hits</span>
                </div>
                <div className="divide-y divide-white/10">
                  {snapshot.assistantCache.recentEntries.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-white/50">No durable cache entries yet.</div>
                  ) : (
                    snapshot.assistantCache.recentEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="grid grid-cols-[1.1fr,0.8fr,0.7fr,0.6fr] gap-3 px-4 py-4 text-sm text-white/75"
                      >
                        <div className="min-w-0">
                          <p>{truncate(entry.normalizedQuestion)}</p>
                          <p className="mt-1 text-xs text-white/45">
                            {entry.intent ?? 'no-intent'} · expires {formatTimestamp(entry.expiresAt)}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p>{entry.strategy}</p>
                          <p className="mt-1 text-xs text-white/45">
                            last hit {formatTimestamp(entry.lastHitAt)}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p>{entry.provider}</p>
                          <p className="mt-1 truncate text-xs text-white/45">{entry.modelId}</p>
                        </div>
                        <div className="min-w-0">
                          <p>{entry.hitCount}</p>
                          <p className="mt-1 text-xs text-white/45">
                            created {formatTimestamp(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
              Recent Analytics
            </p>
            <h2 className="mt-2 text-xl font-semibold">Latest tracked recruiter actions</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Top paths</p>
                <div className="mt-3 space-y-2 text-sm text-white/75">
                  {snapshot.analytics.byPath.length === 0 ? (
                    <p className="text-white/50">No path metadata yet.</p>
                  ) : (
                    snapshot.analytics.byPath.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="truncate">{truncate(item.label, 28)}</span>
                        <span className="text-cyan-200">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Browsers</p>
                <div className="mt-3 space-y-2 text-sm text-white/75">
                  {snapshot.analytics.byBrowser.length === 0 ? (
                    <p className="text-white/50">No browser metadata yet.</p>
                  ) : (
                    snapshot.analytics.byBrowser.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="truncate">{item.label}</span>
                        <span className="text-cyan-200">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Devices</p>
                <div className="mt-3 space-y-2 text-sm text-white/75">
                  {snapshot.analytics.byDevice.length === 0 ? (
                    <p className="text-white/50">No device metadata yet.</p>
                  ) : (
                    snapshot.analytics.byDevice.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="truncate">{item.label}</span>
                        <span className="text-cyan-200">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Locations</p>
                <div className="mt-3 space-y-2 text-sm text-white/75">
                  {snapshot.analytics.byCity.length === 0 ? (
                    <p className="text-white/50">No Vercel geo headers recorded yet.</p>
                  ) : (
                    snapshot.analytics.byCity.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="truncate">{truncate(item.label, 24)}</span>
                        <span className="text-cyan-200">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[0.85fr,1.05fr,0.9fr,0.8fr,0.9fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/50">
                  <span className="min-w-0">Event</span>
                  <span className="min-w-0">Label</span>
                  <span className="min-w-0">Section</span>
                  <span className="min-w-0">Context</span>
                  <span className="min-w-0">When</span>
                </div>
                <div className="divide-y divide-white/10">
                  {snapshot.analytics.recentRows.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-white/50">No recent analytics rows yet.</div>
                  ) : (
                    snapshot.analytics.recentRows.map((entry) => (
                      <div
                        key={entry.id}
                        className="grid grid-cols-[0.85fr,1.05fr,0.9fr,0.8fr,0.9fr] gap-3 px-4 py-4 text-sm text-white/75"
                      >
                        <div className="min-w-0">
                          <p>{entry.eventType}</p>
                          <p className="mt-1 text-xs text-white/45">
                            {truncate(entry.sessionId, 16)}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p>{truncate(entry.label)}</p>
                          <p className="mt-1 text-xs text-white/45">{truncate(entry.href, 36)}</p>
                        </div>
                        <div className="min-w-0">{entry.section ?? 'n/a'}</div>
                        <div className="min-w-0 text-xs text-white/55">
                          <p>{readMetadataString(entry.metadata, 'browser') ?? 'browser n/a'}</p>
                          <p className="mt-1">
                            {truncate(readMetadataString(entry.metadata, 'path'), 26)}
                          </p>
                        </div>
                        <div className="min-w-0">{formatTimestamp(entry.createdAt)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
            Invisible Ink
          </p>
          <h2 className="mt-2 text-xl font-semibold">Recent hidden wall messages</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[0.75fr,1.55fr,0.9fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/50">
                <span className="min-w-0">Alias</span>
                <span className="min-w-0">Message</span>
                <span className="min-w-0">Origin / time</span>
              </div>
              <div className="divide-y divide-white/10">
                {snapshot.invisibleInk.recentEntries.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-white/50">No invisible ink messages yet.</div>
                ) : (
                  snapshot.invisibleInk.recentEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-[0.75fr,1.55fr,0.9fr] gap-3 px-4 py-4 text-sm text-white/75"
                    >
                      <div className="min-w-0">{entry.alias ?? 'Anonymous signal'}</div>
                      <div className="min-w-0">{truncate(entry.message, 112)}</div>
                      <div className="min-w-0 text-xs text-white/55">
                        <p>
                          {entry.createdFromCity ??
                            entry.createdFromRegion ??
                            entry.createdFromCountry ??
                            'origin hidden'}
                        </p>
                        <p className="mt-1">{formatTimestamp(entry.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
            Notes
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {snapshot.notes.map((note) => (
              <li key={note} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
