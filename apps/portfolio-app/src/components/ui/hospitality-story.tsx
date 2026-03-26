"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Wine, Database, ArrowRight, Activity, Users, Layers, Cpu, SplitSquareHorizontal } from 'lucide-react';

export const HospitalityStory = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4">
      
      <div className="mb-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <SplitSquareHorizontal className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          The Non-Traditional Advantage
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The same grit required to manage a packed bar on a Friday night is exactly what powers my approach to scalable data architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        
        {/* Animated connecting line for Desktop */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 bg-background border-2 border-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)]">
          <ArrowRight className="text-primary w-6 h-6" />
        </div>

        {/* LEFT SIDE: Hospitality */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-4 bg-amber-500/20 rounded-2xl">
              <Wine className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">High-Volume Operations</h3>
              <p className="text-amber-500/80 font-medium text-sm tracking-wide uppercase mt-1">Hospitality Management</p>
            </div>
          </div>

          <ul className="space-y-6 relative z-10">
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-amber-500/10 p-2 rounded-lg"><Users className="w-4 h-4 text-amber-500" /></div>
              <div>
                <h4 className="font-bold text-foreground">People & Crisis Management</h4>
                <p className="text-sm text-muted-foreground mt-1">Resolving complex guest issues in real-time and managing cross-functional teams under extreme pressure.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-amber-500/10 p-2 rounded-lg"><Activity className="w-4 h-4 text-amber-500" /></div>
              <div>
                <h4 className="font-bold text-foreground">Rapid Throughput</h4>
                <p className="text-sm text-muted-foreground mt-1">Executing hundreds of transactions per hour with absolute precision and zero margin for error.</p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* RIGHT SIDE: Analytics */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-primary/5 backdrop-blur-sm border border-primary/30 p-8 rounded-3xl relative overflow-hidden group shadow-[0_0_30px_rgba(var(--primary),0.05)]"
        >
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-[60px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-4 bg-primary/20 rounded-2xl">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Scalable Data Systems</h3>
              <p className="text-primary/80 font-medium text-sm tracking-wide uppercase mt-1">Business Analytics</p>
            </div>
          </div>

          <ul className="space-y-6 relative z-10">
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-lg"><Layers className="w-4 h-4 text-primary" /></div>
              <div>
                <h4 className="font-bold text-foreground">Stakeholder Translation</h4>
                <p className="text-sm text-muted-foreground mt-1">Translating messy, ambiguous human needs into structured, scalable Power BI data models.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-lg"><Cpu className="w-4 h-4 text-primary" /></div>
              <div>
                <h4 className="font-bold text-foreground">Automated Throughput</h4>
                <p className="text-sm text-muted-foreground mt-1">Processing 5M+ rows of data and automating 20+ hours of manual workflows via Python & DAX.</p>
              </div>
            </li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
};
