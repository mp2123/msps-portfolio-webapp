'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { trackPortfolioEvent } from '@/lib/portfolio-analytics';
import { scrollToPortfolioSection } from '@/lib/portfolio-navigation';
import {
  getPortfolioActionItems,
  getPortfolioNavLinks,
  getSamePageSectionId,
} from '@/lib/portfolio-nav';

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname() ?? '/';
  const portfolioSections = getPortfolioNavLinks(pathname);
  const actions = getPortfolioActionItems(pathname);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          trackPortfolioEvent({
            eventType: 'search_open',
            label: 'header-search-open',
            section: 'header',
          });
        }}
        className="flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-zinc-400 transition-colors hover:border-cyan-300/20 hover:bg-white/[0.08]"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-cyan-100/70" />
          <span className="truncate">Search sections...</span>
        </span>
        <kbd className="pointer-events-none hidden h-6 shrink-0 select-none items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 font-mono text-[10px] font-medium text-zinc-500 xl:inline-flex">
          <span className="text-xs text-zinc-400">⌘</span>K
        </kbd>
      </button>
      {open ? (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search sections or topics..." />
          <CommandList>
            <CommandEmpty>No matching section found.</CommandEmpty>
            <CommandGroup heading="Portfolio Sections">
              {portfolioSections.map((section) => (
                <CommandItem
                  key={section.label}
                  onSelect={() => {
                    setOpen(false);
                    const samePageSection = getSamePageSectionId(section.href, pathname);

                    if (samePageSection) {
                      scrollToPortfolioSection(samePageSection);
                    } else {
                      window.location.assign(section.href);
                    }

                    trackPortfolioEvent({
                      eventType: 'search_select',
                      label: section.label,
                      href: section.href,
                      section: 'header-search',
                      metadata: {
                        category: section.category,
                        pathname,
                      },
                    });
                  }}
                >
                  <span>{section.label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground uppercase">{section.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Actions">
              {actions.map((action) => (
                <CommandItem
                  key={action.label}
                  onSelect={() => {
                    setOpen(false);
                    const samePageSection = getSamePageSectionId(action.href, pathname);

                    if (samePageSection) {
                      scrollToPortfolioSection(samePageSection);
                    } else {
                      window.location.assign(action.href);
                    }

                    trackPortfolioEvent({
                      eventType: 'search_select',
                      label: action.label,
                      href: action.href,
                      section: 'header-search',
                      metadata: {
                        category: action.category,
                        pathname,
                      },
                    });
                  }}
                >
                  <span>{action.label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground uppercase">{action.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      ) : null}
    </>
  );
}
