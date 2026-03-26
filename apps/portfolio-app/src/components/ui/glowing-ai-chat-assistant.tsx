'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Link, Code, Mic, Send, Info, Bot, X } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef(null);
  
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'google' | 'openai'>('google');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('portfolio_api_key');
    const savedProvider = localStorage.getItem('portfolio_provider');
    if (savedKey) setApiKey(savedKey);
    if (savedProvider) setProvider(savedProvider as any);
  }, []);
  
  const { messages, sendMessage, status } = useChat({
    body: {
      apiKey,
      provider,
    }
  });

  const isLoading = status === 'in_progress';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', content: input });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !(chatRef.current as any).contains(event.target)) {
        if (!(event.target as Element).closest('.floating-ai-button')) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating 3D Glowing AI Logo */}
      <button 
        className={`floating-ai-button relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${
          isChatOpen ? 'rotate-90' : 'rotate-0'
        }`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.8) 0%, rgba(168,85,247,0.8) 100%)',
          boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.7), 0 0 40px rgba(var(--primary-rgb), 0.5), 0 0 60px rgba(124, 58, 237, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
        <div className="relative z-10 text-white">
          { isChatOpen ? <X /> :  <Bot className="w-8 h-8" />}
        </div>
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary"></div>
      </button>

      {/* Chat Interface */}
      <AnimatePresence>
      {isChatOpen && (
        <motion.div 
          ref={chatRef}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="absolute bottom-20 right-0 w-[400px] max-w-[90vw] origin-bottom-right"
        >
          <div className="relative flex flex-col h-[600px] rounded-3xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/90 border border-zinc-500/50 shadow-2xl backdrop-blur-3xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-zinc-400">Michael-Bot</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-700/50 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <ScrollArea className="flex-1 p-6">
                {messages.length === 0 && (
                     <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="flex h-full flex-col items-center justify-center text-center px-6"
                   >
                     <Bot className="h-12 w-12 text-primary/40 mb-4" />
                     <p className="text-sm text-foreground font-semibold mb-2">
                       Hi! I'm Michael-Bot.
                     </p>
                     <p className="text-xs text-muted-foreground mb-6">
                       I am an AI trained on Michael's resume, projects, and work experience. Ask me anything!
                     </p>
                     
                     <div className="flex flex-col gap-2 w-full">
                       <button 
                         onClick={() => setInput("How did Michael save 20 hours/week at Avnet?")}
                         className="text-xs text-left bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/50 rounded-lg p-2.5 transition-colors"
                       >
                         "How did Michael save 20 hours/week at Avnet?"
                       </button>
                       <button 
                         onClick={() => setInput("What is his strongest programming language?")}
                         className="text-xs text-left bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/50 rounded-lg p-2.5 transition-colors"
                       >
                         "What is his strongest programming language?"
                       </button>
                     </div>
                   </motion.div>
                )}
                 <div className="space-y-6">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex items-start gap-3 text-sm",
                          m.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full shadow-sm",
                          m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted border border-border/50"
                        )}>
                          {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                          "rounded-2xl px-4 py-2.5 shadow-sm ring-1 ring-inset transition-all",
                          m.role === 'user' 
                            ? "bg-primary text-primary-foreground ring-primary/10" 
                            : "bg-muted/30 backdrop-blur-sm ring-border/50"
                        )}>
                          {m.content}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground italic">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border/50">
                          <Bot className="h-4 w-4 animate-pulse" />
                        </div>
                        Thinking...
                      </div>
                    )}
                  </div>
            </ScrollArea>

            <div className="px-4 pb-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
                className="w-full px-4 py-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl resize-none outline-none text-base font-normal leading-relaxed text-zinc-100 placeholder-zinc-500"
                placeholder="Ask anything..."
              />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !input.trim()}
                  className="rounded-xl h-12 w-12 shrink-0 bg-primary"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};
