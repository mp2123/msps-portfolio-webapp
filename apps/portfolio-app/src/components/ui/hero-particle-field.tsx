'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  tint: 'white' | 'cyan';
};

type AmbientParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
};

const PARTICLE_DENSITY = 0.00006;
const AMBIENT_DENSITY = 0.000028;
const MOUSE_RADIUS = 160;
const RETURN_SPEED = 0.022;
const DAMPING = 0.94;

export function HeroParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const particlesRef = useRef<Particle[]>([]);
  const ambientRef = useRef<AmbientParticle[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      dimensionsRef.current = { width, height, dpr };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleCount = Math.floor(width * height * PARTICLE_DENSITY);
      const ambientCount = Math.floor(width * height * AMBIENT_DENSITY);

      particlesRef.current = Array.from({ length: particleCount }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;

        return {
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.6 + 0.5,
          alpha: Math.random() * 0.45 + 0.15,
          tint: Math.random() > 0.87 ? 'cyan' : 'white',
        };
      });

      ambientRef.current = Array.from({ length: ambientCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.1 + 0.35,
        alpha: Math.random() * 0.22 + 0.06,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const render = (time: number) => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      const centerGradient = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        0,
        width / 2,
        height * 0.45,
        Math.max(width, height) * 0.52
      );
      centerGradient.addColorStop(0, 'rgba(34, 211, 238, 0.14)');
      centerGradient.addColorStop(0.45, 'rgba(59, 130, 246, 0.08)');
      centerGradient.addColorStop(1, 'rgba(2, 6, 23, 0)');

      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, width, height);

      for (const ambient of ambientRef.current) {
        ambient.x += ambient.vx;
        ambient.y += ambient.vy;

        if (ambient.x < 0) ambient.x = width;
        if (ambient.x > width) ambient.x = 0;
        if (ambient.y < 0) ambient.y = height;
        if (ambient.y > height) ambient.y = 0;

        const twinkle = Math.sin(time * 0.0012 + ambient.phase) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255,255,255,${ambient.alpha * (0.35 + twinkle * 0.65)})`;
        ctx.beginPath();
        ctx.arc(ambient.x, ambient.y, ambient.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const particle of particlesRef.current) {
        const dx = pointerRef.current.x - particle.x;
        const dy = pointerRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!reducedMotionRef.current && pointerRef.current.active && distance < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          const directionX = distance > 0 ? dx / distance : 0;
          const directionY = distance > 0 ? dy / distance : 0;

          particle.vx -= directionX * force * 1.9;
          particle.vy -= directionY * force * 1.9;
        }

        particle.vx += (particle.originX - particle.x) * RETURN_SPEED;
        particle.vy += (particle.originY - particle.y) * RETURN_SPEED;
        particle.vx *= DAMPING;
        particle.vy *= DAMPING;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const alpha = Math.min(particle.alpha + velocity * 0.05, 0.95);

        ctx.fillStyle =
          particle.tint === 'cyan'
            ? `rgba(103, 232, 249, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotionRef.current) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
    };

    initParticles();

    if (reducedMotionRef.current) {
      render(0);
    } else {
      frameRef.current = window.requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(() => {
      initParticles();
    });

    resizeObserver.observe(container);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerleave', clearPointer);
    window.addEventListener('blur', clearPointer);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', clearPointer);
      window.removeEventListener('blur', clearPointer);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-85" />
    </div>
  );
}
