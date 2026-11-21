'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Loader2, X } from 'lucide-react';
import { DISMISSED_KEY, NEWSLETTER_EVENT, SUBSCRIBED_KEY, subscribe } from '@/lib/newsletter';
import { lockScroll } from '@/lib/scroll-lock';
import { ease } from '@/lib/utils';

/** Nothing can open the popup automatically before this, so the first moments on a page stay uninterrupted. */
const ARM_AFTER_MS = 4000;
const DELAY_MS = 25000;
const SCROLL_DEPTH = 0.45;
const QUIET_PATHS = ['/checkout'];

const read = (store: 'local' | 'session', key: string) => {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
};

/** Another overlay (cart, concierge, quick view, menu) currently holds the scroll lock. */
const overlayOpen = () => document.documentElement.style.overflow === 'hidden';

/**
 * Editorial newsletter popup. It opens automatically once per session, after a delay or on
 * scroll or exit intent, and only once ARM_AFTER_MS has passed. `openNewsletter()` from
 * lib/newsletter opens it any time.
 */
export default function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState<{ field?: 'email' | 'name'; text: string } | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const autoShown = useRef(false);

  const show = useCallback(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Manual triggers (footer link, concierge, any button calling openNewsletter())
  useEffect(() => {
    const onOpen = () => {
      setStatus((s) => (s === 'done' ? 'idle' : s));
      show();
    };
    window.addEventListener(NEWSLETTER_EVENT, onOpen);
    return () => window.removeEventListener(NEWSLETTER_EVENT, onOpen);
  }, [show]);

  // Automatic triggers: delay, scroll depth, or exit intent. Armed only after ARM_AFTER_MS.
  useEffect(() => {
    if (autoShown.current || QUIET_PATHS.some((p) => pathname?.startsWith(p))) return;
    if (read('local', SUBSCRIBED_KEY) || read('session', DISMISSED_KEY)) return;

    let armed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const trigger = () => {
      if (!armed || autoShown.current) return;
      if (read('session', DISMISSED_KEY) || read('local', SUBSCRIBED_KEY)) return cleanup();
      if (overlayOpen()) return; // try again on the next intent signal
      autoShown.current = true;
      cleanup();
      show();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_DEPTH) trigger();
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) trigger();
    };
    const cleanup = () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onLeave);
    };

    timers.push(
      setTimeout(() => {
        armed = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        if (window.matchMedia('(pointer: fine)').matches) document.addEventListener('mouseout', onLeave);
        onScroll(); // already scrolled deep before arming
      }, ARM_AFTER_MS),
    );
    // Retry the timed trigger a few times in case another overlay is open at that moment.
    [DELAY_MS, DELAY_MS + 20000, DELAY_MS + 40000].forEach((ms) => timers.push(setTimeout(trigger, ms)));
    return cleanup;
  }, [pathname, show]);

  // Dialog behavior: scroll lock, initial focus, Escape, restore focus on close.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const t = setTimeout(() => emailRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      restoreFocus.current?.focus?.();
    };
  }, [open, close]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError(null);
    const res = await subscribe({ email, name, website, source: 'popup' });
    if (res.ok) {
      setStatus('done');
      return;
    }
    setError({ field: res.field, text: res.error });
    setStatus('error');
    if (res.field === 'email') emailRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[94] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="absolute inset-0 bg-black/45" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nl-title"
            aria-describedby="nl-desc"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            className="relative grid max-h-[94svh] w-full max-w-[820px] overflow-y-auto bg-paper shadow-float sm:rounded-[6px] md:grid-cols-[0.9fr_1.1fr]"
          >
            <button
              onClick={close}
              aria-label="Close newsletter sign-up"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10 md:text-ink md:hover:bg-ink/5"
            >
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>

            {/* Editorial panel */}
            <div className="relative flex min-h-[170px] flex-col justify-end overflow-hidden bg-forest p-7 text-white sm:p-8 md:min-h-[460px] md:p-10">
              <div aria-hidden className="absolute -left-20 -top-24 h-80 w-80 bg-[radial-gradient(closest-side,rgba(216,188,132,0.35),transparent)]" />
              <div aria-hidden className="absolute -bottom-24 right-[-30%] h-80 w-80 bg-[radial-gradient(closest-side,rgba(143,169,155,0.35),transparent)]" />
              <div aria-hidden className="absolute right-8 top-10 h-24 w-16 rotate-6 rounded-[46%] border border-white/15 bg-[radial-gradient(70%_60%_at_40%_35%,rgba(110,143,216,0.55),rgba(95,191,154,0.35)_45%,transparent_75%)] md:h-32 md:w-24" />
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.26em] text-champagne-light">The Synergy 44 letter</p>
              <p className="relative mt-4 font-display text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[2rem] md:text-[2.5rem]">
                First look at <em className="font-medium text-champagne-light">new glass</em>.
              </p>
              <p className="relative mt-3 hidden max-w-[30ch] text-[13.5px] leading-relaxed text-white/65 sm:block">One-of-a-kind pieces sell quickly. Subscribers hear first.</p>
            </div>

            {/* Form */}
            <div className="flex flex-col justify-center p-8 sm:p-10">
              {status === 'done' ? (
                <div aria-live="polite">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-sage-dark text-white">
                    <Check className="h-5 w-5" />
                  </div>
                  <h2 id="nl-title" className="mt-6 font-display text-[2rem] font-semibold leading-tight">
                    Welcome{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}.
                  </h2>
                  <p id="nl-desc" className="mt-3 text-[15px] leading-relaxed text-espresso-700">
                    You’re on the list. Expect occasional notes on new glass, seasonal hair rituals and studio news. Never spam.
                  </p>
                  <button onClick={close} className="btn-dark mt-8 w-full">
                    Continue browsing
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={onSubmit}>
                  <p className="eyebrow">Join the letter</p>
                  <h2 id="nl-title" className="mt-5 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.01em] sm:text-[2.3rem]">
                    Hair rituals, new glass &amp; <em className="font-medium text-champagne">quiet</em> inspiration.
                  </h2>
                  <p id="nl-desc" className="mt-3 text-[14.5px] leading-relaxed text-espresso-500">
                    A few thoughtful emails a season. Unsubscribe any time.
                  </p>

                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={website} onChange={(e) => setWebsite(e.target.value)} />

                  <div className="mt-7 space-y-3">
                    <div>
                      <label htmlFor="nl-name" className="sr-only">
                        First name (optional)
                      </label>
                      <input
                        id="nl-name"
                        autoComplete="given-name"
                        value={name}
                        maxLength={80}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="First name (optional)"
                        className="input"
                        aria-invalid={error?.field === 'name'}
                      />
                    </div>
                    <div>
                      <label htmlFor="nl-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="nl-email"
                        ref={emailRef}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Email address"
                        className="input"
                        aria-invalid={error?.field === 'email'}
                        aria-describedby={error ? 'nl-error' : undefined}
                      />
                    </div>
                  </div>

                  {error && (
                    <p id="nl-error" role="alert" className="mt-3 text-[13px] text-[#7A3322]">
                      {error.text}
                    </p>
                  )}

                  <button type="submit" disabled={status === 'sending'} className="btn-dark mt-5 w-full">
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Joining
                      </>
                    ) : (
                      <>
                        Subscribe <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <button type="button" onClick={close} className="mt-4 w-full text-center text-[13px] text-espresso-500 underline-offset-4 hover:text-ink hover:underline">
                    No thanks
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
