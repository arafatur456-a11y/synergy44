'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import ProductVisual from '@/components/shop/ProductVisual';
import { useCart } from '@/lib/cart';
import { getBrand } from '@/lib/data';
import { productHref } from '@/lib/catalog-utils';
import type { Product } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';

/**
 * Floating "Cynthia's pick" card in the hero. The card opens our product page; the
 * button adds simple products to the bag (variable products link to choose a size).
 */
export default function SpotlightCard({ product: p, className }: { product: Product; className?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const brandName = getBrand(p.brand)?.name ?? p.brand;
  const href = productHref(p);
  const variable = p.type === 'variable';
  const soldOut = p.inStock === false;

  return (
    <div className={cn('glass group relative flex items-center gap-4 p-3 pr-4 transition-[transform,border-color] duration-500 ease-silk hover:-translate-y-1 hover:border-accent-light/40', className)}>
      <Link href={href} aria-label={`${brandName} ${p.name}`} className="absolute inset-0 z-[1] rounded-[inherit]" />
      <div className="relative grid h-[76px] w-[64px] shrink-0 place-items-center overflow-hidden rounded-[10px] bg-elevated">
        {p.image ? (
          <Image src={p.image} alt="" fill sizes="64px" className="zoom-media object-cover" />
        ) : (
          <ProductVisual shape={p.shape} colors={p.colors} cap={p.cap} label={brandName} className="h-[64px]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-medium text-iris-light">Cynthia’s pick</p>
        <p className="mt-0.5 truncate text-[15.5px] font-semibold text-ink">
          {brandName} {p.name}
        </p>
        <p className="mt-0.5 text-[14px] tabular-nums text-stone-500">
          {variable ? 'From ' : ''}
          {formatPrice(p.price)}
        </p>
      </div>
      {variable || soldOut ? (
        <span aria-hidden className="relative z-[2] text-[13px] font-medium text-iris-light">
          {soldOut ? 'Sold out' : 'View'}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => {
            add({
              id: p.id,
              name: p.name,
              subtitle: [brandName, p.size].filter(Boolean).join(', '),
              price: p.price,
              wcId: p.wcId,
              maxQty: p.stockQuantity,
              href,
              visual: p.image ? { type: 'image', src: p.image, alt: p.name } : { type: 'product', shape: p.shape, colors: p.colors, cap: p.cap, label: brandName },
            });
            setAdded(true);
          }}
          aria-label={`Add ${brandName} ${p.name} to bag`}
          className="relative z-[2] grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white shadow-glow transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-accent-hover active:scale-95"
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
