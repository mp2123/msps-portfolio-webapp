// apps/mixology-app/src/components/ui/card-scanner.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

const recipes = [
  { name: "Paper Plane", imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800", id: "MIX-2026-DRINK-1002" },
  { name: "Negroni", imageUrl: "https://images.unsplash.com/photo-1536935338213-d2c1238f91c6?auto=format&fit=crop&q=80&w=800", id: "MIX-2026-DRINK-1001" },
  { name: "Last Word", imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800", id: "MIX-2026-DRINK-1003" },
  { name: "Old Fashioned", imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800", id: "MIX-2026-DRINK-1000" },
  { name: "Margarita", imageUrl: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800", id: "MIX-2026-DRINK-1004" },
];

const generateCode = (width: number, height: number, recipeName: string) => {
  const library = [ `// RECIPE_MODULE: ${recipeName.toUpperCase().replace(/\s/g, '_')}`, "const SERVE_IMMEDIATELY = true;", "const CHILL_GLASS = 'coupe';", "function calculateDilution(ice, time) { return ice.quality * time; }" ];
  let flow = library.join(" ").replace(/\s+/g, " ").trim();
  const totalChars = width * height;
  while (flow.length < totalChars + width) { flow += " " + library[hashCode(`${recipeName}:${flow.length}`) % library.length]; }
  let out = ""; let offset = 0;
  for (let row = 0; row < height; row++) { out += flow.slice(offset, offset + width) + (row < height - 1 ? "\n" : ""); offset += width; }
  return out;
};

const hashCode = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(31, hash) + value.charCodeAt(i);
  }
  return hash >>> 0;
};

export const CardScanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const physicsRef = useRef({
    direction: -1,
    baseVelocity: 20,
    userVelocity: 0,
    friction: 0.95,
    isHovering: false,
    isStill: true,
  });

  const handleInteraction = (e: React.WheelEvent | React.MouseEvent) => {
    const { current: physics } = physicsRef;
    let delta = 0;
    if ('deltaY' in e) { delta = e.deltaX || e.deltaY; } 
    else { delta = e.movementX; }
    
    if (Math.abs(delta) > 1) {
      physics.direction = delta > 0 ? 1 : -1;
      physics.userVelocity += Math.abs(delta) * 1.5;
      physics.isStill = false;
    }
  };

  useEffect(() => {
    let stillTimeout: NodeJS.Timeout;
    const onMouseMove = () => {
      physicsRef.current.isStill = false;
      clearTimeout(stillTimeout);
      stillTimeout = setTimeout(() => physicsRef.current.isStill = true, 100);
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(stillTimeout);
    };
  }, []);

  useAnimationFrame((time, delta) => {
    const { current: physics } = physicsRef;

    physics.userVelocity *= physics.friction;
    if (Math.abs(physics.userVelocity) < 0.1) { physics.userVelocity = 0; }

    let totalVelocity = physics.baseVelocity + physics.userVelocity;
    if (physics.isHovering && physics.isStill) { totalVelocity = 0; }

    const moveBy = (totalVelocity * (delta / 1000)) * physics.direction;
    const cardWidth = 400 + 60;
    const singleSetWidth = cardWidth * recipes.length;
    
    let nextX = x.get() + moveBy;
    if (physics.direction === 1 && nextX > 0) { nextX -= singleSetWidth; } 
    else if (physics.direction === -1 && nextX < -singleSetWidth) { nextX += singleSetWidth; }
    x.set(nextX);
    
    const scannerX = window.innerWidth / 2;
    const cards = containerRef.current?.querySelectorAll('.card-wrapper');
    cards?.forEach((card) => {
      if (!(card instanceof HTMLElement)) return;
      const rect = card.getBoundingClientRect();
      const normal = card.querySelector('.card-normal');
      const ascii = card.querySelector('.card-ascii');
      if (!(normal instanceof HTMLElement) || !(ascii instanceof HTMLElement)) return;
      if (normal && ascii && rect.left < scannerX + 10 && rect.right > scannerX - 10) {
          const intersect = ((scannerX - rect.left) / rect.width) * 100;
          normal.style.setProperty('--clip-right', `${intersect}%`);
          ascii.style.setProperty('--clip-left', `${intersect}%`);
      } else if (normal && ascii) {
          normal.style.setProperty('--clip-right', rect.right < scannerX ? '100%' : '0%');
          ascii.style.setProperty('--clip-left', rect.right < scannerX ? '100%' : '0%');
      }
    });
  });

  return (
    <div 
        className="relative w-full h-[500px] bg-black overflow-hidden flex flex-col items-center justify-center group cursor-crosshair" 
        ref={containerRef}
        onMouseEnter={() => { physicsRef.current.isHovering = true; }}
        onMouseLeave={() => { physicsRef.current.isHovering = false; }}
        onWheel={handleInteraction}
    >
      <style>{`
        .card-wrapper { position: relative; width: 400px; height: 250px; flex-shrink: 0; perspective: 1000px; }
        .card { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; }
        .card-normal { z-index: 2; clip-path: inset(0 0 0 var(--clip-right, 0%)); border: 1px solid rgba(255,255,255,0.1); }
        .card-ascii { z-index: 1; clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0); background: #050505; border: 1px solid #0ff; }
        .ascii-text { font-family: monospace; font-size: 10px; line-height: 1; color: #0ff; opacity: 0.7; white-space: pre; padding: 10px; }
      `}</style>
      
      {/* Refined Swipe Indicator */}
      <div className="absolute top-20 z-30 flex flex-col items-center gap-3 pointer-events-none">
        <motion.div 
            className="flex items-center gap-6 p-3 rounded-full bg-primary/20 border border-primary/40 shadow-[0_0_30px_rgba(var(--primary),0.3)] backdrop-blur-md"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronsLeftRight className="h-6 w-6 text-primary" />
        </motion.div>
        <div className="flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 mb-1">
                Flick to Explore
            </p>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"/>
        </div>
      </div>

      <motion.div className="flex items-center gap-[60px] will-change-transform" style={{ x }}>
        {[...recipes, ...recipes, ...recipes].map((recipe, i) => (
          <a href="#recipes" key={i} className="card-wrapper group/card">
            <div className="card card-normal">
              <Image
                src={recipe.imageUrl}
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                alt={recipe.name}
                fill
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xl font-black uppercase tracking-tighter">{recipe.name}</p>
                <p className="font-mono text-xs tracking-widest opacity-60">{recipe.id}</p>
              </div>
            </div>
            <div className="card card-ascii">
              <div className="ascii-text">
                {generateCode(60, 20, recipe.name)}
              </div>
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  );
};
