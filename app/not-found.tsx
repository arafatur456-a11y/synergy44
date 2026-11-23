import Link from 'next/link';
import BotanicalSprig from '@/components/ui/BotanicalSprig';

export default function NotFound() {
  return (
    <section className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow relative">Error 404</p>
      <h1 className="display-xl relative mt-5">
        We can’t find that page
      </h1>
      <p className="lead relative mt-6 max-w-md">The link may be old, or the piece may have sold. Try the shop or the glass gallery.</p>
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
