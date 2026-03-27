export type PortfolioEventType =
  | "resume_download"
  | "contact_click"
  | "section_navigation"
  | "assistant_prompt_click"
  | "assistant_message_submit"
  | "print_cv_open";

export interface PortfolioEventPayload {
  eventType: PortfolioEventType;
  label?: string;
  href?: string;
  section?: string;
  metadata?: Record<string, unknown>;
}

const SESSION_KEY = "portfolio-app-session-id";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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
