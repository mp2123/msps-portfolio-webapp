import React from 'react';
import { motion } from 'framer-motion';
import type { SkillsGroup } from '@/content/portfolio';

export const SkillsMatrix = ({ groups }: { groups: SkillsGroup[] }) => {
  const accentStyles = [
    {
      shell: 'border-cyan-300/15 bg-cyan-300/8',
      chip: 'border-cyan-300/20 bg-background/60 text-foreground hover:border-cyan-300 hover:bg-cyan-300 hover:text-slate-950',
      label: 'text-cyan-200/75',
    },
    {
      shell: 'border-blue-300/15 bg-blue-300/8',
      chip: 'border-blue-300/20 bg-background/60 text-foreground hover:border-blue-300 hover:bg-blue-300 hover:text-slate-950',
      label: 'text-blue-200/75',
    },
    {
      shell: 'border-emerald-300/15 bg-emerald-300/8',
      chip: 'border-emerald-300/20 bg-background/60 text-foreground hover:border-emerald-300 hover:bg-emerald-300 hover:text-slate-950',
      label: 'text-emerald-200/75',
    },
    {
      shell: 'border-violet-300/15 bg-violet-300/8',
      chip: 'border-violet-300/20 bg-background/60 text-foreground hover:border-violet-300 hover:bg-violet-300 hover:text-slate-950',
      label: 'text-violet-200/75',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((group, groupIndex) => (
          (() => {
            const accent = accentStyles[groupIndex % accentStyles.length];

            return (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: groupIndex * 0.08 }}
            className={`relative overflow-hidden rounded-3xl border p-6 shadow-sm backdrop-blur-sm ${accent.shell}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_26px] opacity-[0.08]" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-45" />
            <div className="relative z-10 mb-4 flex items-center justify-between gap-4">
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${accent.label}`}>
              {group.category}
              </p>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                {group.items.length} signals
              </div>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3">
              {group.items.map((item, itemIndex) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: itemIndex * 0.03 }}
                  whileHover={{ scale: 1.03 }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-colors ${accent.chip}`}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
            );
          })()
        ))}
      </div>
    </div>
  );
};
