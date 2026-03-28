"use client";

import Link from "next/link";
import { ArrowUpRight, Database, Users, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";

const columns = [
  {
    title: "Operator judgment",
    eyebrow: "Hospitality and frontline leadership",
    icon: Users,
    bullets: [
      "Led teams under pressure, resolved real-time issues, and kept service quality stable while volume stayed high.",
      "Built margin and process awareness before the analytics pivot, which is why the technical work stays practical.",
    ],
    href: "/cv",
    label: "Open work history",
  },
  {
    title: "Analytics translation",
    eyebrow: "BI, automation, and systems thinking",
    icon: Database,
    bullets: [
      "Turns messy stakeholder asks into KPI logic, reporting structure, and repeatable operating outputs.",
      "Pairs BI systems with automation, QA, and documentation so teams can keep using the work after handoff.",
    ],
    href: "/projects#avnet-command-center",
    label: "See project proof",
  },
];

export function AdvantagePreview() {
  return (
    <section
      className="portfolio-section-anchor section-glow mx-auto w-full max-w-6xl px-4 py-18"
      id="advantage"
      data-portfolio-section="true"
    >
      <div className="mb-10 max-w-3xl space-y-4">
        <Badge className="border-white/10 bg-white/5 text-zinc-100">Non-traditional advantage</Badge>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          The value is not just technical skill. It is judgment under pressure plus clean system design.
        </h2>
        <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
          The operator background is not side history. It is the reason the analytics and automation work
          stays grounded in speed, adoption, and business reality.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {columns.map((column) => {
          const Icon = column.icon;

          return (
            <div
              key={column.title}
              className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-slate-950/90 to-black/95 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.24)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">
                    {column.eyebrow}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    {column.title}
                  </h3>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
                {column.bullets.map((bullet) => (
                  <li key={`${column.title}-${bullet}`}>• {bullet}</li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/8 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-100">
                  <Workflow className="h-3.5 w-3.5" />
                  recruiter-readable throughline
                </div>
                <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                  <Link
                    href={column.href}
                    onClick={() =>
                      trackPortfolioEvent({
                        eventType: "section_navigation",
                        label: `advantage-${column.label.toLowerCase().replace(/\s+/g, "-")}`,
                        href: column.href,
                        section: "advantage",
                      })
                    }
                  >
                    {column.label}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
