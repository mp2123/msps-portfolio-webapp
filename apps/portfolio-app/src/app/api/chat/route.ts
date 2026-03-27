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
    const googleModelIds = ['gemini-2.5-flash', 'gemini-2.0-flash'];

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
}: ResolvedModel & {
  messages: ModelMessage[];
  latestQuery: string;
}) => {
  const startedAt = Date.now();
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
  });

  return new Response(text, {
    headers: withAssistantHeaders(
      {
        'X-Portfolio-Assistant-Provider': provider,
        'X-Portfolio-Assistant-Model': modelId,
      },
      'live'
    ),
  });
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages ?? [];
    const modelMessages = toModelMessages(messages);
    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    const latestQuery = getMessageText(latestUserMessage);
    const { models, googleKeyPresent, openAiKeyPresent } = resolveModels();

    logAssistantEvent('assistant_request_received', {
      messageCount: messages.length,
      latestQueryLength: latestQuery.length,
      normalizedMessageCount: modelMessages.length,
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
