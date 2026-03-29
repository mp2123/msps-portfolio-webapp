"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  MapPin,
} from "lucide-react";

import { SpiralSignal } from "@/components/portfolio/graphics/spiral-signal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";
import { scrollToPortfolioSection } from "@/lib/portfolio-navigation";
import { contactProfile, proofMetrics } from "@/content/portfolio";

function handleTrackedNavigation(
  eventType: Parameters<typeof trackPortfolioEvent>[0]["eventType"],
  label: string,
  href?: string,
  section?: string,
) {
  return () =>
    trackPortfolioEvent({ eventType, label, href, section });
}

function handleTrackedSectionNavigation(
  sectionId: string,
  eventType: Parameters<typeof trackPortfolioEvent>[0]["eventType"],
  label: string,
  section?: string,
) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToPortfolioSection(sectionId);
    trackPortfolioEvent({ eventType, label, href: `#${sectionId}`, section });
  };
}

export function QuickRecruiterSummary() {
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
      <div className="rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/8 via-black/40 to-slate-950/80 p-5 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-5">
            <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
              Quick recruiter summary
            </Badge>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                BI builder with operator instincts and measurable automation leverage.
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
                Michael is strongest in business intelligence, analytics, and automation work that turns
                vague stakeholder asks into reporting systems, cleaner KPI logic, and decision-ready outputs.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
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

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            <div className="grid grid-cols-2 gap-4">
              {summaryPanels.map((panel) => {
                const Icon = panel.icon;

                return (
                  <div
                    key={panel.label}
                    className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 sm:p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
                          {panel.label}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-white sm:text-sm">{panel.value}</p>
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
