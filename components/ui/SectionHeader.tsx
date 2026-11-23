import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';

/**
 * Section opener: a headline, with an optional serif intro and action beside it.
 * `index` and `label` are accepted for compatibility but not rendered: sections aren't a
 * sequence, and the headline already says what the section is.
 */
export default function SectionHeader({
  title,
  intro,
  action,
  dark,
  className,
}: {
  index?: string;
  label?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('stagger grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8', className)}>
      <Reveal className="lg:col-span-7">
        <h2 className={cn('h-section text-balance', dark && '!text-white')}>{title}</h2>
      </Reveal>
      {(intro || action) && (
        <Reveal className="flex flex-col items-start gap-6 lg:col-span-5 lg:pb-1">
          {intro && <p className={cn('lead !text-[1.15rem]', dark && '!text-white/70')}>{intro}</p>}
          {action}
        </Reveal>
      )}
    </div>
  );
}
