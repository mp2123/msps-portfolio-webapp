export const ASSISTANT_CACHE_VERSION = 'portfolio-assistant-cache-v3';
export const ASSISTANT_CLIENT_CACHE_TTL_MS = 1000 * 60 * 10;
export const ASSISTANT_MEMORY_CACHE_TTL_MS = 1000 * 60 * 5;
export const ASSISTANT_DATABASE_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export type AssistantCacheStrategy = 'exact_transcript' | 'intent_single_turn';

export type AssistantIntent =
  | 'summary'
  | 'role_fit'
  | 'business_impact'
  | 'automation_proof'
  | 'project_comparison'
  | 'hours_saved'
  | 'best_example'
  | 'cross_functional'
  | 'projects_big_data'
  | 'predictive_analytics'
  | 'skills'
  | 'contact_resume'
  | 'location_status'
  | 'general';

export type AssistantCacheMessage = {
  role: string;
  content: string;
};

export type AssistantCacheLookup = {
  transcriptKey: string;
  transcriptFingerprint: string;
  normalizedQuestion: string;
  intent: AssistantIntent;
  intentKey: string | null;
  isSingleTurn: boolean;
};

const INTENT_RULES: Array<{ intent: AssistantIntent; terms: string[] }> = [
  {
    intent: 'project_comparison',
    terms: [
      'compare',
      'versus',
      'vs',
      'difference between',
      'compare command center',
      'compare gemini',
      'compare ticket routing',
      'command center vs',
      'gemini vs',
      'ticket routing vs',
    ],
  },
  {
    intent: 'hours_saved',
    terms: [
      'hours saved',
      '20 hours',
      '20+ hours',
      'save time',
      'time saved',
      'manual work removed',
      'manual reporting',
      'reporting cleanup',
      'reclaimed analyst time',
      'automation saved',
    ],
  },
  {
    intent: 'role_fit',
    terms: [
      'role fit',
      'best fit',
      'best-fit',
      'what roles',
      'strongest for',
      'hire for',
      'right now',
      'best roles',
      'best fit roles',
      'bi roles',
      'analytics roles',
      'automation roles',
      'business intelligence',
      'bi developer',
      'data analyst',
      'operations intelligence',
    ],
  },
  {
    intent: 'business_impact',
    terms: [
      'business impact',
      'strongest business impact',
      'most impact',
      'biggest impact',
      'business value',
      'commercial impact',
      'revenue impact',
      'best business outcome',
      'quantified impact',
      'measurable impact',
      'largest savings',
    ],
  },
  {
    intent: 'automation_proof',
    terms: [
      'automation proof',
      'strongest automation',
      'cleanest proof of automation',
      'best automation proof',
      'workflow automation',
      'systems thinking proof',
      'durable workflow',
      'automation system',
    ],
  },
  {
    intent: 'best_example',
    terms: [
      'best example',
      'strongest example',
      'automation example',
      'systems thinking example',
      'strongest automation',
      'best automation proof',
      'measurable business value',
      'business value',
      'strongest automation or systems thinking example',
    ],
  },
  {
    intent: 'cross_functional',
    terms: [
      'cross functional',
      'cross-functional',
      'stakeholders',
      'operators and stakeholders',
      'work cross',
      'translate between',
      'operators',
      'stakeholder translation',
      'analytics work',
      'cross functional proof',
    ],
  },
  {
    intent: 'projects_big_data',
    terms: [
      'big data',
      'data project',
      'data projects',
      'projects involving data',
      'projects with data',
      'data-heavy project',
      'data work',
      'analytics project',
    ],
  },
  {
    intent: 'predictive_analytics',
    terms: [
      'predictive',
      'prediction',
      'machine learning',
      'ml',
      'gradient boosting',
      'modeling',
      'forecasting',
      'classification',
      'predictive analytics',
    ],
  },
  {
    intent: 'skills',
    terms: [
      'skills',
      'stack',
      'tools',
      'power bi',
      'sql',
      'python',
      'automation skills',
      'tech stack',
      'tooling',
      'dax',
      'power query',
      'databricks',
    ],
  },
  {
    intent: 'contact_resume',
    terms: [
      'resume',
      'cv',
      'contact',
      'email',
      'linkedin',
      'github',
      'resume pdf',
      'one page resume',
      'download resume',
    ],
  },
  {
    intent: 'location_status',
    terms: [
      'location',
      'where is',
      'phoenix',
      'arizona',
      'graduation',
      'status',
      'available',
      'availability',
      'open to',
      'based in',
    ],
  },
  {
    intent: 'summary',
    terms: [
      'summary',
      'one sentence',
      'one-sentence',
      'overview',
      'who is michael',
      'recruiter summary',
      'elevator pitch',
      'quick summary',
      'headline',
    ],
  },
];

export const normalizeAssistantText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const stableStringify = (value: unknown): string => {
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

const hashAssistantKey = (input: string) => {
  let hashA = 0xdeadbeef;
  let hashB = 0x41c6ce57;

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    hashA = Math.imul(hashA ^ code, 2654435761);
    hashB = Math.imul(hashB ^ code, 1597334677);
  }

  hashA =
    Math.imul(hashA ^ (hashA >>> 16), 2246822507) ^
    Math.imul(hashB ^ (hashB >>> 13), 3266489909);
  hashB =
    Math.imul(hashB ^ (hashB >>> 16), 2246822507) ^
    Math.imul(hashA ^ (hashA >>> 13), 3266489909);

  return `${(4294967296 * (2097151 & hashB) + (hashA >>> 0)).toString(36)}`;
};

export const inferAssistantIntent = (query: string): AssistantIntent => {
  const normalizedQuery = normalizeAssistantText(query);

  if (!normalizedQuery) {
    return 'general';
  }

  const matchedRule = INTENT_RULES.find(({ terms }) =>
    terms.some((term) => normalizedQuery.includes(normalizeAssistantText(term)))
  );

  return matchedRule?.intent ?? 'general';
};

export const buildAssistantCacheLookup = (
  messages: AssistantCacheMessage[]
): AssistantCacheLookup => {
  const normalizedMessages = messages
    .map((message) => ({
      role: message.role,
      content: normalizeAssistantText(message.content),
    }))
    .filter((message) => message.content.length > 0);

  const transcriptBase = stableStringify({
    version: ASSISTANT_CACHE_VERSION,
    messages: normalizedMessages,
  });
  const transcriptFingerprint = hashAssistantKey(transcriptBase);
  const transcriptKey = `assistant:transcript:${transcriptFingerprint}`;
  const latestUserMessage = [...normalizedMessages]
    .reverse()
    .find((message) => message.role === 'user');
  const normalizedQuestion = latestUserMessage?.content ?? '';
  const isSingleTurn =
    normalizedMessages.length === 1 && normalizedMessages[0]?.role === 'user';
  const intent = inferAssistantIntent(normalizedQuestion);
  const intentKey =
    isSingleTurn && normalizedQuestion
      ? `assistant:intent:${hashAssistantKey(
          stableStringify({
            version: ASSISTANT_CACHE_VERSION,
            intent,
            normalizedQuestion,
          })
        )}`
      : null;

  return {
    transcriptKey,
    transcriptFingerprint,
    normalizedQuestion,
    intent,
    intentKey,
    isSingleTurn,
  };
};
