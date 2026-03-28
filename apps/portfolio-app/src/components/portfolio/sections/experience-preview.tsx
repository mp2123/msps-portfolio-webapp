"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { careerNodes } from "@/content/portfolio";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";

export function ExperiencePreview() {
  return (
    <section
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-18"
      id="experience"
      data-portfolio-section="true"
    >
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-4">
          <Badge className="border-white/10 bg-white/5 text-zinc-100">Career arc preview</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Chicago to Iowa City to Phoenix, with the throughline intact.
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            The full chronology lives on the web CV. The homepage just shows the progression quickly:
            operator foundation, analytics entry, automation buildout, and current recruiter-facing positioning.
          </p>
        </div>
        <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
          <Link
            href="/cv"
            onClick={() =>
              trackPortfolioEvent({
                eventType: "print_cv_open",
                label: "experience-preview-cv",
                href: "/cv",
                section: "experience-preview",
              })
            }
          >
            Open web CV
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {careerNodes.map((node) => (
          <div
            key={node.id}
            className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 shadow-[0_0_30px_rgba(34,211,238,0.04)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">
                  {node.date}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{node.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {node.companyLabel} · {node.location}
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                {node.theme}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">{node.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
