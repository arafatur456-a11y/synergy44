import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
    <div className={cn('grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8', className)}>
      <h2 className={cn('h-section text-balance lg:col-span-7', dark && '!text-white')}>{title}</h2>
      {(intro || action) && (
        <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:pb-1">
          {intro && <p className={cn('lead !text-[1.15rem]', dark && '!text-white/70')}>{intro}</p>}
          {action}
        </div>
      )}
    </div>
  );
}
