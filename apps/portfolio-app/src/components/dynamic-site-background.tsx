"use client";

import dynamic from "next/dynamic";

export const DynamicSiteBackground = dynamic(
  () => import("@/components/site-background").then((mod) => mod.SiteBackground),
  { ssr: false }
);
