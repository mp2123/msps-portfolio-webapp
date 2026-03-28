"use client";

import { Badge } from "@/components/ui/badge";
import { skillsGroups } from "@/content/portfolio";

export function SkillsSnapshot() {
  return (
    <section
      className="portfolio-section-anchor mx-auto w-full max-w-6xl px-4 py-16"
      id="skills"
      data-portfolio-section="true"
    >
      <div className="mb-10 max-w-3xl space-y-4">
        <Badge className="border-white/10 bg-white/5 text-zinc-100">Skills snapshot</Badge>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Technical range without a giant taxonomy.
        </h2>
        <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
          Enough signal for a recruiter to understand the stack quickly, without turning the homepage
          into a full capability matrix.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {skillsGroups.map((group) => (
          <div
            key={group.category}
            className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 shadow-[0_0_30px_rgba(34,211,238,0.04)]"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">
              {group.category}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={`${group.category}-${item}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
