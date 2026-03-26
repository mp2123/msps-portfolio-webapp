"use client";

import { cn } from "@/lib/utils";
import { GlowCard } from "./spotlight-card";
import {
    CheckCircle,
    TrendingUp,
    Cpu,
    Database,
    LineChart,
    Code2,
    Sparkles,
} from "lucide-react";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

const itemsSample: BentoItem[] = [
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

function BentoGrid({ items = itemsSample }: { items: BentoItem[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        "relative rounded-xl overflow-hidden",
                        item.colSpan ? `md:col-span-${item.colSpan}` : "col-span-1"
                    )}
                >
                    <GlowCard customSize={true} className="w-full h-full p-4">
                        <div className="relative flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 group-hover:bg-gradient-to-br transition-all duration-300">
                                    {item.icon}
                                </div>
                                <span
                                    className={cn(
                                        "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
                                        "bg-white/10 text-gray-300",
                                        "transition-colors duration-300 group-hover:bg-white/20"
                                    )}
                                >
                                    {item.status || "Active"}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-100 tracking-tight text-[15px]">
                                    {item.title}
                                    <span className="ml-2 text-xs text-gray-400 font-normal">
                                        {item.meta}
                                    </span>
                                </h3>
                                <p className="text-sm text-gray-300 leading-snug font-[425]">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                    {item.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.cta || "Explore →"}
                                </span>
                            </div>
                        </div>
                    </GlowCard>
                </div>
            ))}
        </div>
    );
}

export { BentoGrid }