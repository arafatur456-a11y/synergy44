'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Ban, Check, Plus } from 'lucide-react';
import ProductVisual from './ProductVisual';
import { CardAction, CardMeta, MediaFrame } from './CardParts';
import { getBrand } from '@/lib/data';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const brand = getBrand(product.brand);
  const brandName = brand?.name ?? product.brand;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const onAdd = () => {
    add({
      id: product.id,
      name: product.name,
      subtitle: [brandName, product.size].filter(Boolean).join(' · '),
      price: product.price,
      wcId: product.wcId,
      maxQty: product.stockQuantity,
      visual: product.image
        ? { type: 'image', src: product.image, alt: product.name }
        : { type: 'product', shape: product.shape, colors: product.colors, cap: product.cap, label: brandName },
    });
    setAdded(true);
  };

  return (
    <article className="group relative">
      <MediaFrame
        badge={product.badge}
        background={product.image ? undefined : `radial-gradient(90% 70% at 50% 38%, #FFFFFF 0%, ${brand?.tint ?? '#EEE8DE'} 55%, #DCD3C6 100%)`}
        action={
          product.inStock === false ? (
            <CardAction disabled ariaLabel={`${product.name} is sold out`} label="Sold out" icon={<Ban className="h-4 w-4" />} />
          ) : product.type === 'variable' && product.permalink ? (
            <CardAction href={product.permalink} ariaLabel={`Choose options for ${product.name}`} label="Choose options" icon={<ArrowUpRight className="h-4 w-4" />} price={product.price} />
          ) : (
          <CardAction
            onClick={onAdd}
            ariaLabel={`Quick add ${brandName} ${product.name}`}
            label={
              added ? (
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> Added to bag
                </span>
              ) : (
                'Quick add'
              )
            }
            icon={added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            price={product.price}
          />
          )
        }
      >
        {product.image ? (
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
        ) : (
          <>
            <div className="absolute inset-x-[18%] bottom-[14%] h-[10%] rounded-[50%] bg-ink/15 blur-xl" />
            <div className="absolute inset-0 flex items-center justify-center pb-[6%]">
              <ProductVisual shape={product.shape} colors={product.colors} cap={product.cap} label={brandName} className="h-[70%]" />
            </div>
          </>
        )}
      </MediaFrame>
      <CardMeta
        eyebrow={brandName}
        title={product.name}
        price={product.price}
        compareAt={product.regularPrice}
        detail={
          <>
            {product.size}
            <span className="hidden sm:inline">
              {product.size ? ' · ' : ''}
              {product.category}
            </span>
          </>
        }
      />
    </article>
  );
}
