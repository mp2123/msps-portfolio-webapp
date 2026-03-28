"use client";

import dynamic from "next/dynamic";

import { HospitalityStory } from "@/components/portfolio/sections/hospitality-story";
import { SkillsMatrix } from "@/components/ui/skills-matrix";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { Badge } from "@/components/ui/badge";
import { careerNodes, skillsGroups } from "@/content/portfolio";

const ExperienceGlobe = dynamic(
  () =>
    import("@/components/portfolio/graphics/experience-globe").then(
      (mod) => mod.ExperienceGlobe
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-black/30 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_52%)]" />
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`cv-globe-placeholder-${index}`}
              className="min-h-[6.5rem] rounded-[1.5rem] border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    ),
  }
);

export function CvDeepDive() {
  const capabilityPillars = [
    {
      label: "Analytics systems",
      value: "Power BI, DAX, Power Query, SQL, KPI design, and reporting architecture.",
    },
    {
      label: "Automation rigor",
      value: "Workflow cleanup, QA thinking, documentation, and recurring-output reliability.",
    },
    {
      label: "Operator translation",
      value: "Stakeholder framing, pressure handling, prioritization, and people-facing execution.",
    },
  ];

  return (
    <div className="cv-no-print mt-10 space-y-10">
      <section
        className="portfolio-section-anchor section-glow grid-noise rounded-[2rem] border border-white/10 bg-black/25 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl"
        id="experience-visuals"
        data-portfolio-section="true"
      >
        <div className="mb-10 grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-end">
          <div className="max-w-3xl space-y-4">
            <Badge className="border-white/10 bg-white/5 text-zinc-100">Experience visuals</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Geography, stage progression, and systems-thinking context.
            </h2>
            <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
              This is the deeper visual layer for the career arc: where the geography, stage sequencing,
              and recruiter-facing positioning all connect without crowding the homepage.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-400/8 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">
                Globe mode
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                A live route map across Chicago, Iowa City, and Phoenix with stage cards that refocus the
                story in place.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">
                Systems map
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                A single orbital stage model shows how the operator, analytics, automation, and
                portfolio-builder phases connect.
              </p>
            </div>
          </div>
        </div>
        <ExperienceGlobe />
        <div className="mt-10">
          <RadialOrbitalTimeline timelineData={careerNodes} />
        </div>
      </section>

      <section
        id="cv-advantage"
        className="rounded-[2rem] border border-white/10 bg-black/25 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl"
      >
        <HospitalityStory />
      </section>

      <section
        id="cv-capabilities"
        className="rounded-[2rem] border border-white/10 bg-black/20 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl"
      >
        <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
          <div className="space-y-5 px-2 pt-2">
            <Badge className="border-white/10 bg-white/5 text-zinc-100">Capabilities matrix</Badge>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Full technical capability view, organized for deeper review.
              </h2>
              <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
                The homepage handles the first-pass skim. This section keeps the deeper technical surface
                available in a more deliberate, review-friendly layout.
              </p>
            </div>
            <div className="grid gap-3">
              {capabilityPillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="rounded-[1.4rem] border border-white/10 bg-black/25 px-4 py-4 shadow-[0_0_24px_rgba(34,211,238,0.05)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">
                    {pillar.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{pillar.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <SkillsMatrix groups={skillsGroups} className="max-w-none px-0 py-0" />
          </div>
        </div>
      </section>
    </div>
  );
}
