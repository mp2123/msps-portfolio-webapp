'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LoaderCircle, SendHorizontal, Sparkles, WandSparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  INVISIBLE_WALL_ALIAS_MAX_LENGTH,
  INVISIBLE_WALL_MESSAGE_MAX_LENGTH,
  type InvisibleInkWallMessage,
} from '@/lib/invisible-wall';
import { getPortfolioSessionId, trackPortfolioEvent } from '@/lib/portfolio-analytics';
import { cn } from '@/lib/utils';

const FALLBACK_EMPTY_STATE = 'No ink yet. Leave the first note behind the glass.';

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

function InvisibleInkMessageCard({
  entry,
  onReveal,
}: {
  entry: InvisibleInkWallMessage;
  onReveal: (messageId: string) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        if (!revealed) {
          onReveal(entry.id);
        }
        setRevealed((current) => !current);
      }}
      onMouseEnter={() => {
        if (!revealed) {
          onReveal(entry.id);
          setRevealed(true);
        }
      }}
      className="group w-full rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 text-left transition-all duration-300 hover:border-cyan-300/20 hover:bg-white/[0.06]"
      data-revealed={revealed}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/65">
          {entry.alias || 'Anonymous signal'}
        </p>
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
          {formatTimestamp(entry.createdAt)}
        </p>
      </div>
      <p
        className={cn(
          'mt-3 text-sm leading-relaxed transition-all duration-500',
          revealed
            ? 'translate-y-0 text-white/90 blur-0'
            : 'translate-y-1 text-white/10 blur-[5px] saturate-0 group-hover:text-white/85 group-hover:translate-y-0 group-hover:blur-0'
        )}
      >
        {entry.message}
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/35">
        {revealed ? 'Ink revealed' : 'Hover or tap to reveal'}
      </p>
    </button>
  );
}

export function InvisibleInkWall() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<InvisibleInkWallMessage[]>([]);
  const [alias, setAlias] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const revealedIdsRef = useRef(new Set<string>());
  const hasTrackedOpenRef = useRef(false);

  const remaining = useMemo(
    () => Math.max(INVISIBLE_WALL_MESSAGE_MAX_LENGTH - message.length, 0),
    [message.length]
  );

  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/invisible-wall', { cache: 'no-store' });
      const payload = (await response.json()) as {
        ok?: boolean;
        messages?: InvisibleInkWallMessage[];
      };

      setMessages(Array.isArray(payload.messages) ? payload.messages : []);
    } catch {
      setError('Invisible ink is dim right now. Try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      hasTrackedOpenRef.current = false;
      return;
    }

    void loadMessages();

    if (!hasTrackedOpenRef.current) {
      trackPortfolioEvent({
        eventType: 'wall_open',
        label: 'invisible-ink-wall-open',
        section: 'contact',
      });
      hasTrackedOpenRef.current = true;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/30 transition-all duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-100/80 focus-visible:border-cyan-300/30 focus-visible:bg-cyan-300/[0.07] focus-visible:text-cyan-100/90 focus-visible:outline-none"
        >
          <WandSparkles className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
          Leave invisible ink
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-3xl border-cyan-400/15 bg-[linear-gradient(135deg,rgba(8,17,28,0.98),rgba(4,10,18,0.98))] p-0 text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
      >
        <div className="grid min-h-[36rem] gap-0 md:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r">
            <DialogHeader className="text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
                <Sparkles className="h-3.5 w-3.5" />
                Hidden wall
              </div>
              <DialogTitle className="mt-4 text-2xl font-semibold tracking-tight text-white">
                Leave a quick note in invisible ink.
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-white/60">
                Anonymous by default. Keep it short, human, and link-free. Hover or tap messages to reveal them.
              </DialogDescription>
            </DialogHeader>

            <form
              className="mt-6 space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!message.trim()) {
                  return;
                }

                setIsSubmitting(true);
                setError(null);

                try {
                  const response = await fetch('/api/invisible-wall', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      sessionId: getPortfolioSessionId(),
                      alias,
                      message,
                    }),
                  });
                  const payload = (await response.json()) as {
                    ok?: boolean;
                    message?: string | InvisibleInkWallMessage;
                  };

                  if (!response.ok || !payload.ok || typeof payload.message === 'string') {
                    throw new Error(
                      typeof payload.message === 'string'
                        ? payload.message
                        : 'Unable to write invisible ink right now.'
                    );
                  }

                  setAlias('');
                  setMessage('');
                  setMessages((current) => [payload.message as InvisibleInkWallMessage, ...current].slice(0, 18));
                  trackPortfolioEvent({
                    eventType: 'wall_submit',
                    label: 'invisible-ink-wall-submit',
                    section: 'contact',
                    metadata: {
                      hasAlias: Boolean(alias.trim()),
                      messageLength: message.trim().length,
                    },
                  });
                } catch (submitError) {
                  const submitMessage =
                    submitError instanceof Error
                      ? submitError.message
                      : 'Unable to write invisible ink right now.';
                  setError(submitMessage);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.22em] text-white/55" htmlFor="invisible-ink-alias">
                  Alias
                </label>
                <Input
                  id="invisible-ink-alias"
                  value={alias}
                  maxLength={INVISIBLE_WALL_ALIAS_MAX_LENGTH}
                  onChange={(event) => setAlias(event.target.value)}
                  placeholder="Anonymous signal"
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs uppercase tracking-[0.22em] text-white/55" htmlFor="invisible-ink-message">
                    Message
                  </label>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                    {remaining} characters left
                  </span>
                </div>
                <textarea
                  id="invisible-ink-message"
                  value={message}
                  maxLength={INVISIBLE_WALL_MESSAGE_MAX_LENGTH}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Something short, honest, and a little mysterious."
                  className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-cyan-300/30 focus:ring-2 focus:ring-cyan-300/15"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-white/45">
                  Messages with links, scripts, or spammy patterns are blocked.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="mr-2 h-4 w-4" />
                  )}
                  Send ink
                </Button>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-300/15 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}
            </form>
          </div>

          <div className="flex min-h-0 flex-col p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/65">
                  Invisible archive
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">Newest notes first</h3>
              </div>
              <button
                type="button"
                onClick={() => void loadMessages()}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/45 transition hover:border-cyan-300/20 hover:text-cyan-100"
              >
                Refresh
              </button>
            </div>
            <ScrollArea className="min-h-0 flex-1 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="space-y-3 pr-3">
                {isLoading ? (
                  <div className="flex min-h-56 items-center justify-center text-sm text-white/45">
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Developing the ink…
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex min-h-56 items-center justify-center rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center text-sm text-white/45">
                    {FALLBACK_EMPTY_STATE}
                  </div>
                ) : (
                  messages.map((entry) => (
                    <InvisibleInkMessageCard
                      key={entry.id}
                      entry={entry}
                      onReveal={(messageId) => {
                        if (revealedIdsRef.current.has(messageId)) {
                          return;
                        }

                        revealedIdsRef.current.add(messageId);
                        trackPortfolioEvent({
                          eventType: 'wall_reveal',
                          label: `invisible-ink-reveal-${messageId}`,
                          section: 'contact',
                        });
                      }}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
