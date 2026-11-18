import Link from 'next/link';
import type { ReactNode } from 'react';
import Reveal from './Reveal';

/**
 * Split editorial page header: bold title on the left, an art-directed scene on the right.
 */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
  scene,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  scene?: ReactNode;
  /** @deprecated kept for compatibility */
  tint?: string;
}) {
  return (
    <section className="border-b border-ink/10">
      <div className="grid lg:min-h-[560px] lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center px-5 py-14 sm:px-8 sm:py-20 lg:pl-[max(3rem,calc((100vw-1380px)/2+3rem))] lg:pr-16">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-12 text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso-500">
              <ol className="flex flex-wrap items-center gap-2.5">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.label} className="flex items-center gap-2.5">
                    <span aria-hidden className="h-px w-4 bg-espresso-400" />
                    {c.href ? (
                      <Link href={c.href} className="transition-colors hover:text-ink">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-ink">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="display-xl mt-6 text-balance">{title}</h1>
            {intro && <p className="lead mt-7 max-w-xl">{intro}</p>}
          </Reveal>
          {children && <Reveal delay={0.12}>{children}</Reveal>}
        </div>
        {scene && (
          <Reveal y={0} className="relative min-h-[360px] overflow-hidden sm:min-h-[460px] lg:min-h-0">
            <div className="absolute inset-0">{scene}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
