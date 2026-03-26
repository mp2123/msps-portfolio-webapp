// apps/portfolio-app/src/app/page.tsx
"use client";

import { useEffect } from "react";
import { Header } from "@/components/ui/header-1";
import { Chatbot } from "@/components/ui/chatbot";
import { renderCanvas } from "@/components/ui/canvas";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Database, LineChart, Code2, Cpu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExperienceTimeline } from "@/components/ui/experience-timeline";
import { SkillsMatrix } from "@/components/ui/skills-matrix";
import { RecommendationsCarousel } from "@/components/ui/recommendations";

const experienceData = [
  {
    title: "Business Analyst Intern (Global Sales Enablement)",
    company: "Avnet",
    date: "May 2024 - Jan 2026",
    location: "Phoenix, Arizona",
    description: [
      "Co-led expansion of internal 'Command Center' analytics hub.",
      "Cleaned/transformed large datasets in Power Query (M); developed DAX measures/KPIs.",
      "Built supervised ML/predictive analytics in Python and integrated outputs into Power BI.",
      "Automated recurring reporting workflows using VBA, saving 20+ hours/week."
    ]
  },
  {
    title: "Supervisor / Bartender",
    company: "Hilton Hotels & Resorts",
    date: "Sep 2022 - May 2025",
    location: "Phoenix, Arizona",
    description: [
      "Led high-volume shift execution and coached team members.",
      "Resolved complex guest issues in real time under extreme pressure.",
      "Managed cash handling and closeout procedures with absolute precision."
    ]
  },
  {
    title: "Bar Manager",
    company: "Paramount Barco",
    date: "Nov 2021 - Aug 2022",
    location: "Iowa City, Iowa",
    description: [
      "Assisted GM in hiring, training, and standardizing operations.",
      "Performed bookkeeping tasks, inventory analysis, and daily business operational functions."
    ]
  }
];

export default function PortfolioHome() {
  useEffect(() => {
    // This renders the liquid canvas background
    renderCanvas();
  }, []);

  return (
    <div className="flex w-full flex-col relative bg-background overflow-x-hidden min-h-screen">
      
      {/* Interactive Canvas Background for Hero */}
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto z-0 opacity-20"
        id="canvas"
      ></canvas>

      <Header />

      <main className="grow relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="w-full flex items-center justify-center min-h-[70vh] pt-20">
          <div className="text-center space-y-6 max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
              Michael Panico
            </h1>
            <p className="text-xl md:text-3xl font-light text-muted-foreground">
              Bridging <span className="text-primary font-semibold">High-Volume Operations</span> with <span className="text-primary font-semibold">Scalable Data Analytics</span>.
            </p>
            <div className="flex justify-center gap-4 pt-8">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                View Experience
              </button>
              <button className="bg-muted text-foreground border border-border px-8 py-3 rounded-full font-bold hover:bg-muted/80 transition-all">
                Project Command Center
              </button>
            </div>
          </div>
        </section>

        {/* THE COMMAND CENTER (PROJECTS) */}
        <section className="mx-auto w-full max-w-5xl px-4 py-20" id="projects">
            <div className="mb-16 text-center space-y-4">
              <h2 className="text-4xl font-bold">The Command Center</h2>
              <p className="text-muted-foreground text-lg">Scalable reporting, predictive modeling, and workflow automation.</p>
            </div>
            
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4 xl:max-h-[34rem]">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/7]"
                    icon={<Cpu className="h-5 w-5 text-cyan-400" />}
                    title="Agentic AI Orchestration"
                    description="CLI-based orchestration framework for multi-agent AI workflows with durable context and validation gates."
                />
                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:1/7/2/13]"
                    icon={<Database className="h-5 w-5 text-blue-400" />}
                    title="Avnet BI Infrastructure"
                    description="Co-led expansion of 'Command Center' analytics hub. Built Power BI models (DAX/M) adopted across global sales."
                />
                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:2/1/3/5]"
                    icon={<LineChart className="h-5 w-5 text-emerald-400" />}
                    title="Adidas IT Prediction"
                    description="Spearheaded a Gradient Boosting model to predict IT ticket reassignment, estimating $280K in annual savings."
                />
                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:2/5/3/9]"
                    icon={<Code2 className="h-5 w-5 text-indigo-400" />}
                    title="Spotify ML Model"
                    description="Regression modeling with k-fold cross-validation to predict song popularity from audio features."
                />
                <GridItem
                    area="md:[grid-area:3/1/4/13] xl:[grid-area:2/9/3/13]"
                    icon={<Sparkles className="h-5 w-5 text-violet-400" />}
                    title="Sentiment Analysis Pipeline"
                    description="TF-IDF and Logistic Regression pipeline to classify Yelp review sentiments and predict ratings."
                />
            </ul>
        </section>

        {/* SKILLS MATRIX */}
        <section className="w-full bg-background py-20 relative overflow-hidden" id="skills">
          {/* Subtle Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="mb-12 text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Technical Arsenal</h2>
              <p className="text-muted-foreground text-lg">Tools and languages driving my analytics workflows.</p>
            </div>
            <SkillsMatrix />
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section className="w-full bg-black/50 py-20 border-t border-border" id="experience">
          <div className="max-w-5xl mx-auto px-4">
            <div className="mb-16 text-center space-y-4">
              <h2 className="text-4xl font-bold">Experience</h2>
              <p className="text-muted-foreground text-lg">My professional journey so far.</p>
            </div>
            <ExperienceTimeline experiences={experienceData} />
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="w-full bg-background py-20 border-t border-border" id="recommendations">
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">What Leaders Say</h2>
            <p className="text-muted-foreground text-lg">Feedback from managers who have overseen my impact.</p>
          </div>
          <RecommendationsCarousel />
        </section>

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
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background/80 backdrop-blur-sm p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6 transition-all hover:bg-background/90">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted/50 p-2">
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
