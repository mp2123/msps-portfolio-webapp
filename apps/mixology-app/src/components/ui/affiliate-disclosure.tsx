'use client';

export function AffiliateDisclosure() {
  return (
    <footer className="w-full py-12 border-t border-border/40 bg-background/50 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="max-w-md text-center md:text-left">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Legal Disclosure</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            As an Amazon Associate, this site earns from qualifying purchases. Some of the links on this website are affiliate links, meaning, at no additional cost to you, I will earn a commission if you click through and make a purchase. I only recommend tools, spirits, and glassware that I personally use and trust in high-volume, professional environments.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">
            Mixology Lab v1.0.0
          </div>
          <div className="text-[8px] text-muted-foreground italic">
            © 2026 Crafted with precision.
          </div>
        </div>
      </div>
    </footer>
  );
}
