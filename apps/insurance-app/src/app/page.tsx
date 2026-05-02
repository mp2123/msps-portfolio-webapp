// apps/insurance-app/src/app/page.tsx
"use client";

import { useEffect } from "react";
import { Header } from "@/components/ui/header-1";
import { Chatbot } from "@/components/ui/chatbot";
import { StudyDashboard } from "@/components/ui/dashboard";
import { Flashcards } from "@/components/ui/flashcards";
import { HeroSection, LogosSection } from "@/components/ui/hero-1";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { DotScreenShader } from "@/components/ui/dot-shader-background";
import { HalideLanding } from "@/components/ui/halide-topo-hero";
import { renderCanvas } from "@/components/ui/canvas";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Box, Settings, Lock, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";

import { CardScanner } from "@/components/ui/card-scanner";
import { SideTimelineNav } from "@/components/ui/side-timeline-nav";

export default function DemoOne() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="flex w-full flex-col relative bg-background overflow-x-hidden">
      <SideTimelineNav />
      
      {/* Interactive Canvas Background for Hero */}
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto z-0 opacity-30"
        id="canvas"
      ></canvas>

      <Header />

      <main className="grow relative z-10">
        {/* Hero with Canvas */}
        <section id="home">
          <HeroSection />
        </section>

        {/* Digital Policy Scanning Section */}
        <section className="w-full mt-20" id="discovery">
          <CardScanner />
        </section>

        {/* 3D Topographical Hero Section */}
        <section className="w-full mt-20">
          <HalideLanding />
        </section>

        {/* 3D Scroll Animation Section */}
        <section className="flex flex-col overflow-hidden bg-background">
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-semibold text-foreground">
                  Master the Visuals of <br />
                  <span className="text-5xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                    Life Insurance
                  </span>
                </h1>
              </div>
            }
          >
            <div className="relative h-full w-full bg-muted flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200"
                    alt="Study App Dashboard"
                    fill
                    className="object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                    <p className="text-white text-3xl font-bold">Interactive Learning Platform</p>
                </div>
            </div>
          </ContainerScroll>
        </section>

        {/* Interactive Study Tools Section */}
        <section className="mx-auto w-full max-w-5xl px-4 py-20" id="guide">
            <Card className="w-full h-[600px] bg-black/[0.96] relative overflow-hidden border-border/40 shadow-2xl">
                <div className="flex h-full flex-col md:flex-row">
                    {/* Left content */}
                    <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                            Immersive 3D <br /> Study Tools
                        </h1>
                        <p className="mt-6 text-neutral-300 max-w-lg text-lg">
                            Complexity simplified. Explore 3D scenes that break down policy provisions, underwriting cycles, and Arizona state regulations.
                        </p>
                        <div className="mt-8">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                                Launch 3D Lab
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative h-full min-h-[300px] overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_50%_25%,rgba(34,197,94,0.26),transparent_32%),linear-gradient(145deg,rgba(15,23,42,0.95),rgba(2,6,23,1))] md:border-l md:border-t-0">
                        <div className="absolute inset-8 rounded-full border border-emerald-300/25" />
                        <div className="absolute inset-16 rounded-full border border-cyan-300/20" />
                        <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/15 blur-2xl" />
                        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/40 bg-white/5 shadow-[0_0_60px_rgba(16,185,129,0.28)]" />
                        <div className="absolute left-[18%] top-[24%] rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/70">Module</p>
                            <p className="mt-1 text-sm font-semibold text-white">Policy Types</p>
                        </div>
                        <div className="absolute right-[12%] top-[36%] rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Focus</p>
                            <p className="mt-1 text-sm font-semibold text-white">Underwriting</p>
                        </div>
                        <div className="absolute bottom-[18%] left-[28%] rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.18em] text-sky-100/70">Exam</p>
                            <p className="mt-1 text-sm font-semibold text-white">AZ Rules</p>
                        </div>
                        <div className="absolute bottom-8 right-8 flex gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-300" />
                            <span className="h-2 w-2 rounded-full bg-cyan-300" />
                            <span className="h-2 w-2 rounded-full bg-sky-300" />
                        </div>
                    </div>
                </div>
            </Card>
        </section>

        {/* Glowing Dashboard Section */}
        <section className="mx-auto w-full max-w-5xl px-4 py-20" id="dashboard">
            <h2 className="text-4xl font-bold text-center mb-16">High-Performance Modules</h2>
            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                    icon={<Box className="h-4 w-4" />}
                    title="Policy Mastery"
                    description="Deep dive into Term, Whole, and Universal Life structures."
                />
                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                    icon={<Settings className="h-4 w-4" />}
                    title="State Regulations"
                    description="Updated for Arizona 2026 Licensing requirements."
                />
                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                    icon={<Lock className="h-4 w-4" />}
                    title="Security & Ethics"
                    description="Master the legalities of contract law and fiduciary duty."
                />
                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Exam Simulator"
                    description="Adaptive testing with AI-driven performance analytics."
                />
                <GridItem
                    area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                    icon={<Search className="h-4 w-4" />}
                    title="Instant Search"
                    description="Quickly find definitions for 500+ insurance terms."
                />
            </ul>
        </section>

        {/* Existing Components */}
        <section id="review">
          <Flashcards />
        </section>
        <StudyDashboard />

        {/* Dot Shader Background Section */}
        <section className="relative w-full h-[500px] mt-20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <DotScreenShader />
            </div>
            <div className="relative z-10 text-center pointer-events-none">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mix-blend-exclusion text-white uppercase">
                    Licensing Reimagined
                </h1>
                <p className="text-xl md:text-2xl font-light text-white mix-blend-exclusion max-w-2xl mx-auto mt-4 px-4">
                    The fusion of cutting-edge tech and Arizona State insurance expertise.
                </p>
            </div>
        </section>

        <LogosSection />
      </main>

      <Chatbot />
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3 overflow-hidden">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
