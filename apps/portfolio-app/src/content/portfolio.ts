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
    id: "artifact-dashboard",
    type: "dashboard",
    title: "Command Center dashboard walkthrough",
    summary:
      "Planned public-safe dashboard surface for KPI tracking, adoption visibility, and executive reporting flow from the Command Center work.",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    badge: "Sanitized asset slot",
    ctaLabel: "See dashboard",
    note: "Best fit: cropped Power BI screenshots or a short sanitized walkthrough from the Command Center reporting environment.",
    sourceMaterialFolder: "command-center-bi",
    plannedAssetType: "dashboard screenshots or short walkthrough video",
    websiteDestinations: ["Projects", "Translation layer", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-template",
    type: "template",
    title: "Excel or reporting template",
    summary:
      "Planned downloadable scorecard, spreadsheet, or operating template that proves practical systems thinking rather than just presentation polish.",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    badge: "Download-ready slot",
    ctaLabel: "Download template",
    note: "Best fit: a sanitized scorecard, checklist, or reporting template that a manager could actually reuse.",
    sourceMaterialFolder: "shared-proof-assets",
    plannedAssetType: "downloadable template, scorecard, or PDF export",
    websiteDestinations: ["Artifact vault", "Contact", "Assistant"],
  },
  {
    id: "artifact-video",
    type: "video",
    title: "Automation demo",
    summary:
      "Planned short walkthrough of an automation flow, notebook, or reporting pipeline that turns recurring manual work into a repeatable system.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    badge: "Video slot",
    ctaLabel: "Watch demo",
    note: "Best fit: a 30 to 90 second clip showing workflow compression, QA steps, and the final business-facing output.",
    sourceMaterialFolder: "automation-workflows",
    plannedAssetType: "short video or annotated walkthrough",
    websiteDestinations: ["Projects", "Translation layer", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-methodology",
    type: "pdf",
    title: "Case-study methodology brief",
    summary:
      "Planned concise methodology brief that explains business problem, analytical method, QA thinking, and business outcome without exposing sensitive internal detail.",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    badge: "Methodology slot",
    ctaLabel: "View methodology",
    note: "Best fit: a 1 to 2 page PDF or web case-study page for modeling, BI design, or workflow methodology.",
    sourceMaterialFolder: "ticket-routing-prediction",
    plannedAssetType: "PDF brief or web case-study page",
    websiteDestinations: ["Projects", "Artifact vault", "Assistant"],
  },
  {
    id: "artifact-repo",
    type: "repo",
    title: "Gemini/Codex workflow docs repository",
    summary:
      "Public documentation layer for the larger Gemini/Codex workflow automation system, including architecture notes, runbooks, and readiness receipts.",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    badge: "Public repo",
    ctaLabel: "Open docs repo",
    href: "https://github.com/mp2123/Gemini_Codex_Project_1_Docs",
    note: "Public-safe companion repo for a much larger local automation workspace and CLI orchestration system.",
    sourceMaterialFolder: "ai-workflow-automation",
    plannedAssetType: "public documentation repository",
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

export const projects: PortfolioProject[] = [
  {
    id: "avnet-command-center",
    title: "Command Center BI Infrastructure",
    meta: "Power BI + stakeholder adoption",
    oneLiner: "Built scalable reporting systems that turned fragmented sales data into decision-ready operating visibility.",
    atlasSummary:
      "Internal BI infrastructure for KPI clarity, adoption tracking, and recurring executive reporting at Avnet.",
    problem:
      "Stakeholders needed clean opportunity visibility, recurring executive reporting, and adoption tracking inside a growing internal analytics hub.",
    method:
      "Translated stakeholder requests into Power Query transformations, DAX KPI layers, PBIX conversion and adoption models, and recurring reporting workflows backed by QA and documentation.",
    result:
      "Created a more scalable reporting backbone for sales enablement, self-serve decision support, and recurring executive trend reviews.",
    impact: "20+ hours per week removed from manual reporting and follow-up effort",
    impactLabel: "Operational leverage",
    headlineOutcome: "Reporting cadence scaled beyond manual capacity",
    tools: ["Power BI", "DAX", "Power Query", "VBA", "Databricks", "Stakeholder Discovery"],
    tags: ["BI", "Automation", "Executive Reporting"],
    status: "Live",
    sensitivity: "sanitized",
    artifactIds: ["artifact-dashboard", "artifact-template"],
    proofSurfaces: [
      "Sanitized dashboard walkthrough",
      "Automation process note",
      "Reporting template or scorecard handoff",
    ],
    sourceConfidence: "High",
    colSpan: 1,
    icon: Database,
    sourceMaterialFolder: "command-center-bi",
  },
  {
    id: "gemini-codex-workflow",
    title: "Gemini/Codex Workflow Automation",
    meta: "CLI orchestration + durable context",
    oneLiner:
      "Built a file-driven AI orchestration system that keeps Gemini CLI and Codex CLI aligned through durable context, reconciliation, and validation gates.",
    atlasSummary:
      "A multi-agent automation system for context persistence, cross-model handoff, and deterministic session close-out.",
    problem:
      "Long-running AI coding workflows break when context lives only in chat history and when handoffs across models or sessions are not durable.",
    method:
      "Designed a constitution-first repository around declarative intent, a reconciliation loop, blackboard coordination, Gemini/Codex bridge scripts, MCP and n8n automation lanes, and deterministic close-out gates.",
    result:
      "Created a working orchestration environment that treats AI collaboration like an operational system instead of a one-off prompt chain.",
    impact:
      "100 automation scripts, 34 operating docs, and 58 research receipts in a working cross-model CLI workflow ecosystem",
    impactLabel: "System scale",
    headlineOutcome: "Multi-agent AI work stopped depending on chat memory",
    tools: ["Shell", "Python", "Gemini CLI", "Codex CLI", "MCP", "n8n"],
    tags: ["AI Automation", "CLI", "Systems Design"],
    status: "Live",
    sensitivity: "public",
    artifactIds: ["artifact-repo"],
    proofSurfaces: [
      "Public docs repository",
      "Architecture and runbook corpus",
      "Read-only local repo evidence",
    ],
    sourceConfidence: "High",
    colSpan: 1,
    icon: Bot,
    sourceMaterialFolder: "ai-workflow-automation",
  },
  {
    id: "ticket-routing-prediction",
    title: "Ticket Reassignment Prediction",
    meta: "Adidas IT · Gradient Boosting",
    oneLiner:
      "Modeled IT ticket reassignment behavior to reduce escalation friction, rerouting cost, and downtime risk.",
    atlasSummary:
      "Classification model for identifying reassigned tickets before extra handling time and store downtime accumulate.",
    problem:
      "IT support workflows were bleeding time through preventable reassignments and misrouted work.",
    method:
      "Built a Gradient Boosting workflow around ticket urgency, service, category, and geography variables, then evaluated the model with accuracy, recall, precision, and F1.",
    result:
      "Produced a predictive decision aid that could be integrated into ticket submission to flag likely reassignments earlier.",
    impact: "76% accuracy, 86% recall, 73% F1, and roughly $280K in modeled annual labor savings",
    impactLabel: "Model performance",
    headlineOutcome: "Reassigned tickets averaged roughly a week longer to resolve",
    tools: ["Python", "scikit-learn", "Feature Engineering", "Model Evaluation"],
    tags: ["ML", "Prediction", "Ops Analytics"],
    status: "Completed",
    sensitivity: "sanitized",
    artifactIds: ["artifact-methodology"],
    proofSurfaces: ["Final presentation deck", "Adidas service poster", "Methodology brief"],
    sourceConfidence: "High",
    colSpan: 1,
    icon: BrainCircuit,
    sourceMaterialFolder: "ticket-routing-prediction",
  },
  {
    id: "spotify-popularity",
    title: "Spotify Popularity Prediction",
    meta: "Regression + cross-validation",
    oneLiner:
      "Used audio-feature data to model song popularity and translate statistical results into product and marketing recommendations.",
    atlasSummary:
      "Regression case study focused on feature interpretation, model significance, and business-readable music analytics.",
    problem:
      "Needed to understand which measurable audio features aligned most with song popularity rather than relying on intuition alone.",
    method:
      "Applied multiple linear regression, correlation analysis, outlier handling, and cross-validation-oriented model evaluation to a Spotify feature dataset.",
    result:
      "Produced an interpretable modeling case study that surfaced which features mattered most and how that insight could shape promotion strategy.",
    impact:
      "Statistically significant regression work with feature-level interpretation instead of inflated black-box claims",
    impactLabel: "Model insight",
    headlineOutcome: "Turned audio features into business-readable popularity signals",
    tools: ["Python", "Regression", "Cross Validation", "Feature Analysis", "EDA"],
    tags: ["Modeling", "Analytics", "Communication"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-methodology"],
    proofSurfaces: ["Phase 3 report", "Screen-recorded walkthrough", "Project proposal sequence"],
    sourceConfidence: "Medium",
    colSpan: 1,
    icon: LineChart,
    sourceMaterialFolder: "spotify-modeling",
  },
  {
    id: "yelp-review-modeling",
    title: "Yelp Review Rating / Sentiment Modeling",
    meta: "TF-IDF + logistic regression",
    oneLiner:
      "Built a text-mining workflow to classify Yelp review sentiment and surface operational signals from customer language.",
    atlasSummary:
      "Restaurant review modeling using NLP preprocessing, TF-IDF, sentiment analyzers, and logistic regression.",
    problem:
      "Needed a structured way to turn large volumes of review text into actionable insight about customer sentiment and service issues.",
    method:
      "Applied text preprocessing, TF-IDF vectorization, VADER and FLAIR sentiment labeling, and logistic regression classification with standard evaluation metrics.",
    result:
      "Generated a model and business readout that highlighted where customer experience was strong and where wait time or staff issues were driving negative reviews.",
    impact: "High-accuracy sentiment classification paired with operational feedback signals a manager could act on",
    impactLabel: "Decision support",
    headlineOutcome: "Customer review text became a usable service-improvement signal",
    tools: ["Python", "TF-IDF", "Logistic Regression", "VADER", "FLAIR"],
    tags: ["NLP", "Classification", "Customer Insight"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-video", "artifact-methodology"],
    proofSurfaces: ["Final project report", "Final presentation deck", "Recorded walkthrough"],
    sourceConfidence: "Medium",
    colSpan: 1,
    icon: Radar,
    sourceMaterialFolder: "yelp-review-modeling",
  },
  {
    id: "tjix-net-sales-drivers",
    title: "TJIX Net Sales Drivers",
    meta: "Multivariable regression",
    oneLiner:
      "Linked advertising, e-commerce growth, and market trends to a business-readable net-sales growth story for TJX.",
    atlasSummary:
      "Retail and e-commerce driver analysis combining regression, industry benchmarking, and scenario-based recommendation framing.",
    problem:
      "Needed to explain why TJX e-commerce penetration lagged peers and what levers could most credibly increase total net sales.",
    method:
      "Used regression, correlation analysis, scenario modeling, and competitor comparison to relate advertising and e-commerce growth to net-sales outcomes.",
    result:
      "Produced a business-facing argument for deeper e-commerce investment and more deliberate advertising support.",
    impact: "Estimated ~$12.7M in net-sales lift per +$1M of advertising spend in the final model",
    impactLabel: "Revenue signal",
    headlineOutcome: "Advertising and e-commerce were tied directly to net-sales upside",
    tools: ["Regression", "Correlation Analysis", "Excel", "Decision Trees", "Scenario Modeling"],
    tags: ["Commercial Analytics", "Regression", "Strategy"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-methodology", "artifact-template"],
    proofSurfaces: ["Final report", "Supporting workbook", "Scenario summary"],
    sourceConfidence: "High",
    colSpan: 1,
    icon: Radar,
    sourceMaterialFolder: "tjix-net-sales-drivers",
  },
  {
    id: "relational-database-design",
    title: "Relational Database Design",
    meta: "Access + SQL queries",
    oneLiner:
      "Designed a relational database structure to replace spreadsheet-driven project and staffing tracking for a growing IT support business.",
    atlasSummary:
      "Normalized Access database design for projects, employees, tickets, services, and client reporting.",
    problem:
      "A growing IT support firm had outgrown shared spreadsheets, making staffing, project status, and customer support visibility hard to manage cleanly.",
    method:
      "Designed normalized entities, bridge tables, business rules, metadata, and query patterns for projects, employees, clients, assets, tickets, and services.",
    result:
      "Produced a database design built for cleaner reporting, resource allocation visibility, and operational scalability.",
    impact: "Replaced spreadsheet thinking with a relational model built for queryability, consistency, and future growth",
    impactLabel: "Systems design",
    headlineOutcome: "Operations data became structured, relational, and report-ready",
    tools: ["Microsoft Access", "SQL", "ERD Design", "Normalization", "Metadata Design"],
    tags: ["Database", "SQL", "Operations Systems"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-template", "artifact-methodology"],
    proofSurfaces: ["Final report", "Presentation deck", "ERD and metadata narrative"],
    sourceConfidence: "High",
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
    author: "Rashmi Bhakta",
    publicName: "Rashmi",
    role: "Global Sales Enablement Manager",
    company: "Avnet",
    trustLevel: "manager",
  },
  {
    quote:
      "Michael’s attention to detail, interpersonal strength, and instinct for consumer habits helped him grow quickly into management responsibilities. He is dedicated, adaptable, and willing to push himself into new domains.",
    author: "Tania Kedyk",
    publicName: "Tania",
    role: "General Manager",
    company: "Paramount Barco",
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
    artifactId: "artifact-dashboard",
    scannerId: "SCAN-2026-PROOF-1001",
    rawLabel: "Raw stakeholder ask",
    title: "Command Center dashboard walkthrough",
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
    artifactId: "artifact-repo",
    scannerId: "SCAN-2026-PROOF-1002",
    rawLabel: "Agent orchestration contract",
    title: "Workflow docs repository",
    meta: "Durable context / AI orchestration",
    proofLabel: "Public systems proof",
    outcome: "Bridge scripts, blackboard coordination, and reconciliation logic resolve into a public-safe documentation layer that shows the automation system is real.",
    rawFragments: [
      "DECLARE desired_state = INTENT.md",
      "LEASE blackboard.owner = atomic_file_lock",
      "ROUTE bridge = gemini_cli <-> codex_cli",
      "CLOSEOUT = sync + check + archive + push",
    ],
  },
  {
    id: "scanner-template",
    artifactId: "artifact-template",
    scannerId: "SCAN-2026-PROOF-1003",
    rawLabel: "Operator handoff format",
    title: "Reporting template handoff",
    meta: "Scorecard / repeatable ops tool",
    proofLabel: "Download-ready artifact",
    outcome: "Loose spreadsheet logic turns into a polished template that an operator or manager could actually reuse without needing the backstory.",
    rawFragments: [
      "SOURCE = scorecard_columns, owner_flags, labor_notes",
      "STANDARDIZE header_naming, status_bands, date_logic",
      "LOCK formula_cells = true",
      "EXPORT handoff = public_safe_template",
    ],
  },
  {
    id: "scanner-methodology",
    artifactId: "artifact-methodology",
    scannerId: "SCAN-2026-PROOF-1004",
    rawLabel: "Analysis notes",
    title: "Methodology brief",
    meta: "Analytical rigor for recruiters",
    proofLabel: "Business-readable brief",
    outcome: "Model notes, QA choices, and business framing resolve into a short proof brief that explains what was built and why it mattered.",
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

  const experienceSummary = careerNodes
    .map(
      (node) =>
        `- ${node.title} at ${node.companyLabel} (${node.date}, ${node.location}): ${node.summary} Key points: ${node.bullets.join(" ")}`
    )
    .join("\n");

  const recommendationSummary = recommendations
    .map(
      (item) =>
        `- ${item.publicName}, ${item.role} at ${item.company}: "${item.quote}"`
    )
    .join("\n");

  return `You are Michael-Bot, the recruiter-facing portfolio assistant for Michael Panico.
Your job is to answer clearly, confidently, and concisely using the portfolio facts below.
Optimize for recruiters, hiring managers, and stakeholders evaluating Michael for BI, analytics, automation, and operations-intelligence roles.
Answer directly first, then give 2 to 4 concrete proof points, and optionally end with one short follow-up question.

Positioning:
- Michael is a hybrid operator-to-analyst builder with frontline leadership experience and strong business analytics instincts.
- He is strongest when translating messy business needs into repeatable reporting, automation, and decision support.
- Keep the tone sharp, business-oriented, and proof-first.
- Do not fabricate employers, credentials, URLs, or confidential client details.
- When a detail is not public, say it is sanitized or not yet published.

Projects:
${projectSummary}

Artifacts:
- The portfolio includes a sanitized artifact vault for dashboard walkthroughs, downloadable templates, automation demos, and methodology briefs.
- If asked for proof or examples, use the most relevant project first, then mention the artifact vault when helpful.

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
