'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';

type SpiralSignalProps = {
  title: string;
  subtitle: string;
  labels: string[];
};

const SPIRAL_TARGET_FRAME_MS = 1000 / 30;

export function SpiralSignal({ title, subtitle, labels }: SpiralSignalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = {
      progress: 0,
      pulse: 0,
      shimmer: 0,
      centerX: 0,
      centerY: 0,
    };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let isDocumentVisible = document.visibilityState === 'visible';
    let frameId: number | null = null;
    let isAnimating = false;
    let lastFrameTime = 0;

    const setSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.centerX = width * 0.52;
      state.centerY = height * 0.52;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const targetCenterX = width * (pointer.active ? 0.52 + (pointer.x - 0.5) * 0.16 : 0.52);
      const targetCenterY = height * (pointer.active ? 0.52 + (pointer.y - 0.5) * 0.12 : 0.52);
      state.centerX += (targetCenterX - state.centerX) * 0.08;
      state.centerY += (targetCenterY - state.centerY) * 0.08;

      const centerX = state.centerX;
      const centerY = state.centerY;
      const maxRadius = Math.min(width, height) * 0.34;

      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 1.9);
      glow.addColorStop(0, `rgba(34, 211, 238, ${pointer.active ? 0.22 : 0.16})`);
      glow.addColorStop(0.35, `rgba(59, 130, 246, ${pointer.active ? 0.14 : 0.10})`);
      glow.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const turns = 5.6;
      const steps = 126;
      const beaconPhase = ((state.progress * 1.6) % 1 + 1) % 1;
      const counterPhase = ((1 - beaconPhase * 0.72) % 1 + 1) % 1;

      for (let i = 0; i < steps; i += 1) {
        const t = i / (steps - 1);
        const eased = Math.min((t + state.progress) % 1, 1);
        const angle = turns * Math.PI * 2 * eased;
        const radius = eased * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.78;
        const size = 1.1 + eased * 2.1 + state.pulse * 0.5;
        const alpha = 0.15 + eased * 0.7;

        ctx.fillStyle = i % 7 === 0 ? `rgba(103, 232, 249, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      const drawBeacon = (phase: number, accent: string, radiusScale: number) => {
        const angle = turns * Math.PI * 2 * phase;
        const radius = phase * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.78;
        const glowRadius = 16 + state.pulse * 8 * radiusScale;

        const beam = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        beam.addColorStop(0, accent);
        beam.addColorStop(0.5, accent.replace('0.9', '0.28'));
        beam.addColorStop(1, 'rgba(8, 15, 26, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, 4.8 + state.pulse * 1.4 * radiusScale, 0, Math.PI * 2);
        ctx.fill();
      };

      drawBeacon(beaconPhase, 'rgba(103, 232, 249, 0.9)', 1);
      drawBeacon(counterPhase, 'rgba(255, 255, 255, 0.72)', 0.7);

      ctx.strokeStyle = 'rgba(103, 232, 249, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();

      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        const eased = Math.min((t + state.progress * 0.7) % 1, 1);
        const angle = turns * Math.PI * 2 * eased;
        const radius = eased * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.78;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    };

    const animate = (time: number) => {
      if (!isAnimating) return;

      if (lastFrameTime !== 0 && time - lastFrameTime < SPIRAL_TARGET_FRAME_MS) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = time;
      state.progress = ((time * 0.0001) % 1 + 1) % 1;
      state.pulse = 0.5 + Math.sin(time * 0.0024) * 0.5;
      state.shimmer = 0.5 + Math.sin(time * 0.0012) * 0.5;
      draw();
      frameId = window.requestAnimationFrame(animate);
    };

    setSize();
    draw();

    const syncPlayback = () => {
      const shouldRun = !prefersReducedMotion && isVisible && isDocumentVisible;
      if (shouldRun && !isAnimating) {
        isAnimating = true;
        lastFrameTime = 0;
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      if (!shouldRun && isAnimating) {
        isAnimating = false;
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }
        draw();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      setSize();
      draw();
    });
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        syncPlayback();
      },
      { threshold: 0.2 }
    );
    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === 'visible';
      syncPlayback();
    };

    resizeObserver.observe(canvas.parentElement ?? canvas);
    visibilityObserver.observe(canvas.parentElement ?? canvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    syncPlayback();

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      isAnimating = false;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className="group relative overflow-hidden rounded-[1.8rem] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 via-slate-950/90 to-black/95 p-5 shadow-[0_0_40px_rgba(34,211,238,0.08)] transition-transform duration-500 hover:-translate-y-1"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: (event.clientX - bounds.left) / Math.max(bounds.width, 1),
          y: (event.clientY - bounds.top) / Math.max(bounds.height, 1),
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_28px] opacity-[0.12]" />
      <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative h-56 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/30 md:h-full">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-100">Signal path</Badge>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center gap-4">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/65">Trajectory snapshot</p>
            <h3 className="text-2xl font-semibold tracking-tight text-white md:text-[2.15rem]">{title}</h3>
            <p className="text-sm leading-relaxed text-zinc-100/90 md:text-[0.95rem]">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-50 shadow-[0_0_18px_rgba(34,211,238,0.05)]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
