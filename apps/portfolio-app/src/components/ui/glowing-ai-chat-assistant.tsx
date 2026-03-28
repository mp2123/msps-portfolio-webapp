'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, Send, Sparkles, User, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { recruiterPrompts } from '@/content/portfolio';
import {
  ASSISTANT_CLIENT_CACHE_TTL_MS,
  type AssistantCacheMessage,
  buildAssistantCacheLookup,
} from '@/lib/assistant-cache';
import { trackPortfolioEvent } from '@/lib/portfolio-analytics';
import {
  PORTFOLIO_ASSISTANT_OPEN,
  PORTFOLIO_ASSISTANT_REQUEST_OPEN,
} from '@/lib/portfolio-assistant-ui';
import { cn } from '@/lib/utils';

const FALLBACK_RESPONSE_PREFIX = "I'm having trouble reaching the live model right now";
const UNAVAILABLE_RESPONSE_PREFIX = 'The portfolio assistant is temporarily unavailable right now.';
const CLIENT_CACHE_PREFIX = 'portfolio-assistant-client-cache:';

type AssistantMode = 'unknown' | 'live' | 'degraded' | 'offline';

type AssistantRuntimeState = {
  mode: AssistantMode;
  provider: string | null;
  model: string | null;
};

type ClientAssistantCacheEntry = {
  text: string;
  createdAt: number;
  provider: string | null;
  model: string | null;
};

const INITIAL_ASSISTANT_RUNTIME: AssistantRuntimeState = {
  mode: 'unknown',
  provider: null,
  model: null,
};

const getMessageText = (message: {
  content?: unknown;
  parts?: Array<{ type?: string; text?: string }>;
} | undefined) => {
  if (!message) {
    return '';
  }

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

const buildClientCacheKeyFromBody = (body: unknown) => {
  if (!body || typeof body !== 'object' || !('messages' in body)) {
    return null;
  }

  const rawMessages = Array.isArray(body.messages)
    ? (body.messages as Array<{
        role?: string;
        content?: unknown;
        parts?: Array<{ type?: string; text?: string }>;
      }>)
    : [];

  const messages: AssistantCacheMessage[] = rawMessages
    .map((message) => ({
      role: message.role ?? 'user',
      content: getMessageText(message),
    }))
    .filter((message) => message.content.trim().length > 0);

  if (messages.length === 0) {
    return null;
  }

  return buildAssistantCacheLookup(messages).transcriptKey;
};

const readClientCachedResponse = (cacheKey: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(`${CLIENT_CACHE_PREFIX}${cacheKey}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ClientAssistantCacheEntry;
    if (Date.now() - parsed.createdAt > ASSISTANT_CLIENT_CACHE_TTL_MS) {
      window.sessionStorage.removeItem(`${CLIENT_CACHE_PREFIX}${cacheKey}`);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeClientCachedResponse = (
  cacheKey: string,
  value: ClientAssistantCacheEntry
) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(
      `${CLIENT_CACHE_PREFIX}${cacheKey}`,
      JSON.stringify(value)
    );
  } catch {
    // Session cache is opportunistic only.
  }
};

export const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [assistantRuntime, setAssistantRuntime] = useState<AssistantRuntimeState>(
    INITIAL_ASSISTANT_RUNTIME
  );
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const messageViewportRef = useRef<HTMLDivElement | null>(null);
  const hasOpenedRef = useRef(false);
  const previousMessageCountRef = useRef(0);
  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: '/api/chat',
        body: { source: 'portfolio-app' },
        fetch: async (input, init) => {
          let clientCacheKey: string | null = null;

          try {
            const parsedBody =
              typeof init?.body === 'string' ? JSON.parse(init.body) : null;
            clientCacheKey = buildClientCacheKeyFromBody(parsedBody);

            if (clientCacheKey) {
              const cached = readClientCachedResponse(clientCacheKey);

              if (cached) {
                setAssistantRuntime({
                  mode: 'live',
                  provider: cached.provider,
                  model: cached.model,
                });

                return new Response(cached.text, {
                  headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Portfolio-Assistant-Mode': 'live',
                    'X-Portfolio-Assistant-Provider': cached.provider ?? '',
                    'X-Portfolio-Assistant-Model': cached.model ?? '',
                    'X-Portfolio-Assistant-Cache': 'client',
                  },
                });
              }
            }
          } catch {
            clientCacheKey = null;
          }

          try {
            const response = await fetch(input, init);
            const modeHeader = response.headers.get('x-portfolio-assistant-mode');

            setAssistantRuntime({
              mode:
                modeHeader === 'live' || modeHeader === 'degraded' || modeHeader === 'offline'
                  ? modeHeader
                  : 'unknown',
              provider: response.headers.get('x-portfolio-assistant-provider'),
              model: response.headers.get('x-portfolio-assistant-model'),
            });

            if (clientCacheKey && modeHeader === 'live') {
              const provider = response.headers.get(
                'x-portfolio-assistant-provider'
              );
              const model = response.headers.get('x-portfolio-assistant-model');

              void response
                .clone()
                .text()
                .then((text) => {
                  const normalized = text.trim();
                  if (!normalized) return;

                  writeClientCachedResponse(clientCacheKey!, {
                    text: normalized,
                    createdAt: Date.now(),
                    provider,
                    model,
                  });
                })
                .catch(() => {
                  // Non-blocking client cache population.
                });
            }

            return response;
          } catch (fetchError) {
            setAssistantRuntime({
              mode: 'offline',
              provider: null,
              model: null,
            });
            throw fetchError;
          }
        },
      }),
    []
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');
  const latestAssistantText = getMessageText(latestAssistantMessage);
  const hasHeaderMode = assistantRuntime.mode !== 'unknown';
  const isOfflineResponse =
    assistantRuntime.mode === 'offline' ||
    (!hasHeaderMode && latestAssistantText.startsWith(UNAVAILABLE_RESPONSE_PREFIX));
  const isDegradedResponse =
    assistantRuntime.mode === 'degraded' ||
    (!hasHeaderMode &&
      (latestAssistantText.startsWith(FALLBACK_RESPONSE_PREFIX) ||
        latestAssistantText.startsWith('I can help with Michael’s projects')));
  const isLiveResponse = assistantRuntime.mode === 'live';
  const hasCompletedAssistantReply = Boolean(latestAssistantText);
  const assistantModeLabel = error
    ? 'Assistant degraded'
    : isLoading
      ? 'Connecting'
      : isOfflineResponse
        ? 'Offline'
      : isDegradedResponse
        ? 'Degraded fallback'
        : isLiveResponse
          ? assistantRuntime.provider === 'openai'
            ? 'OpenAI live'
            : 'Gemini live'
          : hasCompletedAssistantReply
            ? 'Portfolio reply'
          : 'Ready';
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
    setAssistantRuntime(INITIAL_ASSISTANT_RUNTIME);
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
    setAssistantRuntime(INITIAL_ASSISTANT_RUNTIME);
    sendMessage({ text: prompt });
  };

  const handleLauncherToggle = () => {
    setIsChatOpen((open) => {
      const nextOpen = !open;
      trackPortfolioEvent({
        eventType: nextOpen ? 'assistant_open' : 'assistant_close',
        label: nextOpen ? 'assistant-launcher-open' : 'assistant-launcher-close',
        section: 'assistant',
      });
      return nextOpen;
    });
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
      window.dispatchEvent(new Event(PORTFOLIO_ASSISTANT_OPEN));
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
    const handleAssistantOpenRequest = () => {
      setIsChatOpen(true);
    };

    window.addEventListener(PORTFOLIO_ASSISTANT_REQUEST_OPEN, handleAssistantOpenRequest);
    return () =>
      window.removeEventListener(
        PORTFOLIO_ASSISTANT_REQUEST_OPEN,
        handleAssistantOpenRequest
      );
  }, []);

  useEffect(() => {
    if (!isChatOpen) return;

    const viewport = chatRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]');
    const dialog = dialogRef.current;
    if (!viewport) return;

    messageViewportRef.current = viewport;
    const applyViewportScroll = (deltaY: number) => {
      const currentViewport = messageViewportRef.current;
      if (!currentViewport) return false;

      const { scrollTop, scrollHeight, clientHeight } = currentViewport;
      const maxScrollTop = scrollHeight - clientHeight;
      const canScrollDown = deltaY > 0 && scrollTop < maxScrollTop - 1;
      const canScrollUp = deltaY < 0 && scrollTop > 0;

      if (!canScrollDown && !canScrollUp) {
        return false;
      }

      currentViewport.scrollTop = Math.max(
        0,
        Math.min(maxScrollTop, currentViewport.scrollTop + deltaY)
      );

      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (!applyViewportScroll(event.deltaY)) {
        return;
      }

      event.preventDefault();
    };

    dialog?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      dialog?.removeEventListener('wheel', onWheel);
    };
  }, [isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) {
      previousMessageCountRef.current = 0;
      return;
    }

    const viewport =
      messageViewportRef.current ??
      chatRef.current?.querySelector<HTMLDivElement>('[data-slot="scroll-area-viewport"]');

    if (!viewport) {
      return;
    }

    const previousMessageCount = previousMessageCountRef.current;
    const latestMessageRole = messages[messages.length - 1]?.role;
    const latestMessageId = messages[messages.length - 1]?.id;
    const hasNewMessage = messages.length > previousMessageCount;

    previousMessageCountRef.current = messages.length;

    if (previousMessageCount === 0) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'auto',
        });
      });
      return;
    }

    if (!hasNewMessage) {
      return;
    }

    requestAnimationFrame(() => {
      if (latestMessageRole === 'assistant' && latestMessageId) {
        const latestAssistantBubble = chatRef.current?.querySelector<HTMLElement>(
          `[data-message-id="${latestMessageId}"]`
        );

        if (latestAssistantBubble) {
          const viewportRect = viewport.getBoundingClientRect();
          const bubbleRect = latestAssistantBubble.getBoundingClientRect();
          const bubbleTopWithinViewport =
            bubbleRect.top - viewportRect.top + viewport.scrollTop;

          viewport.scrollTo({
            top: Math.max(0, bubbleTopWithinViewport - 12),
            behavior: 'smooth',
          });
          return;
        }
      }

      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    });
  }, [isChatOpen, messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <button
        ref={launcherRef}
        className={`floating-ai-button relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-500 transform ${
          isChatOpen ? 'rotate-90' : 'rotate-0'
        }`}
        onClick={handleLauncherToggle}
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
            className="absolute bottom-20 right-0 h-[min(720px,calc(100dvh-3.75rem))] w-[min(438px,calc(100vw-0.75rem))] origin-bottom-right sm:h-[min(760px,calc(100dvh-5rem))] sm:w-[min(448px,calc(100vw-1rem))]"
          >
            <div className="pointer-events-none absolute inset-0 translate-y-6 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
            <div
              ref={dialogRef}
              id="recruiter-assistant-dialog"
              role="dialog"
              aria-labelledby="recruiter-assistant-title"
              aria-describedby="recruiter-assistant-description"
              onKeyDown={handleDialogKeyDown}
              className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-zinc-900/95 via-slate-950/95 to-black/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-3xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_24px] opacity-[0.08]" />
              <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4 sm:px-5 sm:pt-4.5">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                      Recruiter Assistant
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
                        error
                          ? 'border-amber-300/30 bg-amber-300/10 text-amber-100'
                          : isLoading
                            ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100'
                            : isOfflineResponse
                              ? 'border-zinc-300/20 bg-white/5 text-zinc-200'
                            : isDegradedResponse
                              ? 'border-amber-300/30 bg-amber-300/10 text-amber-100'
                              : 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
                      )}
                    >
                      {assistantModeLabel}
                    </span>
                  </div>
                  <h2 id="recruiter-assistant-title" className="text-[1.55rem] font-semibold tracking-tight text-white">
                    Michael-Bot
                  </h2>
                  <p
                    id="recruiter-assistant-description"
                    className="max-w-[34ch] text-[12px] leading-relaxed text-zinc-400 sm:text-[13px]"
                  >
                    Ask about role fit, measurable impact, strongest proof, or where Michael fits best right now.
                  </p>
                </div>
                <button
                  onClick={() => {
                    trackPortfolioEvent({
                      eventType: 'assistant_close',
                      label: 'assistant-panel-close',
                      section: 'assistant',
                    });
                    setIsChatOpen(false);
                  }}
                  className="rounded-full p-2 transition-colors hover:bg-white/5"
                  aria-label="Close assistant panel"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="px-4 pb-2 sm:px-5 sm:pb-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {recruiterPrompts.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleStarterPrompt(item.question)}
                        disabled={isLoading}
                        className="rounded-2xl border border-white/8 bg-white/[0.06] px-3 py-2.5 text-left transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/10 focus-visible:border-cyan-300/45 focus-visible:outline-none disabled:opacity-60"
                      >
                        <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-100/70 sm:text-[10px] sm:tracking-[0.22em]">
                          <Sparkles className="h-3.5 w-3.5" />
                          {item.label}
                        </div>
                        <p className="mt-1.5 text-[12px] leading-snug text-zinc-300 sm:text-[13px]">
                          {item.question}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 overflow-x-auto px-4 pb-3 text-[10px] text-zinc-500 sm:px-6">
                  <span className="shrink-0 uppercase tracking-[0.16em] text-cyan-100/60">
                    Quick asks
                  </span>
                  {recruiterPrompts.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleStarterPrompt(item.question)}
                      disabled={isLoading}
                      className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-zinc-300 transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/10"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              <ScrollArea
                className="relative flex-1 min-h-0 px-4 sm:px-6"
                style={{
                  overscrollBehavior: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y',
                }}
              >
                {assistantErrorMessage ? (
                  <div className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                    {assistantErrorMessage}
                  </div>
                ) : null}
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-1 pb-3 pt-1 text-left"
                  >
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
                        Recruiter-ready briefing mode
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        Use a quick ask above or type a custom question below. Once the first answer starts,
                        this space becomes the main transcript window.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        data-message-id={m.id}
                        data-role={m.role}
                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'flex items-start gap-3 text-sm',
                          m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        )}
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
                            'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ring-1 ring-inset transition-all whitespace-pre-wrap break-words leading-relaxed sm:max-w-[78%]',
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

              <div className="mt-auto border-t border-white/8 px-4 pb-4 pt-3 sm:px-5 sm:pt-4">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="min-h-12 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-400/40 sm:min-h-14"
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

                <div className="mt-3 hidden items-center justify-between gap-3 text-[11px] text-zinc-500 sm:flex">
                  <div className="flex items-center gap-1.5">
                    <ChevronDown className="h-3.5 w-3.5" />
                    Ask for metrics, examples, or a role-fit summary
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    Portfolio-assisted replies
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 sm:hidden">
                  <span className="truncate">Ask for metrics, examples, or role fit</span>
                  <span className="ml-3 shrink-0 text-cyan-200/75">Portfolio-assisted</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
