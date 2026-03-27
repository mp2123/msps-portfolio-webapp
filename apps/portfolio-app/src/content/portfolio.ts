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
  | "command-center-bi"
  | "ticket-routing-prediction"
  | "automation-workflows"
  | "spotify-modeling"
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
  problem: string;
  method: string;
  result: string;
  impact: string;
  impactLabel: string;
  tools: string[];
  tags: string[];
  status: ProjectStatus;
  sensitivity: SensitivityLevel;
  artifactIds: string[];
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
    problem:
      "Stakeholders needed clean opportunity visibility, recurring executive reporting, and adoption tracking inside a growing internal analytics hub.",
    method:
      "Translated stakeholder requests into Power Query transformations, DAX KPI layers, PBIX conversion and adoption models, and recurring reporting workflows backed by QA and documentation.",
    result:
      "Created a more scalable reporting backbone for sales enablement, self-serve decision support, and recurring executive trend reviews.",
    impact: "20+ hours per week removed from manual reporting and follow-up effort",
    impactLabel: "Operational leverage",
    tools: ["Power BI", "DAX", "Power Query", "VBA", "Databricks", "Stakeholder Discovery"],
    tags: ["BI", "Automation", "Executive Reporting"],
    status: "Live",
    sensitivity: "sanitized",
    artifactIds: ["artifact-dashboard", "artifact-methodology"],
    colSpan: 2,
    icon: Database,
    sourceMaterialFolder: "command-center-bi",
  },
  {
    id: "ticket-routing-prediction",
    title: "Ticket Reassignment Prediction",
    meta: "Python model",
    oneLiner: "Modeled IT ticket reassignment behavior to reduce friction, rerouting cost, and wasted analyst time.",
    problem:
      "IT support workflows were bleeding time through preventable reassignments and misrouted work.",
    method:
      "Built a Gradient Boosting workflow in Python, evaluated model quality with accuracy, recall, and F1, and translated the outputs into a business-facing story recruiters can understand quickly.",
    result:
      "Produced a predictive decision aid tied to an estimated annual savings opportunity.",
    impact: "76% accuracy, 86% recall, 73% F1, and an estimated $280K annual savings opportunity",
    impactLabel: "Model performance",
    tools: ["Python", "scikit-learn", "Feature Engineering", "Model Evaluation"],
    tags: ["ML", "Prediction", "Ops Analytics"],
    status: "Completed",
    sensitivity: "sanitized",
    artifactIds: ["artifact-methodology", "artifact-video"],
    colSpan: 1,
    icon: BrainCircuit,
    sourceMaterialFolder: "ticket-routing-prediction",
  },
  {
    id: "agentic-automation",
    title: "Agentic Workflow Automation",
    meta: "AI orchestration",
    oneLiner: "Designed repeatable AI-assisted workflows that favor durable context, clear handoffs, and practical execution.",
    problem:
      "Many AI demos look impressive but fall apart when work needs to persist across tools, prompts, and real delivery constraints.",
    method:
      "Structured task decomposition, orchestration patterns, and guided prompt flows around realistic execution, durable context, and operator-style rigor.",
    result:
      "Created a stronger bridge between experimentation and reliable day-to-day automation work.",
    impact: "Faster iteration and clearer execution across multi-step analytical workflows",
    impactLabel: "Execution speed",
    tools: ["AI SDKs", "Prompt Design", "Workflow Design", "CLI Tooling"],
    tags: ["AI", "Automation", "Systems Thinking"],
    status: "In Progress",
    sensitivity: "public",
    artifactIds: ["artifact-video"],
    colSpan: 1,
    icon: Bot,
    sourceMaterialFolder: "automation-workflows",
  },
  {
    id: "spotify-popularity",
    title: "Spotify Popularity Modeling",
    meta: "Regression",
    oneLiner: "Used audio feature data to predict song popularity and communicate model quality in business-readable terms.",
    problem:
      "Needed to understand which measurable features were most predictive of popularity rather than relying on intuition alone.",
    method:
      "Applied regression workflows, feature analysis, and k-fold cross-validation to balance interpretability with predictive lift.",
    result:
      "Produced an analytics case study that demonstrates model thinking, evaluation discipline, and communication clarity.",
    impact: "R² above 0.85 in portfolio-ready modeling work",
    impactLabel: "Model quality",
    tools: ["Python", "Regression", "Cross Validation", "EDA"],
    tags: ["Modeling", "Analytics", "Communication"],
    status: "Completed",
    sensitivity: "public",
    artifactIds: ["artifact-methodology"],
    colSpan: 2,
    icon: LineChart,
    sourceMaterialFolder: "spotify-modeling",
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
    linkedProjectIds: ["avnet-command-center", "ticket-routing-prediction", "agentic-automation"],
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
    linkedProjectIds: ["spotify-popularity", "agentic-automation"],
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
    id: "scanner-automation-demo",
    artifactId: "artifact-video",
    scannerId: "SCAN-2026-PROOF-1002",
    rawLabel: "Manual workflow logic",
    title: "Automation demo reel",
    meta: "Workflow compression",
    proofLabel: "Repeatable system proof",
    outcome: "Manual refreshes, QA checks, and handoff friction compress into a short demo that shows how repetitive reporting becomes a durable workflow.",
    rawFragments: [
      "INPUT.manual_refresh_hours = 20_per_week",
      "RUN qa_checkpoint('source parity', 'row totals', 'stakeholder labels')",
      "SCHEDULE workflow = recurring_reporting_cleanup",
      "RETURN output = decision_ready_packet",
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
