import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, type LanguageModel, type ModelMessage } from 'ai';
import { getPortfolioSystemPrompt } from '@/content/portfolio';
import {
  buildAssistantContextBlock,
  getAssistantAnswerGuidance,
  getAssistantUnavailableReply,
} from '@/content/portfolio-assistant';
import {
  ASSISTANT_CACHE_VERSION,
  ASSISTANT_DATABASE_CACHE_TTL_MS,
  ASSISTANT_MEMORY_CACHE_TTL_MS,
  type AssistantCacheLookup,
  type AssistantCacheMessage,
  type AssistantCacheStrategy,
  buildAssistantCacheLookup,
} from '@/lib/assistant-cache';
import { getPrismaClient } from '@/lib/prisma';

export const runtime = 'nodejs';
export const maxDuration = 30;

type ChatRequestBody = {
  messages?: InboundMessage[];
};

type InboundMessage = {
  role: 'assistant' | 'system' | 'user';
  content?: unknown;
  parts?: Array<{
    type?: string;
    text?: string;
  }>;
};

type ResolvedModel = {
  provider: 'google' | 'openai';
  modelId: string;
  model: LanguageModel;
};

type CacheSource = 'client' | 'memory' | 'database' | 'miss';

type CachedAssistantResponse = {
  provider: 'google' | 'openai';
  modelId: string;
  text: string;
  createdAt: number;
};

type CacheCandidate = {
  cacheKey: string;
  strategy: AssistantCacheStrategy;
  intent: AssistantCacheLookup['intent'] | null;
  normalizedQuestion: string | null;
};

type LiveAssistantResult = {
  provider: 'google' | 'openai';
  modelId: string;
  text: string;
};

const responseHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-store',
};

const TRANSIENT_STATUS_PATTERNS = [
  '429',
  '503',
  'rate limit',
  'too many requests',
  'resource exhausted',
  'overloaded',
];
const RETRYABLE_FAILURE_KINDS = new Set(['rate_limited']);
const MAX_PROVIDER_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1200;
const responseCache = new Map<string, CachedAssistantResponse>();
const inflightResponseMap = new Map<string, Promise<LiveAssistantResult>>();
let assistantCacheTableEnsured = false;

const withAssistantHeaders = (
  headers: HeadersInit,
  mode: 'live' | 'degraded' | 'offline',
  cacheSource: CacheSource = 'miss'
) => ({
  ...responseHeaders,
  'X-Portfolio-Assistant-Mode': mode,
  'X-Portfolio-Assistant-Cache': cacheSource,
  ...headers,
});

const resolveModels = () => {
  const googleKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  const models: ResolvedModel[] = [];

  if (googleKey) {
    const google = createGoogleGenerativeAI({ apiKey: googleKey });
    const googleModelIds = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

    googleModelIds.forEach((modelId) => {
      models.push({
        provider: 'google',
        modelId,
        model: google(modelId),
      });
    });
  }

  if (openAiKey) {
    models.push({
      provider: 'openai',
      modelId: 'gpt-4o-mini',
      model: createOpenAI({ apiKey: openAiKey })('gpt-4o-mini'),
    });
  }

  return {
    googleKeyPresent: Boolean(googleKey),
    openAiKeyPresent: Boolean(openAiKey),
    models,
  };
};

const getMessageText = (message: InboundMessage | undefined) => {
  if (!message) return '';

  if (typeof message.content === 'string') {
    return message.content.trim();
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }

        if (
          part &&
          typeof part === 'object' &&
          'text' in part &&
          typeof part.text === 'string'
        ) {
          return part.text;
        }

        return '';
      })
      .join(' ')
      .trim();
  }

  if (!Array.isArray(message.parts)) {
    return '';
  }

  return message.parts
    .map((part) =>
      part.type === 'text' && typeof part.text === 'string' ? part.text : ''
    )
    .join(' ')
    .trim();
};

const toModelMessages = (messages: InboundMessage[]) => {
  const normalizedMessages: ModelMessage[] = [];

  for (const message of messages) {
    const text = getMessageText(message);
    if (!text) continue;

    switch (message.role) {
      case 'system':
        normalizedMessages.push({ role: 'system', content: text });
        break;
      case 'user':
        normalizedMessages.push({ role: 'user', content: text });
        break;
      case 'assistant':
        normalizedMessages.push({ role: 'assistant', content: text });
        break;
      default:
        break;
    }
  }

  return normalizedMessages;
};

const toAssistantCacheMessages = (
  messages: ModelMessage[]
): AssistantCacheMessage[] =>
  messages
    .map((message) => ({
      role: message.role,
      content: typeof message.content === 'string' ? message.content : '',
    }))
    .filter((message) => message.content.trim().length > 0);

const buildAssistantSystemPrompt = (query: string) => {
  const { contextBlock } = buildAssistantContextBlock(query);

  return [
    getPortfolioSystemPrompt(),
    'Retrieved portfolio context:',
    contextBlock,
    '',
    getAssistantAnswerGuidance(),
  ].join('\n');
};

const buildDeterministicFallbackReply = (query: string) => {
  const { docs } = buildAssistantContextBlock(query, 3);

  if (docs.length === 0) {
    return 'I can help with Michael’s projects, role fit, business impact, skills, and recruiter-facing summaries. Try asking about hours saved, predictive analytics work, or best-fit roles.';
  }

  const proofPoints = docs
    .map((doc) => `- ${doc.title}: ${doc.content}`)
    .join('\n');

  return [
    "I'm having trouble reaching the live model right now, but here is the closest verified portfolio context:",
    proofPoints,
  ].join('\n');
};

const buildCacheCandidates = (messages: ModelMessage[]) => {
  const lookup = buildAssistantCacheLookup(toAssistantCacheMessages(messages));
  const transcriptCandidate: CacheCandidate = {
    cacheKey: lookup.transcriptKey,
    strategy: 'exact_transcript',
    intent: lookup.isSingleTurn ? lookup.intent : null,
    normalizedQuestion: lookup.normalizedQuestion || null,
  };
  const candidates = [transcriptCandidate];

  if (lookup.isSingleTurn && lookup.intentKey && lookup.normalizedQuestion) {
    candidates.push({
      cacheKey: lookup.intentKey,
      strategy: 'intent_single_turn',
      intent: lookup.intent,
      normalizedQuestion: lookup.normalizedQuestion,
    });
  }

  return {
    lookup,
    candidates: candidates.filter(
      (candidate, index, collection) =>
        collection.findIndex(
          (item) => item.cacheKey === candidate.cacheKey
        ) === index
    ),
  };
};

const pruneResponseCache = () => {
  const now = Date.now();

  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.createdAt > ASSISTANT_MEMORY_CACHE_TTL_MS) {
      responseCache.delete(key);
    }
  }
};

const getMemoryCachedResponse = (candidates: CacheCandidate[]) => {
  pruneResponseCache();

  for (const candidate of candidates) {
    const entry = responseCache.get(candidate.cacheKey);
    if (!entry) continue;

    if (Date.now() - entry.createdAt > ASSISTANT_MEMORY_CACHE_TTL_MS) {
      responseCache.delete(candidate.cacheKey);
      continue;
    }

    return entry;
  }

  return null;
};

const setMemoryCachedResponses = (
  candidates: CacheCandidate[],
  response: Omit<CachedAssistantResponse, 'createdAt'>
) => {
  pruneResponseCache();
  const createdAt = Date.now();

  candidates.forEach((candidate) => {
    responseCache.set(candidate.cacheKey, {
      ...response,
      createdAt,
    });
  });
};

const hasDatabaseConnection = () =>
  Boolean(
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim()
  );

const ensureAssistantCacheTable = async () => {
  if (assistantCacheTableEnsured || !hasDatabaseConnection()) {
    return;
  }

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
    CREATE INDEX IF NOT EXISTS "AssistantCacheEntry_expiresAt_idx"
    ON "AssistantCacheEntry" ("expiresAt")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "AssistantCacheEntry_intent_expiresAt_idx"
    ON "AssistantCacheEntry" ("intent", "expiresAt")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "AssistantCacheEntry_createdAt_idx"
    ON "AssistantCacheEntry" ("createdAt")
  `);

  assistantCacheTableEnsured = true;
};

const errorDetails = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: 'UnknownError',
    message: String(error),
  };
};

const classifyAssistantError = (error: unknown) => {
  const { message } = errorDetails(error);
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes('429') ||
    normalizedMessage.includes('rate limit') ||
    normalizedMessage.includes('too many requests')
  ) {
    return 'rate_limited';
  }

  if (normalizedMessage.includes('quota') || normalizedMessage.includes('billing')) {
    return 'quota';
  }

  if (
    normalizedMessage.includes('api key') ||
    normalizedMessage.includes('authentication') ||
    normalizedMessage.includes('permission denied') ||
    normalizedMessage.includes('unauthorized') ||
    normalizedMessage.includes('forbidden')
  ) {
    return 'auth';
  }

  if (
    normalizedMessage.includes('model') &&
    (normalizedMessage.includes('not found') ||
      normalizedMessage.includes('unsupported'))
  ) {
    return 'model_access';
  }

  if (normalizedMessage.includes('empty text response')) {
    return 'empty_response';
  }

  if (
    normalizedMessage.includes('assistantcacheentry') &&
    (normalizedMessage.includes('does not exist') ||
      normalizedMessage.includes('relation') ||
      normalizedMessage.includes('table'))
  ) {
    return 'table_missing';
  }

  return 'unknown';
};

const shouldRetryAssistantError = (error: unknown) => {
  const failureKind = classifyAssistantError(error);
  if (RETRYABLE_FAILURE_KINDS.has(failureKind)) {
    return true;
  }

  const { message } = errorDetails(error);
  const normalizedMessage = message.toLowerCase();
  return TRANSIENT_STATUS_PATTERNS.some((pattern) =>
    normalizedMessage.includes(pattern)
  );
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const logAssistantEvent = (event: string, details: Record<string, unknown>) => {
  console.info(event, details);
};

const logAssistantError = (
  event: string,
  error: unknown,
  details: Record<string, unknown>
) => {
  console.error(event, {
    ...details,
    ...errorDetails(error),
  });
};

const getDatabaseCachedResponse = async (candidates: CacheCandidate[]) => {
  if (!hasDatabaseConnection()) {
    return null;
  }

  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return null;
    }

    await ensureAssistantCacheTable();

    const entries = await prisma.assistantCacheEntry.findMany({
      where: {
        cacheKey: { in: candidates.map((candidate) => candidate.cacheKey) },
        contentVersion: ASSISTANT_CACHE_VERSION,
        expiresAt: { gt: new Date() },
      },
    });

    if (entries.length === 0) {
      return null;
    }

    const entriesByKey = new Map(entries.map((entry) => [entry.cacheKey, entry]));
    const matchedEntry = candidates
      .map((candidate) => entriesByKey.get(candidate.cacheKey))
      .find((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    if (!matchedEntry) {
      return null;
    }

    void prisma.assistantCacheEntry
      .update({
        where: { cacheKey: matchedEntry.cacheKey },
        data: {
          hitCount: { increment: 1 },
          lastHitAt: new Date(),
        },
      })
      .catch((error) => {
        logAssistantError('assistant_database_cache_hit_update_failed', error, {
          cacheKey: matchedEntry.cacheKey,
        });
      });

    return {
      provider: matchedEntry.provider === 'openai' ? 'openai' : 'google',
      modelId: matchedEntry.modelId,
      text: matchedEntry.responseText,
    } satisfies LiveAssistantResult;
  } catch (error) {
    logAssistantError('assistant_database_cache_read_failed', error, {
      candidateCount: candidates.length,
      failureKind: classifyAssistantError(error),
    });
    return null;
  }
};

const persistDatabaseCache = async (
  candidates: CacheCandidate[],
  result: LiveAssistantResult
) => {
  if (!hasDatabaseConnection() || result.provider !== 'google') {
    return;
  }

  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return;
    }

    await ensureAssistantCacheTable();

    const expiresAt = new Date(Date.now() + ASSISTANT_DATABASE_CACHE_TTL_MS);

    await prisma.$transaction(
      candidates.map((candidate) =>
        prisma.assistantCacheEntry.upsert({
          where: {
            cacheKey: candidate.cacheKey,
          },
          update: {
            strategy: candidate.strategy,
            intent: candidate.intent,
            normalizedQuestion: candidate.normalizedQuestion,
            responseText: result.text,
            provider: result.provider,
            modelId: result.modelId,
            contentVersion: ASSISTANT_CACHE_VERSION,
            expiresAt,
          },
          create: {
            cacheKey: candidate.cacheKey,
            strategy: candidate.strategy,
            intent: candidate.intent,
            normalizedQuestion: candidate.normalizedQuestion,
            responseText: result.text,
            provider: result.provider,
            modelId: result.modelId,
            contentVersion: ASSISTANT_CACHE_VERSION,
            expiresAt,
          },
        })
      )
    );
  } catch (error) {
    logAssistantError('assistant_database_cache_write_failed', error, {
      candidateCount: candidates.length,
      failureKind: classifyAssistantError(error),
    });
  }
};

const generateLiveTextWithRetry = async ({
  provider,
  modelId,
  model,
  messages,
  latestQuery,
}: ResolvedModel & {
  messages: ModelMessage[];
  latestQuery: string;
}) => {
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= MAX_PROVIDER_RETRIES) {
    const startedAt = Date.now();

    try {
      const result = await generateText({
        model,
        system: buildAssistantSystemPrompt(latestQuery),
        messages,
      });

      const text = result.text.trim();

      if (!text) {
        throw new Error('Provider returned an empty text response.');
      }

      logAssistantEvent('assistant_provider_success', {
        provider,
        modelId,
        latestQueryLength: latestQuery.length,
        durationMs: Date.now() - startedAt,
        finishReason: result.finishReason,
        responseLength: text.length,
        retryAttempt: attempt,
      });

      return {
        provider,
        modelId,
        text,
      } satisfies LiveAssistantResult;
    } catch (error) {
      lastError = error;
      const retryable = shouldRetryAssistantError(error);
      const retryAttempt = attempt + 1;

      logAssistantError('assistant_provider_attempt_failed', error, {
        provider,
        modelId,
        latestQueryLength: latestQuery.length,
        retryAttempt,
        maxRetries: MAX_PROVIDER_RETRIES,
        retryable,
        failureKind: classifyAssistantError(error),
      });

      if (!retryable || attempt >= MAX_PROVIDER_RETRIES) {
        break;
      }

      const jitterMs = Math.floor(Math.random() * 250);
      const waitMs = BASE_RETRY_DELAY_MS * 2 ** attempt + jitterMs;

      logAssistantEvent('assistant_provider_retry_scheduled', {
        provider,
        modelId,
        latestQueryLength: latestQuery.length,
        retryAttempt,
        waitMs,
      });

      await delay(waitMs);
      attempt += 1;
    }
  }

  throw lastError ?? new Error('Provider failed without a recoverable response.');
};

const buildResponse = (
  result: LiveAssistantResult,
  cacheSource: Exclude<CacheSource, 'client'>
) =>
  new Response(result.text, {
    headers: withAssistantHeaders(
      {
        'X-Portfolio-Assistant-Provider': result.provider,
        'X-Portfolio-Assistant-Model': result.modelId,
      },
      'live',
      cacheSource
    ),
  });

const buildLiveResponse = async ({
  provider,
  modelId,
  model,
  messages,
  latestQuery,
  cacheLookup,
  candidates,
}: ResolvedModel & {
  messages: ModelMessage[];
  latestQuery: string;
  cacheLookup: AssistantCacheLookup;
  candidates: CacheCandidate[];
}) => {
  const memoryCached = getMemoryCachedResponse(candidates);

  if (memoryCached) {
    logAssistantEvent('assistant_memory_cache_hit', {
      provider: memoryCached.provider,
      modelId: memoryCached.modelId,
      latestQueryLength: latestQuery.length,
      cacheAgeMs: Date.now() - memoryCached.createdAt,
      transcriptFingerprint: cacheLookup.transcriptFingerprint,
    });

    return buildResponse(memoryCached, 'memory');
  }

  const databaseCached = await getDatabaseCachedResponse(candidates);

  if (databaseCached) {
    setMemoryCachedResponses(candidates, databaseCached);

    logAssistantEvent('assistant_database_cache_hit', {
      provider: databaseCached.provider,
      modelId: databaseCached.modelId,
      latestQueryLength: latestQuery.length,
      transcriptFingerprint: cacheLookup.transcriptFingerprint,
      isSingleTurn: cacheLookup.isSingleTurn,
      intent: cacheLookup.intent,
    });

    return buildResponse(databaseCached, 'database');
  }

  const inflightRequest = inflightResponseMap.get(cacheLookup.transcriptKey);

  if (inflightRequest) {
    const dedupedResult = await inflightRequest;
    setMemoryCachedResponses(candidates, dedupedResult);

    logAssistantEvent('assistant_inflight_request_deduped', {
      provider: dedupedResult.provider,
      modelId: dedupedResult.modelId,
      latestQueryLength: latestQuery.length,
      transcriptFingerprint: cacheLookup.transcriptFingerprint,
    });

    return buildResponse(dedupedResult, 'memory');
  }

  const generationPromise = (async () => {
    const liveResult = await generateLiveTextWithRetry({
      provider,
      modelId,
      model,
      messages,
      latestQuery,
    });

    setMemoryCachedResponses(candidates, liveResult);
    await persistDatabaseCache(candidates, liveResult);

    return liveResult;
  })();

  inflightResponseMap.set(cacheLookup.transcriptKey, generationPromise);

  try {
    const liveResult = await generationPromise;
    return buildResponse(liveResult, 'miss');
  } finally {
    if (inflightResponseMap.get(cacheLookup.transcriptKey) === generationPromise) {
      inflightResponseMap.delete(cacheLookup.transcriptKey);
    }
  }
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages ?? [];
    const modelMessages = toModelMessages(messages);
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === 'user');
    const latestQuery = getMessageText(latestUserMessage);
    const { lookup: cacheLookup, candidates } = buildCacheCandidates(modelMessages);
    const { models, googleKeyPresent, openAiKeyPresent } = resolveModels();

    logAssistantEvent('assistant_request_received', {
      messageCount: messages.length,
      latestQueryLength: latestQuery.length,
      normalizedMessageCount: modelMessages.length,
      googleKeyPresent,
      openAiKeyPresent,
      providerCount: models.length,
      hasDatabaseConnection: hasDatabaseConnection(),
      cacheVersion: ASSISTANT_CACHE_VERSION,
      transcriptFingerprint: cacheLookup.transcriptFingerprint,
      isSingleTurn: cacheLookup.isSingleTurn,
      intent: cacheLookup.intent,
    });

    if (models.length === 0) {
      logAssistantEvent('assistant_no_provider_config', {
        latestQueryLength: latestQuery.length,
      });
      return new Response(getAssistantUnavailableReply(), {
        headers: withAssistantHeaders({}, 'offline', 'miss'),
      });
    }

    let lastError: unknown = null;

    for (let index = 0; index < models.length; index += 1) {
      const candidate = models[index];

      try {
        logAssistantEvent('assistant_provider_selected', {
          provider: candidate.provider,
          modelId: candidate.modelId,
          latestQueryLength: latestQuery.length,
          attempt: index + 1,
          totalAttempts: models.length,
          transcriptFingerprint: cacheLookup.transcriptFingerprint,
        });

        return await buildLiveResponse({
          provider: candidate.provider,
          modelId: candidate.modelId,
          model: candidate.model,
          messages: modelMessages,
          latestQuery,
          cacheLookup,
          candidates,
        });
      } catch (error) {
        lastError = error;
        logAssistantError('assistant_provider_failed', error, {
          provider: candidate.provider,
          modelId: candidate.modelId,
          latestQueryLength: latestQuery.length,
          attempt: index + 1,
          totalAttempts: models.length,
          failureKind: classifyAssistantError(error),
          transcriptFingerprint: cacheLookup.transcriptFingerprint,
        });
      }
    }

    if (lastError) {
      logAssistantEvent('assistant_degraded_fallback', {
        latestQueryLength: latestQuery.length,
        providerCount: models.length,
        failureKind: classifyAssistantError(lastError),
        transcriptFingerprint: cacheLookup.transcriptFingerprint,
      });
    }

    return new Response(buildDeterministicFallbackReply(latestQuery), {
      headers: withAssistantHeaders({}, 'degraded', 'miss'),
    });
  } catch (error) {
    logAssistantError('assistant_route_error', error, {
      latestQueryLength: 0,
    });
    return new Response(getAssistantUnavailableReply(), {
      headers: withAssistantHeaders({}, 'offline', 'miss'),
    });
  }
}
