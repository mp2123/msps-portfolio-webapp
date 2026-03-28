"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { PublicPageShell } from "@/components/portfolio/public-page-shell";
import { ExperiencePreview } from "@/components/portfolio/sections/experience-preview";
import { HospitalityStory } from "@/components/portfolio/sections/hospitality-story";
import { ProjectAtlas } from "@/components/portfolio/sections/project-atlas";
import { SkillsSnapshot } from "@/components/portfolio/sections/skills-snapshot";
import { SectionAnalyticsTracker } from "@/components/portfolio/section-analytics-tracker";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { RecommendationsCarousel } from "@/components/ui/recommendations";
import { SpiralSignal } from "@/components/portfolio/graphics/spiral-signal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WovenLightHero } from "@/components/ui/woven-light-hero";
import { InvisibleInkWall } from "@/components/portfolio/invisible-ink-wall";
import { openPortfolioAssistant } from "@/lib/portfolio-assistant-ui";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";
import { scrollToPortfolioSection } from "@/lib/portfolio-navigation";
import {
  contactProfile,
  heroContent,
  proofMetrics,
  recommendations,
} from "@/content/portfolio";

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
  const summaryPanels = [
    {
      label: "Best-fit roles",
      value: primaryRoleTargets.join(" · "),
      icon: BriefcaseBusiness,
    },
    {
      label: "Current posture",
      value: "Portfolio first, PDF resume second",
      icon: FileText,
    },
    {
      label: "Location",
      value: contactProfile.location,
      icon: MapPin,
    },
    {
      label: "Current status",
      value: "B.S. Business Analytics, expected June 2026",
      icon: GraduationCap,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/8 via-black/40 to-slate-950/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
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
                <Link
                  href="/projects"
                  onClick={handleTrackedNavigation("section_navigation", "quick-summary-project-library", "/projects", "quick-summary")}
                >
                  Open project library
                </Link>
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
                <Link
                  href="/cv"
                  onClick={handleTrackedNavigation("print_cv_open", "quick-summary-cv", "/cv", "quick-summary")}
                >
                  Open web CV
                </Link>
              </Button>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">
                Recruiter read
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                Strongest when a team needs someone who can absorb messy asks, structure the reporting
                logic, automate the repetitive pieces, and still explain the result clearly to
                stakeholders.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <SpiralSignal
              title="Operator pressure turned into analytics judgment."
              subtitle="The portfolio is built around the same pattern that shows up across Michael's work: absorb ambiguity fast, translate it into a cleaner system, then hand back something stakeholders can actually use."
              labels={["hospitality", "analytics", "automation", "storytelling"]}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {summaryPanels.map((panel) => {
                const Icon = panel.icon;

                return (
                  <div
                    key={panel.label}
                    className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                          {panel.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">{panel.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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

          <button
            type="button"
            onClick={() => {
              openPortfolioAssistant();
              trackPortfolioEvent({
                eventType: "assistant_open",
                label: "contact-guided-tour-assistant",
                section: "contact",
              });
            }}
            className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left transition-colors hover:border-cyan-300/25 hover:bg-white/[0.08]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_24px] opacity-[0.08]" />
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Prefer the guided version?</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  Ask the recruiter assistant about projects, role fit, strongest proof, or where to
                  start.
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">
                  Open recruiter assistant
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function PortfolioHome() {
  return (
    <PublicPageShell>
      <main id="home" className="relative min-h-screen overflow-x-hidden bg-background">
        <WovenLightHero
          eyebrow={heroContent.eyebrow}
          titleLines={heroContent.titleLines ?? [heroContent.title]}
          subtitle={heroContent.subtitle}
          actions={
            <>
              <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                <Link
                  href="/projects"
                  onClick={handleTrackedNavigation(
                    "section_navigation",
                    "hero-project-library",
                    "/projects",
                    "hero"
                  )}
                >
                  Open project library
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              >
                <Link
                  href="/cv"
                  onClick={handleTrackedNavigation("print_cv_open", "hero-web-cv", "/cv", "hero")}
                >
                  Open web CV
                </Link>
              </Button>
            </>
          }
          footerHint={
            <button
              type="button"
              onClick={() => {
                openPortfolioAssistant();
                trackPortfolioEvent({
                  eventType: "assistant_open",
                  label: "hero-assistant-hint",
                  section: "hero",
                });
              }}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-cyan-300/25 hover:bg-white/[0.08] hover:text-white"
            >
              Prefer the guided version? Ask Michael-Bot for a recruiter-ready summary.
            </button>
          }
        />

        <div className="relative px-4 md:px-6 lg:px-8">
          <TerminalWindow className="-mt-16 md:-mt-24">
            <div className="relative z-10 grow bg-transparent">
              <SectionAnalyticsTracker />
              <ProofStrip />
              <QuickRecruiterSummary />
              <ProjectAtlas />
              <SkillsSnapshot />
              <section
                className="portfolio-section-anchor section-glow mx-auto w-full max-w-6xl px-4 py-18"
                id="advantage"
                data-portfolio-section="true"
              >
                <HospitalityStory />
              </section>
              <ExperiencePreview />

              <section
                className="portfolio-section-anchor w-full py-20"
                id="recommendations"
                data-portfolio-section="true"
              >
                <div className="mb-12 space-y-4 text-center">
                  <Badge className="border-white/10 bg-white/5 text-zinc-100">Social proof</Badge>
                  <h2 className="text-4xl font-bold tracking-tight text-white">
                    What leaders noticed first.
                  </h2>
                  <p className="mx-auto max-w-3xl text-lg text-zinc-400">
                    The throughline is consistent: strong judgment under pressure, fast ramp-up, and
                    work that leaves the system better than before.
                  </p>
                </div>
                <RecommendationsCarousel recommendations={recommendations} />
              </section>

              <ContactSection />
              <div aria-hidden="true" className="h-16 md:h-24" />
            </div>
          </TerminalWindow>
        </div>
      </main>
    </PublicPageShell>
  );
}
