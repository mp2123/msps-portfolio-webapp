'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, Send, Sparkles, User, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { recruiterPrompts } from '@/content/portfolio';
import { trackPortfolioEvent } from '@/lib/portfolio-analytics';
import { cn } from '@/lib/utils';

const getMessageText = (message: {
  content?: unknown;
  parts?: Array<{ type?: string; text?: string }>;
}) => {
  if (typeof message.content === 'string') {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') {
          return part.text;
        }
        return '';
      })
      .join('')
      .trim();
  }

  if (Array.isArray(message.parts)) {
    return message.parts
      .map((part) => (part.type === 'text' && typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim();
  }

  return '';
};

export const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const hasOpenedRef = useRef(false);
  const [transport] = useState(
    new TextStreamChatTransport({
      api: '/api/chat',
      body: { source: 'portfolio-app' },
    })
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const assistantErrorMessage = (() => {
    if (!error) return null;
    const rawMessage = error.message?.toLowerCase() ?? '';

    if (
      rawMessage.includes('429') ||
      rawMessage.includes('rate limit') ||
      rawMessage.includes('too many requests')
    ) {
      return 'Too many assistant requests right now. Please wait a few minutes and try again.';
    }

    return 'The assistant hit an error. Please try again shortly.';
  })();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (error) clearError();
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    trackPortfolioEvent({
      eventType: 'assistant_message_submit',
      label: 'assistant-freeform-submit',
      section: 'assistant',
      metadata: {
        messageLength: message.length,
      },
    });
    clearError();
    sendMessage({ text: message });
    setInput('');
  };

  const handleStarterPrompt = (prompt: string) => {
    if (isLoading) return;
    setIsChatOpen(true);
    trackPortfolioEvent({
      eventType: 'assistant_prompt_click',
      label: prompt,
      section: 'assistant',
    });
    clearError();
    sendMessage({ text: prompt });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsChatOpen(false);
      return;
    }

    if (e.key !== 'Tab') return;

    const focusableSelectors = [
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelectors);
    const elements = Array.from(focusableElements ?? []).filter((element) => {
      return element.offsetParent !== null || element === document.activeElement;
    });

    if (elements.length === 0) {
      e.preventDefault();
      return;
    }

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;
      if (chatRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('.floating-ai-button')) return;

      setIsChatOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsChatOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      hasOpenedRef.current = true;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else if (hasOpenedRef.current) {
      requestAnimationFrame(() => {
        launcherRef.current?.focus();
      });
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) return;

    const viewport = chatRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]');
    if (!viewport) return;

    messageViewportRef.current = viewport;
    requestAnimationFrame(() => {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    });
  }, [assistantErrorMessage, isChatOpen, isLoading, messages.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        ref={launcherRef}
        className={`floating-ai-button relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-500 transform ${
          isChatOpen ? 'rotate-90' : 'rotate-0'
        }`}
        onClick={() => setIsChatOpen((open) => !open)}
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 35%), linear-gradient(135deg, rgba(34,211,238,0.92) 0%, rgba(59,130,246,0.92) 45%, rgba(37,99,235,0.96) 100%)',
          boxShadow:
            '0 0 24px rgba(34,211,238,0.75), 0 0 48px rgba(37,99,235,0.55), 0 0 88px rgba(14,165,233,0.35), 0 18px 40px rgba(2,6,23,0.42)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
        aria-label={isChatOpen ? 'Close recruiter assistant' : 'Open recruiter assistant'}
        aria-haspopup="dialog"
        aria-expanded={isChatOpen}
        aria-controls="recruiter-assistant-dialog"
      >
        <motion.div
          className="absolute -inset-3 rounded-full bg-cyan-400/20 blur-2xl"
          animate={{ opacity: isChatOpen ? 0.85 : 0.45, scale: isChatOpen ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute -inset-5 rounded-full border border-cyan-300/20"
          animate={{ opacity: isChatOpen ? 0.9 : 0.45, scale: isChatOpen ? 1.08 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute -inset-8 rounded-full border border-cyan-300/10 opacity-50" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30" />
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-[7px] rounded-full border border-cyan-100/20" />
        <div className="relative z-10 text-white">
          {isChatOpen ? <X /> : <Bot className="h-8 w-8" />}
        </div>
        <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-20" />
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-200/40"
          animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="absolute bottom-20 right-0 w-[420px] max-w-[92vw] origin-bottom-right"
          >
            <div className="pointer-events-none absolute inset-0 translate-y-6 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
            <div
              ref={dialogRef}
              id="recruiter-assistant-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="recruiter-assistant-title"
              aria-describedby="recruiter-assistant-description"
              onKeyDown={handleDialogKeyDown}
              className="relative flex h-[640px] flex-col overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-zinc-900/95 via-slate-950/95 to-black/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-3xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_24px] opacity-[0.08]" />
              <div className="flex items-start justify-between gap-3 px-6 pb-3 pt-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                      Recruiter Assistant
                    </span>
                  </div>
                  <h2 id="recruiter-assistant-title" className="text-base font-semibold text-white">
                    Michael-Bot
                  </h2>
                  <p
                    id="recruiter-assistant-description"
                    className="max-w-[28ch] text-xs leading-relaxed text-zinc-400"
                  >
                    Ask about role fit, measurable impact, projects, or why Michael is a strong operator-to-analyst hire.
                  </p>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-white/5"
                  aria-label="Close assistant panel"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              <div className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {recruiterPrompts.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleStarterPrompt(item.question)}
                      disabled={isLoading}
                      className="rounded-2xl border border-white/8 bg-white/[0.06] px-3 py-3 text-left transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/10 focus-visible:border-cyan-300/45 focus-visible:outline-none disabled:opacity-60"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
                        <Sparkles className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                      <p className="mt-2 text-xs leading-snug text-zinc-300">{item.question}</p>
                    </button>
                  ))}
                </div>
              </div>

              <ScrollArea className="flex-1 px-6">
                {assistantErrorMessage ? (
                  <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                    {assistantErrorMessage}
                  </div>
                ) : null}
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full flex-col items-center justify-center px-2 py-8 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                      <Bot className="h-7 w-7 text-cyan-300" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">Recruiter-ready briefing mode</p>
                    <p className="mt-2 max-w-[28ch] text-xs leading-relaxed text-zinc-400">
                      Start with a prompt above or ask for a project summary, quantified outcome, or role alignment.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {messages.map((m, index) => (
                      <motion.div
                        key={m.id}
                        data-role={m.role}
                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'flex items-start gap-3 text-sm',
                          m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        )}
                        ref={index === messages.length - 1 ? (node) => node?.scrollIntoView({ block: 'end' }) : undefined}
                      >
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full shadow-sm',
                            m.role === 'user'
                              ? 'bg-cyan-400 text-slate-950'
                              : 'border border-white/10 bg-white/5 text-cyan-200'
                          )}
                        >
                          {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div
                          className={cn(
                            'max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ring-1 ring-inset transition-all',
                            m.role === 'user'
                              ? 'bg-cyan-400 text-slate-950 ring-cyan-300/30'
                              : 'bg-white/[0.07] text-zinc-100 backdrop-blur-sm ring-white/10 shadow-[0_0_25px_rgba(34,211,238,0.04)]'
                          )}
                        >
                          {getMessageText(m)}
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <div className="flex items-center gap-3 text-sm italic text-muted-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                          <Bot className="h-4 w-4 animate-pulse" />
                        </div>
                        Thinking through the portfolio...
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="border-t border-white/8 px-4 pb-4 pt-4">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    className="min-h-14 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-400/40"
                    placeholder="Ask about impact, projects, skills, or role fit..."
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="h-12 w-12 shrink-0 rounded-2xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>

                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <ChevronDown className="h-3.5 w-3.5" />
                    Ask for metrics, examples, or a role-fit summary
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    Portfolio-assisted replies
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
