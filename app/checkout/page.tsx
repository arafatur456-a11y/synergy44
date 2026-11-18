import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { isWooConfigured } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

// Depends on runtime environment (store connection) — never prerender.
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const live = isWooConfigured();

  return (
    <section className="container-x py-14 sm:py-20">
      <div className="mb-12 flex flex-col gap-4 border-b border-ink/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-5 font-display text-[2.8rem] font-semibold leading-none tracking-[-0.02em] sm:text-[3.6rem]">
            Almost <em className="accent">yours.</em>
          </h1>
        </div>
        <ol className="flex gap-6 text-[11px] font-semibold uppercase tracking-[0.18em]" aria-label="Checkout steps">
          <li className="text-espresso-400">Bag</li>
          <li className="text-ink">Details</li>
          <li className="text-espresso-400">Payment</li>
        </ol>
      </div>

      {live ? (
        <CheckoutForm />
      ) : (
        <div className="card mx-auto max-w-xl p-12 text-center shadow-soft">
          <p className="font-display text-[2rem] font-semibold">Online checkout isn’t connected yet</p>
          <p className="mt-3 text-espresso-700">Send us your bag and we’ll confirm your order personally.</p>
          <Link href="/contact?topic=product" className="btn-dark mt-8">
            Request this order <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
