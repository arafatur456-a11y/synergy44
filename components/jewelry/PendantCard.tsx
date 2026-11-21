'use client';

import Image from 'next/image';
import { Eye } from 'lucide-react';
import PendantVisual from './PendantVisual';
import { CardAction, CardMeta, MediaFrame } from '@/components/shop/CardParts';
import type { Pendant } from '@/lib/types';
import { productHref } from '@/lib/catalog-utils';

/** Same anatomy as ProductCard (4:5 media, badge, slide-up action, meta row) in the dark gallery tone. */
/** Image + title open the product page; the action bar opens the quick view (when `onOpen` is given). */
export default function PendantCard({ pendant: p, onOpen }: { pendant: Pendant; onOpen?: () => void }) {
  const href = productHref(p);
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <article className="group relative" onPointerMove={track}>
      <MediaFrame
        tone="dark"
        badge="One of one"
        href={href}
        selectLabel={`View ${p.name}`}
        background={p.image ? undefined : `radial-gradient(70% 55% at 50% 42%, ${p.colors[0]}38 0%, #1A1620 55%, #0B0A0D 100%)`}
        action={
          onOpen ? (
            <CardAction onClick={onOpen} ariaLabel={`Quick view ${p.name}`} label="Quick view" icon={<Eye className="h-4 w-4" />} price={p.price} />
          ) : (
            <CardAction href={href} ariaLabel={`View ${p.name}`} label="View piece" icon={<Eye className="h-4 w-4" />} price={p.price} />
          )
        }
      >
        {p.image ? (
          <Image src={p.image} alt={p.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
        ) : (
          <>
            <div className="absolute left-1/2 top-[-10%] h-[70%] w-[70%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)]" />
            {/* Longer chain so the glass hangs at the optical centre of the 4:5 frame */}
            <div className="absolute inset-0 flex flex-col items-center">
              <div className="h-[22%] w-px bg-gradient-to-b from-transparent via-champagne/60 to-champagne" />
              <PendantVisual colors={p.colors} shape={p.shape} chain={false} className="w-[46%]" />
            </div>
          </>
        )}
      </MediaFrame>
      <CardMeta href={href} tone="dark" eyebrow={p.collection} title={p.name} detail={p.size ? `Approx. ${p.size}` : undefined} price={p.price} />
    </article>
  );
}
