import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, generateText, type LanguageModel, type UIMessage } from 'ai';
import { getPortfolioSystemPrompt } from '@/content/portfolio';
import {
  buildAssistantContextBlock,
  getAssistantAnswerGuidance,
  getAssistantUnavailableReply,
} from '@/content/portfolio-assistant';

export const runtime = 'nodejs';
export const maxDuration = 30;

type ChatRequestBody = {
  messages?: UIMessage[];
};

type ResolvedModel = {
  provider: 'google' | 'openai';
  model: LanguageModel;
};

const resolveModel = () => {
  const googleKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (googleKey) {
    return {
      provider: 'google',
      model: createGoogleGenerativeAI({ apiKey: googleKey })('gemini-2.0-flash-001'),
    } satisfies ResolvedModel;
  }

  if (openAiKey) {
    return {
      provider: 'openai',
      model: createOpenAI({ apiKey: openAiKey })('gpt-4o-mini'),
    } satisfies ResolvedModel;
  }

  return null;
};

const getMessageText = (message: UIMessage | undefined) => {
  if (!message) return '';

  return message.parts
    .map((part) => (part.type === 'text' && typeof part.text === 'string' ? part.text : ''))
    .join(' ')
    .trim();
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

const textResponse = (text: string) =>
  new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages ?? [];
    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    const latestQuery = getMessageText(latestUserMessage);
    const resolvedModel = resolveModel();

    if (!resolvedModel) {
      return textResponse(getAssistantUnavailableReply());
    }

    const { text } = await generateText({
      model: resolvedModel.model,
      system: buildAssistantSystemPrompt(latestQuery),
      messages: await convertToModelMessages(messages),
    });

    const reply = text.trim();
    if (reply.length === 0) {
      console.error('assistant_empty_reply', {
        provider: resolvedModel.provider,
        latestQuery,
      });
      return textResponse(buildDeterministicFallbackReply(latestQuery));
    }

    return textResponse(reply);
  } catch (error) {
    console.error('assistant_route_error', error);

    let latestQuery = '';
    try {
      const clonedReq = req.clone();
      const fallbackBody = (await clonedReq.json()) as ChatRequestBody;
      const latestUserMessage = [...(fallbackBody.messages ?? [])]
        .reverse()
        .find((message) => message.role === 'user');
      latestQuery = getMessageText(latestUserMessage);
    } catch {
      latestQuery = '';
    }

    return textResponse(buildDeterministicFallbackReply(latestQuery));
  }
}
