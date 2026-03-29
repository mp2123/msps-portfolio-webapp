"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { artifacts } from "@/content/portfolio";

export function ArtifactGallery() {
  return (
    <section
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
      id="artifacts"
      data-portfolio-section="true"
    >
      <div className="mb-12 max-w-3xl space-y-4">
        <Badge className="border-white/10 bg-white/5 text-zinc-200">Artifact vault</Badge>
        <h2 className="text-4xl font-bold tracking-tight text-white">Proof surfaces, downloads, and recruiter-safe artifacts.</h2>
        <p className="text-lg text-zinc-400">
          This is where public-safe screenshots, short briefs, downloadable templates, and demo
          media will land once each asset is cleared for sharing.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {artifacts.map((artifact) => {
          const isLiveLink = Boolean(artifact.href && !artifact.href.startsWith("#"));

          return (
            <div
              key={artifact.id}
              id={artifact.id}
              data-source-material-folder={artifact.sourceMaterialFolder}
              className="portfolio-section-anchor overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 shadow-[0_0_40px_rgba(15,23,42,0.35)] spotlight-border"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={artifact.thumbnail}
                  alt={artifact.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_34%)]" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge className="border-white/10 bg-black/40 text-zinc-100">{artifact.badge}</Badge>
                  <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                    {artifact.plannedAssetType}
                  </Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.3)]" />
              </div>

              <div className="scanlines relative space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">{artifact.type}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{artifact.title}</h3>
                  </div>
                  <p className="text-right text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    {artifact.websiteDestinations.join(" · ")}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">{artifact.summary}</p>
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-400">
                  {artifact.note}
                </div>
                {isLiveLink ? (
                  <a
                    href={artifact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50 transition-colors hover:bg-cyan-400/15"
                  >
                    <span>{artifact.ctaLabel}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300">
                    <span>{artifact.ctaLabel}</span>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/65">
                      public-safe asset planned
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
