"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const data = [
  {
    name: 'IT Routing Efficiency',
    impact: 280000,
    metric: 'Annual Savings ($)',
    tools: 'Python, Gradient Boosting',
    color: 'hsl(var(--primary))'
  },
  {
    name: 'Manual Reporting Automation',
    impact: 52000, // Estimated value of 1000 hours saved at $52/hr
    metric: 'Value of Time Saved ($)',
    tools: 'VBA, Power Query, DAX',
    color: '#34d399' // Emerald 400
  },
  {
    name: 'Sales Driver Identification',
    impact: 12700000,
    metric: 'Identified Revenue Driver ($)',
    tools: 'Multivariable Regression',
    color: '#818cf8' // Indigo 400
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border p-4 rounded-xl shadow-xl">
        <p className="font-bold text-foreground mb-2">{label}</p>
        <p className="text-primary font-mono text-lg">${data.impact.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{data.metric}</p>
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs font-medium text-foreground">Stack: <span className="text-muted-foreground font-normal">{data.tools}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export const LiveDataChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full animate-pulse bg-muted rounded-xl"></div>;

  // We are excluding the massive 12.7M outlier from the visual chart scale to make the other bars visible,
  // but keeping it in the data array to show we can handle complex scaling or we just cap the domain.
  // For visual appeal in this portfolio, let's use a logarithmic scale or cap it.
  
  return (
    <div className="w-full h-[400px] bg-background/50 border border-border rounded-2xl p-6 shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold font-mono text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Impact Analysis Dashboard
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Simulated view of project KPIs and estimated financial impact.</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.5)" 
            fontSize={12}
            tickMargin={10}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="impact" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
