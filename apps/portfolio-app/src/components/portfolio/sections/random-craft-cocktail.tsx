"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Sparkles, Wine } from "lucide-react";

import {
  COCKTAIL_PREVIEW_NAMES,
  EXAMPLE_CRAFT_COCKTAILS,
  type CraftCocktailIngredient,
} from "@/content/craft-cocktails";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RandomCraftCocktail = {
  slug: string;
  name: string;
  style: string;
  spiritBase: string;
  glassware: string;
  garnish?: string | null;
  shortDescription: string;
  imageUrl: string;
  ingredients: CraftCocktailIngredient[];
  method: string[];
  notes?: string | null;
  source: "database" | "seed";
};

const orbitRadius = 118;

function getFallbackCocktail(): RandomCraftCocktail {
  const cocktail = EXAMPLE_CRAFT_COCKTAILS[Math.floor(Math.random() * EXAMPLE_CRAFT_COCKTAILS.length)];
  return {
    ...cocktail,
    garnish: cocktail.garnish ?? null,
    notes: cocktail.notes ?? null,
    source: "seed",
  };
}

export function RandomCraftCocktail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCocktail, setActiveCocktail] = useState<RandomCraftCocktail | null>(null);

  const orbitLabels = useMemo(() => COCKTAIL_PREVIEW_NAMES.slice(0, 6), []);

  const openCocktail = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/random-cocktail", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = (await response.json()) as { cocktail?: RandomCraftCocktail };
      const cocktail = data.cocktail ?? getFallbackCocktail();

      setActiveCocktail(cocktail);
      setIsOpen(true);

      trackPortfolioEvent({
        eventType: "cocktail_spin",
        label: cocktail.slug,
        section: "advantage",
        metadata: {
          source: cocktail.source,
          spiritBase: cocktail.spiritBase,
          style: cocktail.style,
        },
      });

      trackPortfolioEvent({
        eventType: "cocktail_recipe_view",
        label: cocktail.slug,
        section: "advantage",
        metadata: {
          source: cocktail.source,
          glassware: cocktail.glassware,
        },
      });
    } catch {
      const cocktail = getFallbackCocktail();
      setActiveCocktail(cocktail);
      setIsOpen(true);

      trackPortfolioEvent({
        eventType: "cocktail_spin",
        label: cocktail.slug,
        section: "advantage",
        metadata: {
          source: "seed-fallback",
          spiritBase: cocktail.spiritBase,
          style: cocktail.style,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-950/90 to-black p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_28px] opacity-[0.06]" />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-2xl space-y-5">
            <Badge className="border-amber-300/25 bg-amber-400/10 text-amber-100">
              Hospitality-side bonus
            </Badge>
            <div className="space-y-3">
              <h3 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                Spin up a random craft cocktail.
              </h3>
              <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
                A small bartender-side module for anyone who wants to see the service craft behind the
                operator story. Press the rotor and pull a full build, garnish, and glassware call for a
                seeded classic.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">What it shows</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                  Recipe judgment, visual presentation, and the hospitality side of the broader portfolio.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Future state</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                  Ready for your spreadsheet-backed cocktail catalog once the full recipe sheet lands.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={openCocktail}
              disabled={isLoading}
              className="group bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              {isLoading ? "Spinning the bar book..." : "Generate a random cocktail"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative h-[20rem] w-[20rem] sm:h-[24rem] sm:w-[24rem]">
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-300/12"
                animate={{ rotate: 360 }}
                transition={{
                  duration: isLoading ? 1.05 : 22,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {orbitLabels.map((label, index) => {
                  const angle = (index / orbitLabels.length) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.cos(angle) * orbitRadius;
                  const y = Math.sin(angle) * orbitRadius;

                  return (
                    <div
                      key={label}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="rounded-full border border-cyan-300/15 bg-slate-950/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/75 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                        {label}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              <motion.div
                className="absolute inset-[15%] rounded-full border border-cyan-300/18 bg-[conic-gradient(from_180deg,rgba(34,211,238,0.22),rgba(255,255,255,0.02),rgba(251,191,36,0.16),rgba(34,211,238,0.22))] p-[1px] shadow-[0_0_50px_rgba(34,211,238,0.18)]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: isLoading ? 1.2 : 14,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),rgba(3,7,18,0.96)_58%)]" />
              </motion.div>

              <div className="absolute inset-[26%] rounded-full border border-white/10 bg-black/80 shadow-[inset_0_0_50px_rgba(34,211,238,0.08)]">
                <button
                  type="button"
                  onClick={openCocktail}
                  disabled={isLoading}
                  className="group flex h-full w-full flex-col items-center justify-center rounded-full px-6 text-center transition-transform duration-300 hover:scale-[1.02] disabled:cursor-wait"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-400/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
                    {isLoading ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                      <Sparkles className="h-6 w-6" />
                    )}
                  </div>
                  <p className="mt-4 text-sm uppercase tracking-[0.34em] text-zinc-500">
                    Random pour
                  </p>
                  <p className="mt-2 max-w-[11rem] text-xl font-semibold text-white">
                    {isLoading ? "Shaking and stirring..." : "Press for a classic"}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[min(90vh,860px)] max-w-5xl overflow-hidden border-white/10 bg-[#04070d]/95 p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
          {activeCocktail ? (
            <div className="grid max-h-[min(90vh,860px)] overflow-y-auto lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[20rem] overflow-hidden lg:min-h-full">
                <Image
                  src={activeCocktail.imageUrl}
                  alt={activeCocktail.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 space-y-3">
                  <Badge className="border-white/10 bg-black/50 text-zinc-100">
                    {activeCocktail.style}
                  </Badge>
                  <div>
                    <p className="text-3xl font-black tracking-tight text-white md:text-4xl">
                      {activeCocktail.name}
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-200/85">
                      {activeCocktail.shortDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl font-black tracking-tight text-white md:text-3xl">
                    Full build and service call
                  </DialogTitle>
                  <DialogDescription className="text-base leading-relaxed text-zinc-400">
                    Spirit, glassware, garnish, and build sequence surfaced in a portfolio-friendly format.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Base spirit</p>
                    <p className="mt-2 text-sm font-semibold text-white">{activeCocktail.spiritBase}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Glassware</p>
                    <p className="mt-2 text-sm font-semibold text-white">{activeCocktail.glassware}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Garnish</p>
                    <p className="mt-2 text-sm font-semibold text-white">{activeCocktail.garnish ?? "None"}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Wine className="h-4 w-4 text-cyan-100" />
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Ingredients</p>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {activeCocktail.ingredients.map((ingredient) => (
                        <li
                          key={`${ingredient.amount}-${ingredient.item}`}
                          className="flex items-start justify-between gap-4 border-b border-white/6 pb-3 text-sm last:border-b-0 last:pb-0"
                        >
                          <span className="font-medium text-cyan-100">{ingredient.amount}</span>
                          <span className="text-right text-zinc-200">{ingredient.item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-100" />
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Build method</p>
                    </div>
                    <ol className="mt-4 space-y-3">
                      {activeCocktail.method.map((step, index) => (
                        <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-200">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 text-[11px] font-semibold text-cyan-100">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {activeCocktail.notes ? (
                  <div className="mt-6 rounded-[1.5rem] border border-amber-300/12 bg-amber-400/6 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-amber-100/70">Build note</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-200">{activeCocktail.notes}</p>
                  </div>
                ) : null}

                <DialogFooter className="mt-6 justify-between sm:items-center">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    {activeCocktail.source === "database"
                      ? "Served from the portfolio cocktail catalog"
                      : "Served from the seeded classics set"}
                  </p>
                  <Button type="button" onClick={openCocktail} className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                    Spin again
                  </Button>
                </DialogFooter>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
