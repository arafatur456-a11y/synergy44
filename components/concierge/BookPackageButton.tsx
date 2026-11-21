'use client';

import { CalendarHeart } from 'lucide-react';
import { openConcierge } from '@/lib/concierge';
import { cn } from '@/lib/utils';

/** Opens the concierge directly on the haircut-package booking flow. */
export default function BookPackageButton({ className, label = 'Book a haircut package' }: { className?: string; label?: string }) {
  return (
    <button type="button" onClick={() => openConcierge({ tab: 'book' })} className={cn('btn-outline', className)}>
      <CalendarHeart className="h-4 w-4" strokeWidth={1.7} /> {label}
    </button>
  );
}
