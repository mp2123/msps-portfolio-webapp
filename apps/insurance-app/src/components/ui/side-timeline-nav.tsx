'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  LayoutDashboard, 
  ShieldCheck,
  Zap
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'discovery', label: 'Policy Scanner', icon: ShieldCheck },
  { id: 'guide', label: 'Study Guide', icon: BookOpen },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'review', label: 'Exam Review', icon: Zap },
];

export function SideTimelineNav() {
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-6">
      {/* Central Glowing Line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      
      {navItems.map((item, index) => {
        const isActive = activeSection === item.id;
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="relative flex items-center group"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Nav Point */}
            <button
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] scale-110" 
                  : "bg-background/40 backdrop-blur-md border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "animate-pulse")} />
              
              {/* Active Ripple Effect */}
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-full bg-primary/20 -z-10 blur-md"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>

            {/* Tooltip / Label */}
            <AnimatePresence>
              {(hoveredItem === item.id || isActive) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-14 bg-background/80 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-md shadow-2xl pointer-events-none whitespace-nowrap"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {item.label}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connecting Line Segment (Visual only) */}
            {index < navItems.length - 1 && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 h-6 w-[1px] bg-white/5 group-hover:bg-primary/20 transition-colors" />
            )}
          </div>
        );
      })}

      {/* Aesthetic Spacer */}
      <div className="mt-4 flex flex-col items-center gap-1 opacity-20">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <div className="h-1 w-1 rounded-full bg-primary" />
        <div className="h-1 w-1 rounded-full bg-primary" />
      </div>
    </nav>
  );
}
