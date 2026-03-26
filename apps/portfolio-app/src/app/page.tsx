// apps/portfolio-app/src/app/page.tsx
"use client";

import { useEffect } from "react";
import { Header } from "@/components/ui/header-1";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Database, LineChart, Code2, Cpu, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExperienceTimeline } from "@/components/ui/experience-timeline";
import { SkillsMatrix } from "@/components/ui/skills-matrix";
import { RecommendationsCarousel } from "@/components/ui/recommendations";
import { ROICalculator } from "@/components/ui/roi-calculator";
import { LiveDataChart } from "@/components/ui/live-data-chart";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { FloatingAiAssistant } from "@/components/ui/glowing-ai-chat-assistant";
import { HospitalityStory } from "@/components/ui/hospitality-story";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { CodeSnippet } from "@/components/ui/code-snippet";
import { InteractiveGlobe } from "@/components/ui/globe";

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

const bentoItems: BentoItem[] = [

    {

        title: "Avnet BI Infrastructure",

        meta: "Power BI",

        description:

            "Co-led expansion of 'Command Center' analytics hub, building scalable DAX models.",

        icon: <Database className="w-4 h-4 text-blue-500" />,

        status: "Live",

        tags: ["DAX", "Power Query", "BI"],

        colSpan: 2,

        hasPersistentHover: true,

    },

    {

        title: "Adidas IT Prediction",

        meta: "$280K Savings",

        description: "Gradient Boosting model to predict IT ticket reassignment.",

        icon: <LineChart className="w-4 h-4 text-emerald-500" />,

        status: "Completed",

        tags: ["Python", "ML"],

    },

    {

        title: "Agentic AI Orchestration",

        meta: "CLI Tool",

        description: "Framework for multi-agent AI workflows with durable context.",

        icon: <Cpu className="w-4 h-4 text-cyan-500" />,

        tags: ["AI", "CLI"],

        colSpan: 1,

    },

    {

        title: "Spotify ML Model",

        meta: "R² > 0.85",

        description: "Regression model to predict song popularity from audio features.",

        icon: <TrendingUp className="w-4 h-4 text-green-500" />,

        tags: ["Regression", "Python"],

        colSpan: 2,

    },

];



export default function PortfolioHome() {

  useEffect(() => {

    // renderCanvas(); // Deprecated by the new hero

  }, []);



  return (

    <div className="flex w-full flex-col relative bg-background overflow-x-hidden min-h-screen">

      <Header />



      <ScrollExpandMedia

        mediaType="video"

        mediaSrc="https://videos.pexels.com/video-files/3214439/3214439-hd.mp4" // Abstract data network video

        bgImageSrc="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg" // Dark, abstract background

        title="From Operations to Analytics"

        date="Michael Panico"

        scrollToExpand="Scroll to Explore"

        textBlend

      >

        <TerminalWindow>

          <main className="grow relative z-10 bg-transparent">

            {/* THE SALES HOOK: ROI CALCULATOR */}

            <section className="w-full relative z-20" id="roi-calculator">

              <ROICalculator />

            </section>



            {/* THE COMMAND CENTER (PROJECTS) */}

            <section className="mx-auto w-full max-w-6xl px-4 py-20" id="projects">

                <div className="mb-16 text-center space-y-4">

                  <h2 className="text-4xl font-bold">The Command Center</h2>

                  <p className="text-muted-foreground text-lg">Scalable reporting, predictive modeling, and workflow automation.</p>

                </div>

                

                <div className="mb-12">

                  <LiveDataChart />

                </div>



                <BentoGrid items={bentoItems} />

            </section>



            {/* SKILLS MATRIX */}

            <section className="w-full bg-background/50 py-20 relative overflow-hidden" id="skills">

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



            {/* THE HOSPITALITY ADVANTAGE */}

            <section className="w-full bg-black/30 border-y border-border" id="advantage">

              <HospitalityStory />

            </section>



            {/* EXPERIENCE TIMELINE */}

            <section className="w-full bg-black/50 py-20" id="experience">

              <div className="max-w-5xl mx-auto px-4">

                <div className="mb-16 text-center space-y-4">

                  <h2 className="text-4xl font-bold">Experience</h2>

                  <p className="text-muted-foreground text-lg">My professional journey so far.</p>

                </div>

                <ExperienceTimeline experiences={experienceData} />

              </div>

            </section>



            {/* RECOMMENDATIONS */}

            <section className="w-full py-20" id="recommendations">

              <div className="mb-12 text-center space-y-4">

                <h2 className="text-4xl font-bold tracking-tight">What Leaders Say</h2>

                <p className="text-muted-foreground text-lg">Feedback from managers who have overseen my impact.</p>

              </div>

              <RecommendationsCarousel />

            </section>

          </main>

        </TerminalWindow>

      </ScrollExpandMedia>



      <FloatingAiAssistant />

    </div>

  );

}

