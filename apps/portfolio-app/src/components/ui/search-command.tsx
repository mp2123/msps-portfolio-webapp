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

const studyModules = [
  { name: 'Term Life Insurance', category: 'Policies', id: 'discovery' },
  { name: 'Whole Life Insurance', category: 'Policies', id: 'discovery' },
  { name: 'Universal Life Insurance', category: 'Policies', id: 'discovery' },
  { name: 'Arizona Regulations', category: 'Compliance', id: 'guide' },
  { name: 'Practice Exam', category: 'Review', id: 'review' },
];

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);

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
        <span className="hidden sm:inline">Search study modules...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a term or module name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Study Modules">
            {studyModules.map((module) => (
              <CommandItem
                key={module.name}
                onSelect={() => {
                  setOpen(false);
                  const element = document.getElementById(module.id);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>{module.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground uppercase">{module.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
