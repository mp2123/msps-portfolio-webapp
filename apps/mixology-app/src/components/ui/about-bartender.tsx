'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram, Youtube, Mail } from 'lucide-react';

export function AboutTheBartender() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-32" id="about">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Visual Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800" 
              alt="The Bartender"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8">
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Master Mixologist</p>
              <h3 className="text-3xl font-black tracking-tight">Michael Panico</h3>
            </div>
          </div>
        </motion.div>

        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
              Crafting <span className="text-primary italic">Atmosphere</span>, <br /> One Pour at a Time.
            </h2>
            <div className="h-1 w-20 bg-primary" />
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Welcome to my digital lab. I believe that a great cocktail is more than just a recipe—it&apos;s a precise balance of history, chemistry, and theater. 
            </p>
            <p>
              With a deep passion for **Bourbon, Gin, and avant-garde Sours**, I&apos;ve dedicated my career to deconstructing the classics and building them back up with modern flair. Here, I share my personal tutorial vault, my curated gear recommendations, and the science behind the perfect serve.
            </p>
          </div>

          <div className="flex gap-6 pt-4">
            <a href="#" className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all group">
              <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all group">
              <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#request" className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all group">
              <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-border/40">
            <div>
              <p className="text-2xl font-black tracking-tighter">10+</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Years Behind Bar</p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tighter">500+</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Original Recipes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
