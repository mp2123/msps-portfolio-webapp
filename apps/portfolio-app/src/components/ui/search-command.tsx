'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const portfolioSections = [
  { name: 'Projects', category: 'Case studies', id: 'projects' },
  { name: 'Skills', category: 'Capabilities', id: 'skills' },
  { name: 'Artifacts', category: 'Media vault', id: 'artifacts' },
  { name: 'Advantage', category: 'Story', id: 'advantage' },
  { name: 'Experience', category: 'Career', id: 'experience' },
  { name: 'Recommendations', category: 'Social proof', id: 'recommendations' },
  { name: 'Contact', category: 'Outreach', id: 'contact' },
];

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);

  const scrollToSection = React.useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const headerOffset = 88;
    const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
  }, []);

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
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border border-border/40 rounded-full bg-muted/20 hover:bg-muted/40 transition-all ml-4"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search portfolio sections...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      {open ? (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a section or topic..." />
          <CommandList>
            <CommandEmpty>No matching section found.</CommandEmpty>
            <CommandGroup heading="Portfolio Sections">
              {portfolioSections.map((section) => (
                <CommandItem
                  key={section.name}
                  onSelect={() => {
                    setOpen(false);
                    scrollToSection(section.id);
                  }}
                >
                  <span>{section.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground uppercase">{section.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  scrollToSection('projects');
                }}
              >
                <span>Jump to featured work</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      ) : null}
    </>
  );
}
