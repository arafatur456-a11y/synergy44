import type { ReactNode } from 'react';
import Reveal from './Reveal';
import { cn } from '@/lib/utils';

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  className,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8',
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <Reveal className={cn(align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-2xl')}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h-section mt-4">{title}</h2>
        {intro && <p className={cn('lead mt-5', align === 'center' && 'mx-auto max-w-xl')}>{intro}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}
