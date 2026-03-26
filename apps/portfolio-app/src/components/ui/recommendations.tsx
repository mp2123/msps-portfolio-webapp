import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Recommendation } from '@/content/portfolio';

export const RecommendationsCarousel = ({ recommendations }: { recommendations: Recommendation[] }) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {recommendations.map((rec, index) => (
          <motion.div
            key={`${rec.author}-${rec.company}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-slate-950/90 to-black/95 p-8 shadow-[0_30px_90px_rgba(2,6,23,0.28)] transition-colors hover:border-cyan-300/25"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_26px] opacity-[0.08]" />
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.25)]" />
            <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/20 transition-colors group-hover:text-primary/40" />
            <div className="space-y-6">
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-cyan-100/75">
                  {rec.trustLevel}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">reference signal</span>
              </div>
              <p className="relative z-10 text-sm leading-relaxed text-muted-foreground italic md:text-base">
                &quot;{rec.quote}&quot;
              </p>
              <div className="relative z-10 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <h4 className="font-bold text-foreground">{rec.author}</h4>
                <p className="text-primary text-sm font-medium">{rec.role}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{rec.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
