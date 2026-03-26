'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const cards = [
  { q: "What is the 'Free-Look Period'?", a: "A period (usually 10-30 days) during which the policyholder can cancel for a full refund." },
  { q: "When must 'Insurable Interest' exist?", a: "At the time of the application." },
  { q: "What is the 'MIB'?", a: "Medical Information Bureau - a non-profit association that shares medical data among insurers." },
  { q: "What is 'Adverse Selection'?", a: "The tendency of higher-risk individuals to seek insurance more than average risks." },
];

export function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-20" id="exam">
      <h2 className="text-3xl font-bold text-center mb-10">Quick Flashcards</h2>
      <div className="relative h-80 w-full perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="relative h-full w-full transition-all preserve-3d"
            >
              {/* Front */}
              <Card className="absolute inset-0 flex items-center justify-center p-10 backface-hidden shadow-xl border-2 border-primary/10">
                <CardContent className="text-center">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 block">Question</span>
                  <p className="text-2xl font-semibold leading-tight">{cards[currentIndex].q}</p>
                  <p className="text-sm text-muted-foreground mt-6 italic">Click to flip</p>
                </CardContent>
              </Card>

              {/* Back */}
              <Card className="absolute inset-0 flex items-center justify-center p-10 backface-hidden shadow-xl border-2 border-green-500/20 bg-green-50/10 rotate-y-180">
                <CardContent className="text-center">
                  <span className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-4 block">Answer</span>
                  <p className="text-xl leading-relaxed">{cards[currentIndex].a}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 mt-10">
        <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium tabular-nums">
          {currentIndex + 1} / {cards.length}
        </span>
        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsFlipped(!isFlipped)} className="rounded-full ml-4">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
