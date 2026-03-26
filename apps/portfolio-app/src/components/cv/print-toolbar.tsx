'use client';

import { useEffect } from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { trackPortfolioEvent } from '@/lib/portfolio-analytics';

export function PrintToolbar() {
  useEffect(() => {
    trackPortfolioEvent({
      eventType: 'print_cv_open',
      label: 'web-cv-page-open',
      href: '/cv',
      section: 'cv',
    });
  }, []);

  return (
    <div className="cv-no-print sticky top-0 z-20 -mx-6 mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/80 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Web CV</p>
        <h1 className="text-lg font-semibold text-white">Michael Panico</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to portfolio
          </Link>
        </Button>
        <Button
          type="button"
          onClick={() => window.print()}
          className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print CV
        </Button>
      </div>
    </div>
  );
}
