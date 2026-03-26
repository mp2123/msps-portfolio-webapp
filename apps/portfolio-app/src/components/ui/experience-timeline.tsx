import React from 'react';
import { motion } from 'framer-motion';

export interface ExperienceNodeProps {
  title: string;
  company: string;
  date: string;
  location: string;
  description: string[];
}

export const ExperienceTimeline = ({ experiences }: { experiences: ExperienceNodeProps[] }) => {
  return (
    <div className="relative max-w-5xl mx-auto py-10">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2"></div>
      
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`relative flex flex-col md:flex-row items-start ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 mt-1.5 z-10 shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
            
            {/* Content Container */}
            <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${
              index % 2 === 0 ? "md:pl-12" : "md:pr-12"
            }`}>
              <div className="bg-card/50 backdrop-blur-md border border-border/50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30 relative overflow-hidden group">
                
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex flex-col space-y-2 relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{exp.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm font-medium">
                    <span className="text-primary font-bold">{exp.company}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="text-xs uppercase tracking-wider">{exp.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/60 mb-4">{exp.location}</p>
                  
                  <ul className="mt-4 space-y-3 text-sm md:text-base text-muted-foreground">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-3 mt-1 text-lg leading-none">▹</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
