'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Loader2, Lock, ShieldCheck } from 'lucide-react';
import CartThumb from '@/components/shop/CartThumb';
import { useCart } from '@/lib/cart';
import { US_STATES, validateCustomer, type CheckoutCustomer, type CheckoutResult, type CustomerErrors, type Quote } from '@/lib/checkout';
import { cn, ease, formatPrice } from '@/lib/utils';

type QuoteState = 'idle' | 'loading' | 'ready' | 'error';
type SubmitState = 'idle' | 'submitting' | 'redirecting';

const EMPTY: CheckoutCustomer = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'US',
  note: '',
  company: '',
};

function Field({
  id,
  label,
  error,
  optional,
  className,
  children,
}: {
  id: keyof CheckoutCustomer;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
        {label}
        {optional && <span className="text-[10px] font-medium tracking-[0.14em] text-espresso-400">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-[#A4452F]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm() {
  const { items, update, remove, clear } = useCart();
  const [customer, setCustomer] = useState<CheckoutCustomer>(EMPTY);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteState, setQuoteState] = useState<QuoteState>('idle');
  const [submit, setSubmit] = useState<SubmitState>('idle');
  const [banner, setBanner] = useState('');
  const bannerRef = useRef<HTMLDivElement>(null);

  const online = items.filter((i) => i.wcId);
  const offline = items.filter((i) => !i.wcId);
  const lines = useMemo(() => online.map((i) => ({ wcId: i.wcId!, ...(i.variationId ? { variationId: i.variationId } : {}), qty: i.qty })), [online]);
  const linesKey = JSON.stringify(lines);

  // Live quote: WooCommerce prices + stock for exactly what's in the bag.
  useEffect(() => {
    if (lines.length === 0) {
      setQuote(null);
      setQuoteState('idle');
      return;
    }
    const ctrl = new AbortController();
    setQuoteState('loading');
    fetch('/api/checkout/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lines }), signal: ctrl.signal })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? 'Could not load prices.');
        setQuote(json as Quote);
        setQuoteState('ready');
        // Keep the bag in sync with the store's current prices and stock limits.
        (json as Quote).lines.forEach((l) => {
          const item = items.find((i) => i.wcId === l.wcId && (i.variationId ?? 0) === (l.variationId ?? 0));
          if (!item) return;
          if (l.unitPrice > 0 && l.unitPrice !== item.price) update(item.id, { price: l.unitPrice });
          if ((l.maxQty ?? null) !== (item.maxQty ?? null)) update(item.id, { maxQty: l.maxQty });
        });
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return;
        setQuoteState('error');
        setBanner(e.message);
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey]);

  const set = <K extends keyof CheckoutCustomer>(k: K, v: CheckoutCustomer[K]) => {
    setCustomer((c) => ({ ...c, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const a11y = (k: keyof CheckoutCustomer) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-error` : undefined });

  const showBanner = (msg: string) => {
    setBanner(msg);
    requestAnimationFrame(() => bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner('');
    const found = validateCustomer(customer);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    if (!quote?.ok) {
      showBanner('Please resolve the highlighted items in your order first.');
      return;
    }

    setSubmit('submitting');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, customer }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 422 && json.errors) {
        setErrors(json.errors);
        throw new Error('Please check the highlighted fields.');
      }
      if (res.status === 409 && json.quote) {
        setQuote(json.quote);
        throw new Error(json.error);
      }
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong. Please try again.');

      const result = json as CheckoutResult;
      try {
        sessionStorage.setItem('synergy44.lastOrder', JSON.stringify({ number: result.orderNumber, at: Date.now() }));
      } catch {
        /* ignore */
      }
      setSubmit('redirecting');
      clear();
      window.location.assign(result.paymentUrl); // WooCommerce "Pay for order" page
    } catch (err) {
      setSubmit('idle');
      showBanner(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (items.length === 0 && submit === 'idle') {
    return (
      <div className="card mx-auto max-w-xl p-12 text-center shadow-soft">
        <p className="font-display text-[2rem] font-semibold">Your bag is empty</p>
        <p className="mt-3 text-espresso-700">Add something beautiful, then come back to check out.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products/hair-care" className="btn-dark">
            Shop hair care
          </Link>
          <Link href="/jewelry" className="btn-outline">
            Glass jewelry
          </Link>
        </div>
      </div>
    );
  }

  const quoteLine = (wcId?: number, variationId?: number) => quote?.lines.find((l) => l.wcId === wcId && (l.variationId ?? 0) === (variationId ?? 0));
  const busy = submit !== 'idle';
  const canPay = quoteState === 'ready' && !!quote?.ok && lines.length > 0 && !busy;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Details */}
      <div className="space-y-10 lg:col-span-7">
        <AnimatePresence>
          {banner && (
            <motion.div
              ref={bannerRef}
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-[3px] border border-[#E7C2B6] bg-[#F6E4DE] px-5 py-4 text-sm text-[#7A3322]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {banner}
            </motion.div>
          )}
        </AnimatePresence>

        <fieldset className="card p-6 shadow-soft sm:p-9" disabled={busy}>
          <legend className="sr-only">Contact</legend>
          <div className="flex items-baseline gap-3 border-b border-ink pb-3">
            <span className="font-display text-lg italic text-champagne">01</span>
            <h2 className="font-display text-[1.6rem] font-semibold">Contact</h2>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field id="email" label="Email" error={errors.email} className="sm:col-span-2">
              <input id="email" type="email" autoComplete="email" value={customer.email} onChange={(e) => set('email', e.target.value)} className="input" {...a11y('email')} />
            </Field>
            <Field id="phone" label="Phone" optional error={errors.phone} className="sm:col-span-2">
              <input id="phone" type="tel" autoComplete="tel" value={customer.phone} onChange={(e) => set('phone', e.target.value)} className="input" {...a11y('phone')} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="card p-6 shadow-soft sm:p-9" disabled={busy}>
          <legend className="sr-only">Shipping address</legend>
          <div className="flex items-baseline gap-3 border-b border-ink pb-3">
            <span className="font-display text-lg italic text-champagne">02</span>
            <h2 className="font-display text-[1.6rem] font-semibold">Shipping</h2>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field id="firstName" label="First name" error={errors.firstName}>
              <input id="firstName" autoComplete="given-name" value={customer.firstName} onChange={(e) => set('firstName', e.target.value)} className="input" {...a11y('firstName')} />
            </Field>
            <Field id="lastName" label="Last name" error={errors.lastName}>
              <input id="lastName" autoComplete="family-name" value={customer.lastName} onChange={(e) => set('lastName', e.target.value)} className="input" {...a11y('lastName')} />
            </Field>
            <Field id="address1" label="Address" error={errors.address1} className="sm:col-span-2">
              <input id="address1" autoComplete="address-line1" value={customer.address1} onChange={(e) => set('address1', e.target.value)} className="input" {...a11y('address1')} />
            </Field>
            <Field id="address2" label="Apartment, suite" optional className="sm:col-span-2">
              <input id="address2" autoComplete="address-line2" value={customer.address2} onChange={(e) => set('address2', e.target.value)} className="input" />
            </Field>
            <Field id="city" label="City" error={errors.city}>
              <input id="city" autoComplete="address-level2" value={customer.city} onChange={(e) => set('city', e.target.value)} className="input" {...a11y('city')} />
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field id="state" label="State" error={errors.state}>
                <select id="state" autoComplete="address-level1" value={customer.state} onChange={(e) => set('state', e.target.value)} className="input" {...a11y('state')}>
                  <option value="">—</option>
                  {US_STATES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="postcode" label="ZIP" error={errors.postcode}>
                <input id="postcode" inputMode="numeric" autoComplete="postal-code" value={customer.postcode} onChange={(e) => set('postcode', e.target.value)} className="input" {...a11y('postcode')} />
              </Field>
            </div>
            <p className="text-[12px] text-espresso-500 sm:col-span-2">We currently ship within the United States.</p>
            <Field id="note" label="Order note" optional error={errors.note} className="sm:col-span-2">
              <textarea id="note" rows={3} value={customer.note} onChange={(e) => set('note', e.target.value)} className="input resize-y" placeholder="Gift message, delivery notes…" />
            </Field>
            {/* Honeypot */}
            <div aria-hidden className="absolute left-[-9999px]">
              <label htmlFor="company">Company</label>
              <input id="company" tabIndex={-1} autoComplete="off" value={customer.company} onChange={(e) => set('company', e.target.value)} />
            </div>
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <div className="rounded-[6px] bg-paper p-2.5 shadow-lift ring-1 ring-ink/[0.06]">
            <div className="rounded-[3px] border border-champagne/40 p-6 sm:p-8">
              <div className="flex items-baseline justify-between border-b border-ink pb-3">
                <h2 className="font-display text-[1.6rem] font-semibold">Your order</h2>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso-500">
                  {items.reduce((n, i) => n + i.qty, 0)} items
                </span>
              </div>

              <ul className="divide-y divide-line">
                {online.map((item) => {
                  const ql = quoteLine(item.wcId, item.variationId);
                  const issue = ql && !ql.available ? ql : null;
                  return (
                    <li key={item.id} className="flex gap-4 py-5">
                      <CartThumb item={item} small />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="font-display text-[1.05rem] font-semibold leading-tight">{ql?.name ?? item.name}</p>
                          <p className="text-sm font-semibold tabular-nums">
                            {quoteState === 'loading' && !ql ? <span className="inline-block h-4 w-12 animate-pulse rounded bg-cream-200" /> : formatPrice((ql?.unitPrice ?? item.price) * item.qty)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-espresso-500">
                          {item.subtitle} · Qty {item.qty}
                        </p>
                        {issue && (
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <span className="font-semibold text-[#A4452F]">{issue.issue}</span>
                            {issue.maxQty && issue.maxQty > 0 && issue.maxQty < item.qty ? (
                              <button type="button" onClick={() => update(item.id, { qty: issue.maxQty!, maxQty: issue.maxQty })} className="underline underline-offset-2">
                                Update to {issue.maxQty}
                              </button>
                            ) : issue.permalink && issue.issue?.startsWith('Choose') ? (
                              <a href={issue.permalink} className="underline underline-offset-2">
                                Choose options
                              </a>
                            ) : null}
                            <button type="button" onClick={() => remove(item.id)} className="underline underline-offset-2">
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
                {offline.map((item) => (
                  <li key={item.id} className="flex gap-4 py-5 opacity-60">
                    <CartThumb item={item} small />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[1.05rem] font-semibold leading-tight">{item.name}</p>
                      <p className="mt-1 text-xs text-[#A4452F]">Not available for online checkout</p>
                      <button type="button" onClick={() => remove(item.id)} className="mt-1 text-xs underline underline-offset-2">
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2.5 border-t border-ink pt-5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-espresso-700">Subtotal</dt>
                  <dd className="font-semibold tabular-nums">{quote ? formatPrice(quote.subtotal) : '—'}</dd>
                </div>
                {quote?.shipping && (
                  <div className="flex justify-between">
                    <dt className="text-espresso-700">{quote.shipping.title}</dt>
                    <dd className="font-semibold tabular-nums">{quote.shipping.total === 0 ? 'Free' : formatPrice(quote.shipping.total)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-espresso-500">
                  <dt>Taxes</dt>
                  <dd>Calculated at payment</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em]">Estimated total</dt>
                  <dd className="text-[1.5rem] font-semibold tabular-nums">{quote ? formatPrice(quote.estimatedTotal) : '—'}</dd>
                </div>
              </dl>

              <button type="submit" disabled={!canPay} className="btn-dark mt-7 w-full">
                {submit === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating your order…
                  </>
                ) : submit === 'redirecting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to payment…
                  </>
                ) : quoteState === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Checking availability…
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" /> Continue to secure payment <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className={cn('mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-espresso-500')}>
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-dark" />
                You’ll complete payment on the Synergy 44 store’s secure checkout. Card details are never handled by this site.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Redirect overlay */}
      <AnimatePresence>
        {submit === 'redirecting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-[100] grid place-items-center bg-cream/90 backdrop-blur-md"
            role="status"
          >
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-champagne" />
              <p className="mt-5 font-display text-2xl font-semibold">Taking you to secure payment…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
