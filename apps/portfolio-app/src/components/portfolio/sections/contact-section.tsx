"use client";

import {
  ArrowUpRight,
  Bot,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { InvisibleInkWall } from "@/components/portfolio/invisible-ink-wall";
import { Badge } from "@/components/ui/badge";
import { ContactModal } from "@/components/forms/contact-modal";
import { Button } from "@/components/ui/button";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";
import { openPortfolioAssistant } from "@/lib/portfolio-assistant-ui";
import { scrollToPortfolioSection } from "@/lib/portfolio-navigation";
import { contactProfile } from "@/content/portfolio";

function handleTrackedNavigation(
  eventType: Parameters<typeof trackPortfolioEvent>[0]["eventType"],
  label: string,
  href?: string,
  section?: string,
) {
  return () =>
    trackPortfolioEvent({ eventType, label, href, section });
}

export function ContactSection() {
  return (
    <section
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-16 sm:py-20"
      id="contact"
      data-portfolio-section="true"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="scanlines relative rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/10 via-black/35 to-black/50 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.3)]" />
          <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">Contact funnel</Badge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">{contactProfile.headline}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {contactProfile.availability}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <MapPin className="h-4 w-4 text-cyan-200" />
              {contactProfile.location}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-cyan-200" />
              Sanitized proof friendly
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              <a
                href={contactProfile.links.find((link) => link.label === "Resume PDF")?.href}
                target="_blank"
                rel="noreferrer"
                onClick={handleTrackedNavigation("resume_download", "contact-hero-resume", "/resume/michael-panico-resume.pdf", "contact")}
              >
                Download one-page resume
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <ContactModal>
              <Button variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10" onClick={handleTrackedNavigation("contact_click", "contact-hero-email", "modal", "contact")}>
                Email Michael
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </ContactModal>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {contactProfile.roleTargets.map((role) => (
              <Badge key={role} variant="secondary" className="border-white/10 bg-white/5 text-zinc-100">
                {role}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">
              Hidden in plain sight
            </p>
            <InvisibleInkWall />
          </div>
        </div>

        <div className="grid gap-4">
          {contactProfile.links.map((link) => {
            const Icon = link.icon;
            const isExternal = Boolean(link.href?.startsWith("http"));
            const cardContent = (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-cyan-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{link.label}</p>
                    <p className="truncate text-sm text-zinc-400">{link.helperText}</p>
                  </div>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-cyan-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            );

            if (!link.href) {
              return (
                <div
                  key={link.label}
                  className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-5 backdrop-blur-xl"
                >
                  {cardContent}
                </div>
              );
            }

            if (link.href?.startsWith("mailto")) {
              return (
                <ContactModal key={link.label}>
                  <button
                    onClick={handleTrackedNavigation("contact_click", `contact-card-${link.label.toLowerCase().replace(/\s+/g, "-")}`, "modal", "contact")}
                    className="w-full text-left group relative overflow-hidden rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-5 backdrop-blur-xl transition-colors hover:border-cyan-400/30 hover:bg-white/5"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {cardContent}
                  </button>
                </ContactModal>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                download={link.href.endsWith(".pdf") ? true : undefined}
                onClick={handleTrackedNavigation(
                  link.label === "Resume PDF" ? "resume_download" : "contact_click",
                  `contact-card-${link.label.toLowerCase().replace(/\s+/g, "-")}`,
                  link.href,
                  "contact"
                )}
                className="group relative overflow-hidden rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-5 backdrop-blur-xl transition-colors hover:border-cyan-400/30 hover:bg-white/5"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {cardContent}
              </a>
            );
          })}

          <button
            type="button"
            onClick={() => {
              openPortfolioAssistant();
              trackPortfolioEvent({
                eventType: "assistant_open",
                label: "contact-guided-tour-assistant",
                section: "contact",
              });
            }}
            className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left transition-colors hover:border-cyan-300/25 hover:bg-white/[0.08]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_24px] opacity-[0.08]" />
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white">Prefer the guided version?</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  Ask the recruiter assistant about projects, role fit, strongest proof, or where to
                  start.
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">
                  Open recruiter assistant
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
