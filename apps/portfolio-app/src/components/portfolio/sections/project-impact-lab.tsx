"use client";

import { LiveDataChart } from "@/components/ui/live-data-chart";
import { ROICalculator } from "@/components/ui/roi-calculator";
import { Badge } from "@/components/ui/badge";

export function ProjectImpactLab() {
  return (
    <section
      id="impact-lab"
      data-portfolio-section="true"
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
    >
      <div className="mb-12 max-w-4xl space-y-4">
        <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
          Impact lab
        </Badge>
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Business leverage deserves its own space, not a cramped homepage corner.
        </h2>
        <p className="text-lg leading-relaxed text-zinc-400">
          This is where the quantified story lives: modeled savings, automation compression,
          and recruiter-readable signal around what the work can do for a team when it moves from
          manual effort into repeatable systems.
        </p>
      </div>

      <div className="space-y-8">
        <LiveDataChart />
        <div className="rounded-[2rem] border border-white/10 bg-black/20 shadow-[0_30px_90px_rgba(2,6,23,0.24)]">
          <ROICalculator />
        </div>
      </div>
    </section>
  );
}
