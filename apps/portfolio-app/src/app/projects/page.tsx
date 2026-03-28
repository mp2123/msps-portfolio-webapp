"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ArtifactGallery } from "@/components/portfolio/sections/artifact-gallery";
import { ArtifactScanner } from "@/components/portfolio/sections/artifact-scanner";
import { ProjectsLibrary } from "@/components/portfolio/sections/projects-library";
import { SectionAnalyticsTracker } from "@/components/portfolio/section-analytics-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header-1";
import { projects } from "@/content/portfolio";

const FloatingAiAssistant = dynamic(
  () =>
    import("@/components/ui/glowing-ai-chat-assistant").then(
      (mod) => mod.FloatingAiAssistant
    ),
  { ssr: false, loading: () => null }
);

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="relative z-10 px-0 pb-24 pt-24">
        <SectionAnalyticsTracker />

        <section
          className="portfolio-section-anchor mx-auto w-full max-w-6xl px-4 pb-6 pt-4"
          id="projects-hero"
          data-portfolio-section="true"
        >
          <div className="rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/8 via-black/45 to-slate-950/80 p-7 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl md:p-9">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                  Project library
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
                  Full project depth, proof surfaces, and recruiter-readable outcomes.
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-zinc-300">
                  The homepage now stays brief by design. This page carries the full project library,
                  translation layer, and artifact vault so every major project can be treated seriously without overcrowding the landing page.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                    <a href="#projects-top">
                      Browse projects
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                    <Link href="/cv">
                      Open web CV
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                    <Link href="/#contact">
                      Contact Michael
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">
                    Major projects
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-white">{projects.length}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Equal-weight case studies spanning BI infrastructure, AI orchestration, predictive analytics, NLP, regression, and database design.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">
                    Proof policy
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                    Public content stays derived and sanitized. Raw resumes, raw decks, and internal source material remain local-only inside the intake system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProjectsLibrary />
        <ArtifactScanner />
        <ArtifactGallery />
      </main>

      <FloatingAiAssistant />
    </div>
  );
}
