import Link from 'next/link';
import BotanicalSprig from '@/components/ui/BotanicalSprig';

export default function NotFound() {
  return (
    <section className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <BotanicalSprig className="absolute left-1/2 top-1/2 h-[420px] -translate-x-1/2 -translate-y-1/2 text-sage/15" />
      <p className="eyebrow relative">404</p>
      <h1 className="display-xl relative mt-5">
        This page has <em className="text-iridescent">wandered off.</em>
      </h1>
      <p className="lead relative mt-6 max-w-md">Let’s get you back to something beautiful.</p>
      <div className="relative mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-dark">
          Return home
        </Link>
        <Link href="/products/hair-care" className="btn-outline">
          Shop hair care
        </Link>
      </div>
    </section>
  );
}
