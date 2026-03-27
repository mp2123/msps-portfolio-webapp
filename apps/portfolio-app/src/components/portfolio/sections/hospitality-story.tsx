"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Wine, Database, Activity, Users, Layers, Cpu, SplitSquareHorizontal } from 'lucide-react';
import { InteractiveGlobe } from '@/components/portfolio/graphics/interactive-orb';

export const HospitalityStory = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="mb-16 text-center space-y-4">
        <div className="mb-2 inline-flex items-center justify-center rounded-full border border-cyan-300/15 bg-primary/10 p-3 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
          <SplitSquareHorizontal className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          The Non-Traditional Advantage
        </h2>
        <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed">
          The same judgment required to protect margins, lead teams, and keep service moving under pressure now shows up in my analytics and automation work.
        </p>
        <div className="mx-auto hidden h-28 w-28 items-center justify-center md:flex xl:hidden">
          <InteractiveGlobe />
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/18 to-transparent md:block" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl md:block" />

        <div className="absolute top-1/2 left-1/2 z-10 hidden h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center xl:flex 2xl:h-44 2xl:w-44">
          <InteractiveGlobe />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-500/10 via-black/70 to-slate-950/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1 hover:border-amber-300/30"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_26px] opacity-[0.08]" />
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-500/10 blur-[50px] opacity-50 transition-opacity group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="rounded-2xl bg-amber-500/20 p-4 shadow-[0_0_24px_rgba(245,158,11,0.12)]">
              <Wine className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-foreground [text-shadow:0_0_18px_rgba(255,255,255,0.06)] xl:text-[2.15rem]">High-Volume Operations</h3>
              <p className="text-amber-400/95 font-medium text-sm tracking-[0.18em] uppercase mt-1">Hospitality Management</p>
            </div>
          </div>

          <ul className="space-y-6 relative z-10">
            <li className="flex items-start gap-4">
              <div className="mt-1 rounded-lg bg-amber-500/10 p-2"><Users className="w-4 h-4 text-amber-500" /></div>
              <div>
                <h4 className="font-extrabold text-foreground text-[1.15rem]">People & Crisis Management</h4>
                <p className="text-sm text-zinc-200/95 leading-relaxed mt-1">Led high-volume operations and coached 15+ employees while resolving guest and operational issues in real time.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 rounded-lg bg-amber-500/10 p-2"><Activity className="w-4 h-4 text-amber-500" /></div>
              <div>
                <h4 className="font-extrabold text-foreground text-[1.15rem]">Profit and Process Ownership</h4>
                <p className="text-sm text-zinc-200/95 leading-relaxed mt-1">Drove 35% YoY net profit growth and roughly 18% bar profit improvement through inventory, labor, and service-process discipline.</p>
              </div>
            </li>
          </ul>

          <div className="relative z-10 mt-8 rounded-2xl border border-amber-300/15 bg-black/25 px-4 py-3 shadow-[0_0_24px_rgba(245,158,11,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200/75">Transferable edge</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-100/95">Margin awareness, prioritization under pressure, and the ability to keep teams aligned while things are moving fast.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="group relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-black/70 to-slate-950/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1 hover:border-cyan-300/30"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_26px] opacity-[0.08]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/20 blur-[60px] opacity-50 transition-opacity group-hover:opacity-100"></div>
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="rounded-2xl bg-primary/20 p-4 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-foreground [text-shadow:0_0_18px_rgba(255,255,255,0.06)] xl:text-[2.15rem]">Scalable Data Systems</h3>
              <p className="text-primary/95 font-medium text-sm tracking-[0.18em] uppercase mt-1">Business Analytics</p>
            </div>
          </div>

          <ul className="space-y-6 relative z-10">
            <li className="flex items-start gap-4">
              <div className="mt-1 rounded-lg bg-primary/10 p-2"><Layers className="w-4 h-4 text-primary" /></div>
              <div>
                <h4 className="font-extrabold text-foreground text-[1.15rem]">Stakeholder Translation</h4>
                <p className="text-sm text-zinc-200/95 leading-relaxed mt-1">Translated messy stakeholder asks into structured Power BI models, KPI layers, and reporting outputs people could actually use.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 rounded-lg bg-primary/10 p-2"><Cpu className="w-4 h-4 text-primary" /></div>
              <div>
                <h4 className="font-extrabold text-foreground text-[1.15rem]">Automated Throughput</h4>
                <p className="text-sm text-zinc-200/95 leading-relaxed mt-1">Automated recurring reporting, added QA checks, and connected predictive Python work to business-facing Power BI outputs.</p>
              </div>
            </li>
          </ul>

          <div className="relative z-10 mt-8 rounded-2xl border border-primary/20 bg-black/25 px-4 py-3 shadow-[0_0_24px_rgba(34,211,238,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/75">Current leverage</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-100/95">BI systems, analytics, and automation that turn operational ambiguity into cleaner reporting cadence and better decisions.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
