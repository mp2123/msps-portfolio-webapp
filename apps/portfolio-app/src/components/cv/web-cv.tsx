import { ArrowUpRight, BadgeCheck, MapPin, FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  contactProfile,
  careerNodes,
  proofMetrics,
  projects,
  recommendations,
  skillsGroups,
} from '@/content/portfolio';

const summaryBullets = [
  'Business analytics builder with a hospitality leadership foundation.',
  'Strongest in Power BI, SQL, Python, workflow automation, and stakeholder translation.',
  'Best fit for BI, analytics, BI developer, and operations-intelligence roles.',
  'Based in Phoenix and currently completing a B.S. in Business Analytics, expected June 2026.',
];

export function WebCv() {
  return (
    <div className="cv-page mx-auto min-h-screen max-w-5xl px-6 pb-16 pt-6 text-white">
      <div className="grid gap-8">
        <section className="rounded-[2rem] border border-white/10 bg-black/25 p-8 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">Web CV</Badge>
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-white">Michael Panico</h2>
                <p className="mt-2 text-lg text-zinc-300">Business Analytics, BI, and Automation</p>
              </div>
              <p className="max-w-3xl text-base leading-relaxed text-zinc-300">
                Portfolio-first CV for recruiters who want the concise version and the deeper proof behind it.
              </p>
            </div>

            <div className="cv-no-print flex flex-wrap gap-2">
              <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                <a href={contactProfile.links.find((link) => link.label === 'Resume PDF')?.href} download>
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                <a href="#contact">
                  <MapPin className="mr-2 h-4 w-4" />
                  Jump to contact
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {summaryBullets.map((bullet) => (
              <div key={bullet} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200">
                {bullet}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {proofMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article key={metric.label} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Icon className="h-5 w-5 text-cyan-200" />
                  <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">{metric.label}</span>
                </div>
                <p className="mt-5 text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-zinc-400">{metric.context}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]" id="experience">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
            <h3 className="text-xl font-semibold text-white">Experience</h3>
            <div className="mt-4 space-y-4">
              {careerNodes.map((node) => (
                <article key={node.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{node.title}</p>
                      <p className="text-xs text-cyan-200/80">{node.companyLabel}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{node.date}</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-300">{node.summary}</p>
                  <ul className="mt-4 space-y-2">
                    {node.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-zinc-200">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
              <h3 className="text-xl font-semibold text-white">Selected Projects</h3>
              <div className="mt-4 space-y-4">
                {projects.map((project) => (
                  <article key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{project.title}</p>
                        <p className="text-xs text-cyan-200/80">{project.meta}</p>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{project.status}</span>
                    </div>
                    <p className="mt-3 text-sm text-zinc-300">{project.oneLiner}</p>
                    <p className="mt-3 text-sm text-zinc-400">{project.impactLabel}: {project.impact}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
              <h3 className="text-xl font-semibold text-white">Skills</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {skillsGroups.map((group) => (
                  <div key={group.category} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{group.category}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-zinc-100">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2" id="recommendations">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-6">
            <h3 className="text-xl font-semibold text-white">Recommendations</h3>
            <div className="mt-4 space-y-4">
              {recommendations.map((rec) => (
                <blockquote key={`${rec.publicName}-${rec.company}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm leading-relaxed text-zinc-300">{rec.quote}</p>
                  <footer className="mt-4 text-sm">
                    <p className="font-semibold text-white">{rec.publicName}</p>
                    <p className="text-zinc-400">{rec.role} · {rec.company}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          <section className="rounded-[1.75rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-black/35 to-black/50 p-6" id="contact">
            <h3 className="text-xl font-semibold text-white">Contact</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              {contactProfile.availability}
            </p>
            <div className="mt-4 space-y-3 text-sm text-zinc-200">
              <p>{contactProfile.location}</p>
              <p>{contactProfile.links.find((link) => link.label === 'Direct Email')?.helperText}</p>
              <p>{contactProfile.links.find((link) => link.label === 'LinkedIn')?.helperText}</p>
              <p>{contactProfile.links.find((link) => link.label === 'GitHub')?.helperText}</p>
            </div>
            <div className="cv-no-print mt-6 flex flex-wrap gap-3">
              {contactProfile.links.map((link) => {
                if (!link.href) return null;

                const isExternal = link.href.startsWith('http');
                return (
                  <Button key={link.label} asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
                    <a href={link.href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined} download={link.href.endsWith('.pdf') ? true : undefined}>
                      {link.label}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
