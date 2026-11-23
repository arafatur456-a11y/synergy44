'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import InstagramLink from '@/components/ui/InstagramLink';
import { subscribe } from '@/lib/newsletter';
import { brands } from '@/lib/data';
import { site } from '@/lib/site';

const explore = [
  ['Glass jewelry', '/jewelry'],
  ['Salon', '/hair-styling'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const joined = status === 'done';

  return (
    <footer className="relative overflow-hidden bg-forest text-white">
      <div className="container-x">
        <div className="grid gap-12 border-b border-white/15 py-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="max-w-[16ch] font-display text-[2.4rem] font-semibold leading-[1] tracking-[-0.03em] sm:text-[3.2rem]">
              Hear about new glass before it sells
            </h2>
            <p className="mt-5 max-w-[44ch] font-serif text-[1.15rem] leading-relaxed text-white/65">
              A short letter a few times a season: new pendants, hair care that’s working in the salon, and studio news.
            </p>
          </div>
          <form
            className="lg:col-span-5 lg:col-start-8"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              if (status === 'sending' || joined) return;
              setStatus('sending');
              setError('');
              const res = await subscribe({ email, website, source: 'footer' });
              if (res.ok) setStatus('done');
              else {
                setError(res.error);
                setStatus('error');
              }
            }}
          >
            <label htmlFor="footer-email" className="text-[15px] text-white/70">
              Your email
            </label>
            <div className="mt-3 flex h-14 items-center rounded-full border border-white/25 pl-5 pr-1.5 transition-colors focus-within:border-white/70">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                readOnly={joined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                aria-invalid={!!error}
                aria-describedby={error ? 'footer-email-error' : undefined}
                placeholder="name@example.com"
                className="h-full flex-1 bg-transparent text-[16px] text-white placeholder:text-white/40 focus:outline-none"
              />
              <button type="submit" disabled={joined || status === 'sending'} className="flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-[15px] font-medium text-ink transition-colors hover:bg-iris-pale disabled:opacity-80">
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Joining
                  </>
                ) : joined ? (
                  <>
                    <Check className="h-4 w-4 text-iris" /> Subscribed
                  </>
                ) : (
                  <>
                    Subscribe
                  </>
                )}
              </button>
            </div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <p id="footer-email-error" role={error ? 'alert' : undefined} aria-live="polite" className={error ? 'mt-3 text-[13px] text-[#F0B4A2]' : 'mt-3 text-[13px] text-white/55'}>
              {error || (joined ? 'You’re on the list. Watch for the next letter.' : 'Unsubscribe any time.')}
            </p>
          </form>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-xs text-[15px] leading-relaxed text-white/70">Organic hair care, salon appointments and handmade dichroic glass by Cynthia Reedy. Salon visits by appointment in {site.locations.join(' and ')}.</p>
            <Link href="/contact?topic=salon" className="btn-light mt-8">
              Book a visit
            </Link>
          </div>
          <div className="lg:col-span-3 lg:col-start-6">
            <p className="text-[15px] font-medium text-white/50">Hair care</p>
            <ul className="mt-5 grid grid-cols-2 gap-y-3 text-[15px]">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/products/hair-care/${b.slug}`} className="text-white/80 transition-colors hover:text-white hover:underline hover:underline-offset-4">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[15px] font-medium text-white/50">Explore</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              {explore.map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-white/80 transition-colors hover:text-white hover:underline hover:underline-offset-4">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[15px] font-medium text-white/50">Studios</p>
            <ul className="mt-5 space-y-3 text-[15px] text-white/80">
              {site.locations.map((l) => (
                <li key={l}>{l}</li>
              ))}
              <li className="text-white/50">{site.hours}</li>
            </ul>
            <InstagramLink tone="dark" className="mt-6" />
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-white/10 py-6 text-[14px] text-white/45 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Synergy 44 LLC</p>
        <p>Made in Michigan and California</p>
      </div>
    </footer>
  );
}
