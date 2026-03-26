"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Link2, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CareerNode } from "@/content/portfolio";

interface RadialOrbitalTimelineProps {
  timelineData: CareerNode[];
}

const statusStyles: Record<CareerNode["status"], string> = {
  completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  "in-progress": "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  pending: "border-white/15 bg-white/5 text-zinc-300",
};

const statusLabels: Record<CareerNode["status"], string> = {
  completed: "Established",
  "in-progress": "Compounding",
  pending: "Emerging",
};

function getThemeGlow(theme: CareerNode["theme"]) {
  switch (theme) {
    case "hospitality":
      return "from-amber-400/30 to-amber-500/5";
    case "analytics":
      return "from-cyan-400/30 to-cyan-500/5";
    case "automation":
      return "from-indigo-400/30 to-purple-500/5";
    default:
      return "from-white/20 to-white/5";
  }
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [activeNodeId, setActiveNodeId] = useState<number | string>(
    timelineData[0]?.id ?? ""
  );
  const activeNode = timelineData.find((item) => item.id === activeNodeId) ?? timelineData[0];

  const focusNodeByOffset = (currentId: string | number, offset: number) => {
    const currentIndex = timelineData.findIndex((item) => item.id === currentId);
    if (currentIndex < 0) return;

    const nextIndex = (currentIndex + offset + timelineData.length) % timelineData.length;
    setActiveNodeId(timelineData[nextIndex]?.id ?? currentId);
  };

  const rotationAngle = useMemo(() => {
    if (!activeNode) return 0;
    const index = timelineData.findIndex((item) => item.id === activeNode.id);
    const totalNodes = timelineData.length;
    const targetAngle = (index / totalNodes) * 360;
    return 270 - targetAngle;
  }, [activeNode, timelineData]);

  const positions = useMemo(() => {
    const radius = 220;
    return timelineData.map((item, index) => {
      const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
      const radian = (angle * Math.PI) / 180;
      const x = radius * Math.cos(radian);
      const y = radius * Math.sin(radian);
      const opacity = Math.max(0.55, Math.min(1, 0.45 + 0.6 * ((1 + Math.sin(radian)) / 2)));
      const zIndex = Math.round(100 + 50 * Math.cos(radian));

      return { id: item.id, x, y, opacity, zIndex };
    });
  }, [rotationAngle, timelineData]);

  const relatedTitles =
    activeNode?.relatedIds
      .map((id) => timelineData.find((item) => item.id === id))
      .filter(Boolean) ?? [];

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:hidden">
        {timelineData.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-pressed={activeNodeId === item.id}
              onClick={() => setActiveNodeId(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveNodeId(item.id);
                  return;
                }

                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  focusNodeByOffset(item.id, 1);
                  return;
                }

                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  focusNodeByOffset(item.id, -1);
                }
              }}
              className={`rounded-3xl border p-5 text-left transition-all ${
                activeNodeId === item.id
                  ? "border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getThemeGlow(item.theme)}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.date}</p>
                  </div>
                </div>
                <Badge className={statusStyles[item.status]}>{statusLabels[item.status]}</Badge>
              </div>
              <p className="mt-4 text-sm text-zinc-300">{item.summary}</p>
              {activeNodeId === item.id ? (
                <div className="mt-5 space-y-4">
                  <div className="space-y-3">
                    {item.bullets.map((bullet) => (
                      <div key={`${item.id}-${bullet}`} className="flex items-start gap-3 text-sm text-zinc-200">
                        <ArrowRight className="mt-0.5 h-4 w-4 text-cyan-300" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-cyan-300" />
                        Momentum
                      </span>
                      <span>{item.energy}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${item.energy}%` }}
                      />
                    </div>
                  </div>

                  {item.relatedIds.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                        <Link2 className="h-3.5 w-3.5 text-cyan-300" />
                        Connected stages
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.relatedIds.map((relatedId) => {
                          const relatedNode = timelineData.find((node) => node.id === relatedId);
                          if (!relatedNode) return null;

                          return (
                            <Button
                              key={`${item.id}-${relatedNode.id}`}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveNodeId(relatedNode.id);
                              }}
                            >
                              {relatedNode.title}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="relative hidden min-h-[620px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 px-8 py-10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_55%)]" />
        <div className="absolute h-[460px] w-[460px] rounded-full border border-white/10" />
        <div className="absolute h-[620px] w-[620px] rounded-full border border-white/5" />

        <Card className="relative z-20 w-full max-w-md border-white/10 bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <Badge className={activeNode ? statusStyles[activeNode.status] : ""}>
                {activeNode ? statusLabels[activeNode.status] : "Active"}
              </Badge>
              <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                {activeNode?.date}
              </span>
            </div>
            <CardTitle className="text-2xl text-white">{activeNode?.title}</CardTitle>
            <CardDescription className="text-sm text-cyan-200/80">
              {activeNode?.companyLabel} · {activeNode?.location}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-relaxed text-zinc-300">{activeNode?.summary}</p>

            <div className="space-y-3">
              {activeNode?.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 text-sm text-zinc-200">
                  <ArrowRight className="mt-0.5 h-4 w-4 text-cyan-300" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-cyan-300" />
                  Momentum
                </span>
                <span>{activeNode?.energy}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ width: `${activeNode?.energy ?? 0}%` }}
                />
              </div>
            </div>

            {relatedTitles.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  <Link2 className="h-3.5 w-3.5 text-cyan-300" />
                  Connected stages
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatedTitles.map((relatedNode) => (
                    <Button
                      key={relatedNode?.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      onClick={() => setActiveNodeId(relatedNode!.id)}
                    >
                      {relatedNode?.title}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {timelineData.map((item) => {
          const position = positions.find((node) => node.id === item.id);
          const Icon = item.icon;
          const isActive = activeNodeId === item.id;
          const isRelated = Boolean(activeNode?.relatedIds.includes(item.id));

          return (
            <button
              key={item.id}
              type="button"
              tabIndex={activeNodeId === item.id ? 0 : -1}
              aria-pressed={isActive}
              aria-label={`${item.title}, ${item.date}, ${statusLabels[item.status]}`}
              onClick={() => setActiveNodeId(item.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  focusNodeByOffset(item.id, 1);
                  return;
                }

                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  focusNodeByOffset(item.id, -1);
                }
              }}
              className="absolute z-10 transition-all duration-500"
              style={{
                transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`,
                opacity: isActive ? 1 : position?.opacity ?? 1,
                zIndex: isActive ? 200 : position?.zIndex ?? 100,
              }}
            >
              <div className={`absolute -inset-5 rounded-full bg-gradient-to-br ${getThemeGlow(item.theme)} blur-xl ${isActive || isRelated ? "opacity-100" : "opacity-50"}`} />
              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition-all ${
                  isActive
                    ? "scale-125 border-cyan-300 bg-white text-slate-950 ring-4 ring-cyan-300/20"
                    : isRelated
                    ? "border-cyan-300/40 bg-cyan-300/10 text-white"
                    : "border-white/20 bg-black/70 text-white focus-visible:border-cyan-300 focus-visible:ring-4 focus-visible:ring-cyan-300/20"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div
                className={`absolute left-1/2 top-16 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-[0.16em] ${
                  isActive ? "text-white" : "text-zinc-400"
                }`}
              >
                {item.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
