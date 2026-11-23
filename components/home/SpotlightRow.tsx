'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ProductVisual from '@/components/shop/ProductVisual';
import { useCart } from '@/lib/cart';
import { getBrand } from '@/lib/data';
import { productHref } from '@/lib/catalog-utils';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

/** One quiet product line under the hero: what Cynthia is recommending right now. */
export default function SpotlightRow({ product: p }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const brandName = getBrand(p.brand)?.name ?? p.brand;
  const canAdd = p.inStock !== false && p.type !== 'variable';
  const href = productHref(p);

  return (
    <div className="flex items-center gap-4 border-t border-ink/15 pt-5">
      <Link href={href} className="relative grid h-16 w-14 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-paper">
        {p.image ? (
          <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <ProductVisual shape={p.shape} colors={p.colors} cap={p.cap} label={brandName} className="h-[52px]" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="label truncate">Cynthia’s pick this month</p>
        <Link href={href} className="mt-0.5 block truncate text-[16px] font-medium text-ink hover:underline hover:underline-offset-4">
          {brandName} {p.name}
        </Link>
        <span className="text-[15px] tabular-nums text-stone-500 sm:hidden">{formatPrice(p.price)}</span>
      </div>
      <span className="hidden text-[16px] font-medium tabular-nums sm:inline">{formatPrice(p.price)}</span>
      {canAdd ? (
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
          className="btn-outline h-10 px-4 text-[14px]"
        >
          {added ? 'Added' : (<><span className="sm:hidden">Add</span><span className="hidden sm:inline">Add to bag</span></>)}
        </button>
      ) : (
        <Link href={href} className="btn-outline h-10 px-4 text-[14px]">
          Choose options
        </Link>
      )}
    </div>
  );
}
