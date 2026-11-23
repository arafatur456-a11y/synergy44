'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Check, Clock, Loader2, MapPin } from 'lucide-react';
import {
  bookingLocations,
  formatBookingDate,
  haircutPackages,
  isoDay,
  packageById,
  timeWindows,
  validateBooking,
  windowLabel,
  type BookingErrors,
  type BookingPayload,
  type TimeWindow,
} from '@/lib/booking';
import { cn } from '@/lib/utils';

type Step = 0 | 1 | 2;
const STEPS = ['Package', 'Date & time', 'Your details'];

const empty: BookingPayload = { packageId: '', date: '', window: 'flexible', location: bookingLocations[0] ?? '', name: '', email: '', phone: '', notes: '', company: '' };

/** Three-step haircut package request: package preferred day/window contact confirmation. */
export default function BookingFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<BookingPayload>(empty);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [confirmed, setConfirmed] = useState<{ reference: string; booking: BookingPayload } | null>(null);

  const set = <K extends keyof BookingPayload>(k: K, v: BookingPayload[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined, ...(k === 'phone' ? { email: undefined } : {}) }));
  };

  // Next 10 days (skipping Sundays) as quick picks; any date works through the picker.
  const quickDays = useMemo(() => {
    const out: { iso: string; dow: string; day: string }[] = [];
    for (let i = 1; out.length < 6 && i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      if (d.getDay() === 0) continue;
      out.push({ iso: isoDay(i), dow: d.toLocaleDateString('en-US', { weekday: 'short' }), day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
    }
    return out;
  }, []);

  const stepFields: (keyof BookingPayload)[][] = [['packageId'], ['date', 'window', 'location'], ['name', 'email', 'phone', 'notes']];

  const next = () => {
    const all = validateBooking(form);
    const own = Object.fromEntries(stepFields[step].filter((k) => all[k]).map((k) => [k, all[k]])) as BookingErrors;
    setErrors(own);
    if (Object.keys(own).length) return false;
    if (step < 2) setStep((s) => (s + 1) as Step);
    return true;
  };

  const submit = async () => {
    const all = validateBooking(form);
    if (Object.keys(all).length) {
      setErrors(all);
      const firstBad = stepFields.findIndex((f) => f.some((k) => all[k]));
      if (firstBad >= 0) setStep(firstBad as Step);
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setConfirmed({ reference: data.reference, booking: form });
        setStatus('idle');
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(data.error || 'Please check the highlighted details.');
      setStatus('error');
    } catch {
      setServerError('You appear to be offline. Please try again.');
      setStatus('error');
    }
  };

  if (confirmed) {
    const pkg = packageById(confirmed.booking.packageId)!;
    const w = windowLabel(confirmed.booking.window);
    return (
      <div className="px-6 py-8">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-sage-dark text-white">
          <Check className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <h3 className="mt-6 font-display text-[2rem] font-semibold leading-tight">Request received</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-stone-700">
          Thank you, {confirmed.booking.name.split(' ')[0]}. The studio will confirm your time personally{confirmed.booking.email ? ' by email' : ' by phone'}, usually within one business day.
        </p>
        <dl className="mt-7 divide-y divide-line border-y border-line text-[14px]">
          {[
            ['Reference', confirmed.reference],
            ['Package', `${pkg.name}, ${pkg.price}`],
            ['Preferred day', formatBookingDate(confirmed.booking.date)],
            ['Time', `${w?.label} (${w?.hint})`],
            ['Studio', confirmed.booking.location],
            ['Contact', [confirmed.booking.email, confirmed.booking.phone].filter(Boolean).join(', ')],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3">
              <dt className="text-stone-500">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[12px] leading-relaxed text-stone-400">This is a request, not a confirmed appointment yet. Prices are from our current salon menu and may vary with hair length and condition.</p>
        <div className="mt-7 flex flex-col gap-3">
          <button
            onClick={() => {
              setConfirmed(null);
              setForm(empty);
              setStep(0);
            }}
            className="btn-outline w-full"
          >
            Make another request
          </button>
          <button onClick={onDone} className="text-center text-sm text-stone-500 hover:text-ink">
            Back to the concierge
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof BookingPayload) =>
    errors[k] ? (
      <p id={`bk-${k}-err`} className="mt-2 text-[12.5px] text-[#7A3322]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form
      noValidate
      className="flex min-h-full flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 2) next();
        else void submit();
      }}
    >
      {/* Progress */}
      <ol className="flex gap-2 px-6 pt-6" aria-label="Booking steps">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1" aria-current={i === step ? 'step' : undefined}>
            <span className={cn('block h-[2px] transition-colors duration-500', i <= step ? 'bg-iris' : 'bg-line')} />
            <span className={cn('mt-2 block text-[13px] font-semibold', i === step ? 'text-ink' : 'text-stone-400')}>{label}</span>
          </li>
        ))}
      </ol>

      <div className="flex-1 px-6 py-6">
        {/* Hidden from people; bots fill it in */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.company} onChange={(e) => set('company', e.target.value)} />

        {step === 0 && (
          <fieldset>
            <legend className="font-display text-[1.6rem] font-semibold leading-tight">Choose your package</legend>
            <p className="mt-1 text-[13px] text-stone-500">Every cut begins with a consultation.</p>
            <div className="mt-5 space-y-2.5" role="radiogroup" aria-describedby={errors.packageId ? 'bk-packageId-err' : undefined}>
              {haircutPackages.map((p) => {
                const on = form.packageId === p.id;
                return (
                  <label
                    key={p.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-4 rounded-media border p-4 transition-colors duration-300',
                      on ? 'border-ink bg-mineral' : 'border-line bg-paper hover:border-stone-400',
                    )}
                  >
                    <input type="radio" name="package" value={p.id} checked={on} onChange={() => set('packageId', p.id)} className="sr-only" />
                    <span className={cn('mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border', on ? 'border-ink' : 'border-stone-400')}>
                      {on && <span className="h-2 w-2 rounded-full bg-accent-light" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-[1.15rem] font-semibold leading-tight">{p.name}</span>
                        <span className="shrink-0 text-[14px] font-semibold tabular-nums">{p.price}</span>
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-stone-500">{p.includes}</span>
                      <span className="mt-2 flex items-center gap-3 text-[13px] font-semibold text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {p.duration}
                        </span>
                        <span>{p.audience}</span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {err('packageId')}
          </fieldset>
        )}

        {step === 1 && (
          <div className="space-y-7">
            <fieldset>
              <legend className="font-display text-[1.6rem] font-semibold leading-tight">Preferred day</legend>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {quickDays.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    aria-pressed={form.date === d.iso}
                    onClick={() => set('date', d.iso)}
                    className={cn(
                      'rounded-[8px] border px-2 py-2.5 text-center transition-colors duration-300',
                      form.date === d.iso ? 'border-accent bg-accent text-white' : 'border-line bg-paper hover:border-stone-400',
                    )}
                  >
                    <span className="block text-[13px] font-semibold opacity-70">{d.dow}</span>
                    <span className="block text-[14px] font-semibold">{d.day}</span>
                  </button>
                ))}
              </div>
              <label htmlFor="bk-date" className="mt-4 block text-[13px] font-semibold text-stone-500">
                Or pick another date
              </label>
              <input
                id="bk-date"
                type="date"
                min={isoDay(0)}
                max={isoDay(180)}
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? 'bk-date-err' : undefined}
                className="input mt-2"
              />
              {err('date')}
            </fieldset>

            <fieldset>
              <legend className="text-[13px] font-semibold">Time window</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {timeWindows.map((w) => (
                  <button
                    key={w.value}
                    type="button"
                    aria-pressed={form.window === w.value}
                    onClick={() => set('window', w.value as TimeWindow)}
                    className={cn(
                      'rounded-[8px] border px-3 py-3 text-left transition-colors duration-300',
                      form.window === w.value ? 'border-ink bg-mineral' : 'border-line bg-paper hover:border-stone-400',
                    )}
                  >
                    <span className="block text-[14px] font-semibold">{w.label}</span>
                    <span className="block text-[12px] text-stone-500">{w.hint}</span>
                  </button>
                ))}
              </div>
              {err('window')}
            </fieldset>

            {bookingLocations.length > 1 && (
              <fieldset>
                <legend className="text-[13px] font-semibold">Studio</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {bookingLocations.map((l) => (
                    <button key={l} type="button" aria-pressed={form.location === l} onClick={() => set('location', l)} className={cn('chip gap-2', form.location === l ? 'chip-on' : 'chip-off')}>
                      <MapPin className="h-3.5 w-3.5" /> {l}
                    </button>
                  ))}
                </div>
                {err('location')}
              </fieldset>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display text-[1.6rem] font-semibold leading-tight">How can we reach you?</h3>
              <p className="mt-1 text-[13px] text-stone-500">An email or phone number is enough. We’ll confirm your time personally.</p>
            </div>
            <Field id="bk-name" label="Name" error={errors.name}>
              <input id="bk-name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} className="input" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'bk-name-err' : undefined} />
            </Field>
            <Field id="bk-email" label="Email" error={errors.email}>
              <input id="bk-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'bk-email-err' : undefined} />
            </Field>
            <Field id="bk-phone" label="Phone (optional)" error={errors.phone}>
              <input id="bk-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'bk-phone-err' : undefined} />
            </Field>
            <Field id="bk-notes" label="Notes (optional)" error={errors.notes}>
              <textarea
                id="bk-notes"
                rows={3}
                maxLength={1000}
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Hair length, the look you’re after, anything we should know…"
                className="input resize-none"
              />
            </Field>

            {form.packageId && form.date && (
              <div className="rounded-media border border-line bg-mineral p-4 text-[13px] leading-relaxed text-stone-700">
                <p className="text-[13px] font-semibold text-iris">Your request</p>
                <p className="mt-1.5 font-display text-[1.1rem] font-semibold text-ink">{packageById(form.packageId)?.name}</p>
                <p>
                  {formatBookingDate(form.date)}, {windowLabel(form.window)?.label.toLowerCase()}, {form.location}
                </p>
              </div>
            )}
            {serverError && (
              <p role="alert" className="border-l-2 border-[#A4452F] pl-3 text-[13px] text-[#7A3322]">
                {serverError}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 flex gap-3 border-t border-line bg-paper px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => (s - 1) as Step)} className="btn-outline px-5" aria-label="Previous step">
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <button type="submit" disabled={status === 'sending'} className="btn-dark flex-1">
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending request
            </>
          ) : step < 2 ? (
            <>
              Continue
            </>
          ) : (
            'Request this appointment'
          )}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-stone-500">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[12.5px] text-[#7A3322]">
          {error}
        </p>
      )}
    </div>
  );
}
