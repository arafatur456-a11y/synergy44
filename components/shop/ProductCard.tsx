'use client';

import { Plus } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import ProductVisual from './ProductVisual';
import type { Product } from '@/lib/data/products';
import { getBrand } from '@/lib/data/brands';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const brand = getBrand(product.brand);
  const brandName = brand?.name ?? product.brand;

  const onAdd = () =>
    add({
      id: product.id,
      name: product.name,
      subtitle: `${brandName} · ${product.size}`,
      price: product.price,
      visual: { type: 'product', shape: product.shape, colors: product.colors, cap: product.cap, label: brandName },
    });

  return (
    <TiltCard className="card flex flex-col p-2 sm:p-3">
      <div
        className="relative flex aspect-[4/4.3] items-center justify-center overflow-hidden rounded-[18px] sm:rounded-[22px] [transform:translateZ(18px)]"
        style={{ background: `linear-gradient(160deg, #FFFFFF 0%, ${brand?.tint ?? '#F4F0EA'} 100%)` }}
      >
        <div aria-hidden className="absolute bottom-6 h-10 w-2/3 rounded-full bg-espresso/10 blur-2xl" />
        <ProductVisual
          shape={product.shape}
          colors={product.colors}
          cap={product.cap}
          label={brandName}
          className="relative h-[78%] transition-transform duration-700 ease-silk group-hover:-translate-y-2 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/90 px-2.5 py-1 text-[9px] sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-sage-dark backdrop-blur">
            {product.badge}
          </span>
        )}
        <button
          onClick={onAdd}
          aria-label={`Add ${brandName} ${product.name} to bag`}
          className="absolute bottom-2.5 right-2.5 grid h-10 w-10 sm:bottom-4 sm:right-4 sm:h-11 sm:w-11 place-items-center rounded-full bg-espresso text-cream shadow-lift transition-all duration-500 ease-silk hover:bg-sage md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-2 pt-4 sm:px-3 sm:pb-3 sm:pt-5 [transform:translateZ(24px)]">
        <div className="flex items-center justify-between gap-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] sm:text-[10.5px] sm:tracking-[0.2em]">
          <span className="text-sage">{brandName}</span>
          <span className="hidden text-espresso-400 min-[400px]:inline">{product.category}</span>
        </div>
        <h3 className="mt-1.5 font-display text-[1.15rem] leading-tight sm:mt-2 sm:text-[1.45rem]">{product.name}</h3>
        <p className="mt-1.5 hidden line-clamp-2 text-[13.5px] sm:[display:-webkit-box] leading-relaxed text-espresso-500">{product.description}</p>
        <div className="mt-auto flex items-end justify-between pt-3 sm:pt-5">
          <span className="font-display text-lg sm:text-xl">{formatPrice(product.price)}</span>
          <span className="text-xs text-espresso-400">{product.size}</span>
        </div>
      </div>
    </TiltCard>
  );
}
