import { notFound } from 'next/navigation';
import { ASSISTANT_CACHE_VERSION } from '@/lib/assistant-cache';
import { getPrismaClient } from '@/lib/prisma';

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
  byEventType: Array<{ label: string; count: number }>;
  recentRows: Array<{
    id: string;
    eventType: string;
    label: string | null;
    href: string | null;
    section: string | null;
    sessionId: string;
    createdAt: Date;
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
  byEventType: [],
  recentRows: [],
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
      eventTypeCounts,
      recentEventRows,
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
      prisma.portfolioEvent.groupBy({
        by: ['eventType'],
        where: { createdAt: { gte: sevenDaysAgo } },
        _count: { _all: true },
        orderBy: {
          _count: { eventType: 'desc' },
        },
      }),
      prisma.portfolioEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 12,
        select: {
          id: true,
          eventType: true,
          label: true,
          href: true,
          section: true,
          sessionId: true,
          createdAt: true,
        },
      }),
    ]);

    const totalHits = cacheHits._sum.hitCount ?? 0;

    notes.push(
      'Recent assistant rows omit response bodies on purpose. This page is meant for cache and analytics health only.'
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
        byEventType: eventTypeCounts.map((entry) => ({
          label: entry.eventType,
          count: entry._count._all,
        })),
        recentRows: recentEventRows,
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
    notFound();
  }

  const snapshot = await getDebugSnapshot();
  const activeRate = formatPercent(
    snapshot.assistantCache.activeEntries,
    snapshot.assistantCache.totalEntries
  );

  return (
    <main className="min-h-screen bg-[#061019] px-4 py-10 text-white md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="rounded-[28px] border border-cyan-400/15 bg-[linear-gradient(135deg,rgba(12,28,42,0.95),rgba(5,12,21,0.96))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="text-sm text-white/80">{item.label}</span>
                        <span className="text-sm font-medium text-cyan-200">{item.count}</span>
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
            <h2 className="mt-2 text-xl font-semibold">Recent event types</h2>
            <div className="mt-6 space-y-3">
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
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
              Recent Cache Rows
            </p>
            <h2 className="mt-2 text-xl font-semibold">Latest durable assistant entries</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.1fr,0.8fr,0.7fr,0.6fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/50">
                <span>Question</span>
                <span>Strategy</span>
                <span>Model</span>
                <span>Hits</span>
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
                      <div>
                        <p>{truncate(entry.normalizedQuestion)}</p>
                        <p className="mt-1 text-xs text-white/45">
                          {entry.intent ?? 'no-intent'} · expires {formatTimestamp(entry.expiresAt)}
                        </p>
                      </div>
                      <div>
                        <p>{entry.strategy}</p>
                        <p className="mt-1 text-xs text-white/45">
                          last hit {formatTimestamp(entry.lastHitAt)}
                        </p>
                      </div>
                      <div>
                        <p>{entry.provider}</p>
                        <p className="mt-1 text-xs text-white/45">{entry.modelId}</p>
                      </div>
                      <div>
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

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
              Recent Analytics
            </p>
            <h2 className="mt-2 text-xl font-semibold">Latest tracked recruiter actions</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[0.8fr,1fr,0.8fr,0.9fr] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/50">
                <span>Event</span>
                <span>Label</span>
                <span>Section</span>
                <span>When</span>
              </div>
              <div className="divide-y divide-white/10">
                {snapshot.analytics.recentRows.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-white/50">No recent analytics rows yet.</div>
                ) : (
                  snapshot.analytics.recentRows.map((entry) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-[0.8fr,1fr,0.8fr,0.9fr] gap-3 px-4 py-4 text-sm text-white/75"
                    >
                      <div>
                        <p>{entry.eventType}</p>
                        <p className="mt-1 text-xs text-white/45">
                          {truncate(entry.sessionId, 16)}
                        </p>
                      </div>
                      <div>
                        <p>{truncate(entry.label)}</p>
                        <p className="mt-1 text-xs text-white/45">{truncate(entry.href, 36)}</p>
                      </div>
                      <div>{entry.section ?? 'n/a'}</div>
                      <div>{formatTimestamp(entry.createdAt)}</div>
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
