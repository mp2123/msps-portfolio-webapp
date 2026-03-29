'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { SearchCommand } from '@/components/ui/search-command';
import { trackPortfolioEvent } from '@/lib/portfolio-analytics';
import { PORTFOLIO_ASSISTANT_OPEN } from '@/lib/portfolio-assistant-ui';
import { scrollToPortfolioSection } from '@/lib/portfolio-navigation';
import {
  getHeaderPrimaryCta,
  getHomeLinkHref,
  getPortfolioNavLinks,
  getSamePageSectionId,
} from '@/lib/portfolio-nav';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const pathname = usePathname() ?? '/';

  const handleSectionNavigation = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string, closeMenu = false) => {
      const sectionId = getSamePageSectionId(href, pathname);
      if (closeMenu) {
        setOpen(false);
      }

      if (sectionId) {
        event.preventDefault();
        scrollToPortfolioSection(sectionId);
      }

      trackPortfolioEvent({
        eventType: 'section_navigation',
        label: `header-${sectionId ?? href.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
        href,
        section: 'header',
        metadata: { closeMenu, pathname },
      });
    },
    [pathname],
  );

  const links = getPortfolioNavLinks(pathname);
  const primaryCta = getHeaderPrimaryCta(pathname);
  const homeHref = getHomeLinkHref(pathname);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  React.useEffect(() => {
    const handleAssistantOpen = () => {
      setOpen(false);
    };

    window.addEventListener(PORTFOLIO_ASSISTANT_OPEN, handleAssistantOpen);
    return () => window.removeEventListener(PORTFOLIO_ASSISTANT_OPEN, handleAssistantOpen);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full border-b border-transparent bg-background/80 backdrop-blur-xl transition-colors',
        scrolled && 'border-white/10 bg-background/92',
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-6 lg:px-8">
        {/* Logo / Home link */}
        <a
          href={homeHref}
          className="group flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition-colors hover:border-cyan-300/25 hover:bg-white/[0.08]"
          aria-label="Jump to top of portfolio"
          onClick={(event) => handleSectionNavigation(event, homeHref)}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/12 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
            MP
          </span>
          <span className="hidden min-w-0 flex-col leading-none md:flex">
            <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-cyan-100/65">
              Michael
            </span>
            <span className="text-sm font-semibold text-white">Panico</span>
          </span>
          <span className="hidden rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors group-hover:text-cyan-100/80 lg:inline-flex">
            Home
          </span>
        </a>

        {/* Search — hidden on small screens */}
        <div className="hidden min-w-0 flex-1 lg:flex lg:max-w-[18rem] xl:max-w-[22rem] 2xl:max-w-[25rem]">
          <SearchCommand />
        </div>

        {/* Desktop nav links — show at lg (1024px+) */}
        <div className="ml-auto hidden items-center gap-1 lg:flex lg:gap-1.5 xl:gap-2">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: 'ghost', className: 'text-xs lg:text-sm' })}
              href={link.href}
              onClick={(event) => handleSectionNavigation(event, link.href)}
            >
              {link.label}
            </a>
          ))}
          <div className="mx-1.5 h-6 w-px bg-border lg:mx-2" />
          <Button asChild>
            <a
              href={primaryCta.href}
              onClick={(event) => handleSectionNavigation(event, primaryCta.href)}
            >
              {primaryCta.label}
            </a>
          </Button>
        </div>

        {/* Mobile hamburger — show below lg (1024px) */}
        <div className="ml-auto lg:hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} className="size-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div
          id="mobile-menu"
          className={cn(
            'fixed top-14 right-0 bottom-0 left-0 z-40 lg:hidden',
            'bg-background backdrop-blur-lg border-t border-white/10',
          )}
        >
          <div className="space-y-4 p-4">
            <SearchCommand />
            <div className="space-y-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  className={buttonVariants({
                    variant: 'ghost',
                    className: 'justify-start w-full text-base',
                  })}
                  href={link.href}
                  onClick={(event) => handleSectionNavigation(event, link.href, true)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-white/10 space-y-2">
            <Button asChild className="w-full">
              <a
                href={primaryCta.href}
                onClick={(event) => handleSectionNavigation(event, primaryCta.href, true)}
              >
                {primaryCta.label}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
