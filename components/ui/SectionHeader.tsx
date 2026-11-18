import type { ReactNode } from 'react';
import Reveal from './Reveal';
import { cn } from '@/lib/utils';

/**
 * Editorial section opener: numbered index + label on a hairline, then a bold
 * serif title with optional intro and action aligned to the baseline.
 */
export default function SectionHeader({
  index,
  label,
  title,
  intro,
  action,
  dark,
  className,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal>
        <div className={cn('flex items-center gap-5 border-t pt-5 text-[11px] font-semibold uppercase tracking-[0.24em]', dark ? 'border-white/20 text-white/80' : 'border-ink text-ink')}>
          {index && <span className={cn('font-display text-sm italic tracking-normal', dark ? 'text-champagne-light' : 'text-champagne')}>{index}</span>}
          <span>{label}</span>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <h2 className={cn('h-section text-balance', dark && '!text-white')}>{title}</h2>
        </Reveal>
        {(intro || action) && (
          <Reveal delay={0.1} className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
            {intro && <p className={cn('lead', dark && '!text-white/70')}>{intro}</p>}
            {action}
          </Reveal>
        )}
      </div>
    </div>
  );
}
