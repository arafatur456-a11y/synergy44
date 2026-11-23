import { testimonials } from '@/lib/data';
import { cn } from '@/lib/utils';

/**
 * Client words, set as two quotes side by side in the reading serif. Static on purpose:
 * no autoplay carousel. Only the first two entries (named clients) are shown.
 */
export default function Testimonials({ className }: { index?: string; label?: string; className?: string }) {
  const shown = testimonials.slice(0, 2);
  return (
    <section aria-labelledby="words-heading" className={cn('container-x py-20 sm:py-28', className)}>
      <h2 id="words-heading" className="h-section">From clients</h2>
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-10">
        {shown.map((t) => (
          <figure key={t.name} className="flex flex-col border-t border-ink/20 pt-8">
            <blockquote className="font-serif text-[1.5rem] leading-[1.4] text-ink sm:text-[1.75rem]">“{t.quote}”</blockquote>
            <figcaption className="mt-6 text-[15px]">
              <span className="font-medium">{t.name}</span>
              <span className="text-stone-500">, {t.context.toLowerCase()}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
