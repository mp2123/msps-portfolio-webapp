import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Recommendation {
  text: string;
  author: string;
  role: string;
  company: string;
}

const recommendations: Recommendation[] = [
  {
    text: "Michael brought tremendous value to my team during his internship at Avnet. He quickly understood our business needs and consistently went above and beyond to solve challenges. One standout example was when he transformed a highly manual follow-up process—previously taking 4 or 5 hours—into an automated solution completed in just 30 minutes. Michael's drive, problem-solving skills, and impact speak for themselves.",
    author: "Rashmi Bhakta",
    role: "Global Sales Enablement Manager",
    company: "Avnet"
  },
  {
    text: "Michael was able to grow within the company at a fast pace. He excelled in his career as a bartender and quickly extended his reach to an Assistant Manager position. His attention to detail, strong interpersonal skills, and instinct for consumer habits and demands allowed him to expand his expertise quickly... Michael is a dedicated employee who puts his heart on the line.",
    author: "Tania Kedyk",
    role: "General Manager",
    company: "Paramount Barco"
  }
];

export const RecommendationsCarousel = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-card border border-border/50 p-8 rounded-2xl relative shadow-lg group hover:border-primary/50 transition-colors"
          >
            <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed italic relative z-10 text-sm md:text-base">
                &quot;{rec.text}&quot;
              </p>
              <div>
                <h4 className="font-bold text-foreground">{rec.author}</h4>
                <p className="text-primary text-sm font-medium">{rec.role}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{rec.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
