import Image from 'next/image';
import ProductVisual from './ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';
import type { CartItem } from '@/lib/cart';
import { cn } from '@/lib/utils';

/** Bag / checkout line thumbnail: real photo when available, otherwise the illustrated packshot. */
export default function CartThumb({ item, small }: { item: CartItem; small?: boolean }) {
  const v = item.visual;
  return (
    <div className={cn('grid shrink-0 place-items-center overflow-hidden rounded-[8px] bg-elevated', small ? 'h-[72px] w-[58px]' : 'h-24 w-20')}>
      {v.type === 'image' ? (
        <div className="relative h-full w-full">
          <Image src={v.src} alt={v.alt} fill sizes="80px" className="object-cover" />
        </div>
      ) : v.type === 'product' ? (
        <ProductVisual shape={v.shape} colors={v.colors} cap={v.cap} label={v.label} className={small ? 'h-[60px]' : 'h-20'} />
      ) : (
        <PendantVisual colors={v.colors} shape={v.shape} chain={false} className={small ? 'w-9' : 'w-12'} />
      )}
    </div>
  );
}
