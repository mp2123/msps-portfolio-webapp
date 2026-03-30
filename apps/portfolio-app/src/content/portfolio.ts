import {
  Bot,
  BrainCircuit,
  CalendarRange,
  Database,
  FileText,
  Github,
  Linkedin,
  LineChart,
  Mail,
  Radar,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getProjectEvidence } from "@/content/project-evidence";

export type ArtifactType = "video" | "image" | "dashboard" | "template" | "pdf" | "repo";
export type SensitivityLevel = "public" | "sanitized";
export type ProjectStatus = "Live" | "Completed" | "In Progress";
export type CareerTheme = "hospitality" | "analytics" | "automation";
export type TrustLevel = "manager" | "operator" | "stakeholder";
export type SourceMaterialFolder =
  | "ai-workflow-automation"
  | "command-center-bi"
  | "ticket-routing-prediction"
  | "automation-workflows"
  | "spotify-modeling"
  | "yelp-review-modeling"
  | "relational-database-design"
  | "tjix-net-sales-drivers"
  | "recommendations"
  | "resume-and-positioning"
  | "shared-proof-assets";

export interface HeroContent {
  eyebrow: string;
  title: string;
  titleLines?: string[];
  subtitle: string;
  dateLabel: string;
  scrollLabel: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  bgImageSrc: string;
  posterSrc?: string;
}

export interface ProofMetric {
  label: string;
  value: string;
  context: string;
  icon: LucideIcon;
}

export interface ImpactSignal {
  name: string;
  impact: number;
  metric: string;
  tools: string;
  color: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  summary: string;
  thumbnail: string;
  badge: string;
  ctaLabel: string;
  publicationState: "live" | "request-only" | "planned";
  href?: string;
  note?: string;
  sourceMaterialFolder: SourceMaterialFolder;
  plannedAssetType: string;
  websiteDestinations: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  meta: string;
  oneLiner: string;
  atlasSummary: string;
  problem: string;
  method: string;
  result: string;
  impact: string;
  impactLabel: string;
  headlineOutcome: string;
  tools: string[];
  tags: string[];
  status: ProjectStatus;
  sensitivity: SensitivityLevel;
  artifactIds: string[];
  proofSurfaces: string[];
  sourceConfidence: "High" | "Medium";
  colSpan: 1 | 2;
  icon: LucideIcon;
  sourceMaterialFolder: SourceMaterialFolder;
}

export interface CareerNode {
  id: string;
  title: string;
  companyLabel: string;
  date: string;
  location: string;
  summary: string;
  bullets: string[];
  linkedProjectIds: string[];
  relatedIds: string[];
  theme: CareerTheme;
  status: "completed" | "in-progress" | "pending";
  energy: number;
  icon: LucideIcon;
}

export interface Recommendation {
  quote: string;
  author: string;
  publicName: string;
  role: string;
  company: string;
  trustLevel: TrustLevel;
}

export interface RecruiterPrompt {
  id: string;
  label: string;
  question: string;
}

export interface ContactLink {
  label: string;
  href?: string;
  icon: LucideIcon;
  helperText: string;
}

export interface ContactProfile {
  headline: string;
  location: string;
  availability: string;
  roleTargets: string[];
  note: string;
  links: ContactLink[];
}

export interface SkillsGroup {
  category: string;
  items: string[];
}

export interface ArtifactScannerSignal {
  id: string;
  artifactId: string;
  scannerId: string;
  rawLabel: string;
  title: string;
  meta: string;
  proofLabel: string;
  outcome: string;
  rawFragments: string[];
}

export const heroContent: HeroContent = {
  eyebrow: "Business Analytics / BI",
  title: "Turn messy data into decision-ready reporting systems.",
  titleLines: ["Turn messy data", "into decision-ready reporting systems."],
  subtitle:
    "Power BI, SQL, Python, and workflow automation for teams that need stronger reporting cadence, cleaner KPI definitions, and practical stakeholder-facing execution.",
  dateLabel: "Michael Panico",
  scrollLabel: "Scroll to review proof",
  mediaType: "image",
  mediaSrc:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  bgImageSrc:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
};

export const proofMetrics: ProofMetric[] = [
  {
    label: "Manual work removed",
    value: "20+ hrs/week",
    context: "Automation delivered on recurring reporting workflows.",
    icon: Workflow,
  },
  {
    label: "Predictive model impact",
    value: "$280K",
    context: "Annual savings tied to ticket reassignment prediction work.",
    icon: LineChart,
  },
  {
    label: "Revenue signal surfaced",
    value: "$12.7M",
    context: "Sales-driver analysis tied analytics to commercial decision-making.",
    icon: Radar,
  },
  {
    label: "Operator-side impact",
    value: "35% YoY profit",
    context: "Delivered before the analytics pivot through high-volume hospitality leadership.",
    icon: Users,
  },
];

export const artifacts: Artifact[] = [
  {
    id: "artifact-command-center-brief",
    type: "dashboard",
    title: "Command Center BI proof brief",
    summary:
      "Sanitized recruiter-safe proof page for the Command Center BI work, including the problem, reporting method, measurable outcome, and the request-only path for a deeper walkthrough.",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    badge: "Request-only proof",
    ctaLabel: "Review sanitized brief",
    publicationState: "request-only",
    href: "/projects/avnet-command-center",
    note: "Live dashboards remain private, but this brief documents the BI infrastructure and the recruiter-safe disclosure path.",
    sourceMaterialFolder: "command-center-bi",
    plannedAssetType: "sanitized web brief",
    websiteDestinations: ["Projects", "Translation layer", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-gemini-brief",
    type: "pdf",
    title: "Gemini/Codex workflow proof brief",
    summary:
      "Public-safe brief covering durable context, reconciliation, bridge scripts, and validation gates in the Gemini/Codex workflow system.",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    badge: "Live proof",
    ctaLabel: "Open proof brief",
    publicationState: "live",
    href: "/projects/gemini-codex-workflow",
    note: "Pairs a sanitized web brief with direct links to the public docs repo and architecture receipts.",
    sourceMaterialFolder: "ai-workflow-automation",
    plannedAssetType: "sanitized web brief",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-ticket-routing-brief",
    type: "pdf",
    title: "Ticket routing methodology brief",
    summary:
      "Sanitized project page for the Adidas ticket reassignment model, with the downloadable deck and business-facing methodology path.",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    badge: "Live proof",
    ctaLabel: "Open methodology page",
    publicationState: "live",
    href: "/projects/ticket-routing-prediction",
    note: "The live proof surface is the methodology page and downloadable presentation deck.",
    sourceMaterialFolder: "ticket-routing-prediction",
    plannedAssetType: "methodology page + deck",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-tjix-bundle",
    type: "template",
    title: "TJIX report and workbook bundle",
    summary:
      "Live proof bundle for the TJIX net-sales analysis, including the methodology page, native report, and supporting workbook.",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    badge: "Live proof",
    ctaLabel: "Open report bundle",
    publicationState: "live",
    href: "/projects/tjix-net-sales-drivers",
    note: "This proof surface includes both the commercial regression writeup and the supporting workbook.",
    sourceMaterialFolder: "tjix-net-sales-drivers",
    plannedAssetType: "methodology page + downloads",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-relational-db-brief",
    type: "pdf",
    title: "Relational database design brief",
    summary:
      "Project page covering the normalized database design, ERD logic, and the public-safe PDF walkthrough.",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    badge: "Live proof",
    ctaLabel: "Open database brief",
    publicationState: "live",
    href: "/projects/relational-database-design",
    note: "The live proof surface includes the methodology page and the downloadable ERD PDF.",
    sourceMaterialFolder: "relational-database-design",
    plannedAssetType: "methodology page + PDF",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-yelp-brief",
    type: "video",
    title: "Yelp sentiment modeling brief",
    summary:
      "Project page for the NLP classification workflow, with the recorded walkthrough plus downloadable deck and report.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    badge: "Live proof",
    ctaLabel: "Open NLP brief",
    publicationState: "live",
    href: "/projects/yelp-review-modeling",
    note: "The strongest public proof here is the recorded walkthrough paired with the downloadable project materials.",
    sourceMaterialFolder: "yelp-review-modeling",
    plannedAssetType: "methodology page + walkthrough",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-spotify-brief",
    type: "video",
    title: "Spotify regression brief",
    summary:
      "Sanitized project page for the Spotify regression case study, focused on interpretable modeling and the recorded walkthrough.",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    badge: "Live proof",
    ctaLabel: "Open regression brief",
    publicationState: "live",
    href: "/projects/spotify-popularity",
    note: "The live proof surface is the recorded walkthrough. The full final report is not yet published publicly.",
    sourceMaterialFolder: "spotify-modeling",
    plannedAssetType: "methodology page + walkthrough",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-gemini-repo",
    type: "repo",
    title: "Gemini/Codex workflow docs repository",
    summary:
      "Live public documentation layer for the Gemini/Codex automation system, including architecture notes, runbooks, and readiness receipts.",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    badge: "Live repo",
    ctaLabel: "Open docs repo",
    publicationState: "live",
    href: "https://github.com/mp2123/Gemini_Codex_Project_1_Docs",
    note: "Public-safe companion repo for a much larger local automation workspace and CLI orchestration system.",
    sourceMaterialFolder: "ai-workflow-automation",
    plannedAssetType: "public docs repo",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
];

export const impactSignals: ImpactSignal[] = [
  {
    name: "IT Routing Efficiency",
    impact: 280000,
    metric: "Estimated annual savings",
    tools: "Python, Gradient Boosting",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "Manual Reporting Automation",
    impact: 52000,
    metric: "Value of reclaimed analyst time",
    tools: "VBA, Power Query, DAX",
    color: "from-emerald-400 to-teal-500",
  },
  {
    name: "Sales Driver Identification",
    impact: 12700000,
    metric: "Revenue signal surfaced",
    tools: "Regression, stakeholder analysis",
    color: "from-indigo-400 to-purple-500",
  },
];

const avnetCommandCenterEvidence = getProjectEvidence("avnet-command-center");
const geminiCodexEvidence = getProjectEvidence("gemini-codex-workflow");
const ticketRoutingEvidence = getProjectEvidence("ticket-routing-prediction");
const spotifyEvidence = getProjectEvidence("spotify-popularity");
const yelpEvidence = getProjectEvidence("yelp-review-modeling");
const tjixEvidence = getProjectEvidence("tjix-net-sales-drivers");
const relationalDatabaseEvidence = getProjectEvidence("relational-database-design");

export const projects: PortfolioProject[] = [
  {
    id: "avnet-command-center",
    title: "Command Center BI Infrastructure",
    meta: "Power BI + stakeholder adoption",
    oneLiner: avnetCommandCenterEvidence.oneLiner,
    atlasSummary: avnetCommandCenterEvidence.atlasSummary,
    problem: avnetCommandCenterEvidence.problem,
    method: avnetCommandCenterEvidence.method,
    result: avnetCommandCenterEvidence.result,
    impact: avnetCommandCenterEvidence.impact,
    impactLabel: "Operational leverage",
    headlineOutcome: avnetCommandCenterEvidence.headlineOutcome,
    tools: ["Power BI", "DAX", "Power Query", "VBA", "Databricks", "Stakeholder Discovery"],
    tags: ["BI", "Automation", "Executive Reporting"],
    status: "Live",
    sensitivity: "sanitized",
    artifactIds: ["artifact-command-center-brief"],
    proofSurfaces: avnetCommandCenterEvidence.proofSurfaces,
    sourceConfidence: avnetCommandCenterEvidence.confidence,
    colSpan: 1,
    icon: Database,
    sourceMaterialFolder: "command-center-bi",
  },
  {
    id: "gemini-codex-workflow",
    title: "Gemini/Codex Workflow Automation",
    meta: "CLI orchestration + durable context",
    oneLiner: geminiCodexEvidence.oneLiner,
    atlasSummary: geminiCodexEvidence.atlasSummary,
    problem: geminiCodexEvidence.problem,
    method: geminiCodexEvidence.method,
    result: geminiCodexEvidence.result,
    impact: geminiCodexEvidence.impact,
    impactLabel: "System scale",
    headlineOutcome: geminiCodexEvidence.headlineOutcome,
    tools: ["Shell", "Python", "Gemini CLI", "Codex CLI", "MCP", "n8n"],
    tags: ["AI Automation", "CLI", "Systems Design"],
    status: "Live",
    sensitivity: "public",
    artifactIds: ["artifact-gemini-brief", "artifact-gemini-repo"],
    proofSurfaces: geminiCodexEvidence.proofSurfaces,
    sourceConfidence: geminiCodexEvidence.confidence,
    colSpan: 1,
    icon: Bot,
    sourceMaterialFolder: "ai-workflow-automation",
  },
  {
    id: "ticket-routing-prediction",
    title: "Ticket Reassignment Prediction",
    meta: "Adidas IT · Gradient Boosting",
    oneLiner: ticketRoutingEvidence.oneLiner,
    atlasSummary: ticketRoutingEvidence.atlasSummary,
    problem: ticketRoutingEvidence.problem,
    method: ticketRoutingEvidence.method,
    result: ticketRoutingEvidence.result,
    impact: ticketRoutingEvidence.impact,
    impactLabel: "Model performance",
    headlineOutcome: ticketRoutingEvidence.headlineOutcome,
    tools: ["Python", "scikit-learn", "Feature Engineering", "Model Evaluation"],
    tags: ["ML", "Prediction", "Ops Analytics"],
    status: "Completed",
    sensitivity: "sanitized",
    artifactIds: ["artifact-ticket-routing-brief"],
    proofSurfaces: ticketRoutingEvidence.proofSurfaces,
    sourceConfidence: ticketRoutingEvidence.confidence,
    colSpan: 1,
    icon: BrainCircuit,
    sourceMaterialFolder: "ticket-routing-prediction",
  },
  {
    id: "spotify-popularity",
    title: "Spotify Popularity Prediction",
    meta: "Regression + cross-validation",
    oneLiner: spotifyEvidence.oneLiner,
    atlasSummary: spotifyEvidence.atlasSummary,
    problem: spotifyEvidence.problem,
    method: spotifyEvidence.method,
    result: spotifyEvidence.result,
    impact: spotifyEvidence.impact,
    impactLabel: "Model insight",
    headlineOutcome: spotifyEvidence.headlineOutcome,
    tools: ["Python", "Regression", "Cross Validation", "Feature Analysis", "EDA"],
    tags: ["Modeling", "Analytics", "Communication"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-spotify-brief"],
    proofSurfaces: spotifyEvidence.proofSurfaces,
    sourceConfidence: spotifyEvidence.confidence,
    colSpan: 1,
    icon: LineChart,
    sourceMaterialFolder: "spotify-modeling",
  },
  {
    id: "yelp-review-modeling",
    title: "Yelp Review Rating / Sentiment Modeling",
    meta: "TF-IDF + logistic regression",
    oneLiner: yelpEvidence.oneLiner,
    atlasSummary: yelpEvidence.atlasSummary,
    problem: yelpEvidence.problem,
    method: yelpEvidence.method,
    result: yelpEvidence.result,
    impact: yelpEvidence.impact,
    impactLabel: "Decision support",
    headlineOutcome: yelpEvidence.headlineOutcome,
    tools: ["Python", "TF-IDF", "Logistic Regression", "VADER", "FLAIR"],
    tags: ["NLP", "Classification", "Customer Insight"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-yelp-brief"],
    proofSurfaces: yelpEvidence.proofSurfaces,
    sourceConfidence: yelpEvidence.confidence,
    colSpan: 1,
    icon: Radar,
    sourceMaterialFolder: "yelp-review-modeling",
  },
  {
    id: "tjix-net-sales-drivers",
    title: "TJIX Net Sales Drivers",
    meta: "Multivariable regression",
    oneLiner: tjixEvidence.oneLiner,
    atlasSummary: tjixEvidence.atlasSummary,
    problem: tjixEvidence.problem,
    method: tjixEvidence.method,
    result: tjixEvidence.result,
    impact: tjixEvidence.impact,
    impactLabel: "Revenue signal",
    headlineOutcome: tjixEvidence.headlineOutcome,
    tools: ["Regression", "Correlation Analysis", "Excel", "Decision Trees", "Scenario Modeling"],
    tags: ["Commercial Analytics", "Regression", "Strategy"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-tjix-bundle"],
    proofSurfaces: tjixEvidence.proofSurfaces,
    sourceConfidence: tjixEvidence.confidence,
    colSpan: 1,
    icon: Radar,
    sourceMaterialFolder: "tjix-net-sales-drivers",
  },
  {
    id: "relational-database-design",
    title: "Relational Database Design",
    meta: "Access + SQL queries",
    oneLiner: relationalDatabaseEvidence.oneLiner,
    atlasSummary: relationalDatabaseEvidence.atlasSummary,
    problem: relationalDatabaseEvidence.problem,
    method: relationalDatabaseEvidence.method,
    result: relationalDatabaseEvidence.result,
    impact: relationalDatabaseEvidence.impact,
    impactLabel: "Systems design",
    headlineOutcome: relationalDatabaseEvidence.headlineOutcome,
    tools: ["Microsoft Access", "SQL", "ERD Design", "Normalization", "Metadata Design"],
    tags: ["Database", "SQL", "Operations Systems"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-relational-db-brief"],
    proofSurfaces: relationalDatabaseEvidence.proofSurfaces,
    sourceConfidence: relationalDatabaseEvidence.confidence,
    colSpan: 1,
    icon: Workflow,
    sourceMaterialFolder: "relational-database-design",
  },
];

export const careerNodes: CareerNode[] = [
  {
    id: "hospitality-foundation",
    title: "Frontline Hospitality Leadership",
    companyLabel: "Hilton Hotels & Resorts",
    date: "Aug 2016 - Sep 2024",
    location: "Phoenix, Arizona",
    summary:
      "Built frontline leadership and operational discipline in high-pressure environments where trust, speed, and judgment mattered every shift.",
    bullets: [
      "Promoted from bartender to manager across high-volume hospitality operations.",
      "Drove 35% year-over-year net profit growth and 18% bar profit through labor, purchasing, and process optimization.",
      "Built repeatable systems for staffing, inventory, and guest experience under pressure, a pattern that now carries into analytics and automation work.",
    ],
    linkedProjectIds: ["avnet-command-center"],
    relatedIds: ["avnet-internship", "avnet-expanded"],
    theme: "hospitality",
    status: "completed",
    energy: 88,
    icon: Users,
  },
  {
    id: "avnet-internship",
    title: "Analytics Entry Point",
    companyLabel: "Avnet",
    date: "Jun 2024 - Sep 2024",
    location: "Phoenix, Arizona",
    summary:
      "Moved from business questions to decision-ready metrics by building dashboards, KPI logic, and recurring reporting outputs.",
    bullets: [
      "Built Power BI dashboards and DAX KPI layers for opportunity visibility and executive trend reporting.",
      "Partnered with marketing and data-engineering stakeholders to translate messy asks into scalable reporting outputs.",
      "Established the analyst-to-stakeholder communication style that anchors the current portfolio.",
    ],
    linkedProjectIds: ["avnet-command-center"],
    relatedIds: ["hospitality-foundation", "avnet-expanded"],
    theme: "analytics",
    status: "completed",
    energy: 78,
    icon: CalendarRange,
  },
  {
    id: "avnet-expanded",
    title: "Automation and Predictive Systems",
    companyLabel: "Avnet",
    date: "May 2025 - Jan 2026",
    location: "Phoenix, Arizona",
    summary:
      "Expanded from dashboarding into automation, predictive analytics, adoption-focused BI infrastructure, and teammate enablement across sales enablement.",
    bullets: [
      "Co-led the multi-year Command Center expansion with scalable Power BI models, DAX logic, and Power Query transformations.",
      "Integrated Python-based predictive analytics into business-facing Power BI outputs for opportunity and forecasting use cases.",
      "Automated recurring workflows with VBA and QA checks, saving 20+ hours per week while producing enablement materials that improved self-serve usage.",
    ],
    linkedProjectIds: ["avnet-command-center", "ticket-routing-prediction", "gemini-codex-workflow"],
    relatedIds: ["avnet-internship", "operator-to-builder"],
    theme: "automation",
    status: "in-progress",
    energy: 96,
    icon: Workflow,
  },
  {
    id: "operator-to-builder",
    title: "Portfolio-Led Builder Positioning",
    companyLabel: "Recruiter-facing narrative",
    date: "Now",
    location: "Phoenix, Arizona",
    summary:
      "Packaging operational credibility, analytics rigor, and automation instinct into a recruiter-first personal product.",
    bullets: [
      "Highlights quantified outcomes instead of generic resume bullets.",
      "Frames cross-functional leadership as a technical advantage, not a tangent.",
      "Creates clear paths for BI, analytics, automation, and operations-intelligence conversations.",
    ],
    linkedProjectIds: ["spotify-popularity", "gemini-codex-workflow"],
    relatedIds: ["avnet-expanded"],
    theme: "automation",
    status: "pending",
    energy: 74,
    icon: Sparkles,
  },
];

export const recommendations: Recommendation[] = [
  {
    quote:
      "Michael brought tremendous value to my team during his internship. He quickly understood our business needs and consistently went above and beyond to solve challenges, including turning a manual process that took hours into an automated solution completed in about 30 minutes.",
    author: "R. Bhakta",
    publicName: "Rashmi",
    role: "Global Sales Enablement Manager",
    company: "Avnet",
    trustLevel: "manager",
  },
  {
    quote:
      "Michael’s attention to detail, interpersonal strength, and instinct for consumer habits helped him grow quickly into management responsibilities. He is dedicated, adaptable, and willing to push himself into new domains.",
    author: "T. Kedyk",
    publicName: "Tania",
    role: "General Manager",
    company: "Multi-Unit Hospitality Group",
    trustLevel: "operator",
  },
];

export const recruiterPrompts: RecruiterPrompt[] = [
  {
    id: "hours-saved",
    label: "Hours saved",
    question: "How did Michael save 20+ hours per week through automation and reporting cleanup?",
  },
  {
    id: "role-fit",
    label: "Best-fit roles",
    question: "Which BI, analytics, or automation roles is Michael strongest for right now?",
  },
  {
    id: "best-example",
    label: "Best automation proof",
    question: "What is Michael's strongest automation or systems-thinking example with measurable business value?",
  },
  {
    id: "cross-functional",
    label: "Cross-functional proof",
    question: "What proves Michael can translate between operators, stakeholders, and analytics work?",
  },
];

export const skillsGroups: SkillsGroup[] = [
  {
    category: "Analytics",
    items: ["Power BI", "DAX", "Power Query (M)", "SQL", "KPI Design", "RLS"],
  },
  {
    category: "Programming",
    items: ["Python", "pandas", "scikit-learn", "Regression", "Classification", "Gradient Boosting"],
  },
  {
    category: "Automation",
    items: ["Workflow Automation", "VBA", "Documentation", "QA Thinking", "Repeatable Reporting", "Databricks"],
  },
  {
    category: "Operator Strengths",
    items: ["Stakeholder Translation", "Leadership", "Prioritization", "Crisis Management", "High-Volume Ops", "Team Coaching"],
  },
];

export const artifactScannerSignals: ArtifactScannerSignal[] = [
  {
    id: "scanner-command-center",
    artifactId: "artifact-command-center-brief",
    scannerId: "SCAN-2026-PROOF-1001",
    rawLabel: "Raw stakeholder ask",
    title: "Command Center BI proof brief",
    meta: "Power BI / KPI translation",
    proofLabel: "Executive visibility surface",
    outcome: "Fragmented opportunity reporting becomes a recruiter-ready walkthrough of KPI logic, adoption flow, and operating visibility.",
    rawFragments: [
      "// STAKEHOLDER_ASK: show pipeline clarity by region, owner, and segment",
      "DEFINE KPI.win_rate = DIVIDE([wins],[opportunities])",
      "GROUP BY fiscal_week, account_owner, motion",
      "REQUIRED_OUTPUT = executive trend view + self-serve drill path",
    ],
  },
  {
    id: "scanner-ai-workflow",
    artifactId: "artifact-gemini-brief",
    scannerId: "SCAN-2026-PROOF-1002",
    rawLabel: "Agent orchestration contract",
    title: "Gemini/Codex workflow proof brief",
    meta: "Durable context / AI orchestration",
    proofLabel: "Public systems proof",
    outcome: "Bridge scripts, blackboard coordination, and reconciliation logic resolve into a public-safe proof brief with a live docs-repo handoff.",
    rawFragments: [
      "DECLARE desired_state = INTENT.md",
      "LEASE blackboard.owner = atomic_file_lock",
      "ROUTE bridge = gemini_cli <-> codex_cli",
      "CLOSEOUT = sync + check + archive + push",
    ],
  },
  {
    id: "scanner-template",
    artifactId: "artifact-tjix-bundle",
    scannerId: "SCAN-2026-PROOF-1003",
    rawLabel: "Commercial model handoff",
    title: "TJIX report and workbook bundle",
    meta: "Regression / downloadable proof",
    proofLabel: "Download-ready bundle",
    outcome: "Regression notes, scenario framing, and workbook logic resolve into a downloadable proof bundle that keeps the business story intact.",
    rawFragments: [
      "SOURCE = ad_spend, ecommerce_penetration, competitor_growth",
      "FIT regression = revenue_signal_story",
      "EXPORT report = recruiter_safe_pdf",
      "EXPORT workbook = scenario_model_bundle",
    ],
  },
  {
    id: "scanner-methodology",
    artifactId: "artifact-ticket-routing-brief",
    scannerId: "SCAN-2026-PROOF-1004",
    rawLabel: "Analysis notes",
    title: "Ticket routing methodology brief",
    meta: "Predictive analytics for recruiters",
    proofLabel: "Business-readable methodology",
    outcome: "Model notes, evaluation metrics, and business framing resolve into a concise predictive-analytics proof surface with a live deck handoff.",
    rawFragments: [
      "MODEL = gradient_boosting_classifier",
      "METRICS = accuracy, recall, f1_score",
      "QA = validation_split + stakeholder narrative alignment",
      "DELIVERABLE = one_to_two_page_methodology_brief",
    ],
  },
];

export const contactProfile: ContactProfile = {
  headline: "Open to BI, analytics, BI developer, and automation conversations.",
  location: "Phoenix, Arizona",
  availability:
    "This site is the fuller portfolio and working CV. The PDF resume is available as a fast recruiter handoff for anyone who wants the one-page version before diving deeper.",
  roleTargets: [
    "Business Intelligence Analyst",
    "Data Analyst",
    "BI Developer",
    "Analytics / Automation",
    "Operations Intelligence",
  ],
  note:
    "Sanitized demos, dashboard captures, notebooks, methodology briefs, and downloadable templates can now drop into the portfolio without redesign.",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/michaelspanico",
      icon: Linkedin,
      helperText: "linkedin.com/in/michaelspanico",
    },
    {
      label: "GitHub",
      href: "https://github.com/mp2123",
      icon: Github,
      helperText: "github.com/mp2123",
    },
    {
      label: "Resume PDF",
      href: "/resume/michael-panico-resume.pdf",
      icon: FileText,
      helperText: "Download the current one-page resume",
    },
    {
      label: "Direct Email",
      href: "mailto:michael_s_panico@outlook.com",
      icon: Mail,
      helperText: "michael_s_panico@outlook.com",
    },
  ],
};

export function getArtifactById(id: string) {
  return artifacts.find((artifact) => artifact.id === id);
}

export function getPortfolioSystemPrompt() {
  const projectSummary = projects
    .map(
      (project) =>
        `- ${project.title}: ${project.oneLiner} Impact: ${project.impact}. Tools: ${project.tools.join(", ")}. Sensitivity: ${project.sensitivity}.`
    )
    .join("\n");

  const artifactSummary = artifacts
    .map(
      (artifact) =>
        `- ${artifact.title} (${artifact.publicationState}): ${artifact.summary} Format: ${artifact.plannedAssetType}.${artifact.href ? ` Published path: ${artifact.href}.` : ""}`
    )
    .join("\n");

  const experienceSummary = careerNodes
    .map(
      (node) =>
        `- ${node.title} at ${node.companyLabel} (${node.date}, ${node.location}): ${node.summary} Key points: ${node.bullets.join(" ")}`
    )
    .join("\n");

  const recommendationSummary = recommendations
    .map(
      (item) =>
        `- ${item.publicName}, ${item.role}: "${item.quote}"`
    )
    .join("\n");

  return `You are Michael-Bot, the recruiter-facing portfolio assistant for Michael Panico.
Your job is to answer clearly, confidently, and concisely using the portfolio facts below.
Optimize for recruiters, hiring managers, and stakeholders evaluating Michael for BI, analytics, automation, and operations-intelligence roles.
Use plain text only, not markdown formatting.
Answer directly first, then give 2 to 4 short concrete proof lines.
For comparison questions, use short labels like "Short answer:", "Project A:", "Project B:", and "Proof:".
Keep most answers to 5 short lines or fewer unless the user clearly asks for depth.
Only end with one short follow-up question when it materially helps narrow role fit or proof type.

Positioning:
- Michael is a hybrid operator-to-analyst builder with frontline leadership experience and strong business analytics instincts.
- He is strongest when translating messy business needs into repeatable reporting, automation, and decision support.
- Keep the tone sharp, business-oriented, and proof-first.
- Do not fabricate employers, credentials, URLs, or confidential client details.
- Never invent or rewrite proof links. Only mention an exact published path from the portfolio context, and only when it is actually present.
- When a detail is not public, say it is sanitized or not yet published.

Projects:
${projectSummary}

Artifacts:
${artifactSummary}
- If asked for proof or examples, use the most relevant project first, then explain whether the best proof is live, request-only, or not yet published.

Experience:
${experienceSummary}

Recommendations:
${recommendationSummary}

Role targets:
- ${contactProfile.roleTargets.join("\n- ")}

If asked about contact links or resume downloads, point to the public links in the contact section and the one-page PDF resume.`;
}

export function getPortfolioQuickContext() {
  return {
    heroContent,
    proofMetrics,
    projects,
    careerNodes,
    recommendations,
    recruiterPrompts,
    artifacts,
    contactProfile,
    skillsGroups,
  };
}
