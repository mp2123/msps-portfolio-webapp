import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { getPortfolioSystemPrompt } from '@/content/portfolio';
import {
  buildAssistantContextBlock,
  getAssistantAnswerGuidance,
  getAssistantUnavailableReply,
} from '@/content/portfolio-assistant';

export const maxDuration = 30;

type ChatRequestBody = {
  messages?: UIMessage[];
};

const resolveModel = () => {
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const googleKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();

  if (openAiKey) {
    return createOpenAI({ apiKey: openAiKey })('gpt-4o-mini');
  }

  if (googleKey) {
    return createGoogleGenerativeAI({ apiKey: googleKey })('gemini-1.5-flash');
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

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const messages = body.messages ?? [];
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  const latestQuery = getMessageText(latestUserMessage);
  const model = resolveModel();

  if (!model) {
    return new Response(getAssistantUnavailableReply(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const result = await streamText({
    model,
    system: buildAssistantSystemPrompt(latestQuery),
    messages: await convertToModelMessages(messages),
  });

  return result.toTextStreamResponse();
}
