'use client';

import React from 'react';
import Image from 'next/image';
import { GlassWater, Info } from 'lucide-react';

interface RecipeCardProps {
  recipe: {
    name: string;
    ingredients: string[];
    difficulty: string;
    glass: string;
    imageUrl: string;
  };
}

export const PrintableRecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  ({ recipe }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[800px] bg-white text-black p-12 flex flex-col gap-8 relative overflow-hidden"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        {/* Background Decorative Element */}
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-amber-50 rounded-full -z-10" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-amber-600 font-bold uppercase tracking-widest text-sm">Professional Mixology Lab</p>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">{recipe.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Complexity</p>
            <p className="text-lg font-black uppercase">{recipe.difficulty}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mt-4">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-lg flex items-center gap-3">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                Glassware
              </h3>
              <p className="text-lg flex items-center gap-2">
                <GlassWater className="h-5 w-5 text-amber-600" />
                {recipe.glass}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden border-4 border-black shadow-2xl">
              <Image src={recipe.imageUrl} alt={recipe.name} width={500} height={500} className="w-full h-full object-cover" />
            </div>
            <div className="bg-black text-white p-6 rounded-xl space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-2">
                <Info className="h-3 w-3" /> Note from the Bartender
              </p>
              <p className="text-sm leading-relaxed italic opacity-90">
                Precision is key. Always use fresh juice and high-quality ice. The theater of the pour is as important as the taste.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12 flex justify-between items-end border-t border-gray-100">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30">
              MIXOLOGY LAB v1.0 • AZ-2026
            </p>
          </div>
          <p className="text-xs font-bold italic">Crafted by Michael Panico</p>
        </div>
      </div>
    );
  }
);

PrintableRecipeCard.displayName = 'PrintableRecipeCard';
