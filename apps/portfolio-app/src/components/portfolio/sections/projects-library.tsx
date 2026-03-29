"use client";

import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArtifactById, projects } from "@/content/portfolio";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";

type ArtifactRecord = NonNullable<ReturnType<typeof getArtifactById>>;

export function ProjectsLibrary() {
  return (
    <section
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
      id="projects-top"
      data-portfolio-section="true"
    >
      <div className="mb-14 max-w-4xl space-y-4">
        <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
          Project library
        </Badge>
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
          Equal-weight project depth, without homepage bloat.
        </h2>
        <p className="text-lg leading-relaxed text-zinc-400 md:text-xl">
          This is the canonical project surface for the portfolio. Every major project gets the
          same level of seriousness: problem, method, result, public-safe proof path, and recruiter-readable outcome.
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project) => {
          const Icon = project.icon;
          const artifacts = project.artifactIds
            .map((artifactId) => getArtifactById(artifactId))
            .filter((artifact): artifact is ArtifactRecord => Boolean(artifact));

          return (
            <article
              key={project.id}
              id={project.id}
              data-portfolio-section="true"
              className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-slate-950/90 to-black/95 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.24)] md:p-8"
            >
              <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/60">
                          {project.meta}
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                          {project.title}
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Badge variant="secondary" className="border-white/10 bg-white/5 text-zinc-100">
                        {project.status}
                      </Badge>
                      <Badge variant="secondary" className="border-white/10 bg-white/5 text-zinc-100">
                        {project.sensitivity}
                      </Badge>
                      <Badge variant="secondary" className="border-white/10 bg-white/5 text-zinc-100">
                        {project.sourceConfidence} confidence
                      </Badge>
                    </div>
                  </div>

                  <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
                    {project.oneLiner}
                  </p>

                  <div className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-400/8 p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
                      Headline outcome
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-relaxed text-cyan-100">
                      {project.headlineOutcome}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={`${project.id}-${tool}`}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Impact</p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-100">{project.impact}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Proof path</p>
                      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-300">
                        {project.proofSurfaces.map((surface) => (
                          <li key={`${project.id}-${surface}`}>• {surface}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Problem</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-200">{project.problem}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Method</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-200">{project.method}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Result</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-200">{project.result}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {artifacts.map((artifact) => {
                      const targetHref = artifact.href || `/projects/${project.id}`;
                      const isExternal = targetHref.startsWith("http");

                      return (
                        <Button
                          key={`${project.id}-${artifact.id}`}
                          asChild
                          variant="outline"
                          className="justify-between border-white/10 bg-white/5 text-zinc-100 hover:border-cyan-300/25 hover:bg-white/10"
                        >
                          <a
                            href={targetHref}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            onClick={() =>
                              trackPortfolioEvent({
                                eventType: "project_action_click",
                                label: `library-${project.id}-${artifact.id}`,
                                href: targetHref,
                                section: "projects-library",
                                metadata: {
                                  projectTitle: project.title,
                                  artifactTitle: artifact.title,
                                },
                              })
                            }
                          >
                            {artifact.ctaLabel || "View artifact"}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
