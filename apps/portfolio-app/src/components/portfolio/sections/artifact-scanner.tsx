"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronsLeftRight } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import {
  artifactScannerSignals,
  getArtifactById,
  type ArtifactScannerSignal,
} from "@/content/portfolio";
import { trackPortfolioEvent } from "@/lib/portfolio-analytics";

const CARD_GAP = 28;
const CARD_WIDTH_FALLBACK = 368;

function buildSignalText(signal: ArtifactScannerSignal, columns = 54, rows = 18) {
  const source = [
    `// PORTFOLIO_SIGNAL: ${signal.scannerId}`,
    ...signal.rawFragments,
    `OUTPUT.surface = ${signal.proofLabel}`,
    `OUTPUT.story = ${signal.title}`,
  ];

  let flow = source.join(" // ").replace(/\s+/g, " ").trim();
  let cursor = 0;

  while (flow.length < columns * rows + columns) {
    flow += ` // ${source[cursor % source.length]}`;
    cursor += 1;
  }

  let result = "";
  let offset = 0;
  for (let row = 0; row < rows; row += 1) {
    result += flow.slice(offset, offset + columns);
    if (row < rows - 1) {
      result += "\n";
    }
    offset += columns;
  }

  return result;
}

export function ArtifactScanner() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const x = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const playbackRef = useRef({
    sectionVisible: true,
    documentVisible: true,
  });
  const measurementsRef = useRef({
    cardWidth: CARD_WIDTH_FALLBACK,
  });
  const physicsRef = useRef({
    baseVelocity: -40,
    userVelocity: 0,
    friction: 0.94,
    isHovering: false,
  });
  const animationBudgetRef = useRef(0);

  const items = useMemo(
    () =>
      artifactScannerSignals
        .map((signal) => ({
          signal,
          artifact: getArtifactById(signal.artifactId),
          signalText: buildSignalText(signal),
        }))
        .filter((item) => item.artifact),
    []
  );

  const repeatedItems = useMemo(
    () =>
      Array.from({ length: 3 }, (_, setIndex) =>
        items.map((item) => ({
          ...item,
          key: `${setIndex}-${item.signal.id}`,
        }))
      ).flat(),
    [items]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateMeasurements = () => {
      const firstCard = cardRefs.current.find(Boolean);
      if (firstCard) {
        measurementsRef.current.cardWidth = firstCard.offsetWidth || CARD_WIDTH_FALLBACK;
      }
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements();
    });

    resizeObserver.observe(container);
    const firstCard = cardRefs.current.find(Boolean);
    if (firstCard) {
      resizeObserver.observe(firstCard);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [repeatedItems.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        playbackRef.current.sectionVisible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.15 }
    );
    const handleVisibilityChange = () => {
      playbackRef.current.documentVisible = document.visibilityState === "visible";
    };

    visibilityObserver.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    const container = containerRef.current;
    if (!container || repeatedItems.length === 0) return;

    animationBudgetRef.current += delta;
    if (animationBudgetRef.current < 1000 / 30) {
      return;
    }
    const frameDelta = animationBudgetRef.current;
    animationBudgetRef.current = 0;

    const shouldAnimate =
      !prefersReducedMotion &&
      playbackRef.current.sectionVisible &&
      playbackRef.current.documentVisible;

    if (shouldAnimate) {
      const physics = physicsRef.current;
      physics.userVelocity *= physics.friction;

      if (Math.abs(physics.userVelocity) < 0.08) {
        physics.userVelocity = 0;
      }

      // Base velocity is positive so items naturally flow left-to-right (x increases)
      const totalVelocity = physics.isHovering
        ? physics.userVelocity
        : physics.baseVelocity + physics.userVelocity;

      const singleSetWidth =
        (measurementsRef.current.cardWidth + CARD_GAP) * items.length;

      let nextX = x.get() + totalVelocity * (frameDelta / 1000);

      if (singleSetWidth > 0) {
        if (totalVelocity < 0 && nextX < -singleSetWidth) {
          nextX += singleSetWidth;
        } else if (totalVelocity > 0 && nextX > 0) {
          nextX -= singleSetWidth;
        }
      }

      x.set(nextX);
    }

    const containerRect = container.getBoundingClientRect();
    const scannerX = containerRect.left + containerRect.width * 0.5;

    cardRefs.current.forEach((card) => {
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const polished = card.querySelector<HTMLElement>(".artifact-scanner-polished");
      const raw = card.querySelector<HTMLElement>(".artifact-scanner-raw");

      if (!polished || !raw) return;

      if (rect.left < scannerX + 2 && rect.right > scannerX - 2) {
        const intersect = ((scannerX - rect.left) / rect.width) * 100;
        polished.style.setProperty("--artifact-clip-right", `${intersect}%`);
        raw.style.setProperty("--artifact-clip-left", `${intersect}%`);
      } else if (rect.right <= scannerX) {
        polished.style.setProperty("--artifact-clip-right", "100%");
        raw.style.setProperty("--artifact-clip-left", "100%");
      } else {
        polished.style.setProperty("--artifact-clip-right", "0%");
        raw.style.setProperty("--artifact-clip-left", "0%");
      }
    });
  });

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const physics = physicsRef.current;
    
    // Choose the dominant hardware scroll axis
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (Math.abs(delta) <= 1) return;

    // Apply native trackpad/wheel momentum explicitly without magnitude absolute mapping
    physics.userVelocity += delta * -2.0;
    
    // Clamp extreme manual velocity to prevent jarring jumps
    if (physics.userVelocity > 2000) physics.userVelocity = 2000;
    if (physics.userVelocity < -2000) physics.userVelocity = -2000;
  };

  return (
    <section
      id="translation-layer"
      data-portfolio-section="true"
      className="portfolio-section-anchor section-glow grid-noise mx-auto w-full max-w-6xl px-4 py-20"
    >
      <div className="mb-10 max-w-3xl space-y-4">
        <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
          Translation layer
        </Badge>
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Raw business signal scanned into recruiter-ready proof.
        </h2>
        <p className="text-lg leading-relaxed text-zinc-400">
          This strip turns the actual shape of the work into something a recruiter can process fast:
          messy asks, KPI logic, and workflow notes crossing a scanner line and resolving into proof assets.
        </p>
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseEnter={() => {
          physicsRef.current.isHovering = true;
        }}
        onMouseLeave={() => {
          physicsRef.current.isHovering = false;
        }}
        className="group relative isolate overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-400/8 via-black to-slate-950/90 px-4 py-12 shadow-[0_0_50px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:px-6"
      >
        <style>{`
          .artifact-scanner-wrapper {
            position: relative;
            width: min(24rem, calc(100vw - 4rem));
            height: 18rem;
            flex-shrink: 0;
          }
          .artifact-scanner-surface {
            position: absolute;
            inset: 0;
            overflow: hidden;
            border-radius: 1.5rem;
          }
          .artifact-scanner-polished {
            z-index: 2;
            clip-path: inset(0 0 0 var(--artifact-clip-right, 0%));
          }
          .artifact-scanner-raw {
            z-index: 1;
            clip-path: inset(0 calc(100% - var(--artifact-clip-left, 0%)) 0 0);
          }
          .artifact-scanner-text {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 10px;
            line-height: 1.05;
            white-space: pre;
          }
          @media (min-width: 768px) {
            .artifact-scanner-wrapper {
              width: 24rem;
              height: 19rem;
            }
          }
        `}</style>

        <div className="pointer-events-none absolute inset-y-8 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent md:block" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-72 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/18 blur-[44px] md:block" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_0,transparent_1px)] bg-[size:100%_24px] opacity-[0.08]" />

        <div className="mb-8 flex flex-col gap-4 text-[11px] uppercase tracking-[0.28em] text-white/45 md:flex-row md:items-center md:justify-between">
          <span>Raw signal</span>
          <div className="flex items-center gap-3 self-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
            <ChevronsLeftRight className="h-4 w-4" />
            <span className="tracking-[0.24em]">Wheel to scan</span>
          </div>
          <span className="text-right">Proof asset</span>
        </div>

        <motion.div
          style={{ x }}
          className="flex items-center gap-7 will-change-transform"
        >
          {repeatedItems.map((item, index) => {
            const artifact = item.artifact;
            if (!artifact) {
              return null;
            }

            return (
              <a
                key={item.key}
                href={`#${artifact.id}`}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                onClick={() => {
                  trackPortfolioEvent({
                    eventType: "section_navigation",
                    label: `artifact-scanner-${item.signal.id}`,
                    href: `#${artifact.id}`,
                    section: "translation-layer",
                    metadata: {
                      scannerId: item.signal.scannerId,
                      artifactId: artifact.id,
                    },
                  });
                }}
                className="artifact-scanner-wrapper group/card"
              >
                <div className="artifact-scanner-surface artifact-scanner-polished border border-white/10 bg-black/40 shadow-[0_20px_50px_rgba(2,6,23,0.35)]">
                  <Image
                    src={artifact.thumbnail}
                    alt={artifact.title}
                    fill
                    sizes="(min-width: 768px) 24rem, calc(100vw - 4rem)"
                    className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_38%)]" />
                  <div className="absolute left-5 top-5">
                    <Badge className="border-white/10 bg-black/45 text-zinc-100">
                      {item.signal.meta}
                    </Badge>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/75">
                      {item.signal.proofLabel}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      {item.signal.title}
                    </h3>
                    <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-zinc-200/85">
                      {item.signal.outcome}
                    </p>
                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-zinc-100">
                      <span>{artifact.ctaLabel}</span>
                      <ArrowUpRight className="h-4 w-4 text-cyan-100" />
                    </div>
                  </div>
                </div>

                <div className="artifact-scanner-surface artifact-scanner-raw border border-cyan-300/45 bg-[#02070d] shadow-[0_0_40px_rgba(34,211,238,0.08)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_35%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_0,transparent_1px)] bg-[size:100%_16px] opacity-[0.08]" />
                  <div className="relative flex h-full flex-col overflow-hidden px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">
                        {item.signal.rawLabel}
                      </span>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100/80">
                        {item.signal.scannerId}
                      </span>
                    </div>
                    <pre className="artifact-scanner-text flex-1 overflow-hidden text-cyan-200/78">
                      {item.signalText}
                    </pre>
                  </div>
                </div>
              </a>
            );
          })}
        </motion.div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            "Stakeholder asks, KPI definitions, SQL, DAX, and workflow notes feed the left side.",
            "The center scan line visualizes Michael’s strongest skill: translation under ambiguity.",
            "The right side resolves into recruiter-speed proof assets already wired into the artifact vault.",
          ].map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-zinc-300"
            >
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
