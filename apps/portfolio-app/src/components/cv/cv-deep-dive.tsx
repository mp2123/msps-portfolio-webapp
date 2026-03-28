"use client";

import dynamic from "next/dynamic";

import { ExperiencePreview } from "@/components/portfolio/sections/experience-preview";
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
  return (
    <div className="cv-no-print mt-10 space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-black/20 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl">
        <div className="max-w-3xl space-y-4">
          <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
            CV companion
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            The visual modules moved here, not out of the portfolio.
          </h2>
          <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
            The homepage now briefs recruiters quickly. This companion layer keeps the heavier
            experience and capability modules available without forcing them into the landing page.
          </p>
        </div>
      </section>

      <ExperiencePreview />

      <section
        className="portfolio-section-anchor section-glow grid-noise rounded-[2rem] border border-white/10 bg-black/25 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl"
        id="experience-visuals"
        data-portfolio-section="true"
      >
        <div className="mb-10 max-w-3xl space-y-4">
          <Badge className="border-white/10 bg-white/5 text-zinc-100">Experience visuals</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Geography, stage progression, and systems-thinking context.
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            These deeper visuals stay available for anyone who wants the full operator-to-analyst
            arc after reading the shorter recruiter-facing CV summary above.
          </p>
        </div>
        <ExperienceGlobe />
        <div className="mt-10">
          <RadialOrbitalTimeline timelineData={careerNodes} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-black/25 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl">
        <HospitalityStory />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-black/20 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl">
        <div className="mb-8 max-w-3xl space-y-4 px-4 pt-2">
          <Badge className="border-white/10 bg-white/5 text-zinc-100">Capabilities matrix</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Full technical capability view, preserved outside the homepage.
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            The compact homepage snapshot handles first-pass scanning. This matrix stays here for
            deeper review without crowding the landing page.
          </p>
        </div>
        <SkillsMatrix groups={skillsGroups} />
      </section>
    </div>
  );
}
