export type EvidenceConfidence = "High" | "Medium";
export type EvidenceStrength = "highest" | "strong" | "supporting";

export interface ProjectEvidence {
  projectId: string;
  publicTitle: string;
  oneLiner: string;
  atlasSummary: string;
  problem: string;
  method: string;
  result: string;
  impact: string;
  headlineOutcome: string;
  proofSurfaces: string[];
  roleFitTitles: string[];
  businessImpactSummary: string;
  businessImpactStrength: EvidenceStrength;
  automationProofSummary: string;
  automationStrength: EvidenceStrength;
  comparisonHooks: string[];
  artifactAvailability: string[];
  confidence: EvidenceConfidence;
  projectAliases: string[];
}

export const projectEvidence: ProjectEvidence[] = [
  {
    projectId: "avnet-command-center",
    publicTitle: "Command Center BI Infrastructure",
    oneLiner:
      "Built scalable Power BI reporting systems that turned fragmented sales data into decision-ready operating visibility.",
    atlasSummary:
      "Internal BI infrastructure for KPI clarity, adoption tracking, and recurring executive reporting inside Avnet's Command Center buildout.",
    problem:
      "Stakeholders needed cleaner opportunity visibility, KPI logic, recurring reporting, and adoption tracking inside a growing internal analytics hub.",
    method:
      "Used Power BI, DAX, Power Query (M), VBA automation, stakeholder discovery, QA, and documentation to translate messy asks into durable reporting logic.",
    result:
      "Delivered a reusable reporting backbone for executive visibility, self-serve decision support, and cleaner adoption tracking.",
    impact: "20+ hours/week removed from recurring reporting and follow-up effort.",
    headlineOutcome: "Reporting cadence scaled beyond manual capacity",
    proofSurfaces: [
      "Sanitized BI infrastructure brief",
      "Request-only dashboard walkthrough",
      "Reporting template and automation notes",
    ],
    roleFitTitles: [
      "Business Intelligence Analyst",
      "Data Analyst",
      "BI Developer",
      "Analytics / Automation",
    ],
    businessImpactSummary:
      "Strong internal BI impact proof: recurring reporting was stabilized and roughly 20+ hours per week of manual work was removed.",
    businessImpactStrength: "strong",
    automationProofSummary:
      "Strong automation proof inside a business analytics environment: KPI logic, reporting cleanup, and repeatable workflow compression.",
    automationStrength: "strong",
    comparisonHooks: [
      "internal BI infrastructure",
      "stakeholder translation",
      "reporting automation",
      "KPI design",
      "executive reporting",
    ],
    artifactAvailability: [
      "request-only sanitized walkthrough",
      "sanitized web brief",
    ],
    confidence: "High",
    projectAliases: [
      "command center",
      "avnet",
      "power bi project",
      "command center bi",
    ],
  },
  {
    projectId: "gemini-codex-workflow",
    publicTitle: "Gemini/Codex Workflow Automation",
    oneLiner:
      "Built a file-driven AI orchestration system that keeps Gemini CLI and Codex CLI aligned through durable context, reconciliation, and validation gates.",
    atlasSummary:
      "A multi-agent automation system for durable context, cross-model handoff, and deterministic session close-out.",
    problem:
      "Long-running AI coding workflows break when context, handoff, and validation live only in chat memory.",
    method:
      "Designed a constitution-first automation environment around declarative intent, a reconciliation loop, blackboard coordination, Gemini/Codex bridge scripts, MCP and n8n lanes, and deterministic close-out gates.",
    result:
      "Created a working orchestration environment that treats AI collaboration like an operational system instead of a one-off prompt chain.",
    impact:
      "Working system with 100 scripts, 34 docs, and 58 research artifacts in the read-only source repo.",
    headlineOutcome: "Multi-agent AI work stopped depending on chat memory",
    proofSurfaces: [
      "Sanitized workflow brief",
      "Public docs repository",
      "Architecture and runbook excerpts",
    ],
    roleFitTitles: [
      "Automation Engineer",
      "AI Automation / Workflow Builder",
      "Systems Analyst",
      "Solutions Engineer",
      "Technical Operations",
    ],
    businessImpactSummary:
      "Strongest systems-design proof in the portfolio, showing durable automation architecture rather than a single model demo.",
    businessImpactStrength: "strong",
    automationProofSummary:
      "Strongest pure automation and systems-thinking proof in the portfolio because it demonstrates durable state, bridge scripts, validation gates, and cross-model handoff.",
    automationStrength: "highest",
    comparisonHooks: [
      "AI orchestration",
      "durable context",
      "workflow automation",
      "multi-agent system",
      "Gemini Codex bridge",
    ],
    artifactAvailability: ["live public docs repo", "sanitized web brief"],
    confidence: "High",
    projectAliases: [
      "gemini codex",
      "ai workflow automation",
      "codex workflow",
      "multi-agent automation",
    ],
  },
  {
    projectId: "ticket-routing-prediction",
    publicTitle: "Ticket Reassignment Prediction",
    oneLiner:
      "Modeled IT ticket reassignment behavior to reduce escalation friction, rerouting cost, and downtime risk.",
    atlasSummary:
      "Classification case study for identifying reassigned tickets before extra handling time and store downtime accumulate.",
    problem:
      "IT support workflows were losing time and retail uptime through preventable ticket reassignments.",
    method:
      "Built a Gradient Boosting classifier around urgency, service, category, and geography variables, then evaluated it with accuracy, recall, precision, and F1.",
    result:
      "Produced a predictive decision aid and business-facing routing recommendation that could flag likely reassignments earlier in the ticket flow.",
    impact:
      "Approximately 76.1% accuracy, 85.8% recall, 73.3% F1, and about $277K in annual labor savings, with additional downtime savings cited in the project materials.",
    headlineOutcome: "Preventable routing friction became a measurable prediction target",
    proofSurfaces: [
      "Sanitized methodology page",
      "Downloadable presentation deck",
      "Model evaluation summary",
    ],
    roleFitTitles: [
      "Data Analyst",
      "Predictive Analytics Analyst",
      "BI / Analytics Analyst",
      "Junior Data Scientist",
    ],
    businessImpactSummary:
      "Strongest quantified predictive analytics case in the current portfolio because it combines classification performance with modeled annual labor savings.",
    businessImpactStrength: "strong",
    automationProofSummary:
      "Supporting automation proof because it turns operational friction into a decision aid, but it is primarily predictive analytics rather than workflow automation.",
    automationStrength: "supporting",
    comparisonHooks: [
      "predictive analytics",
      "classification",
      "ticket routing",
      "gradient boosting",
      "operational labor savings",
    ],
    artifactAvailability: ["live methodology page", "downloadable deck"],
    confidence: "High",
    projectAliases: [
      "ticket routing",
      "ticket reassignment",
      "adidas model",
      "gradient boosting",
    ],
  },
  {
    projectId: "spotify-popularity",
    publicTitle: "Spotify Popularity Prediction",
    oneLiner:
      "Used audio-feature data to model song popularity and translate statistical results into business-readable recommendations.",
    atlasSummary:
      "Regression case study focused on feature interpretation, model significance, and communication of statistical results.",
    problem:
      "Needed to understand which measurable audio features aligned with song popularity rather than relying on intuition.",
    method:
      "Applied regression, correlation analysis, exploratory data analysis, outlier handling, and cross-validation-oriented evaluation to a Spotify feature dataset.",
    result:
      "Produced an interpretable modeling case study that showed which features mattered most and how to communicate them without overstating prediction.",
    impact:
      "Statistically significant feature analysis and model interpretation, positioned as an interpretable analytics case study rather than a hard business-impact claim.",
    headlineOutcome: "Turned audio features into business-readable popularity signals",
    proofSurfaces: ["Recorded walkthrough", "Sanitized regression brief"],
    roleFitTitles: [
      "Data Analyst",
      "Analytics Intern",
      "BI Analyst",
      "Junior Modeling / Research Analyst",
    ],
    businessImpactSummary:
      "Useful modeling communication proof, but not the strongest business-impact project because the published evidence is interpretive rather than commercial.",
    businessImpactStrength: "supporting",
    automationProofSummary:
      "Low automation relevance; this project is better used as interpretable modeling proof.",
    automationStrength: "supporting",
    comparisonHooks: [
      "regression",
      "feature analysis",
      "Spotify",
      "model interpretation",
      "cross-validation",
    ],
    artifactAvailability: ["live recorded walkthrough", "sanitized web brief"],
    confidence: "Medium",
    projectAliases: [
      "spotify",
      "popularity prediction",
      "music model",
      "audio features",
    ],
  },
  {
    projectId: "yelp-review-modeling",
    publicTitle: "Yelp Review Rating / Sentiment Modeling",
    oneLiner:
      "Built a text-mining workflow to classify Yelp review sentiment and surface operational signals from customer language.",
    atlasSummary:
      "Restaurant review modeling using NLP preprocessing, TF-IDF, sentiment analyzers, and logistic regression.",
    problem:
      "Needed to turn large volumes of review text into structured signals for customer sentiment and service issues.",
    method:
      "Applied text preprocessing, TF-IDF vectorization, VADER and FLAIR sentiment labeling, and logistic regression classification with standard evaluation metrics.",
    result:
      "Generated a model and business readout that translated review language into repeatable service-improvement signals.",
    impact:
      "High-accuracy sentiment classification paired with operational feedback a manager could act on, as documented in the final project materials.",
    headlineOutcome: "Customer review text became a usable service-improvement signal",
    proofSurfaces: [
      "Recorded walkthrough",
      "Downloadable presentation deck",
      "Methodology report",
    ],
    roleFitTitles: [
      "Data Analyst",
      "Text Analytics Analyst",
      "Analytics / Operations Analyst",
      "NLP Analyst",
    ],
    businessImpactSummary:
      "Strong NLP and classification proof tied to operational decision-making, but less quantified than TJIX or Ticket Routing.",
    businessImpactStrength: "supporting",
    automationProofSummary:
      "Supporting proof for applied analytics and repeatable text-processing, but not a lead automation example.",
    automationStrength: "supporting",
    comparisonHooks: [
      "NLP",
      "text classification",
      "customer sentiment",
      "restaurant reviews",
      "TF-IDF",
    ],
    artifactAvailability: [
      "live recorded walkthrough",
      "downloadable deck",
      "downloadable report",
    ],
    confidence: "Medium",
    projectAliases: [
      "yelp",
      "sentiment model",
      "review classification",
      "tf idf",
    ],
  },
  {
    projectId: "tjix-net-sales-drivers",
    publicTitle: "TJIX Net Sales Drivers",
    oneLiner:
      "Linked advertising, e-commerce growth, and market trends to a business-readable net-sales growth story for TJX.",
    atlasSummary:
      "Commercial analytics case study combining regression, benchmarking, and scenario framing to explain net-sales growth levers.",
    problem:
      "Needed to explain which levers most credibly drive TJX net sales growth and where e-commerce and advertising investment mattered.",
    method:
      "Used regression, correlation analysis, scenario modeling, Excel, and competitor comparison to tie advertising and e-commerce growth to net-sales outcomes.",
    result:
      "Produced a business-facing recommendation for deeper e-commerce and advertising investment backed by regression and benchmark analysis.",
    impact:
      "Final materials attribute roughly $12.7M in net-sales lift per additional $1M in advertising spend.",
    headlineOutcome: "Advertising and e-commerce were tied directly to net-sales upside",
    proofSurfaces: [
      "Live methodology page",
      "Downloadable final report",
      "Downloadable workbook",
    ],
    roleFitTitles: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Commercial Analytics Analyst",
      "Strategy / Analytics Analyst",
    ],
    businessImpactSummary:
      "Strongest commercial business-impact story in the current public portfolio because the regression work is tied to a concrete revenue lever.",
    businessImpactStrength: "highest",
    automationProofSummary:
      "Useful proof of analytical rigor and business framing, but not a lead automation example.",
    automationStrength: "supporting",
    comparisonHooks: [
      "commercial analytics",
      "regression",
      "scenario modeling",
      "revenue upside",
      "advertising spend",
    ],
    artifactAvailability: [
      "live methodology page",
      "downloadable report",
      "downloadable workbook",
    ],
    confidence: "High",
    projectAliases: ["tjix", "tjx", "net sales drivers", "sales drivers"],
  },
  {
    projectId: "relational-database-design",
    publicTitle: "Relational Database Design",
    oneLiner:
      "Designed a relational data model to replace spreadsheet-driven project and staffing tracking for a growing IT support business.",
    atlasSummary:
      "Normalized database design for projects, employees, tickets, services, and client reporting.",
    problem:
      "Spreadsheet-based staffing and project tracking was causing inconsistency, limited analysis, and poor scalability.",
    method:
      "Designed normalized entities, bridge tables, metadata rules, and query patterns for projects, employees, clients, assets, tickets, and services.",
    result:
      "Produced a relational structure built for cleaner reporting, resource visibility, and future operational growth.",
    impact:
      "Replaced spreadsheet thinking with a structured data model built for queryability, reporting consistency, and future operational growth.",
    headlineOutcome: "Operations data became structured, relational, and report-ready",
    proofSurfaces: ["Live methodology page", "Downloadable ERD PDF"],
    roleFitTitles: [
      "BI Analyst",
      "Data Analyst",
      "Junior Business Systems Analyst",
      "Analytics Engineering / Data Model Support",
    ],
    businessImpactSummary:
      "Useful systems-thinking proof showing data structure and reporting readiness, but not the strongest quantified impact story in the portfolio.",
    businessImpactStrength: "supporting",
    automationProofSummary:
      "Supporting systems-design proof because it replaces spreadsheet chaos with a structured model that enables later reporting and automation.",
    automationStrength: "supporting",
    comparisonHooks: [
      "database design",
      "ERD",
      "normalization",
      "Access",
      "SQL",
      "business systems",
    ],
    artifactAvailability: ["live methodology page", "downloadable ERD PDF"],
    confidence: "High",
    projectAliases: [
      "relational database",
      "database design",
      "erd",
      "access sql",
    ],
  },
];

export const projectEvidenceById = Object.fromEntries(
  projectEvidence.map((entry) => [entry.projectId, entry])
) as Record<string, ProjectEvidence>;

export function getProjectEvidence(projectId: string) {
  return projectEvidenceById[projectId];
}
