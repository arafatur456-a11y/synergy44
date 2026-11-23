import Link from 'next/link';
import { Clock } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { serviceGroups } from '@/lib/data';

/**
 * Salon price list in two columns: service, dotted leader, price; detail and duration below.
 * Content comes from `serviceGroups` in lib/data.ts.
 */
export default function PricingMenu() {
  return (
    <Reveal>
      <article className="rounded-media bg-paper px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div>
          <nav aria-label="Menu sections" className="flex flex-wrap gap-2">
            {serviceGroups.map((g) => (
              <a key={g.id} href={`#svc-${g.id}`} className="chip chip-off">
                {g.title}
              </a>
            ))}
          </nav>

          {/* Sections */}
          <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {serviceGroups.map((g) => (
              <section key={g.id} id={`svc-${g.id}`} className="scroll-mt-36" aria-labelledby={`svc-${g.id}-title`}>
                <div className="flex items-baseline gap-3 border-b border-ink/25 pb-3">
                  <h4 id={`svc-${g.id}-title`} className="font-display text-[1.65rem] font-semibold leading-tight">
                    {g.title}
                  </h4>
                </div>
                {g.note && <p className="mt-3 font-serif text-[1rem] text-stone-700">{g.note}</p>}
                <ul>
                  {g.services.map((s) => (
                    <li key={s.name} className="group border-b border-line py-[1.15rem] last:border-b-0">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[1.15rem] font-medium leading-snug">{s.name}</span>
                        <span aria-hidden className="mb-1 min-w-6 flex-1 border-b border-dotted border-ink/30" />
                        <span className="whitespace-nowrap text-[16px] tabular-nums">{s.price}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                        <span className="font-serif text-[15px] leading-relaxed text-stone-500">{s.detail}</span>
                        {s.duration && (
                          <span className="inline-flex items-center gap-1.5 text-[13px] text-stone-500">
                            <Clock className="h-3 w-3" /> {s.duration}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-14 flex flex-col items-start gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
            <ul className="space-y-1 font-serif text-[15px] text-stone-500">
              <li>Prices are starting points and vary with hair length and density.</li>
              <li>Cynthia confirms your price at the consultation, before any work starts.</li>
            </ul>
            <Link href="/contact?topic=salon" className="btn-dark shrink-0">
              Book an appointment
            </Link>
          </footer>
        </div>
      </article>
    </Reveal>
  );
}
