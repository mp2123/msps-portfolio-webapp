"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { SideSectionNav } from "@/components/portfolio/side-section-nav";
import { Header } from "@/components/ui/header-1";
import { cn } from "@/lib/utils";

const FloatingAiAssistant = dynamic(
  () =>
    import("@/components/ui/glowing-ai-chat-assistant").then(
      (mod) => mod.FloatingAiAssistant
    ),
  { ssr: false, loading: () => null }
);

export function PublicPageShell({
  children,
  className,
  chromeClassName,
  showHeader = true,
}: {
  children: ReactNode;
  className?: string;
  chromeClassName?: string;
  showHeader?: boolean;
}) {
  return (
    <div className={cn("relative min-h-screen overflow-x-hidden bg-background", className)}>
      <div className={chromeClassName}>
        <SideSectionNav />
      </div>
      {showHeader ? (
        <div className={chromeClassName}>
          <Header />
        </div>
      ) : null}
      {children}
      <div className={chromeClassName}>
        <FloatingAiAssistant />
      </div>
    </div>
  );
}
