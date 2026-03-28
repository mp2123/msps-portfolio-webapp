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

const CV_LINKS: PortfolioNavItem[] = [
  { label: "Experience", href: "#experience-visuals", category: "Visual arc" },
  { label: "Advantage", href: "#cv-advantage", category: "Story" },
  { label: "Capabilities", href: "#cv-capabilities", category: "Skills matrix" },
  { label: "Projects", href: "/projects", category: "Library" },
  { label: "Contact", href: "#contact", category: "Outreach" },
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
  { label: "Open impact lab", href: "#impact-lab", category: "Business leverage" },
  { label: "Open translation layer", href: "#translation-layer", category: "Deep work" },
  { label: "Open artifact vault", href: "#artifacts", category: "Proof vault" },
  { label: "Open web CV", href: "/cv", category: "Resume" },
];

const CV_ACTIONS: PortfolioActionItem[] = [
  { label: "Open project library", href: "/projects", category: "Deep work" },
  { label: "Jump to experience arc", href: "#experience-visuals", category: "Visual arc" },
  { label: "Jump to capabilities", href: "#cv-capabilities", category: "Skills matrix" },
  { label: "Back to homepage briefing", href: "/#home", category: "Briefing" },
];

export const getPortfolioNavLinks = (pathname: string) =>
  pathname.startsWith("/projects")
    ? PROJECTS_LINKS
    : pathname.startsWith("/cv")
      ? CV_LINKS
      : HOME_LINKS;

export const getPortfolioActionItems = (pathname: string) =>
  pathname.startsWith("/projects")
    ? PROJECTS_ACTIONS
    : pathname.startsWith("/cv")
      ? CV_ACTIONS
      : HOME_ACTIONS;

export const getHeaderPrimaryCta = (pathname: string) =>
  pathname.startsWith("/projects")
    ? { label: "Back Home", href: "/#home" }
    : pathname.startsWith("/cv")
      ? { label: "Project Library", href: "/projects" }
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
