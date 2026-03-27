'use client';

import { useEffect, useRef } from 'react';

import { trackPortfolioEvent } from '@/lib/portfolio-analytics';

const IMPRESSION_STORAGE_KEY = 'portfolio-section-impressions';

export function SectionAnalyticsTracker() {
  const activeSectionRef = useRef<string | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-portfolio-section="true"][id]')
    );

    if (sections.length === 0) {
      return;
    }

    const seenSections = new Set<string>();
    try {
      const existing = window.sessionStorage.getItem(IMPRESSION_STORAGE_KEY);
      if (existing) {
        JSON.parse(existing).forEach((entry: string) => seenSections.add(entry));
      }
    } catch {
      // Session persistence is opportunistic only.
    }

    const ratios = new Map<string, number>();

    const persistSeen = () => {
      try {
        window.sessionStorage.setItem(
          IMPRESSION_STORAGE_KEY,
          JSON.stringify(Array.from(seenSections))
        );
      } catch {
        // Ignore storage errors.
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          const sectionId = target.id;
          ratios.set(sectionId, entry.isIntersecting ? entry.intersectionRatio : 0);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.28 && !seenSections.has(sectionId)) {
            seenSections.add(sectionId);
            persistSeen();
            trackPortfolioEvent({
              eventType: 'section_impression',
              label: sectionId,
              section: sectionId,
            });
          }
        }

        const nextActive = Array.from(ratios.entries())
          .filter(([, ratio]) => ratio >= 0.42)
          .sort((left, right) => right[1] - left[1])[0]?.[0];

        if (nextActive && nextActive !== activeSectionRef.current) {
          activeSectionRef.current = nextActive;
          trackPortfolioEvent({
            eventType: 'section_active',
            label: nextActive,
            section: nextActive,
          });
        }
      },
      {
        threshold: [0.15, 0.28, 0.42, 0.6, 0.8],
        rootMargin: '-12% 0px -18% 0px',
      }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
