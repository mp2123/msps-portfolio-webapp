'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookMarked, Heart, History, Sparkles, ChevronRight } from 'lucide-react';

interface BarBookDashboardProps {
  onSignInClick: () => void;
}

export function BarBookDashboard({ onSignInClick }: BarBookDashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-20">
        <Card className="bg-primary/5 border-primary/20 p-12 text-center rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BookMarked className="h-40 w-40" />
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-black uppercase tracking-tight">Unlock Your <span className="text-primary">Personal Bar Book</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Save your favorite riffs, track your progress through the vault, and build your digital cocktail collection.
            </p>
            <Button 
              size="lg" 
              className="rounded-full px-12 py-6 font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
              onClick={onSignInClick}
            >
              Sign In to Start Building
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20" id="book">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.3em]">
            <Sparkles className="h-3 w-3" /> User Dashboard
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">Your Bar Book</h2>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{user.email}</p>
          <Button variant="link" size="sm" className="text-primary text-[10px] uppercase tracking-widest p-0" onClick={() => supabase.auth.signOut()}>Sign Out</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div whileHover={{ y: -5 }}>
          <Card className="bg-muted/20 border-border/40 hover:border-primary/50 transition-colors h-full">
            <CardHeader>
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                <Heart className="h-5 w-5" />
              </div>
              <CardTitle className="uppercase tracking-tight">Saved Riffs</CardTitle>
              <CardDescription>0 Recipes saved to your collection.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest gap-2 p-0">Browse Library <ChevronRight className="h-3 w-3" /></Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }}>
          <Card className="bg-muted/20 border-border/40 hover:border-primary/50 transition-colors h-full">
            <CardHeader>
              <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 mb-2">
                <History className="h-5 w-5" />
              </div>
              <CardTitle className="uppercase tracking-tight">Viewing History</CardTitle>
              <CardDescription>Tutorials you&apos;ve mastered recently.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest gap-2 p-0">Resume Learning <ChevronRight className="h-3 w-3" /></Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }}>
          <Card className="bg-primary border-none shadow-xl shadow-primary/20 h-full text-primary-foreground">
            <CardHeader>
              <CardTitle className="uppercase tracking-tight text-white">Bartender Notes</CardTitle>
              <CardDescription className="text-white/70 italic">
                &quot;The difference between a good drink and a great one is 1/4 ounce of precision.&quot;
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2 text-white">Next Masterclass</p>
              <p className="text-lg font-black text-white">Clarity & Ice Science</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
