import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import {
  generateText,
  type LanguageModel,
  type ModelMessage,
} from 'ai';
import { getPortfolioSystemPrompt } from '@/content/portfolio';
import {
  buildAssistantContextBlock,
  getAssistantAnswerGuidance,
  getAssistantUnavailableReply,
} from '@/content/portfolio-assistant';

export const runtime = 'nodejs';
export const maxDuration = 30;

type ChatRequestBody = {
  messages?: InboundMessage[];
};

type ResolvedModel = {
  provider: 'google' | 'openai';
  modelId: string;
  model: LanguageModel;
};

type CachedAssistantResponse = {
  provider: 'google' | 'openai';
  modelId: string;
  text: string;
  createdAt: number;
};

type InboundMessage = {
  role: 'assistant' | 'system' | 'user';
  content?: unknown;
  parts?: Array<{
    type?: string;
    text?: string;
  }>;
};

const responseHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-store',
};

const TRANSIENT_STATUS_PATTERNS = ['429', '503', 'rate limit', 'too many requests', 'resource exhausted', 'overloaded'];
const RETRYABLE_FAILURE_KINDS = new Set(['rate_limited']);
const MAX_PROVIDER_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1200;
const RESPONSE_CACHE_TTL_MS = 1000 * 60 * 5;
const MAX_RESPONSE_CACHE_ENTRIES = 48;
const responseCache = new Map<string, CachedAssistantResponse>();

const withAssistantHeaders = (
  headers: HeadersInit,
  mode: 'live' | 'degraded' | 'offline'
) => ({
  ...responseHeaders,
  'X-Portfolio-Assistant-Mode': mode,
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
    const googleModelIds = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

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

        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') {
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
    .map((part) => (part.type === 'text' && typeof part.text === 'string' ? part.text : ''))
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
        normalizedMessages.push({
          role: 'system',
          content: text,
        });
        break;
      case 'user':
        normalizedMessages.push({
          role: 'user',
          content: text,
        });
        break;
      case 'assistant':
        normalizedMessages.push({
          role: 'assistant',
          content: text,
        });
        break;
      default:
        break;
    }
  }

  return normalizedMessages;
};

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

const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
    left.localeCompare(right)
  );

  return `{${entries
    .map(([key, nestedValue]) => `${JSON.stringify(key)}:${stableStringify(nestedValue)}`)
    .join(',')}}`;
};

const buildConversationCacheKey = (messages: ModelMessage[]) =>
  messages.length > 0 ? stableStringify(messages) : '__empty__';

const pruneResponseCache = () => {
  const now = Date.now();

  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.createdAt > RESPONSE_CACHE_TTL_MS) {
      responseCache.delete(key);
    }
  }

  while (responseCache.size > MAX_RESPONSE_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (!oldestKey) break;
    responseCache.delete(oldestKey);
  }
};

const getCachedResponse = (cacheKey: string) => {
  pruneResponseCache();
  const entry = responseCache.get(cacheKey);

  if (!entry) return null;

  if (Date.now() - entry.createdAt > RESPONSE_CACHE_TTL_MS) {
    responseCache.delete(cacheKey);
    return null;
  }

  return entry;
};

const setCachedResponse = (
  cacheKey: string,
  response: Omit<CachedAssistantResponse, 'createdAt'>
) => {
  pruneResponseCache();
  responseCache.set(cacheKey, {
    ...response,
    createdAt: Date.now(),
  });
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
    (normalizedMessage.includes('not found') || normalizedMessage.includes('unsupported'))
  ) {
    return 'model_access';
  }

  if (normalizedMessage.includes('empty text response')) {
    return 'empty_response';
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
  return TRANSIENT_STATUS_PATTERNS.some((pattern) => normalizedMessage.includes(pattern));
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const logAssistantEvent = (event: string, details: Record<string, unknown>) => {
  console.info(event, details);
};

const logAssistantError = (event: string, error: unknown, details: Record<string, unknown>) => {
  console.error(event, {
    ...details,
    ...errorDetails(error),
  });
};

const buildLiveResponse = async ({
  provider,
  modelId,
  model,
  messages,
  latestQuery,
  cacheKey,
}: ResolvedModel & {
  messages: ModelMessage[];
  latestQuery: string;
  cacheKey: string;
}) => {
  const cached = getCachedResponse(cacheKey);

  if (cached) {
    logAssistantEvent('assistant_cache_hit', {
      provider: cached.provider,
      modelId: cached.modelId,
      latestQueryLength: latestQuery.length,
      cacheAgeMs: Date.now() - cached.createdAt,
    });

    return new Response(cached.text, {
      headers: withAssistantHeaders(
        {
          'X-Portfolio-Assistant-Provider': cached.provider,
          'X-Portfolio-Assistant-Model': cached.modelId,
          'X-Portfolio-Assistant-Cache': 'hit',
        },
        'live'
      ),
    });
  }

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

      setCachedResponse(cacheKey, {
        provider,
        modelId,
        text,
      });

      logAssistantEvent('assistant_provider_success', {
        provider,
        modelId,
        latestQueryLength: latestQuery.length,
        durationMs: Date.now() - startedAt,
        finishReason: result.finishReason,
        responseLength: text.length,
        retryAttempt: attempt,
      });

      return new Response(text, {
        headers: withAssistantHeaders(
          {
            'X-Portfolio-Assistant-Provider': provider,
            'X-Portfolio-Assistant-Model': modelId,
            'X-Portfolio-Assistant-Cache': 'miss',
          },
          'live'
        ),
      });
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages ?? [];
    const modelMessages = toModelMessages(messages);
    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    const latestQuery = getMessageText(latestUserMessage);
    const cacheKey = buildConversationCacheKey(modelMessages);
    const { models, googleKeyPresent, openAiKeyPresent } = resolveModels();

    logAssistantEvent('assistant_request_received', {
      messageCount: messages.length,
      latestQueryLength: latestQuery.length,
      normalizedMessageCount: modelMessages.length,
      cacheable: modelMessages.length > 0,
      googleKeyPresent,
      openAiKeyPresent,
      providerCount: models.length,
    });

    if (models.length === 0) {
      logAssistantEvent('assistant_no_provider_config', {
        latestQueryLength: latestQuery.length,
      });
      return new Response(getAssistantUnavailableReply(), {
        headers: withAssistantHeaders({}, 'offline'),
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
        });

        return await buildLiveResponse({
          provider: candidate.provider,
          modelId: candidate.modelId,
          model: candidate.model,
          messages: modelMessages,
          latestQuery,
          cacheKey,
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
        });
      }
    }

    if (lastError) {
      logAssistantEvent('assistant_degraded_fallback', {
        latestQueryLength: latestQuery.length,
        providerCount: models.length,
        failureKind: classifyAssistantError(lastError),
      });
    }

    return new Response(buildDeterministicFallbackReply(latestQuery), {
      headers: withAssistantHeaders({}, 'degraded'),
    });
  } catch (error) {
    logAssistantError('assistant_route_error', error, {
      latestQueryLength: 0,
    });
    return new Response(getAssistantUnavailableReply(), {
      headers: withAssistantHeaders({}, 'offline'),
    });
  }
}
