'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductVisual from '@/components/shop/ProductVisual';
import PendantVisual from '@/components/jewelry/PendantVisual';
import type { Pendant, Product, ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Product photography: 4:5 main frame (object-cover) + thumbnail rail.
 * `activeSrc` lets the purchase panel swap in a variation's image.
 * Without photos (demo catalog) it shows the illustrated packshot.
 */
export default function ProductGallery({
  images,
  kind,
  item,
  brandName,
  activeSrc,
}: {
  images: ProductImage[];
  kind: 'product' | 'pendant';
  item: Product | Pendant;
  brandName: string;
  activeSrc?: string;
}) {
  const [index, setIndex] = useState(0);
  const dark = kind === 'pendant';

  // When a variation image is selected, jump to it (or show it if it isn't in the gallery)
  const extra = activeSrc && !images.some((i) => i.src === activeSrc) ? [{ src: activeSrc, alt: item.name }] : [];
  const all = [...extra, ...images];
  useEffect(() => {
    if (!activeSrc) return;
    const i = all.findIndex((img) => img.src === activeSrc);
    if (i >= 0) setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSrc]);

  const current = all[Math.min(index, all.length - 1)];
  const go = (d: number) => setIndex((i) => (i + d + all.length) % all.length);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {all.length > 1 && (
        <ul className="flex gap-3 overflow-x-auto no-scrollbar lg:w-[84px] lg:flex-col lg:overflow-visible" aria-label="Product images">
          {all.map((img, i) => (
            <li key={img.src + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'relative block aspect-[4/5] w-[72px] overflow-hidden rounded-[8px] ring-1 transition lg:w-full',
                  i === index ? 'ring-2 ring-ink' : 'ring-ink/10 opacity-70 hover:opacity-100',
                )}
              >
                <Image src={img.src} alt="" fill sizes="84px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className={cn(
          'group relative aspect-[4/5] flex-1 overflow-hidden rounded-media ring-1',
          dark ? 'bg-[#0F0D12] ring-white/10' : 'bg-[#ECE6DC] shadow-soft ring-ink/[0.06]',
        )}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
      >
        {current ? (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt || item.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-silk group-hover:scale-[1.03]"
          />
        ) : kind === 'pendant' ? (
          <div
            className="sheen-live absolute inset-0 flex flex-col items-center"
            style={{ background: `radial-gradient(70% 55% at 50% 42%, ${(item as Pendant).colors[0]}40 0%, #1A1620 55%, #0B0A0D 100%)` }}
          >
            <div className="h-[20%] w-px bg-gradient-to-b from-transparent via-iris/60 to-iris" />
            <PendantVisual colors={(item as Pendant).colors} shape={(item as Pendant).shape} chain={false} className="w-[44%]" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'radial-gradient(90% 70% at 50% 38%, #FFFFFF 0%, #EEE8DE 55%, #DCD3C6 100%)' }}>
            <ProductVisual shape={(item as Product).shape} colors={(item as Product).colors} cap={(item as Product).cap} label={brandName} className="h-[72%]" />
          </div>
        )}

        {all.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink opacity-0 shadow-soft transition group-hover:opacity-100 focus-visible:opacity-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink opacity-0 shadow-soft transition group-hover:opacity-100 focus-visible:opacity-100">
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-semibold tabular-nums text-ink">
              {index + 1} / {all.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
