import type { Pendant } from './types';

/** Pure helpers that are safe to import from client components (no server credentials). */
export const collectionsOf = (list: Pendant[]) => Array.from(new Set(list.map((p) => p.collection)));
