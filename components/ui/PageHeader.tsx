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
  /** Not rendered (kept for compatibility); the breadcrumb and title carry the context. */
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  scene?: ReactNode;
  /** @deprecated kept for compatibility */
  tint?: string;
}) {
  return (
    <section>
      <div className="grid lg:min-h-[560px] lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-20 lg:pl-[max(3rem,calc((100vw-1320px)/2+3rem))] lg:pr-16">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-10 text-[14px] text-stone-500">
              <ol className="flex flex-wrap items-center gap-2.5">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.label} className="flex items-center gap-2.5">
                    <span aria-hidden>/</span>
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
            <h1 className="display-xl max-w-[14ch] text-balance">{title}</h1>
            {intro && <p className="lead mt-7">{intro}</p>}
          </Reveal>
          {children && <Reveal delay={0.12}>{children}</Reveal>}
        </div>
        {scene && (
          <Reveal className="relative mx-4 mb-4 min-h-[340px] overflow-hidden rounded-media sm:mx-8 sm:min-h-[460px] lg:mx-0 lg:mb-6 lg:mr-6 lg:mt-6 lg:min-h-0">
            <div className="absolute inset-0">{scene}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
