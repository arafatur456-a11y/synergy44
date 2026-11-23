'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, CalendarHeart, Mail, MessageCircle, RotateCcw, X } from 'lucide-react';
import BookingFlow from './BookingFlow';
import { CHAT_LIMITS, parseReply, starterPrompts, type ChatTurn, type ConciergeItem, type ConciergeOpen } from '@/lib/concierge';
import { openNewsletter } from '@/lib/newsletter';
import { lockScroll } from '@/lib/scroll-lock';
import { cn, ease, formatPrice } from '@/lib/utils';

const STORE_KEY = 'synergy44.concierge.v1';
type Tab = 'chat' | 'book';

function loadTurns(): ChatTurn[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((t) => t && typeof t.content === 'string').slice(-CHAT_LIMITS.turns) : [];
  } catch {
    return [];
  }
}

export default function ConciergeDrawer({ open, onClose, request }: { open: boolean; onClose: () => void; request: ConciergeOpen & { n: number } }) {
  const [tab, setTab] = useState<Tab>('chat');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'ai' | 'guide' | null>(null);
  const [items, setItems] = useState<Record<string, ConciergeItem>>({});
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  // Restore this session's conversation and load the catalog cards once.
  useEffect(() => {
    setTurns(loadTurns());
    fetch('/api/concierge')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { items: ConciergeItem[]; mode: 'ai' | 'guide' } | null) => {
        if (!d) return;
        setItems(Object.fromEntries(d.items.map((i) => [i.slug, i])));
        setMode(d.mode);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (busy) return;
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(turns));
    } catch {
      /* storage unavailable */
    }
  }, [turns, busy]);

  // Open / close side effects: scroll lock, focus, Escape.
  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const t = setTimeout(() => (tab === 'chat' ? inputRef.current : closeRef.current)?.focus(), 350);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      restoreFocus.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns, tab]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, CHAT_LIMITS.chars);
      if (!content || busy) return;
      setError('');
      setDraft('');
      const history: ChatTurn[] = [...turns, { role: 'user' as const, content }].slice(-CHAT_LIMITS.turns);
      setTurns([...history, { role: 'assistant' as const, content: '' }]);
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'The concierge is unavailable right now.');
        }
        setMode((res.headers.get('X-Concierge-Mode') as 'ai' | 'guide') ?? null);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          const snapshot = reply;
          setTurns((t) => [...t.slice(0, -1), { role: 'assistant', content: snapshot }]);
        }
        if (!reply.trim()) throw new Error('I didn’t catch that — please try again.');
      } catch (err) {
        if (ctrl.signal.aborted) return;
        setTurns((t) => (t[t.length - 1]?.role === 'assistant' && !t[t.length - 1].content ? t.slice(0, -1) : t));
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        if (abortRef.current === ctrl) abortRef.current = null;
        setBusy(false);
      }
    },
    [busy, turns],
  );

  // External open requests: openConcierge({ tab, prompt })
  const lastRequest = useRef(0);
  useEffect(() => {
    if (!request.n || request.n === lastRequest.current) return;
    lastRequest.current = request.n;
    if (request.tab) setTab(request.tab);
    if (request.prompt) {
      setTab('chat');
      void send(request.prompt);
    }
  }, [request, send]);

  const reset = () => {
    abortRef.current?.abort();
    setTurns([]);
    setError('');
    setBusy(false);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[92]">
          <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="concierge-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-paper shadow-float"
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-line bg-mineral px-6 pb-4 pt-6">
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <h2 id="concierge-title" className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em]">
                    Ask the concierge
                  </h2>
                  <p className="mt-2 font-serif text-[15px] text-stone-500">Hair routines, glass and gift ideas, and haircut booking.</p>
                </div>
                <button ref={closeRef} onClick={onClose} aria-label="Close concierge" className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-ink/5">
                  <X className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </div>
              <div role="tablist" aria-label="Concierge" className="relative mt-5 grid grid-cols-2 gap-1 rounded-full border border-line bg-paper p-1">
                {(
                  [
                    ['chat', 'Ask', MessageCircle],
                    ['book', 'Book a cut', CalendarHeart],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={tab === id}
                    onClick={() => setTab(id)}
                    className={cn(
                      'flex h-10 items-center justify-center gap-2 rounded-full text-[14px] font-medium transition-colors duration-200',
                      tab === id ? 'bg-accent text-white' : 'text-stone-500 hover:text-ink',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {tab === 'book' ? (
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <BookingFlow onDone={() => setTab('chat')} />
              </div>
            ) : (
              <>
                <div ref={listRef} className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-6" aria-live="polite" aria-busy={busy}>
                  <Bubble role="assistant">
                    <p>Welcome. Tell me about your hair (its texture, any color, what’s bothering it) and I’ll suggest a simple routine. I can also help you find a glass pendant, share Cynthia’s story, or book a haircut.</p>
                  </Bubble>

                  {turns.length === 0 && (
                    <div className="flex flex-wrap gap-2">
                      {starterPrompts.map((p) => (
                        <button
                          key={p}
                          onClick={() => (p.startsWith('Book') ? setTab('book') : send(p))}
                          className="rounded-full border border-line bg-paper px-4 py-2 text-left text-[13px] text-stone-700 transition hover:border-iris hover:text-ink"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}

                  {turns.map((t, i) =>
                    t.role === 'user' ? (
                      <Bubble key={i} role="user">
                        <p>{t.content}</p>
                      </Bubble>
                    ) : (
                      <Bubble key={i} role="assistant">
                        {t.content ? (
                          <Reply text={t.content} items={items} onBook={() => setTab('book')} onClose={onClose} />
                        ) : (
                          <span className="flex items-center gap-1.5 py-1" aria-label="Concierge is thinking">
                            {[0, 1, 2].map((d) => (
                              <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-iris" style={{ animationDelay: `${d * 160}ms` }} />
                            ))}
                          </span>
                        )}
                      </Bubble>
                    ),
                  )}

                  {error && (
                    <p role="alert" className="border-l-2 border-[#A4452F] pl-3 text-[13px] text-[#7A3322]">
                      {error}
                    </p>
                  )}
                </div>

                <form
                  className="border-t border-line bg-mineral px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send(draft);
                  }}
                >
                  <div className="flex items-end gap-2 rounded-[8px] border border-line bg-paper p-2 transition focus-within:border-ink">
                    <label htmlFor="concierge-input" className="sr-only">
                      Ask the concierge
                    </label>
                    <textarea
                      id="concierge-input"
                      ref={inputRef}
                      rows={1}
                      value={draft}
                      maxLength={CHAT_LIMITS.chars}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          void send(draft);
                        }
                      }}
                      placeholder="Ask about hair, glass or booking…"
                      className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-snug text-ink placeholder:text-stone-400 focus:outline-none"
                    />
                    <button type="submit" disabled={busy || !draft.trim()} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white transition hover:bg-accent-hover disabled:opacity-30">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-400">
                    <span>{mode === 'guide' ? 'Guided suggestions from our catalog' : 'AI suggestions. Your stylist has the final word.'}</span>
                    {turns.length > 0 && (
                      <button type="button" onClick={reset} className="flex items-center gap-1 hover:text-ink">
                        <RotateCcw className="h-3 w-3" /> New chat
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Bubble({ role, children }: { role: ChatTurn['role']; children: React.ReactNode }) {
  return role === 'user' ? (
    <div className="ml-auto max-w-[85%] rounded-[14px] rounded-br-[4px] bg-accent px-4 py-3 text-[14.5px] leading-relaxed text-white">{children}</div>
  ) : (
    <div className="max-w-[94%] text-[14.5px] leading-relaxed text-stone-700">
      <p className="mb-1.5 text-[13px] font-medium text-sage-dark">Concierge</p>
      {children}
    </div>
  );
}

/** Render a reply: paragraphs, "- " bullets, product cards and action buttons. */
function Reply({ text, items, onBook, onClose }: { text: string; items: Record<string, ConciergeItem>; onBook: () => void; onClose: () => void }) {
  const segments = useMemo(() => parseReply(text), [text]);
  return (
    <div className="space-y-3">
      {segments.map((s, i) => {
        if (s.type === 'product') {
          const item = items[s.slug];
          return item ? <ItemCard key={i} item={item} onClose={onClose} /> : null;
        }
        if (s.type === 'book')
          return (
            <button key={i} onClick={onBook} className="btn-dark w-full">
              <CalendarHeart className="h-4 w-4" /> Choose a haircut package
            </button>
          );
        if (s.type === 'newsletter')
          return (
            <button key={i} onClick={openNewsletter} className="btn-outline w-full">
              <Mail className="h-4 w-4" /> Join the Synergy 44 letter
            </button>
          );
        return <Prose key={i} text={s.text} />;
      })}
    </div>
  );
}

function Prose({ text }: { text: string }) {
  // Paragraphs split on blank lines; runs of "- " lines inside a paragraph become a list.
  const blocks = text.trim().split(/\n{2,}/).filter(Boolean);
  const clean = (l: string) => l.replace(/\*\*/g, '');
  return (
    <>
      {blocks.map((block, i) => {
        const groups: { list: boolean; lines: string[] }[] = [];
        for (const raw of block.split('\n')) {
          const line = raw.trim();
          if (!line) continue;
          const list = /^[-•*]\s/.test(line);
          const last = groups[groups.length - 1];
          if (last && last.list === list) last.lines.push(list ? line.replace(/^[-•*]\s/, '') : line);
          else groups.push({ list, lines: [list ? line.replace(/^[-•*]\s/, '') : line] });
        }
        return (
          <div key={i} className="space-y-2">
            {groups.map((g, j) =>
              g.list ? (
                <ul key={j} className="space-y-1.5">
                  {g.lines.map((l, k) => (
                    <li key={k} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-iris" />
                      <span>{clean(l)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={j}>
                  {g.lines.map((l, k) => (
                    <Fragment key={k}>
                      {k > 0 && <br />}
                      {clean(l)}
                    </Fragment>
                  ))}
                </p>
              ),
            )}
          </div>
        );
      })}
    </>
  );
}

function ItemCard({ item, onClose }: { item: ConciergeItem; onClose: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="group flex items-center gap-4 rounded-media border border-line bg-paper p-2.5 pr-4 transition-colors duration-300 hover:border-iris"
    >
      <div
        className="relative h-16 w-14 shrink-0 overflow-hidden rounded-[8px]"
        style={{
          background:
            item.kind === 'glass'
              ? `radial-gradient(70% 60% at 50% 40%, ${item.colors[0]}88, #1A1620 75%)`
              : `linear-gradient(160deg, ${item.colors[0]}, ${item.colors[1] ?? item.colors[0]})`,
        }}
      >
        {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover transition-transform duration-700 ease-silk group-hover:scale-105" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-stone-400">{item.kind === 'glass' ? `Glass, ${item.subtitle}` : item.subtitle}</p>
        <p className="truncate font-display text-[1.08rem] font-semibold leading-tight text-ink">{item.name}</p>
        <p className="mt-0.5 text-[13px] tabular-nums text-stone-500">
          {formatPrice(item.price)}
          {!item.inStock && <span className="ml-2 text-[#A4452F]">{item.kind === 'glass' ? 'Sold' : 'Sold out'}</span>}
        </p>
      </div>
    </Link>
  );
}
