export interface PortfolioNavItem {
  label: string;
  href: string;
  category: string;
}

const HOME_LINKS: PortfolioNavItem[] = [
  { label: "Projects", href: "#projects", category: "Case studies" },
  { label: "Skills", href: "#skills", category: "Capabilities" },
  { label: "Advantage", href: "#advantage", category: "Story" },
  { label: "Experience", href: "#experience", category: "Career" },
  { label: "Recommendations", href: "#recommendations", category: "Social proof" },
  { label: "Contact", href: "#contact", category: "Outreach" },
];

const PROJECTS_LINKS: PortfolioNavItem[] = [
  { label: "Projects", href: "#projects-top", category: "Library" },
  { label: "Artifacts", href: "#artifacts", category: "Proof vault" },
  { label: "Skills", href: "/#skills", category: "Capabilities" },
  { label: "Advantage", href: "/#advantage", category: "Story" },
  { label: "Experience", href: "/#experience", category: "Career" },
  { label: "Contact", href: "/#contact", category: "Outreach" },
];

export interface PortfolioActionItem {
  label: string;
  href: string;
  category: string;
}

const HOME_ACTIONS: PortfolioActionItem[] = [
  { label: "Open project library", href: "/projects", category: "Deep work" },
  { label: "Open web CV", href: "/cv", category: "Resume" },
];

const PROJECTS_ACTIONS: PortfolioActionItem[] = [
  { label: "Open translation layer", href: "#translation-layer", category: "Deep work" },
  { label: "Open artifact vault", href: "#artifacts", category: "Proof vault" },
  { label: "Open web CV", href: "/cv", category: "Resume" },
];

export const getPortfolioNavLinks = (pathname: string) =>
  pathname.startsWith("/projects") ? PROJECTS_LINKS : HOME_LINKS;

export const getPortfolioActionItems = (pathname: string) =>
  pathname.startsWith("/projects") ? PROJECTS_ACTIONS : HOME_ACTIONS;

export const getHeaderPrimaryCta = (pathname: string) =>
  pathname.startsWith("/projects")
    ? { label: "Contact", href: "/#contact" }
    : { label: "Project Library", href: "/projects" };

export const getHomeLinkHref = (pathname: string) =>
  pathname === "/" ? "#home" : "/#home";

export const getSamePageSectionId = (href: string, pathname: string) => {
  if (href.startsWith("#")) {
    return href.slice(1);
  }

  if (href.startsWith(`${pathname}#`)) {
    return href.slice(pathname.length + 1);
  }

  if (pathname === "/" && href.startsWith("/#")) {
    return href.slice(2);
  }

  return null;
};
