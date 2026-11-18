import Link from 'next/link';
import type { ReactNode } from 'react';
import Reveal from './Reveal';
import BotanicalSprig from './BotanicalSprig';

export default function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
  tint,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  tint?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-espresso/[0.06]">
      <div aria-hidden className="absolute inset-0">
        <div
          className="absolute -right-24 -top-32 h-[460px] w-[460px] rounded-full opacity-70 blur-3xl"
          style={{ background: tint ?? '#DFE9E3' }}
        />
        <div className="absolute -bottom-40 left-1/4 h-[340px] w-[540px] rounded-full bg-champagne-pale opacity-80 blur-3xl" />
        <BotanicalSprig className="absolute -right-6 bottom-0 hidden h-[340px] text-sage/25 md:block" />
      </div>

      <div className="container-x relative pb-16 pt-14 sm:pb-20 sm:pt-20">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10 text-xs text-espresso-400">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-espresso">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-espresso">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-espresso-700">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-xl mt-5">{title}</h1>
          {intro && <p className="lead mt-7 max-w-xl">{intro}</p>}
        </Reveal>
        {children && <Reveal delay={0.15}>{children}</Reveal>}
      </div>
    </section>
  );
}
