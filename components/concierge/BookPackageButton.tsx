'use client';

import { openConcierge } from '@/lib/concierge';
import { cn } from '@/lib/utils';

/** Opens the concierge directly on the haircut-package booking flow. */
export default function BookPackageButton({ className, label = 'Book a haircut package', variant = 'outline' }: { className?: string; label?: string; variant?: 'dark' | 'outline' }) {
  return (
    <button type="button" onClick={() => openConcierge({ tab: 'book' })} className={cn(variant === 'dark' ? 'btn-dark' : 'btn-outline', className)}>
      {label}
    </button>
  );
}
