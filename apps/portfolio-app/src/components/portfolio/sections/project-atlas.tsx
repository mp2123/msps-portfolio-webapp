"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/portfolio";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";

export function ProjectAtlas() {
  return (
    <section
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
      id="projects"
      data-portfolio-section="true"
    >
      <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-4">
          <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
            Project atlas
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Seven serious projects, kept scannable on the homepage.
          </h2>
          <p className="text-lg leading-relaxed text-zinc-400">
            The homepage stays fast. The full technical depth, proof surfaces, and methodology
            details now live in the dedicated project library.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-4 text-sm text-zinc-300 shadow-[0_0_30px_rgba(34,211,238,0.04)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/65">
            Portfolio rule
          </p>
          <p className="mt-2 max-w-sm leading-relaxed">
            Equal visual seriousness for every major project, without turning the landing page into
            a wall of case-study prose.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => {
          const Icon = project.icon;

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-slate-950/90 to-black/95 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.24)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_24px] opacity-[0.08]" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.25)]" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100 transition-colors group-hover:border-cyan-300/25 group-hover:bg-cyan-300/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="border-white/10 bg-white/5 text-zinc-100">
                    {project.status}
                  </Badge>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/60">
                      {project.meta}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">{project.atlasSummary}</p>
                </div>

                {project.headlineOutcome ? (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      Headline outcome
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-cyan-100">
                      {project.headlineOutcome}
                    </p>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tools.slice(0, 4).map((tool) => (
                    <span
                      key={`${project.id}-${tool}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <p className="text-sm text-zinc-400">{project.impact}</p>
                  <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                    <Link
                      href={`/projects#${project.id}`}
                      onClick={() =>
                        trackPortfolioEvent({
                          eventType: "project_action_click",
                          label: `atlas-${project.id}`,
                          href: `/projects#${project.id}`,
                          section: "projects-atlas",
                          metadata: {
                            projectTitle: project.title,
                          },
                        })
                      }
                    >
                      Deep dive
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
