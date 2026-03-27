export type PortfolioEventType =
  | "resume_download"
  | "contact_click"
  | "section_navigation"
  | "section_impression"
  | "section_active"
  | "assistant_prompt_click"
  | "assistant_message_submit"
  | "assistant_open"
  | "assistant_close"
  | "search_open"
  | "search_select"
  | "globe_stage_select"
  | "globe_drag"
  | "project_action_click"
  | "wall_open"
  | "wall_submit"
  | "wall_reveal"
  | "print_cv_open";

export interface PortfolioEventPayload {
  eventType: PortfolioEventType;
  label?: string;
  href?: string;
  section?: string;
  metadata?: Record<string, unknown>;
}

const SESSION_KEY = "portfolio-app-session-id";

type AnalyticsClientContext = {
  path: string;
  pageTitle: string;
  referrer: string | null;
  timezone: string | null;
  language: string | null;
  browser: string;
  os: string;
  device: "mobile" | "tablet" | "desktop";
  viewportWidth: number;
  viewportHeight: number;
  screenWidth: number;
  screenHeight: number;
};

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function detectBrowser(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/OPR\//i.test(userAgent)) return "Opera";
  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) return "Chrome";
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return "Safari";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  return "Other";
}

function detectOperatingSystem(userAgent: string) {
  if (/Mac OS X/i.test(userAgent)) return "macOS";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Android/i.test(userAgent)) return "Android";
  if (/(iPhone|iPad|iPod)/i.test(userAgent)) return "iOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function detectDeviceKind(width: number) {
  if (width < 640) return "mobile" as const;
  if (width < 1100) return "tablet" as const;
  return "desktop" as const;
}

function getAnalyticsClientContext(): AnalyticsClientContext {
  const width = window.innerWidth || window.screen.width || 0;
  const height = window.innerHeight || window.screen.height || 0;
  const userAgent = navigator.userAgent || "";

  return {
    path: window.location.pathname + window.location.search + window.location.hash,
    pageTitle: document.title,
    referrer: document.referrer || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    language: navigator.language || null,
    browser: detectBrowser(userAgent),
    os: detectOperatingSystem(userAgent),
    device: detectDeviceKind(width),
    viewportWidth: width,
    viewportHeight: height,
    screenWidth: window.screen.width || width,
    screenHeight: window.screen.height || height,
  };
}

export function getPortfolioSessionId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const next = createSessionId();
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}

export function trackPortfolioEvent(payload: PortfolioEventPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const body = JSON.stringify({
    ...payload,
    metadata: {
      ...getAnalyticsClientContext(),
      ...(payload.metadata ?? {}),
    },
    sessionId: getPortfolioSessionId(),
  });

  const url = "/api/portfolio-events";

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics should never block the portfolio UX.
  });
}
