"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Clock, DollarSign } from 'lucide-react';

export const ROICalculator = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);
  
  // Michael's Avnet Metric: Automated a 4-5 hr process down to 30 mins (approx 85% reduction)
  const automationEfficiency = 0.85; 
  
  const [savedHoursYearly, setSavedHoursYearly] = useState(0);
  const [savedCostYearly, setSavedCostYearly] = useState(0);

  useEffect(() => {
    // 52 weeks in a year
    const totalCurrentHoursYearly = hoursPerWeek * 52;
    const automatedHoursSaved = totalCurrentHoursYearly * automationEfficiency;
    
    setSavedHoursYearly(Math.round(automatedHoursSaved));
    setSavedCostYearly(Math.round(automatedHoursSaved * hourlyRate));
  }, [hoursPerWeek, hourlyRate]);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="bg-card/40 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Abstract Tech Background */}
        <div className="absolute top-[-100px] -right-[100px] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
          {/* Input Section */}
          <div className="space-y-8 relative z-10">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Calculator className="text-primary w-6 h-6" />
                The ROI of Automation
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Based on my work at Avnet (converting a 5-hour manual process to a 30-minute script), calculate how much I could save your team.
              </p>
            </div>

            <div className="space-y-6">
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Manual Reporting (Hours/Week)</label>
                  <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">{hoursPerWeek} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="2" max="40" step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Average Team Hourly Rate ($)</label>
                  <span className="text-emerald-400 font-mono bg-emerald-400/10 px-2 py-1 rounded-md">${hourlyRate}/hr</span>
                </div>
                <input 
                  type="range" 
                  min="25" max="150" step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col justify-center gap-6 relative z-10">
            <motion.div 
              key={savedHoursYearly}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background/80 border border-border p-6 rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Time Reclaimed (Yearly)</p>
                <h4 className="text-4xl font-black text-foreground">{savedHoursYearly.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">hrs</span></h4>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </motion.div>

            <motion.div 
              key={savedCostYearly}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-background/80 border border-emerald-500/30 p-6 rounded-2xl flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
              <div className="relative z-10">
                <p className="text-emerald-500/80 text-sm font-medium mb-1">Estimated Cost Savings (Yearly)</p>
                <h4 className="text-4xl font-black text-emerald-400">${savedCostYearly.toLocaleString()}</h4>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center relative z-10">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};
