'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Map, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Study Guide",
    description: "387 verified questions with detailed explanations.",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Practice Exam",
    description: "Timed simulations to test your exam readiness.",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    title: "Visual Mindmaps",
    description: "Interactive diagrams for complex insurance concepts.",
    icon: Map,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    title: "Progress Tracker",
    description: "Track your scores and identify weak areas.",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export function StudyDashboard() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full border-none shadow-md transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className={`${feature.bg} ${feature.color} w-fit rounded-lg p-2 mb-2`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${feature.bg.replace('bg-', 'bg-').replace('50', '500')} w-0 transition-all duration-1000`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
