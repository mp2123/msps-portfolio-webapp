"use client";

import { motion } from "framer-motion";
import { impactSignals, type ImpactSignal } from "@/content/portfolio";

export const LiveDataChart = ({
  data = impactSignals,
}: {
  data?: ImpactSignal[];
}) => {
  const maxImpact = Math.max(...data.map((item) => item.impact));

  return (
    <div className="relative w-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-background/50 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_16%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.25)]" />

      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xl font-bold text-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Impact Analysis Dashboard
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Recruiter-friendly proof of scale, business value, and technical range.
          </p>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-cyan-100/75">
          live signal
        </div>
      </div>

      <div className="relative space-y-5">
        {data.map((item, index) => {
          const width = `${Math.max((item.impact / maxImpact) * 100, 12)}%`;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm"
            >
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.metric}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-white">${item.impact.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400">{item.tools}</p>
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} shadow-[0_0_18px_rgba(34,211,238,0.18)]`}
                  style={{ width }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
