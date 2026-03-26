"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowCard } from "./spotlight-card";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status: string;
    tags: string[];
    meta: string;
    problem: string;
    method: string;
    result: string;
    proofLabel: string;
    proofValue: string;
    actions: Array<{
        label: string;
        href?: string;
        note?: string;
    }>;
    colSpan: 1 | 2;
}

function BentoGrid({ items }: { items: BentoItem[] }) {
    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
            {items.map((item, index) => (
                <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.16 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className={cn(
                        "relative overflow-hidden rounded-xl",
                        item.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"
                    )}
                >
                    <GlowCard customSize={true} className="group relative h-full w-full overflow-hidden p-5">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_18%)]" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_28px] opacity-[0.08]" />
                        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.3)]" />
                        <div className="relative flex h-full flex-col space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/8 transition-all duration-300 group-hover:border-cyan-300/30 group-hover:bg-cyan-300/10">
                                    {item.icon}
                                </div>
                                <Badge variant="secondary" className="border border-white/10 bg-white/10 text-zinc-100 shadow-[0_0_18px_rgba(34,211,238,0.06)]">
                                    {item.status}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/60">
                                        {item.meta}
                                    </p>
                                    <h3 className="mt-2 font-semibold text-gray-100 tracking-tight text-lg">
                                    {item.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-300 leading-snug font-[425]">{item.description}</p>
                            </div>

                            <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Problem</p>
                                    <p className="mt-1 text-sm text-zinc-200">{item.problem}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Method</p>
                                    <p className="mt-1 text-sm text-zinc-200">{item.method}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Result</p>
                                    <p className="mt-1 text-sm text-zinc-200">{item.result}</p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4">
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.4)]" />
                                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/70">{item.proofLabel}</p>
                                <p className="mt-2 text-base font-semibold text-cyan-100">{item.proofValue}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={`${item.title}-${tag}`}
                                            className="rounded-md border border-white/8 bg-white/10 px-2 py-1 text-xs text-gray-300 backdrop-blur-sm transition-all duration-200 hover:border-cyan-300/25 hover:bg-white/20"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                            </div>

                            <div className="mt-auto grid gap-2 sm:grid-cols-2">
                                {item.actions.map((action) =>
                                    action.href ? (
                                        <Button key={action.label} asChild variant="outline" className="justify-between border-white/10 bg-white/5 text-zinc-100 hover:border-cyan-300/25 hover:bg-white/10">
                                            <a href={action.href}>
                                                {action.label}
                                                <ArrowUpRight className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    ) : (
                                        <div
                                            key={action.label}
                                            className="rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-2 text-sm text-zinc-400"
                                        >
                                            <p className="font-medium text-zinc-200">{action.label}</p>
                                            {action.note ? <p className="mt-1 text-xs text-zinc-500">{action.note}</p> : null}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </GlowCard>
                </motion.div>
            ))}
        </div>
    );
}

export { BentoGrid }
