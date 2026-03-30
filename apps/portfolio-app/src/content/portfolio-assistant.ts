import {
  artifacts,
  careerNodes,
  contactProfile,
  getArtifactById,
  heroContent,
  proofMetrics,
  projects,
  recommendations,
  recruiterPrompts,
  skillsGroups,
} from "@/content/portfolio";
import { getProjectEvidence, projectEvidence } from "@/content/project-evidence";

export type PortfolioKnowledgeKind =
  | "hero"
  | "proof"
  | "project"
  | "artifact"
  | "career"
  | "recommendation"
  | "contact"
  | "prompt"
  | "skill"
  | "positioning"
  | "comparison";

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
    const evidence = getProjectEvidence(project.id);
    const artifactLinks = project.artifactIds
      .map((artifactId) => getArtifactById(artifactId))
      .filter((artifact): artifact is NonNullable<ReturnType<typeof getArtifactById>> => Boolean(artifact))
      .map((artifact) =>
        artifact.href
          ? `${artifact.title} [${artifact.publicationState}] -> ${artifact.href}`
          : `${artifact.title} [${artifact.publicationState}]`
      );

    return {
      id: `project-${project.id}`,
      kind: "project",
      title: project.title,
      content: [
        project.oneLiner,
        `Atlas summary: ${project.atlasSummary}`,
        `Problem: ${project.problem}`,
        `Method: ${project.method}`,
        `Result: ${project.result}`,
        `Impact: ${project.impact}`,
        `Headline outcome: ${project.headlineOutcome}`,
        `Proof surfaces: ${project.proofSurfaces.join(", ")}`,
        `Source confidence: ${project.sourceConfidence}`,
        `Tools: ${project.tools.join(", ")}`,
        `Tags: ${project.tags.join(", ")}`,
        artifactLinks.length > 0 ? `Published proof paths: ${artifactLinks.join("; ")}.` : "",
        evidence
          ? `Role fit: ${evidence.roleFitTitles.join(", ")}. Business impact: ${evidence.businessImpactSummary} Automation proof: ${evidence.automationProofSummary} Artifact availability: ${evidence.artifactAvailability.join(", ")}.`
          : "",
      ].join(" "),
      keywords: joinKeywords(
        project.meta,
        project.tags,
        project.tools,
        project.status,
        project.sensitivity,
        project.atlasSummary,
        project.headlineOutcome,
        project.proofSurfaces,
        project.sourceMaterialFolder,
        evidence?.projectAliases ?? [],
        evidence?.comparisonHooks ?? [],
        evidence?.roleFitTitles ?? []
      ),
      linkedIds: [project.id, ...project.artifactIds, ...careerLinks],
    };
  });
};

const buildProjectEvidenceDocs = (): PortfolioKnowledgeDoc[] => {
  return projectEvidence.map((entry) => {
    const project = projects.find((item) => item.id === entry.projectId);
    const artifactIds = project?.artifactIds ?? [];

    return {
      id: `evidence-${entry.projectId}`,
      kind: "positioning",
      title: `${entry.publicTitle} recruiter evidence`,
      content: [
        `Best-fit roles: ${entry.roleFitTitles.join(", ")}.`,
        `Business impact summary: ${entry.businessImpactSummary} Strength: ${entry.businessImpactStrength}.`,
        `Automation proof summary: ${entry.automationProofSummary} Strength: ${entry.automationStrength}.`,
        `Artifact availability: ${entry.artifactAvailability.join(", ")}.`,
        `Confidence: ${entry.confidence}.`,
      ].join(" "),
      keywords: joinKeywords(
        entry.publicTitle,
        entry.projectAliases,
        entry.roleFitTitles,
        entry.comparisonHooks,
        entry.artifactAvailability,
        entry.businessImpactSummary,
        entry.automationProofSummary
      ),
      linkedIds: [entry.projectId, ...artifactIds],
    };
  });
};

const buildPositioningDocs = (): PortfolioKnowledgeDoc[] => {
  const roleFitDoc: PortfolioKnowledgeDoc = {
    id: "positioning-role-fit",
    kind: "positioning",
    title: "Best-fit roles",
    content: [
      "Best current fits: Business Intelligence Analyst, Data Analyst, BI Developer, Analytics / Automation, and junior business systems or analytics-engineering-adjacent roles.",
      "Command Center BI is the clearest proof for BI Analyst, Data Analyst, and BI Developer roles because it combines stakeholder translation, KPI logic, reporting automation, and measurable time savings.",
      "Gemini/Codex Workflow Automation strengthens automation, systems, and technical operations fit because it shows durable context, orchestration, and validation gates.",
      "Ticket Reassignment Prediction and TJIX Net Sales Drivers strengthen predictive analytics and commercial analytics fit.",
      "Relational Database Design supports business systems and data-modeling conversations, while Yelp Review Modeling adds NLP-flavored customer-insight proof without needing overstated claims.",
    ].join(" "),
    keywords: joinKeywords(
      "role fit",
      "best-fit roles",
      "strongest roles",
      "hire for",
      ["Business Intelligence Analyst", "Data Analyst", "BI Developer", "Automation", "business systems"]
    ),
    linkedIds: [
      "avnet-command-center",
      "gemini-codex-workflow",
      "ticket-routing-prediction",
      "tjix-net-sales-drivers",
    ],
  };

  const businessImpactDoc: PortfolioKnowledgeDoc = {
    id: "positioning-business-impact",
    kind: "positioning",
    title: "Strongest business impact",
    content: [
      "Strongest quantified business impact ranking: TJIX Net Sales Drivers first for the commercial upside story, Ticket Reassignment Prediction second for modeled labor savings, Command Center BI third for recurring hours saved, and Gemini/Codex Workflow Automation fourth for systems scale rather than a direct commercial metric.",
      "Use TJIX when the question is about revenue or commercial upside.",
      "Use Ticket Routing when the question is about predictive analytics with measurable savings.",
      "Use Command Center when the question is about BI systems reducing manual reporting work.",
    ].join(" "),
    keywords: joinKeywords(
      "strongest business impact",
      "most impact",
      "biggest impact",
      "business value",
      "revenue impact",
      "hours saved",
      "savings"
    ),
    linkedIds: [
      "tjix-net-sales-drivers",
      "ticket-routing-prediction",
      "avnet-command-center",
      "gemini-codex-workflow",
    ],
  };

  const automationProofDoc: PortfolioKnowledgeDoc = {
    id: "positioning-automation-proof",
    kind: "positioning",
    title: "Strongest automation proof",
    content: [
      "Strongest automation proof ranking: Gemini/Codex Workflow Automation first, Command Center BI second, Ticket Reassignment Prediction third when the question blends analytics with process improvement.",
      "Gemini/Codex is the clearest systems-thinking example because it shows durable state, orchestration, bridge scripts, and deterministic close-out.",
      "Command Center is the clearest business automation example because it turned recurring reporting work into reusable operating infrastructure.",
    ].join(" "),
    keywords: joinKeywords(
      "automation proof",
      "strongest automation",
      "systems thinking",
      "best automation proof",
      "workflow automation"
    ),
    linkedIds: [
      "gemini-codex-workflow",
      "avnet-command-center",
      "ticket-routing-prediction",
    ],
  };

  const comparisonGuideDoc: PortfolioKnowledgeDoc = {
    id: "comparison-projects",
    kind: "comparison",
    title: "Project comparison guide",
    content: [
      "Command Center BI vs Ticket Routing: Command Center is internal BI infrastructure and reporting automation; Ticket Routing is predictive analytics and classification with modeled savings.",
      "Gemini/Codex vs Command Center: Gemini/Codex is automation architecture and durable orchestration; Command Center is stakeholder-facing BI infrastructure and reporting operations.",
      "TJIX vs Ticket Routing: TJIX is commercial regression and revenue framing; Ticket Routing is operational classification and labor-savings prediction.",
      "Relational Database Design vs Command Center: Relational Database Design proves schema thinking, normalization, and operational data structure; Command Center proves stakeholder-facing BI delivery and recurring reporting automation.",
      "Yelp Review Modeling vs Spotify Popularity Prediction: Yelp shows NLP and classification-oriented customer-signal extraction; Spotify is the cleaner regression-and-interpretation case study.",
    ].join(" "),
    keywords: joinKeywords(
      "compare",
      "versus",
      "vs",
      "difference between",
      "comparison",
      projectEvidence.flatMap((entry) => [entry.publicTitle, ...entry.projectAliases])
    ),
    linkedIds: [
      "avnet-command-center",
      "ticket-routing-prediction",
      "gemini-codex-workflow",
      "tjix-net-sales-drivers",
      "relational-database-design",
      "yelp-review-modeling",
      "spotify-popularity",
    ],
  };

  return [roleFitDoc, businessImpactDoc, automationProofDoc, comparisonGuideDoc];
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
    id: `recommendation-${normalizeText(item.publicName).replace(/\s+/g, "-")}`,
    kind: "recommendation",
    title: `${item.publicName}, ${item.role}`,
    content: `"${item.quote}"`,
    keywords: joinKeywords(item.publicName, item.role, item.company, item.trustLevel),
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
      `Availability: ${artifact.publicationState}.`,
      `Artifact format: ${artifact.plannedAssetType}.`,
      `Artifact note: ${artifact.note ?? "No additional note yet."}`,
      `Website destinations: ${artifact.websiteDestinations.join(", ")}.`,
      artifact.href ? `Artifact path: ${artifact.href}.` : "No direct artifact link is published yet.",
    ].join(" "),
    keywords: joinKeywords(
      artifact.type,
      artifact.badge,
      artifact.ctaLabel,
      artifact.publicationState,
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
    "hours-saved": [
      "project-avnet-command-center",
      "evidence-avnet-command-center",
      "proof-manual-work-removed",
      "positioning-business-impact",
    ],
    "role-fit": [
      "positioning-role-fit",
      "evidence-avnet-command-center",
      "evidence-gemini-codex-workflow",
      "contact-overview",
    ],
    "best-example": [
      "positioning-automation-proof",
      "evidence-gemini-codex-workflow",
      "evidence-avnet-command-center",
      "project-ticket-routing-prediction",
    ],
    "cross-functional": [
      "career-hospitality-foundation",
      "career-avnet-internship",
      "career-avnet-expanded",
      "evidence-avnet-command-center",
      "evidence-tjix-net-sales-drivers",
    ],
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
  ...buildPositioningDocs(),
  ...buildProjectDocs(),
  ...buildProjectEvidenceDocs(),
  ...buildArtifactDocs(),
  ...buildCareerDocs(),
  ...buildRecommendationDocs(),
  buildContactDoc(),
  ...buildPromptDocs(),
  ...buildSkillDocs(),
];

const fallbackKnowledgeDocs: PortfolioKnowledgeDoc[] = [
  buildHeroDoc(),
  buildPositioningDocs()[0],
  buildProofDocs()[0],
  buildContactDoc(),
  buildProjectDocs()[0],
  buildProjectEvidenceDocs()[0],
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

    if (doc.kind === "positioning" && normalizedTitle.includes("role")) {
      score += 6;
    }
  }

  if (
    rawQuery.includes("impact") ||
    rawQuery.includes("business value") ||
    rawQuery.includes("revenue") ||
    rawQuery.includes("savings")
  ) {
    if (doc.kind === "positioning" && normalizedTitle.includes("impact")) {
      score += 6;
    }
  }

  if (
    rawQuery.includes("automation") ||
    rawQuery.includes("systems thinking") ||
    rawQuery.includes("workflow")
  ) {
    if (doc.kind === "positioning" && normalizedTitle.includes("automation")) {
      score += 6;
    }
  }

  if (
    rawQuery.includes("compare") ||
    rawQuery.includes("vs") ||
    rawQuery.includes("versus") ||
    rawQuery.includes("difference")
  ) {
    if (doc.kind === "comparison") {
      score += 8;
    }

    if (doc.kind === "project" || doc.kind === "positioning") {
      score += 3;
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
    "Write like a recruiter briefing, not a casual chatbot reply.",
    "Lead with a direct one-sentence answer.",
    "Then give 2 to 4 short proof points drawn from the retrieved portfolio context.",
    "Use plain text only. Do not use markdown emphasis, markdown bullets, or numbered lists.",
    "Prefer short labeled lines or tight proof points over long paragraphs.",
    "Prefer quantified impact, tools used, stakeholder outcomes, and proof availability over generic adjectives.",
    "If the user asks about role fit, name the most relevant role titles first and explain why they fit.",
    "If the user asks about strongest business impact, rank the most defensible quantified outcomes first.",
    "If the user asks about automation proof, lead with the clearest systems or workflow example rather than the flashiest project title.",
    "If the user asks for a comparison, answer in a concise A vs B structure using short labels like 'Short answer:', 'Project A:', 'Project B:', and 'Proof:'.",
    "Do not invent URLs. Only cite an exact proof path that appears in the retrieved context, and otherwise refer to the proof surface by title.",
    "If relevant, mention published or planned sanitized proof surfaces such as dashboard walkthroughs, methodology briefs, templates, or automation demos.",
    "If the user asks something not covered in the retrieved context, say it is not yet published or it is sanitized.",
    "Keep the tone recruiter-facing, concise, business-oriented, and slightly high-conviction.",
    "Keep most answers to 5 short lines or fewer unless the user clearly asks for depth.",
    "Only end with a follow-up question when it materially helps the recruiter narrow role fit or proof type.",
  ].join(" ");
}
