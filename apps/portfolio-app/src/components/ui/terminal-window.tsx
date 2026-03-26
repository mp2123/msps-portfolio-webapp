"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const TerminalWindow = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="max-w-7xl mx-auto my-12 border-2 border-border/20 rounded-2xl shadow-2xl shadow-primary/5 bg-black/30 backdrop-blur-3xl overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="h-10 bg-muted/30 flex items-center px-4 border-b-2 border-border/20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground font-mono">
          /Users/MichaelPanico/Portfolio -- -zsh
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-2 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
