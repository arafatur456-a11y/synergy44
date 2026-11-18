'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { topics, validateContact, type ContactPayload, type FieldErrors, type Topic } from '@/lib/contact';
import { useCart } from '@/lib/cart';
import { site } from '@/lib/site';
import { cn, ease, formatPrice } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';

function Field({
  label,
  error,
  children,
  optional,
  htmlFor,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
  htmlFor: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
        {label}
        {optional && <span className="text-[10px] font-medium tracking-[0.14em] text-espresso-400">Optional</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${htmlFor}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-[#A4452F]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm({ initialTopic }: { initialTopic: Topic }) {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState<ContactPayload>({
    name: '',
    email: '',
    phone: '',
    topic: initialTopic,
    location: '',
    preferredDate: '',
    message: '',
    company: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const successRef = useRef<HTMLDivElement>(null);

  // Bring the confirmation into view (the form collapses, so it may sit above the viewport)
  useEffect(() => {
    if (status !== 'sent' || !successRef.current) return;
    const top = successRef.current.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top, behavior: 'smooth' });
    successRef.current.focus({ preventScroll: true });
  }, [status]);

  const isBooking = form.topic === 'salon' || form.topic === 'consultation';
  const includeBag = form.topic === 'product' && items.length > 0;

  const set = <K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateContact(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    const bagSummary = includeBag
      ? `\n\n— Items in bag —\n${items.map((i) => `${i.qty} × ${i.name} (${i.subtitle}) — ${formatPrice(i.price * i.qty)}`).join('\n')}\nSubtotal: ${formatPrice(subtotal)}`
      : '';

    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, message: form.message + bagSummary }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error ?? 'Something went wrong. Please try again.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (status === 'sent') {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="card flex flex-col items-center px-8 py-20 text-center focus:outline-none"
        role="status"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-ink text-white">
          <Check className="h-7 w-7" strokeWidth={1.8} />
        </span>
        <h2 className="mt-6 font-display text-[2.6rem] font-semibold">Thank you, {form.name.split(' ')[0]}.</h2>
        <p className="mt-3 max-w-sm text-espresso-500">Your message is on its way. We’ll be in touch at {form.email} soon.</p>
        <button
          onClick={() => {
            setForm((f) => ({ ...f, message: '', preferredDate: '' }));
            setStatus('idle');
          }}
          className="btn-outline mt-8"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const err = (k: keyof ContactPayload) => ({
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="card p-6 shadow-soft sm:p-10">
      <fieldset>
        <legend className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">How can we help?</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <label key={t.value} className={cn('chip cursor-pointer', form.topic === t.value ? 'chip-on' : 'chip-off')}>
              <input type="radio" name="topic" value={t.value} checked={form.topic === t.value} onChange={() => set('topic', t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input id="name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} className="input" {...err('name')} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input" {...err('email')} />
        </Field>
        <Field label="Phone" htmlFor="phone" optional error={errors.phone}>
          <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input" {...err('phone')} />
        </Field>

        <AnimatePresence initial={false}>
          {isBooking && (
            <motion.div key="loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Field label="Preferred location" htmlFor="location" optional>
                <select id="location" value={form.location} onChange={(e) => set('location', e.target.value)} className="input">
                  <option value="">No preference</option>
                  {site.locations.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
            </motion.div>
          )}
          {isBooking && (
            <motion.div key="date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sm:col-span-2">
              <Field label="Preferred date & time" htmlFor="preferredDate" optional>
                <input
                  id="preferredDate"
                  value={form.preferredDate}
                  onChange={(e) => set('preferredDate', e.target.value)}
                  placeholder="e.g. Weekday mornings, or Sat 14 Dec"
                  className="input"
                />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        <Field label="Your message" htmlFor="message" error={errors.message} className="sm:col-span-2">
          <textarea
            id="message"
            rows={6}
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder={
              isBooking
                ? 'Tell us about your hair and the service you have in mind…'
                : form.topic === 'jewelry'
                  ? 'Colors, shapes or occasions you have in mind…'
                  : 'How can we help?'
            }
            className="input resize-y"
            {...err('message')}
          />
        </Field>

        {/* Honeypot (hidden from people, tempting for bots) */}
        <div aria-hidden className="absolute left-[-9999px]">
          <label htmlFor="company">Company</label>
          <input id="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => set('company', e.target.value)} />
        </div>
      </div>

      {includeBag && (
        <div className="mt-6 rounded-[3px] border border-line bg-cream p-5 text-sm">
          <p className="font-semibold">Your bag will be included</p>
          <ul className="mt-2 space-y-1 text-espresso-500">
            {items.map((i) => (
              <li key={i.id}>
                {i.qty} × {i.name} — {formatPrice(i.price * i.qty)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && (
        <p role="alert" className="mt-6 rounded-[3px] border border-[#E7C2B6] bg-[#F6E4DE] px-5 py-4 text-sm text-[#7A3322]">
          {serverError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-espresso-400">We reply personally, usually within one to two business days.</p>
        <button type="submit" disabled={status === 'sending'} className="btn-dark w-full sm:w-auto">
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
