"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const TerminalWindow = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="group relative mx-auto my-12 max-w-7xl overflow-hidden rounded-[1.75rem] border border-cyan-300/10 bg-black/35 shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur-3xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_30px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[1.6rem] border border-white/6" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent shadow-[0_0_25px_rgba(34,211,238,0.35)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-300/12 to-transparent" />

      {/* Terminal Header */}
      <div className="relative flex h-11 items-center border-b border-white/10 bg-slate-950/78 px-4 backdrop-blur-xl">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-400/60 shadow-[0_0_12px_rgba(251,113,133,0.35)]" />
          <div className="h-3 w-3 rounded-full bg-amber-300/60 shadow-[0_0_12px_rgba(252,211,77,0.25)]" />
          <div className="h-3 w-3 rounded-full bg-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.25)]" />
        </div>
        <div className="flex-1 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
          /Users/MichaelPanico/Portfolio -- -zsh
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-200/50">
          live system
        </div>
      </div>

      {/* Terminal Body */}
      <div className="relative p-2 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
