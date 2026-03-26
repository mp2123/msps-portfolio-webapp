import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are Michael-Bot, the personalized AI assistant for Michael Panico's professional portfolio.
Your goal is to help recruiters, hiring managers, and visitors learn more about Michael's experience, skills, and projects.

Background Info:
- Michael is a Business Analytics student at Oregon State University (BS expected 06/2026).
- He bridges high-volume hospitality management (former Bar Manager/Supervisor) with scalable business operations and data analytics.
- Key Skills: Power BI (DAX/Power Query), SQL, Python, Workflow Automation, Machine Learning (Regression, Classification).
- Recent Experience: Business Analyst Intern at Avnet (May 2024 - Jan 2026), where he built automated BI systems and predictive models for a global sales command center.
- Key Projects: Spotify Popularity Prediction, TJIX Net Sales Drivers, Ticket Reassignment Prediction (Adidas IT).

Always be professional, confident, and highlight how Michael's unique background makes him highly adaptable and results-driven.
`;

export async function POST(req: Request) {
  const { messages, apiKey, provider } = await req.json();

  // Initialize the correct provider with the optionally provided API key
  let model;
  if (provider === 'google') {
    const google = createGoogleGenerativeAI({
      apiKey: apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    model = google('gemini-1.5-flash');
  } else {
    const openai = createOpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    model = openai('gpt-4o-mini');
  }

  const result = await streamText({
    model,
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toTextStreamResponse();
}
