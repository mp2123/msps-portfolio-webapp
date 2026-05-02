"use client";

import React from "react";
import { motion } from "framer-motion";
import { Network, TrendingUp, Music, ShieldCheck } from "lucide-react";

interface ArtifactVisualsProps {
  projectid: string;
}

export function ArtifactVisuals({ projectid }: ArtifactVisualsProps) {
  if (projectid === "ticket-routing-prediction") {
    return (
      <div className="my-12 flex flex-col gap-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 shadow-[0_0_40px_-10px_rgba(245,158,11,0.1)]">
        <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
          <ShieldCheck className="h-6 w-6 text-amber-400" />
          <h4 className="m-0 text-xl font-bold tracking-tight text-white">Model Confidence Distribution</h4>
        </div>
        
        <div className="space-y-6">
          {/* Accuracy */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-zinc-300">Accuracy</span>
              <span className="text-amber-400">76%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-black/50 border border-white/5 relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "76%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
              />
            </div>
          </div>

          {/* Recall */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-zinc-300">Recall (Critical Catch Rate)</span>
              <span className="text-amber-400">86%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-black/50 border border-white/5 relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "86%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
              />
            </div>
          </div>

          {/* F1 Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-zinc-300">F1 Score</span>
              <span className="text-amber-400">73%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-black/50 border border-white/5 relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "73%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full"
              />
            </div>
          </div>
        </div>
        <p className="m-0 mt-4 text-sm text-zinc-400">Yielding massive friction recovery equating to ~$280K in modeled annual overhead savings.</p>
      </div>
    );
  }

  if (projectid === "tjix-net-sales-drivers") {
    return (
      <div className="my-12 flex flex-col items-center justify-center gap-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-12 text-center shadow-[0_0_60px_-15px_rgba(99,102,241,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl"></div>
        
        <TrendingUp className="h-12 w-12 text-indigo-400" />
        <h4 className="m-0 text-2xl font-bold tracking-tight text-white">Advertising Coefficient Multiplier</h4>
        <div className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-500 pb-2">
          12.7x
        </div>
        <p className="m-0 max-w-md text-base leading-relaxed text-indigo-200">
          Statistically proven estimated lift: <strong className="text-white">~$12.7M</strong> in net-sales volume per every baseline <strong className="text-white">+$1M</strong> in localized advertising expenditure.
        </p>
      </div>
    );
  }

  if (projectid === "yelp-review-modeling") {
    return (
      <div className="my-12 rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8 shadow-[0_0_40px_-10px_rgba(236,72,153,0.1)]">
        <div className="mb-8 flex items-center gap-3 border-b border-pink-500/20 pb-4">
          <Network className="h-6 w-6 text-pink-400" />
          <h4 className="m-0 text-xl font-bold tracking-tight text-white">NLP Extractor Pipeline</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Raw Corpus", subtitle: "Yelp JSON" },
            { step: "2", title: "TF-IDF Array", subtitle: "Vectorization" },
            { step: "3", title: "VADER / FLAIR", subtitle: "Polarity Signals" },
            { step: "4", title: "Logit Model", subtitle: "Binary Classifier" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-4 text-center relative"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300 ring-1 ring-pink-500/30">
                {item.step}
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                <div className="text-xs text-zinc-500">{item.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (projectid === "spotify-modeling") {
    return (
      <div className="my-12 rounded-2xl border border-green-500/20 bg-green-500/5 p-8 shadow-[0_0_40px_-10px_rgba(34,197,94,0.1)] overflow-hidden">
        <div className="mb-8 flex items-center gap-3 border-b border-green-500/20 pb-4">
          <Music className="h-6 w-6 text-green-400" />
          <h4 className="m-0 text-xl font-bold tracking-tight text-white">Audio Feature Significance Weights</h4>
        </div>
        
        <div className="relative mt-12 mb-6 h-48 w-full">
          {/* Baseline Zero */}
          <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/20 z-0"></div>
          
          <div className="absolute inset-0 z-10 flex items-end justify-between px-4 pb-24">
            {[
              { label: "Danceability", val: 80 },
              { label: "Energy", val: 65 },
              { label: "Acousticness", val: "-40", negative: true },
              { label: "Tempo", val: 30 },
              { label: "Valence", val: 55 }
            ].map((bar, i) => (
              <div key={i} className="relative flex flex-col items-center w-12 h-24">
                {bar.negative ? (
                  // Negative bar
                  <motion.div 
                    initial={{ height: 0 }} 
                    whileInView={{ height: `${Math.abs(Number(bar.val))}%` }} 
                    viewport={{ once: true }}
                    className="absolute top-0 w-8 bg-red-500/50 rounded-b-md"
                  />
                ) : (
                  // Positive bar
                  <motion.div 
                    initial={{ height: 0 }} 
                    whileInView={{ height: `${bar.val}%` }} 
                    viewport={{ once: true }}
                    className="absolute bottom-0 w-8 bg-green-500/80 rounded-t-md"
                  />
                )}
                <span className="absolute -bottom-8 whitespace-nowrap text-[11px] font-semibold text-zinc-400 rotate-[-45deg] origin-top-left -translate-x-3">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
