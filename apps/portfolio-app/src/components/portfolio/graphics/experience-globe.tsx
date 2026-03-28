'use client';

import { memo, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from 'react';
import createGlobe from 'cobe';
import { ArrowRight, Hand, MapPin } from 'lucide-react';

import { trackPortfolioEvent } from '@/lib/portfolio-analytics';
import { cn } from '@/lib/utils';

type GlobeMarker = {
  id: string;
  label: string;
  cityLabel: string;
  location: [number, number];
  note: string;
};

type GlobeArc = {
  id: string;
  from: [number, number];
  to: [number, number];
};

type GlobeRenderState = {
  width: number;
  height: number;
  phi: number;
  theta: number;
};

const markers: GlobeMarker[] = [
  {
    id: 'chicago-foundation',
    label: 'Chicago foundations',
    cityLabel: 'Chicago, Illinois',
    location: [41.8781, -87.6298],
    note:
      'Early work across the Chicago Park District, service roles, and bartending built pace, public-facing composure, and responsibility before the management climb.',
  },
  {
    id: 'iowa-city-operator',
    label: 'Iowa City operator growth',
    cityLabel: 'Iowa City, Iowa',
    location: [41.6611, -91.5302],
    note:
      'Management, hiring, recruiting, training, and profit-minded ownership sharpened in Iowa City before the move into Phoenix-based analytics work.',
  },
  {
    id: 'phoenix-analytics',
    label: 'Phoenix analytics buildout',
    cityLabel: 'Phoenix, Arizona',
    location: [33.4484, -112.074],
    note:
      'Avnet internships, BI systems, workflow automation, and predictive analytics work turned business questions into decision-ready reporting outputs.',
  },
  {
    id: 'phoenix-portfolio',
    label: 'Phoenix portfolio base',
    cityLabel: 'Phoenix, Arizona',
    location: [33.515, -112.02],
    note:
      'Current recruiter-facing base: packaging operator credibility, analytics rigor, and automation instinct into a stronger portfolio and hiring narrative.',
  },
];

const arcs: GlobeArc[] = [
  { id: 'chi-to-iowa', from: markers[0].location, to: markers[1].location },
  { id: 'iowa-to-phoenix', from: markers[1].location, to: markers[2].location },
  { id: 'phoenix-to-portfolio', from: markers[2].location, to: markers[3].location },
];

const BASE_MARKER = markers[2];
const INITIAL_PHI = 5.1;
const INITIAL_THETA = 0.35;

const getFocusPhi = (longitude: number) =>
  INITIAL_PHI - ((longitude - BASE_MARKER.location[1]) * Math.PI) / 180;

const getFocusTheta = (latitude: number) =>
  INITIAL_THETA - ((latitude - BASE_MARKER.location[0]) * Math.PI) / 720;

export function ExperienceGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const dragDistanceRef = useRef(0);
  const focusRef = useRef({
    phi: getFocusPhi(BASE_MARKER.location[1]),
    theta: getFocusTheta(BASE_MARKER.location[0]),
  });
  const orbitOffsetRef = useRef(0);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [isGlobeVisible, setIsGlobeVisible] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState(BASE_MARKER.id);

  const activeMarker = useMemo(
    () => markers.find((marker) => marker.id === activeMarkerId) ?? BASE_MARKER,
    [activeMarkerId]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasEnteredViewport(true);
          setIsGlobeVisible(true);
          return;
        }

        setIsGlobeVisible(false);
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    focusRef.current = {
      phi: getFocusPhi(activeMarker.location[1]),
      theta: getFocusTheta(activeMarker.location[0]),
    };
    orbitOffsetRef.current = 0;
  }, [activeMarker]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerInteracting.current) return;

      dragOffset.current = {
        phi: (event.clientX - pointerInteracting.current.x) / 180,
        theta: (event.clientY - pointerInteracting.current.y) / 360,
      };
      dragDistanceRef.current = Math.max(
        dragDistanceRef.current,
        Math.abs(event.clientX - pointerInteracting.current.x) +
          Math.abs(event.clientY - pointerInteracting.current.y)
      );
    };

    const handlePointerUp = () => {
      if (!pointerInteracting.current) return;

      if (dragDistanceRef.current > 18) {
        trackPortfolioEvent({
          eventType: 'globe_drag',
          label: activeMarker.label,
          section: 'experience',
          metadata: {
            city: activeMarker.cityLabel,
            dragDistance: Math.round(dragDistanceRef.current),
          },
        });
      }

      focusRef.current = {
        phi: focusRef.current.phi + dragOffset.current.phi,
        theta: focusRef.current.theta + dragOffset.current.theta,
      };
      if (
        pointerIdRef.current !== null &&
        canvasRef.current?.hasPointerCapture(pointerIdRef.current)
      ) {
        canvasRef.current.releasePointerCapture(pointerIdRef.current);
      }
      pointerIdRef.current = null;
      dragOffset.current = { phi: 0, theta: 0 };
      dragDistanceRef.current = 0;
      pointerInteracting.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeMarker.cityLabel, activeMarker.label]);

  useEffect(() => {
    if (!isGlobeVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const initialWidth = canvas.offsetWidth;
    if (!initialWidth) return;

    let width = initialWidth;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.8),
      width: initialWidth * 2,
      height: initialWidth * 2,
      phi: focusRef.current.phi,
      theta: focusRef.current.theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 14000,
      mapBrightness: 4,
      baseColor: [0.04, 0.07, 0.13],
      markerColor: [0.34, 0.88, 1],
      glowColor: [0.08, 0.27, 0.48],
      markerSize: 0.075,
      markerElevation: 0.08,
      markers: markers.map((marker) => ({
        location: marker.location,
        size: 0.09,
      })),
      arcs: arcs.map((arc) => ({
        from: arc.from,
        to: arc.to,
      })),
      arcColor: [0.34, 0.88, 1],
      arcWidth: 0.95,
      arcHeight: 0.16,
      opacity: 0.92,
      onRender: (state: GlobeRenderState) => {
        width = canvas.offsetWidth;
        state.width = width * 2;
        state.height = width * 2;

        orbitOffsetRef.current += pointerInteracting.current ? 0 : 0.00125;
        const targetPhi = focusRef.current.phi + dragOffset.current.phi + orbitOffsetRef.current;
        const targetTheta = focusRef.current.theta + dragOffset.current.theta;

        state.phi += (targetPhi - state.phi) * 0.085;
        state.theta += (targetTheta - state.theta) * 0.085;
      },
    } as never);

    canvas.style.opacity = '1';

    return () => {
      canvas.style.opacity = '0';
      globe.destroy();
    };
  }, [isGlobeVisible]);

  const handleStageSelect = (marker: GlobeMarker, source: 'card' | 'globe-hint' = 'card') => {
    setActiveMarkerId(marker.id);
    trackPortfolioEvent({
      eventType: 'globe_stage_select',
      label: marker.label,
      section: 'experience',
      metadata: {
        city: marker.cityLabel,
        source,
      },
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-black/30 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_52%)]" />
        <div className="relative mx-auto aspect-square max-w-[22rem]">
          <GlobeCanvasShell
            canvasRef={canvasRef}
            hasEnteredViewport={hasEnteredViewport}
            pointerInteractingRef={pointerInteracting}
            pointerIdRef={pointerIdRef}
            dragDistanceRef={dragDistanceRef}
          />
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">
              Active stage
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{activeMarker.label}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
              {activeMarker.cityLabel}
            </p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Chicago → Iowa City → Phoenix
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Hand className="h-3.5 w-3.5" />
            drag to rotate
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {markers.map((marker, index) => {
          const isActive = marker.id === activeMarker.id;

          return (
            <button
              key={marker.id}
              type="button"
              onClick={() => handleStageSelect(marker)}
              className={cn(
                'rounded-[1.5rem] border p-4 text-left backdrop-blur-xl transition-all duration-300',
                isActive
                  ? 'border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_36px_rgba(34,211,238,0.14)] -translate-y-0.5'
                  : 'border-white/10 bg-white/5 hover:border-cyan-300/20 hover:bg-white/[0.08] hover:-translate-y-0.5'
              )}
              aria-pressed={isActive}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/60">
                    Stage {index + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{marker.label}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-100/70">
                    {marker.cityLabel}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-2xl transition-colors',
                    isActive ? 'bg-cyan-400/20 text-cyan-50' : 'bg-cyan-400/10 text-cyan-100'
                  )}
                >
                  <ArrowRight className={cn('h-4 w-4 transition-transform', isActive && 'translate-x-0.5')} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{marker.note}</p>
              {isActive ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-100">
                  Focus locked
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const GlobeCanvasShell = memo(function GlobeCanvasShell({
  canvasRef,
  dragDistanceRef,
  hasEnteredViewport,
  pointerInteractingRef,
  pointerIdRef,
}: {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  dragDistanceRef: MutableRefObject<number>;
  hasEnteredViewport: boolean;
  pointerIdRef: MutableRefObject<number | null>;
  pointerInteractingRef: MutableRefObject<{ x: number; y: number } | null>;
}) {
  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    pointerInteractingRef.current = { x: event.clientX, y: event.clientY };
    pointerIdRef.current = event.pointerId;
    dragDistanceRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="h-full w-full cursor-grab touch-none opacity-0 transition-opacity duration-1000 active:cursor-grabbing"
      />
      {!hasEnteredViewport ? (
        <div className="absolute inset-0 rounded-full border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_55%)]" />
      ) : null}
    </>
  );
});
