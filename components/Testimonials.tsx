import { testimonials } from '@/lib/data';
import { cn } from '@/lib/utils';
import Reveal from '@/components/ui/Reveal';

/**
 * Client words, set as two quotes side by side in the reading serif. Static on purpose:
 * no autoplay carousel. Only the first two entries (named clients) are shown.
 */
export default function Testimonials({ className }: { index?: string; label?: string; className?: string }) {
  const shown = testimonials.slice(0, 2);
  return (
    <section aria-labelledby="words-heading" className={cn('container-x py-20 sm:py-28', className)}>
      <h2 id="words-heading" className="h-section">From clients</h2>
      <div className="stagger mt-12 grid gap-5 md:grid-cols-2">
        {shown.map((t) => (
          <Reveal key={t.name} className="card card-hover flex flex-col p-7 sm:p-9"><figure className="flex h-full flex-col">
            <blockquote className="font-serif text-[1.5rem] leading-[1.4] text-ink sm:text-[1.75rem]">“{t.quote}”</blockquote>
            <figcaption className="mt-auto pt-6 text-[15px]">
              <span className="font-medium">{t.name}</span>
              <span className="text-stone-500">, {t.context.toLowerCase()}</span>
            </figcaption>
          </figure></Reveal>
        ))}
      </div>
    </section>
  );
}
