import type { Pendant } from './types';

/** Pure helpers that are safe to import from client components (no server credentials). */
export const collectionsOf = (list: Pendant[]) => Array.from(new Set(list.map((p) => p.collection)));

/** Canonical URL of a product or pendant page. */
export const productHref = (p: { slug?: string; id: string }) => `/product/${encodeURIComponent(p.slug ?? p.id)}`;
