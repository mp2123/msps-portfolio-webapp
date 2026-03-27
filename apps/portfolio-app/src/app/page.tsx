"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  FileText,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { Header } from "@/components/ui/header-1";
import { ROICalculator } from "@/components/ui/roi-calculator";
import { LiveDataChart } from "@/components/ui/live-data-chart";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { HospitalityStory } from "@/components/portfolio/sections/hospitality-story";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { SkillsMatrix } from "@/components/ui/skills-matrix";
import { RecommendationsCarousel } from "@/components/ui/recommendations";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { SpiralSignal } from "@/components/portfolio/graphics/spiral-signal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvisibleInkWall } from "@/components/portfolio/invisible-ink-wall";
import { SectionAnalyticsTracker } from "@/components/portfolio/section-analytics-tracker";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";
import { scrollToPortfolioSection } from "@/lib/portfolio-navigation";
import {
  artifacts,
  careerNodes,
  contactProfile,
  getArtifactById,
  heroContent,
  proofMetrics,
  projects,
  recommendations,
  skillsGroups,
} from "@/content/portfolio";

const FloatingAiAssistant = dynamic(
  () =>
    import("@/components/ui/glowing-ai-chat-assistant").then(
      (mod) => mod.FloatingAiAssistant
    ),
  { ssr: false, loading: () => null }
);

const ExperienceGlobe = dynamic(
  () =>
    import("@/components/portfolio/graphics/experience-globe").then(
      (mod) => mod.ExperienceGlobe
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-black/30 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_52%)]" />
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`globe-placeholder-${index}`}
              className="min-h-[6.5rem] rounded-[1.5rem] border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    ),
  }
);

const projectCards: BentoItem[] = projects.map((project) => {
  const Icon = project.icon;

  return {
    title: project.title,
    meta: project.meta,
    description: project.oneLiner,
    icon: <Icon className="h-5 w-5 text-cyan-200" />,
    status: project.status,
    tags: project.tags,
    problem: project.problem,
    method: project.method,
    result: project.result,
    proofLabel: project.impactLabel,
    proofValue: project.impact,
    actions: project.artifactIds.map((artifactId) => {
      const artifact = getArtifactById(artifactId);

      return {
        label: artifact?.ctaLabel ?? "Artifact slot",
        href: artifact?.href ?? `#${artifactId}`,
        note: artifact?.note,
      };
    }),
    colSpan: project.colSpan,
  };
});

function handleTrackedNavigation(
  eventType: Parameters<typeof trackPortfolioEvent>[0]["eventType"],
  label: string,
  href?: string,
  section?: string,
  metadata?: Record<string, unknown>
) {
  return () =>
    trackPortfolioEvent({
      eventType,
      label,
      href,
      section,
      metadata,
    });
}

function handleTrackedSectionNavigation(
  sectionId: string,
  eventType: Parameters<typeof trackPortfolioEvent>[0]["eventType"],
  label: string,
  section?: string,
  metadata?: Record<string, unknown>
) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToPortfolioSection(sectionId);
    trackPortfolioEvent({
      eventType,
      label,
      href: `#${sectionId}`,
      section,
      metadata,
    });
  };
}

function ProofStrip() {
  return (
    <section
      className="portfolio-section-anchor mx-auto w-full max-w-6xl px-4 py-12"
      id="proof-strip"
      data-portfolio-section="true"
    >
      <div className="mb-10 max-w-3xl space-y-4">
        <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
          Recruiter-first briefing
        </Badge>
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Proof over polish, with enough polish to hold attention.
        </h2>
        <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
          This portfolio is designed to answer the recruiter questions that matter fastest:
          what Michael builds, what business leverage he creates, and why his operator-first
          background makes the analytics work stronger.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {proofMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-[0_0_30px_rgba(34,211,238,0.04)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  {metric.label}
                </span>
              </div>
              <p className="mt-5 text-2xl font-semibold text-white">{metric.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{metric.context}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QuickRecruiterSummary() {
  const primaryRoleTargets = contactProfile.roleTargets.slice(0, 3);
  const strongestProofs = [
    `${proofMetrics[0]?.value} removed from recurring reporting work`,
    `${proofMetrics[1]?.value} in modeled savings tied to predictive analytics`,
    `${proofMetrics[2]?.value} revenue signal surfaced through commercial analysis`,
    "B.S. in Business Analytics expected June 2026",
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/8 via-black/40 to-slate-950/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
              Quick recruiter summary
            </Badge>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                BI builder with operator instincts and measurable automation leverage.
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
                Michael is strongest in business intelligence, analytics, and automation work that turns
                vague stakeholder asks into reporting systems, cleaner KPI logic, and decision-ready outputs.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {strongestProofs.map((proof) => (
                <div
                  key={proof}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200"
                >
                  <div className="flex items-start gap-3">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span>{proof}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                <a
                  href="#projects"
                  onClick={handleTrackedSectionNavigation("projects", "section_navigation", "quick-summary-projects", "quick-summary")}
                >
                  View projects
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                <a
                  href="#contact"
                  onClick={handleTrackedSectionNavigation("contact", "contact_click", "quick-summary-contact", "quick-summary")}
                >
                  Contact Michael
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                <a
                  href="/resume/michael-panico-resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleTrackedNavigation("resume_download", "quick-summary-resume", "/resume/michael-panico-resume.pdf", "quick-summary")}
                >
                  Download one-page resume
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                <a
                  href="/cv"
                  onClick={handleTrackedNavigation("print_cv_open", "quick-summary-cv", "/cv", "quick-summary")}
                >
                  Open web CV
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <SpiralSignal
              title="Operator pressure turned into analytics judgment."
              subtitle="The portfolio is built around the same pattern that shows up across Michael's work: absorb ambiguity fast, translate it into a cleaner system, then hand back something stakeholders can actually use."
              labels={["hospitality", "analytics", "automation", "storytelling"]}
            />
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Best-fit roles</p>
                  <p className="mt-1 text-sm font-semibold text-white">{primaryRoleTargets.join(" · ")}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Current status</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    B.S. Business Analytics, expected June 2026
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Location</p>
                  <p className="mt-1 text-sm font-semibold text-white">{contactProfile.location}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Portfolio posture</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Portfolio first, PDF resume second
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArtifactGallery() {
  return (
    <section
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
      id="artifacts"
      data-portfolio-section="true"
    >
      <div className="mb-12 max-w-3xl space-y-4">
        <Badge className="border-white/10 bg-white/5 text-zinc-200">Artifact vault</Badge>
        <h2 className="text-4xl font-bold tracking-tight text-white">Sanitized proof slots ready for media.</h2>
        <p className="text-lg text-zinc-400">
          The structure is in place for walkthrough videos, dashboard screenshots, methodology briefs,
          and downloadable templates. Public-safe assets can drop into these slots without redesign.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            id={artifact.id}
            className="portfolio-section-anchor overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 shadow-[0_0_40px_rgba(15,23,42,0.35)] spotlight-border"
          >
            <div className="relative h-56 w-full">
              <Image
                src={artifact.thumbnail}
                alt={artifact.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_34%)]" />
              <div className="absolute left-4 top-4">
                <Badge className="border-white/10 bg-black/40 text-zinc-100">{artifact.badge}</Badge>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.3)]" />
            </div>

            <div className="scanlines relative space-y-4 p-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">{artifact.type}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{artifact.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">{artifact.summary}</p>
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-400">
                {artifact.note}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300">
                <span>{artifact.ctaLabel}</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/65">slot armed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
      id="contact"
      data-portfolio-section="true"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="scanlines relative rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-black/35 to-black/50 p-8 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.3)]" />
          <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">Contact funnel</Badge>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-white">{contactProfile.headline}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            {contactProfile.availability}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <MapPin className="h-4 w-4 text-cyan-200" />
              {contactProfile.location}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-cyan-200" />
              Sanitized proof friendly
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              <a
                href={contactProfile.links.find((link) => link.label === "Resume PDF")?.href}
                target="_blank"
                rel="noreferrer"
                onClick={handleTrackedNavigation("resume_download", "contact-hero-resume", "/resume/michael-panico-resume.pdf", "contact")}
              >
                Download one-page resume
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
              <a
                href={contactProfile.links.find((link) => link.label === "Direct Email")?.href}
                onClick={handleTrackedNavigation("contact_click", "contact-hero-email", "mailto:michael_s_panico@outlook.com", "contact")}
              >
                Email Michael
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {contactProfile.roleTargets.map((role) => (
              <Badge key={role} variant="secondary" className="border-white/10 bg-white/5 text-zinc-100">
                {role}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">
              Hidden in plain sight
            </p>
            <InvisibleInkWall />
          </div>
        </div>

        <div className="grid gap-4">
          {contactProfile.links.map((link) => {
            const Icon = link.icon;
            const isExternal = Boolean(link.href?.startsWith("http"));
            const cardContent = (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-cyan-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{link.label}</p>
                    <p className="text-sm text-zinc-400">{link.helperText}</p>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-cyan-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            );

            if (!link.href) {
              return (
                <div
                  key={link.label}
                  className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-5 backdrop-blur-xl"
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                download={link.href.endsWith(".pdf") ? true : undefined}
                onClick={handleTrackedNavigation(
                  link.label === "Resume PDF" ? "resume_download" : "contact_click",
                  `contact-card-${link.label.toLowerCase().replace(/\s+/g, "-")}`,
                  link.href,
                  "contact"
                )}
                className="group relative overflow-hidden rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-5 backdrop-blur-xl transition-colors hover:border-cyan-400/30 hover:bg-white/5"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {cardContent}
              </a>
            );
          })}

          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_24px] opacity-[0.08]" />
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Asset drop-in notes</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{contactProfile.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PortfolioHome() {
  return (
    <div id="home" className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      <Header />

      <ScrollExpandMedia
        mediaType={heroContent.mediaType}
        mediaSrc={heroContent.mediaSrc}
        posterSrc={heroContent.posterSrc}
        bgImageSrc={heroContent.bgImageSrc}
        eyebrow={heroContent.eyebrow}
        title={heroContent.title}
        titleLines={heroContent.titleLines}
        subtitle={heroContent.subtitle}
        date={heroContent.dateLabel}
        scrollToExpand={heroContent.scrollLabel}
        textBlend
      >
        <TerminalWindow>
          <main className="relative z-10 grow bg-transparent">
            <SectionAnalyticsTracker />
            <ProofStrip />
            <QuickRecruiterSummary />

            <section
              className="portfolio-section-anchor relative z-20 w-full"
              id="roi-calculator"
              data-portfolio-section="true"
            >
              <ROICalculator />
            </section>

            <section
              className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
              id="projects"
              data-portfolio-section="true"
            >
              <div className="mb-16 max-w-3xl space-y-4">
                <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                  Command Center
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Case studies that connect business problems to operating leverage.
                </h2>
                <p className="text-lg leading-relaxed text-zinc-400">
                  Each project is framed around the business question, the analytical method,
                  and the proof a recruiter actually needs to see.
                </p>
              </div>

              <div className="mb-12">
                <LiveDataChart />
              </div>

              <BentoGrid items={projectCards} />
            </section>

            <section
              className="portfolio-section-anchor section-glow grid-noise relative w-full overflow-hidden bg-background/50 py-20"
              id="skills"
              data-portfolio-section="true"
            >
              <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-12 text-center space-y-4">
                  <Badge className="border-white/10 bg-white/5 text-zinc-100">Technical arsenal</Badge>
                  <h2 className="text-4xl font-bold tracking-tight text-white">Capabilities that bridge operators and analysts.</h2>
                  <p className="mx-auto max-w-3xl text-lg text-zinc-400">
                    The stack spans BI, modeling, workflow automation, and the communication discipline
                    needed to move work across teams.
                  </p>
                </div>
                <SkillsMatrix groups={skillsGroups} />
              </div>
            </section>

            <ArtifactGallery />

            <section
              className="portfolio-section-anchor section-glow relative w-full border-y border-border bg-black/30"
              id="advantage"
              data-portfolio-section="true"
            >
              <HospitalityStory />
            </section>

            <section
              className="portfolio-section-anchor section-glow grid-noise relative w-full bg-black/50 py-20"
              id="experience"
              data-portfolio-section="true"
            >
              <div className="mx-auto max-w-6xl px-4">
                <div className="mb-16 max-w-3xl space-y-4">
                  <Badge className="border-white/10 bg-white/5 text-zinc-100">Experience graph</Badge>
                  <h2 className="text-4xl font-bold tracking-tight text-white">A career arc built around pressure, translation, and systems thinking.</h2>
                  <p className="text-lg text-zinc-400">
                    The shift from hospitality leadership to analytics and automation is not a pivot away from execution.
                    It is the reason the technical work stays practical.
                  </p>
                </div>
                <div className="mb-10">
                  <ExperienceGlobe />
                </div>
                <RadialOrbitalTimeline timelineData={careerNodes} />
              </div>
            </section>

            <section
              className="portfolio-section-anchor w-full py-20"
              id="recommendations"
              data-portfolio-section="true"
            >
              <div className="mb-12 text-center space-y-4">
                <Badge className="border-white/10 bg-white/5 text-zinc-100">Social proof</Badge>
                <h2 className="text-4xl font-bold tracking-tight text-white">What leaders noticed first.</h2>
                <p className="mx-auto max-w-3xl text-lg text-zinc-400">
                  The throughline is consistent: strong judgment under pressure, fast ramp-up, and work that leaves the system better than before.
                </p>
              </div>
              <RecommendationsCarousel recommendations={recommendations} />
            </section>

            <ContactSection />
            <div aria-hidden="true" className="h-72 md:h-96" />
          </main>
        </TerminalWindow>
      </ScrollExpandMedia>

      <FloatingAiAssistant />
    </div>
  );
}
