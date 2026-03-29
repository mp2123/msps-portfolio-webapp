"use client";

import { Badge } from "@/components/ui/badge";
import { proofMetrics } from "@/content/portfolio";

export function ProofStrip() {
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
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Proof over polish, with enough polish to hold attention.
        </h2>
        <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
          This portfolio is designed to answer the recruiter questions that matter fastest:
          what Michael builds, what business leverage he creates, and why his operator-first
          background makes the analytics work stronger.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
