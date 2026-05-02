'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, ExternalLink } from 'lucide-react';

const videos = [
  {
    title: "Mastering the Old Fashioned",
    description: "Deep dive into dilution, bitters, and garnish expression.",
    thumbnail: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    url: "#",
  },
  {
    title: "The Art of the Dry Shake",
    description: "How to get the perfect thick foam every single time.",
    thumbnail: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    url: "#",
  },
  {
    title: "Gin Basil Smash Riff",
    description: "Adding an amaro twist to a modern gin classic.",
    thumbnail: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    url: "#",
  },
];

export function VideoGallery() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20" id="tutorials">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-bold">Tutorial Vault</h2>
        <p className="text-muted-foreground text-sm flex items-center gap-2">
          New videos weekly <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videos.map((video, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="group overflow-hidden border-border/40 bg-muted/20 backdrop-blur-sm cursor-pointer">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={video.thumbnail} 
                  alt={video.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>
              <CardHeader className="p-5">
                <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                  {video.title}
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {video.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
