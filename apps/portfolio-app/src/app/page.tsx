"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

import { PublicPageShell } from "@/components/portfolio/public-page-shell";
import { ProofStrip } from "@/components/portfolio/sections/proof-strip";
import { QuickRecruiterSummary } from "@/components/portfolio/sections/quick-recruiter-summary";
import { ContactSection } from "@/components/portfolio/sections/contact-section";
import { ExperiencePreview } from "@/components/portfolio/sections/experience-preview";
import { HospitalityStory } from "@/components/portfolio/sections/hospitality-story";
import { ProjectAtlas } from "@/components/portfolio/sections/project-atlas";
import { SkillsSnapshot } from "@/components/portfolio/sections/skills-snapshot";
import { SectionAnalyticsTracker } from "@/components/portfolio/section-analytics-tracker";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { RecommendationsCarousel } from "@/components/ui/recommendations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { openPortfolioAssistant } from "@/lib/portfolio-assistant-ui";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";
import {
  heroContent,
  recommendations,
} from "@/content/portfolio";

const WovenLightHero = dynamic(
  () => import("@/components/ui/woven-light-hero").then((mod) => mod.WovenLightHero),
  {
    ssr: false,
    loading: () => (
      <section className="relative isolate overflow-hidden px-4 pb-20 pt-[calc(var(--portfolio-header-height)+2.75rem)] md:px-6 md:pb-24 md:pt-[calc(var(--portfolio-header-height)+4.5rem)] lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.82),rgba(2,6,23,0.98))]" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-var(--portfolio-header-height)-5rem)] max-w-7xl items-center">
          <div className="max-w-4xl space-y-7">
            <div className="h-8 w-48 animate-pulse rounded-full bg-white/10" />
            <div className="space-y-3">
              <div className="h-16 w-full max-w-lg animate-pulse rounded-2xl bg-white/5" />
              <div className="h-16 w-full max-w-md animate-pulse rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

function handleTrackedNavigation(
  eventType: Parameters<typeof trackPortfolioEvent>[0]["eventType"],
  label: string,
  href?: string,
  section?: string,
) {
  return () =>
    trackPortfolioEvent({ eventType, label, href, section });
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

        <div className="relative px-3 sm:px-4 md:px-6 lg:px-8">
          <TerminalWindow className="-mt-16 md:-mt-24">
            <div className="relative z-10 grow bg-transparent">
              <SectionAnalyticsTracker />
              <ProofStrip />
              <QuickRecruiterSummary />
              <ProjectAtlas />
              <SkillsSnapshot />
              <section
                className="portfolio-section-anchor section-glow mx-auto w-full max-w-6xl px-4 py-14 sm:py-18"
                id="advantage"
                data-portfolio-section="true"
              >
                <HospitalityStory />
              </section>
              <ExperiencePreview />

              <section
                className="portfolio-section-anchor w-full py-16 sm:py-20"
                id="recommendations"
                data-portfolio-section="true"
              >
                <div className="mb-12 space-y-4 text-center">
                  <Badge className="border-white/10 bg-white/5 text-zinc-100">Social proof</Badge>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    What leaders noticed first.
                  </h2>
                  <p className="mx-auto max-w-3xl text-base text-zinc-400 sm:text-lg">
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

      {/* Semantic footer */}
      <footer className="border-t border-white/5 bg-background py-6 text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Michael Panico. Built with Next.js &amp; Vercel.</p>
      </footer>
    </PublicPageShell>
  );
}
