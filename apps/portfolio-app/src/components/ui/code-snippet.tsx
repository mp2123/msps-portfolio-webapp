"use client";

import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Code2 } from 'lucide-react';

export const CodeSnippet = ({ code }: { code: string }) => {
  return (
    <div className="bg-black/70 border border-border/50 rounded-lg overflow-hidden my-4">
      <div className="flex items-center justify-between bg-muted/20 px-4 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-muted-foreground">Example Snippet</span>
        </div>
      </div>
      <div className="p-4 text-sm font-mono text-emerald-300">
        <TypeAnimation
          sequence={[code, 5000]}
          wrapper="div"
          speed={70}
          repeat={Infinity}
          cursor={true}
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
        />
      </div>
    </div>
  );
};
