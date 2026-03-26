import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: 'Power BI', category: 'Analytics' },
  { name: 'DAX', category: 'Analytics' },
  { name: 'Power Query (M)', category: 'Analytics' },
  { name: 'Python', category: 'Programming' },
  { name: 'SQL', category: 'Programming' },
  { name: 'pandas / scikit-learn', category: 'Machine Learning' },
  { name: 'Predictive Modeling', category: 'Machine Learning' },
  { name: 'Workflow Automation', category: 'Operations' },
  { name: 'VBA', category: 'Operations' },
  { name: 'Cross-Functional Leadership', category: 'Operations' },
];

export const SkillsMatrix = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 md:px-6 md:py-3 rounded-full border border-primary/20 bg-primary/5 text-foreground backdrop-blur-sm cursor-default hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm"
          >
            <span className="font-semibold text-sm md:text-base tracking-wide">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
