import { contactProfile, heroContent, proofMetrics } from "@/content/portfolio";

export const siteName = "Michael Panico | Business Analytics & Operations";
export const siteDescription =
  "Portfolio and web CV for Michael Panico, bridging hospitality leadership with business analytics, BI, and automation.";

function normalizeSiteUrl(rawUrl?: string) {
  if (!rawUrl) return null;
  return rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : `https://${rawUrl}`;
}

export function getSiteUrl() {
  const resolvedUrl =
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    "http://localhost:3006";

  return new URL(resolvedUrl);
}

export function getCanonicalUrl(pathname = "/") {
  return new URL(pathname, getSiteUrl()).toString();
}

export function getSocialImageFacts() {
  return {
    title: "Michael Panico",
    subtitle: "Business Analytics / BI / Automation",
    summary:
      "Operator-to-analyst portfolio built around measurable reporting leverage, predictive thinking, and practical stakeholder execution.",
    metrics: [
      proofMetrics[0],
      proofMetrics[1],
      proofMetrics[3],
    ],
    roleTargets: contactProfile.roleTargets.slice(0, 3),
    highlight: heroContent.title,
  };
}
