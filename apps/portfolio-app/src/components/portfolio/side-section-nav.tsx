"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  FileUser,
  FolderKanban,
  Gem,
  HandCoins,
  Home,
  LayoutGrid,
  MessageSquareQuote,
  Send,
  Sparkles,
  Waypoints,
} from "lucide-react";

import { trackPortfolioEvent } from "@/lib/portfolio-analytics";
import { openPortfolioAssistant } from "@/lib/portfolio-assistant-ui";
import { scrollToPortfolioSection } from "@/lib/portfolio-navigation";
import { cn } from "@/lib/utils";

type SideNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: "assistant";
};

const HOME_ITEMS: SideNavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "#home" },
  { id: "projects", label: "Projects", icon: FolderKanban, href: "#projects" },
  { id: "skills", label: "Skills", icon: LayoutGrid, href: "#skills" },
  { id: "advantage", label: "Advantage", icon: Sparkles, href: "#advantage" },
  { id: "experience", label: "Experience", icon: Waypoints, href: "#experience" },
  {
    id: "recommendations",
    label: "Recommendations",
    icon: MessageSquareQuote,
    href: "#recommendations",
  },
  { id: "contact", label: "Contact", icon: Send, href: "#contact" },
  { id: "assistant", label: "Ask AI", icon: Bot, action: "assistant" },
];

const PROJECT_ITEMS: SideNavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/#home" },
  { id: "projects-hero", label: "Overview", icon: FolderKanban, href: "#projects-hero" },
  { id: "projects-top", label: "Library", icon: LayoutGrid, href: "#projects-top" },
  { id: "impact-lab", label: "Impact Lab", icon: HandCoins, href: "#impact-lab" },
  { id: "translation-layer", label: "Scanner", icon: Sparkles, href: "#translation-layer" },
  { id: "artifacts", label: "Vault", icon: Gem, href: "#artifacts" },
  { id: "cv", label: "Web CV", icon: FileUser, href: "/cv" },
  { id: "assistant", label: "Ask AI", icon: Bot, action: "assistant" },
];

const CV_ITEMS: SideNavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/#home" },
  { id: "cv-top", label: "CV Top", icon: FileUser, href: "#cv-top" },
  { id: "experience-visuals", label: "Arc", icon: Waypoints, href: "#experience-visuals" },
  { id: "cv-advantage", label: "Advantage", icon: Sparkles, href: "#cv-advantage" },
  { id: "cv-capabilities", label: "Capabilities", icon: LayoutGrid, href: "#cv-capabilities" },
  { id: "contact", label: "Contact", icon: Send, href: "#contact" },
  { id: "assistant", label: "Ask AI", icon: Bot, action: "assistant" },
];

const getNavItems = (pathname: string) => {
  if (pathname.startsWith("/projects")) {
    return PROJECT_ITEMS;
  }

  if (pathname.startsWith("/cv")) {
    return CV_ITEMS;
  }

  return HOME_ITEMS;
};

export function SideSectionNav() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const navItems = React.useMemo(() => getNavItems(pathname), [pathname]);
  const [activeSection, setActiveSection] = React.useState(navItems[0]?.id ?? "home");
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-38% 0px -38% 0px",
        threshold: 0,
      }
    );

    navItems.forEach((item) => {
      if (!item.href || !item.href.startsWith("#")) {
        return;
      }

      const element = document.getElementById(item.href.slice(1));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [navItems]);

  const handleItemSelect = (item: SideNavItem) => {
    if (item.action === "assistant") {
      openPortfolioAssistant();
      trackPortfolioEvent({
        eventType: "section_navigation",
        label: "side-nav-assistant",
        href: "__assistant__",
        section: "side-nav",
        metadata: { pathname },
      });
      return;
    }

    if (!item.href) {
      return;
    }

    if (item.href.startsWith("#")) {
      scrollToPortfolioSection(item.href.slice(1));
      trackPortfolioEvent({
        eventType: "section_navigation",
        label: `side-nav-${item.id}`,
        href: item.href,
        section: "side-nav",
        metadata: { pathname },
      });
      return;
    }

    trackPortfolioEvent({
      eventType: "section_navigation",
      label: `side-nav-${item.id}`,
      href: item.href,
      section: "side-nav",
      metadata: { pathname },
    });
    router.push(item.href);
  };

  return (
    <nav className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 lg:flex lg:flex-col lg:items-center lg:gap-5 xl:left-5 xl:gap-6">
      <div className="pointer-events-none absolute inset-y-4 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/18 to-transparent" />

      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <div
            key={item.id}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              type="button"
              onClick={() => handleItemSelect(item)}
              className={cn(
                "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300",
                isActive
                  ? "scale-110 border-cyan-300/35 bg-cyan-400/15 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.28)]"
                  : "border-white/10 bg-black/45 text-zinc-400 backdrop-blur-xl hover:border-cyan-300/25 hover:text-cyan-100"
              )}
              aria-label={item.label}
              aria-pressed={isActive}
            >
              <Icon className={cn("h-4 w-4", isActive && "animate-pulse")} />
              {isActive ? (
                <motion.div
                  layoutId={`portfolio-side-nav-${pathname}`}
                  className="absolute inset-0 -z-10 rounded-full bg-cyan-400/15 blur-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                />
              ) : null}
            </button>

            <AnimatePresence>
              {(hoveredItem === item.id || isActive) && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="pointer-events-none absolute left-14 whitespace-nowrap rounded-full border border-white/10 bg-black/75 px-3 py-1.5 backdrop-blur-xl"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/85">
                    {item.label}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {index < navItems.length - 1 ? (
              <div className="pointer-events-none absolute left-1/2 top-11 h-6 w-px -translate-x-1/2 bg-white/5 transition-colors" />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
