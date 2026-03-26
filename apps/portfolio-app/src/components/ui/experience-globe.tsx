'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { ArrowRight, MapPin } from 'lucide-react';

type GlobeMarker = {
  id: string;
  label: string;
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
};

const markers: GlobeMarker[] = [
  {
    id: 'phoenix-home',
    label: 'Phoenix base',
    location: [33.4484, -112.074],
    note: 'Current home base and recruiter contact point.',
  },
  {
    id: 'hospitality',
    label: 'Hospitality leadership',
    location: [33.5387, -112.186],
    note: 'High-volume operations, team leadership, and profit ownership.',
  },
  {
    id: 'analytics',
    label: 'Analytics buildout',
    location: [33.4255, -111.94],
    note: 'BI, automation, and predictive analytics work across the Phoenix metro.',
  },
  {
    id: 'portfolio',
    label: 'Portfolio layer',
    location: [33.4942, -111.9261],
    note: 'Operator-to-analyst positioning packaged into a recruiter-first product.',
  },
];

const arcs: GlobeArc[] = [
  {
    id: 'ops-to-analytics',
    from: markers[1].location,
    to: markers[2].location,
  },
  {
    id: 'analytics-to-portfolio',
    from: markers[2].location,
    to: markers[3].location,
  },
];

export function ExperienceGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let phi = 5.1;
    let width = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: width * 2,
      height: width * 2,
      phi,
      theta: 0.35,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 18000,
      mapBrightness: 4,
      baseColor: [0.04, 0.07, 0.13],
      markerColor: [0.34, 0.88, 1],
      glowColor: [0.08, 0.27, 0.48],
      markers: markers.map((marker) => ({
        location: marker.location,
        size: 0.085,
      })),
      arcs: arcs.map((arc) => ({
        from: arc.from,
        to: arc.to,
      })),
      arcColor: [0.34, 0.88, 1],
      arcWidth: 0.9,
      arcHeight: 0.14,
      opacity: 0.88,
      onRender: (state: GlobeRenderState) => {
        width = canvas.offsetWidth;
        state.width = width * 2;
        state.height = width * 2;
        state.phi = phi;
        phi += 0.0021;
      },
    } as never);

    canvas.style.opacity = '1';

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-black/30 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_52%)]" />
        <div className="relative mx-auto aspect-square max-w-[22rem]">
          <canvas
            ref={canvasRef}
            className="h-full w-full opacity-0 transition-opacity duration-1000"
          />
        </div>
        <div className="relative mt-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">
          <MapPin className="h-3.5 w-3.5" />
          Phoenix-based operator to analyst arc
        </div>
      </div>

      <div className="grid gap-3">
        {markers.map((marker, index) => (
          <div
            key={marker.id}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/60">
                  Stage {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">{marker.label}</h3>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-100">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{marker.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
