'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarHeart, MapPin } from 'lucide-react';

const cols = [
  { title: 'Shop', links: ['Hair Care', 'Dichroic Jewelry', 'Gift Cards', 'Bestsellers'] },
  { title: 'Salon', links: ['Services', 'Book Online', 'Hair Consultations', 'Policies'] },
  { title: 'Studio', links: ['Our Story', 'Custom Glass Orders', 'Care Guide', 'Contact'] },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.06] pt-24">
      <div aria-hidden className="absolute -bottom-40 left-1/2 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-jade/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Booking CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative overflow-hidden rounded-[36px] p-8 sm:p-14"
        >
          <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-jade/40 to-lilac/30 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow">Salon Services · Michigan &amp; California</p>
              <h2 className="section-title mt-4">
                Your hair, <em className="text-gradient">healed</em>.
              </h2>
              <p className="mt-5 max-w-md text-stone-400">
                Cuts, color, treatments and consultations with a licensed cosmetologist who puts the health of your hair first.
              </p>
              <a href="#" className="btn-primary group mt-8">
                <CalendarHeart className="h-4 w-4" /> Book an appointment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: POST to Mailchimp / Klaviyo / WP newsletter endpoint
                setSent(true);
              }}
              className="w-full"
            >
              <label htmlFor="nl" className="text-sm text-stone-300">
                Join the list for new glass drops &amp; hair-care rituals
              </label>
              <div className="mt-3 flex flex-col gap-3 rounded-3xl border border-white/10 bg-ink/50 p-2 sm:flex-row sm:rounded-full">
                <input
                  id="nl"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none"
                />
                <button type="submit" className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-jade">
                  {sent ? 'You’re in ✦' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <div className="grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-display text-3xl text-stone-50">
              Synergy<span className="text-jade">44</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">
              Organic hair care, healing salon services and handmade dichroic glass art.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-stone-400">
              <MapPin className="h-4 w-4 text-jade" /> Michigan · California
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-300">{c.title}</p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-stone-500 transition-colors hover:text-jade">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-stone-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Synergy 44. All rights reserved.</p>
          <p>Cruelty-free curation · Handmade with light</p>
        </div>
      </div>
    </footer>
  );
}
