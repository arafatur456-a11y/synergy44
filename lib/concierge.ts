/**
 * AI Beauty & Jewelry Concierge — shared (client-safe) pieces.
 *
 * Replies are plain text. The model (or the offline guide) references catalog items and
 * actions with inline markers that the drawer turns into cards and buttons:
 *   [[product:<slug>]]   a hair-care product or glass pendant from the live catalog
 *   [[book]]             opens the haircut package booking flow
 *   [[newsletter]]       opens the newsletter sign-up
 */

export type ConciergeItem = {
  slug: string;
  href: string;
  name: string;
  /** Brand name for hair care, collection for glass */
  subtitle: string;
  kind: 'hair' | 'glass';
  price: number;
  image?: string;
  colors: string[];
  inStock: boolean;
};

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export type Segment =
  | { type: 'text'; text: string }
  | { type: 'product'; slug: string }
  | { type: 'book' }
  | { type: 'newsletter' };

const MARKER = /\[\[(product:[^\]\s]+|book|newsletter)\]\]/g;

/** Split a (possibly still-streaming) reply into text and marker segments. */
export function parseReply(reply: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  // Hide a half-streamed marker at the very end ("[[prod…") until it completes.
  const safe = reply.replace(/\[\[[^\]]*\]?$/, '');
  for (const m of safe.matchAll(MARKER)) {
    if (m.index! > last) out.push({ type: 'text', text: safe.slice(last, m.index) });
    const tag = m[1];
    if (tag === 'book') out.push({ type: 'book' });
    else if (tag === 'newsletter') out.push({ type: 'newsletter' });
    else out.push({ type: 'product', slug: tag.slice('product:'.length) });
    last = m.index! + m[0].length;
  }
  if (last < safe.length) out.push({ type: 'text', text: safe.slice(last) });
  return out;
}

export const starterPrompts = [
  'My color-treated hair feels dry and breaks easily',
  'Fine, flat hair — what adds volume?',
  'A glass pendant gift for my mom',
  'Tell me about Cynthia and the glass',
  'Book a haircut package',
];

export const CONCIERGE_EVENT = 's44:concierge';
export type ConciergeOpen = { tab?: 'chat' | 'book'; prompt?: string };

/** Open the concierge from anywhere: `openConcierge({ tab: 'book' })`. */
export function openConcierge(detail: ConciergeOpen = {}) {
  window.dispatchEvent(new CustomEvent<ConciergeOpen>(CONCIERGE_EVENT, { detail }));
}

export const CHAT_LIMITS = { turns: 16, chars: 1500 } as const;
