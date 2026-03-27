import {
  artifacts,
  careerNodes,
  contactProfile,
  heroContent,
  proofMetrics,
  projects,
  recommendations,
  recruiterPrompts,
  skillsGroups,
} from "@/content/portfolio";

export type PortfolioKnowledgeKind =
  | "hero"
  | "proof"
  | "project"
  | "artifact"
  | "career"
  | "recommendation"
  | "contact"
  | "prompt"
  | "skill";

export interface PortfolioKnowledgeDoc {
  id: string;
  kind: PortfolioKnowledgeKind;
  title: string;
  content: string;
  keywords: string[];
  linkedIds: string[];
}

export interface PortfolioAssistantRetrieval {
  query: string;
  docs: PortfolioKnowledgeDoc[];
  contextBlock: string;
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenizeQuery = (value: string) => {
  const tokens = normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 2);

  return Array.from(new Set(tokens));
};

const joinKeywords = (...groups: Array<Array<string> | string>) => {
  const values = groups.flat().map((item) => normalizeText(item));
  return Array.from(new Set(values.filter(Boolean)));
};

const buildProjectDocs = (): PortfolioKnowledgeDoc[] => {
  return projects.map((project) => {
    const careerLinks = careerNodes
      .filter((node) => node.linkedProjectIds.includes(project.id))
      .map((node) => node.id);

    return {
      id: `project-${project.id}`,
      kind: "project",
      title: project.title,
      content: [
        project.oneLiner,
        `Problem: ${project.problem}`,
        `Method: ${project.method}`,
        `Result: ${project.result}`,
        `Impact: ${project.impact}`,
        `Tools: ${project.tools.join(", ")}`,
        `Tags: ${project.tags.join(", ")}`,
      ].join(" "),
      keywords: joinKeywords(project.meta, project.tags, project.tools, project.status, project.sensitivity),
      linkedIds: [...project.artifactIds, ...careerLinks],
    };
  });
};

const buildCareerDocs = (): PortfolioKnowledgeDoc[] => {
  return careerNodes.map((node) => ({
    id: `career-${node.id}`,
    kind: "career",
    title: `${node.title} at ${node.companyLabel}`,
    content: [
      node.summary,
      `Date: ${node.date}`,
      `Location: ${node.location}`,
      `Highlights: ${node.bullets.join(" ")}`,
    ].join(" "),
    keywords: joinKeywords(node.theme, node.status, node.location, node.companyLabel, node.title),
    linkedIds: [...node.linkedProjectIds, ...node.relatedIds],
  }));
};

const buildProofDocs = (): PortfolioKnowledgeDoc[] => {
  return proofMetrics.map((metric) => ({
    id: `proof-${normalizeText(metric.label).replace(/\s+/g, "-")}`,
    kind: "proof",
    title: metric.label,
    content: `${metric.value}. ${metric.context}`,
    keywords: joinKeywords(metric.label, metric.value, metric.context),
    linkedIds: [],
  }));
};

const buildRecommendationDocs = (): PortfolioKnowledgeDoc[] => {
  return recommendations.map((item) => ({
    id: `recommendation-${normalizeText(item.author).replace(/\s+/g, "-")}`,
    kind: "recommendation",
    title: `${item.author}, ${item.role}`,
    content: `"${item.quote}"`,
    keywords: joinKeywords(item.author, item.role, item.company, item.trustLevel),
    linkedIds: [],
  }));
};

const buildArtifactDocs = (): PortfolioKnowledgeDoc[] => {
  return artifacts.map((artifact) => ({
    id: `artifact-${artifact.id}`,
    kind: "artifact",
    title: artifact.title,
    content: [
      artifact.summary,
      `Planned asset: ${artifact.plannedAssetType}.`,
      `Artifact note: ${artifact.note ?? "No additional note yet."}`,
      `Website destinations: ${artifact.websiteDestinations.join(", ")}.`,
    ].join(" "),
    keywords: joinKeywords(
      artifact.type,
      artifact.badge,
      artifact.ctaLabel,
      artifact.sourceMaterialFolder,
      artifact.websiteDestinations
    ),
    linkedIds: [artifact.id, artifact.sourceMaterialFolder],
  }));
};

const buildContactDoc = (): PortfolioKnowledgeDoc => ({
  id: "contact-overview",
  kind: "contact",
  title: "Contact and availability",
  content: [
    contactProfile.headline,
    contactProfile.location,
    contactProfile.availability,
    `Role targets: ${contactProfile.roleTargets.join(", ")}`,
    `Links: ${contactProfile.links
      .map((link) => `${link.label} (${link.helperText})`)
      .join("; ")}`,
  ].join(" "),
  keywords: joinKeywords(contactProfile.headline, contactProfile.location, contactProfile.roleTargets, contactProfile.links.map((link) => link.label)),
  linkedIds: ["projects", "resume", "contact"],
});

const buildHeroDoc = (): PortfolioKnowledgeDoc => ({
  id: "hero-overview",
  kind: "hero",
  title: heroContent.title,
  content: [
    heroContent.eyebrow,
    heroContent.subtitle,
    heroContent.dateLabel,
    heroContent.scrollLabel,
  ].join(" "),
  keywords: joinKeywords(heroContent.eyebrow, heroContent.title, heroContent.subtitle),
  linkedIds: ["proof", "projects", "contact"],
});

const buildPromptDocs = (): PortfolioKnowledgeDoc[] => {
  const promptLinkMap: Record<string, string[]> = {
    "hours-saved": ["project-avnet-command-center", "proof-manual-work-removed"],
    "role-fit": [
      "contact-overview",
      "career-avnet-expanded",
      "skill-analytics",
      "skill-programming",
      "skill-automation",
    ],
    "best-example": ["project-avnet-command-center", "project-ticket-routing-prediction", "project-agentic-automation"],
    "cross-functional": ["career-hospitality-foundation", "career-avnet-internship", "career-avnet-expanded"],
  };

  return recruiterPrompts.map((prompt) => ({
    id: `prompt-${prompt.id}`,
    kind: "prompt",
    title: prompt.label,
    content: prompt.question,
    keywords: joinKeywords(prompt.label, prompt.question),
    linkedIds: promptLinkMap[prompt.id] ?? [],
  }));
};

const buildSkillDocs = (): PortfolioKnowledgeDoc[] => {
  return skillsGroups.map((group) => ({
    id: `skill-${normalizeText(group.category).replace(/\s+/g, "-")}`,
    kind: "skill",
    title: group.category,
    content: group.items.join(", "),
    keywords: joinKeywords(group.category, group.items),
    linkedIds: ["projects", "career"],
  }));
};

export const portfolioKnowledgeDocs: PortfolioKnowledgeDoc[] = [
  buildHeroDoc(),
  ...buildProofDocs(),
  ...buildProjectDocs(),
  ...buildArtifactDocs(),
  ...buildCareerDocs(),
  ...buildRecommendationDocs(),
  buildContactDoc(),
  ...buildPromptDocs(),
  ...buildSkillDocs(),
];

const fallbackKnowledgeDocs: PortfolioKnowledgeDoc[] = [
  buildHeroDoc(),
  buildProofDocs()[0],
  buildContactDoc(),
  buildProjectDocs()[0],
].filter((doc): doc is PortfolioKnowledgeDoc => Boolean(doc));

const scoreDoc = (doc: PortfolioKnowledgeDoc, queryTokens: string[], rawQuery: string) => {
  const normalizedTitle = normalizeText(doc.title);
  const normalizedContent = normalizeText(doc.content);
  const normalizedKeywords = doc.keywords.map((keyword) => normalizeText(keyword));
  const normalizedIds = doc.linkedIds.map((id) => normalizeText(id));
  let score = 0;

  if (rawQuery.includes(normalizedTitle)) {
    score += 8;
  }

  queryTokens.forEach((token) => {
    if (normalizedTitle.includes(token)) {
      score += 6;
    }

    if (normalizedKeywords.some((keyword) => keyword.includes(token))) {
      score += 4;
    }

    if (normalizedContent.includes(token)) {
      score += 2;
    }

    if (normalizedIds.some((id) => id.includes(token))) {
      score += 2;
    }
  });

  if (rawQuery.includes("resume") && doc.kind === "contact") {
    score += 5;
  }

  if (rawQuery.includes("project") && doc.kind === "project") {
    score += 3;
  }

  if (rawQuery.includes("role") || rawQuery.includes("fit")) {
    if (doc.kind === "contact" || doc.kind === "career" || doc.kind === "hero") {
      score += 2;
    }
  }

  return score;
};

export function getRelevantPortfolioDocs(query: string, limit = 5) {
  const rawQuery = normalizeText(query);
  const queryTokens = tokenizeQuery(query);

  const ranked = portfolioKnowledgeDocs
    .map((doc) => ({
      doc,
      score: scoreDoc(doc, queryTokens, rawQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);

  const fallbackDocs = fallbackKnowledgeDocs;
  const selected = (ranked.length > 0 ? ranked : fallbackDocs.map((doc) => ({ doc, score: 1 }))).slice(0, limit);

  return selected.map(({ doc, score }) => ({ ...doc, score }));
}

export function buildAssistantContextBlock(query: string, limit = 5) {
  const docs = getRelevantPortfolioDocs(query, limit);

  const lines = docs.map((doc) => {
    const linked = doc.linkedIds.length > 0 ? ` Linked ids: ${doc.linkedIds.join(", ")}.` : "";

    return `- [${doc.kind}] ${doc.title}: ${doc.content}${linked}`;
  });

  return {
    docs,
    contextBlock: lines.join("\n"),
  } satisfies { docs: Array<PortfolioKnowledgeDoc & { score: number }>; contextBlock: string };
}

export function getAssistantUnavailableReply() {
  return "The portfolio assistant is temporarily unavailable right now. A server model key is not configured yet, so live replies are offline.";
}

export function getAssistantAnswerGuidance() {
  return [
    "Lead with a direct one-sentence answer.",
    "Then give 2 to 4 short proof points drawn from the retrieved portfolio context.",
    "Prefer quantified impact, tools used, and stakeholder outcomes over generic adjectives.",
    "If the user asks about role fit, name the most relevant role titles first and explain why they fit.",
    "If relevant, mention published or planned sanitized proof surfaces such as dashboard walkthroughs, methodology briefs, templates, or automation demos.",
    "If the user asks something not covered in the retrieved context, say it is not yet published or it is sanitized.",
    "Keep the tone recruiter-facing, concise, and business-oriented.",
    "Optionally end with one short follow-up question.",
  ].join(" ");
}
