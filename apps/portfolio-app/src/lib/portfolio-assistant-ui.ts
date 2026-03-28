"use client";

export const PORTFOLIO_ASSISTANT_REQUEST_OPEN = "portfolio-assistant-request-open";
export const PORTFOLIO_ASSISTANT_OPEN = "portfolio-assistant-open";

export const openPortfolioAssistant = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(PORTFOLIO_ASSISTANT_REQUEST_OPEN));
};
