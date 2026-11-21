/**
 * Concierge — server side: catalog grounding, the system prompt, and the offline "guide"
 * that answers with rule-based recommendations when no ANTHROPIC_API_KEY is configured.
 */
import { brands, getBrand, milestones } from './data';
import { getPendants, getProducts } from './catalog';
import { productHref } from './catalog-utils';
import { haircutPackages } from './booking';
import { site } from './site';
import type { ConciergeItem } from './concierge';
import type { Pendant, Product } from './types';

type Indexed = ConciergeItem & { brandSlug?: string; category?: string; description: string; collection?: string };

const MAX_ITEMS = 160;

function fromProduct(p: Product): Indexed {
  return {
    slug: p.slug ?? p.id,
    href: productHref(p),
    name: p.name,
    subtitle: getBrand(p.brand)?.name ?? p.brand,
    kind: 'hair',
    price: p.price,
    image: p.image,
    colors: p.colors,
    inStock: p.inStock !== false,
    brandSlug: p.brand,
    category: p.category,
    description: p.description,
  };
}

function fromPendant(p: Pendant): Indexed {
  return {
    slug: p.slug ?? p.id,
    href: productHref(p),
    name: p.name,
    subtitle: p.collection,
    kind: 'glass',
    price: p.price,
    image: p.image,
    colors: p.colors,
    inStock: p.inStock !== false,
    collection: p.collection,
    description: p.description,
  };
}

/** The concierge's view of the catalog (same ISR-cached source the pages use). */
export async function conciergeCatalog(): Promise<Indexed[]> {
  const [products, pendants] = await Promise.all([getProducts().catch(() => []), getPendants().catch(() => [])]);
  // Pendants first so one-of-a-kind glass is never cut by the cap on a large hair catalog.
  return [...pendants.map(fromPendant), ...products.map(fromProduct)].slice(0, MAX_ITEMS);
}

export const publicItem = ({ slug, href, name, subtitle, kind, price, image, colors, inStock }: Indexed): ConciergeItem => ({
  slug, href, name, subtitle, kind, price, image, colors, inStock,
});

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

// ── System prompt ────────────────────────────────────────────────────────────

const INSTRUCTIONS = `You are the Synergy 44 Concierge, the beauty and jewelry advisor for ${site.name} (${site.url}): organic, vegan-forward hair care, salon services by appointment in ${site.locations.join(' and ')}, and handmade dichroic glass jewelry by the artist and licensed cosmetologist Cynthia Reedy.

Voice: warm, knowledgeable and unhurried, like a trusted stylist. Write in plain conversational prose with short paragraphs. A short "- " list is fine when comparing options. No headings, tables, emoji or markdown emphasis. Keep most replies under 120 words.

What you help with:
1. Hair care. Ask at most one clarifying question if hair type or the main concern is unclear (texture, thickness, color-treated or not, dryness, breakage, frizz, oiliness, heat styling). Then suggest a simple routine of 1–3 products and say briefly why each one fits.
2. Dichroic glass jewelry. Suggest pieces by color, mood, occasion or recipient, and give gift and styling ideas: chain length, necklines, pairing with metals and outfits, and how the colors shift in the light. Every pendant is one of a kind.
3. The artist's story, using only the facts in the About section below.
4. Haircut packages. When someone wants to book or asks about cuts, describe the fitting package and add the [[book]] marker so they can open the booking form. Never collect names, emails, phone numbers or dates in chat; the form handles that. You cannot see availability or confirm appointments; the studio confirms personally.

Product rules:
- Recommend only items from the catalog below. Reference each one with its marker on its own line, exactly [[product:SLUG]]. Use the slug, not the name. The site renders the marker as a card with the photo, price and a link, so don't repeat the price in your text.
- At most 3 product markers per reply. Prefer items marked in stock, and only mention sold-out items if asked about them.
- Never invent products, prices, ingredients, discounts, shipping terms or policies. If something isn't in the catalog or the facts below, say so and offer to connect them with the studio through the contact page (/contact).
- No medical or dermatological claims. For scalp conditions, hair loss or allergies, suggest seeing a professional and offer a salon consultation.
- If someone wants updates on new glass or hair rituals, you may add [[newsletter]].
- Politely steer unrelated requests back to hair, beauty, jewelry or the studio.

About Synergy 44 and Cynthia Reedy:
${milestones.map((m) => `- ${m.phase}: ${m.title}. ${m.body}`).join('\n')}
- The Synergy 44 Guarantee: satisfaction guaranteed, clean considered formulas, truly handmade glass, and personal care.
- Salon visits are by appointment.

Brands carried:
${brands.map((b) => `- ${b.name}: ${b.tagline}. ${b.description}`).join('\n')}

Haircut packages (bookable through [[book]]; prices are the current salon menu):
${haircutPackages.map((p) => `- ${p.name} (${p.audience}): ${p.includes}. ${p.price}, ${p.duration}.`).join('\n')}`;

export function buildSystem(catalog: Indexed[]) {
  const lines = catalog.map((i) =>
    [
      i.slug,
      i.name,
      i.kind === 'glass' ? `Dichroic glass pendant, ${i.collection} collection` : `${i.subtitle}, ${i.category}`,
      `$${i.price}`,
      i.inStock ? 'in stock' : 'sold out',
      clip(i.description.replace(/\s+/g, ' '), 160),
    ].join(' | '),
  );
  return { instructions: INSTRUCTIONS, catalog: `Catalog (slug | name | type | price | stock | notes):\n${lines.join('\n')}` };
}

// ── Offline guide (no API key) ───────────────────────────────────────────────

type Rule = { test: RegExp; brands?: string[]; categories?: string[]; words?: RegExp; lead: string };

const HAIR_RULES: Rule[] = [
  { test: /damag|break|brittle|bleach|blond|lighten|bond|split|snap|over.?process|chemical/, brands: ['olaplex'], lead: 'For breakage and color- or bleach-stressed hair, I’d start by rebuilding strength. Bond repair restores the hair’s internal structure, and a gentle, moisturizing cleanse keeps it there.' },
  { test: /dry|frizz|thirst|moistur|hydrat|coarse|rough|dull/, brands: ['neuma', 'loma', 'mks-eco'], words: /moist|hydrat|oil|masque|leave|condition/i, lead: 'For dryness and frizz, layer moisture: a hydrating cleanse and conditioner, then something that seals it in.' },
  { test: /curl|wave|coil|texture|bounce/, brands: ['mks-eco', 'neuma', 'loma'], words: /curl|bounce|texture|leave|crème|creme|moist/i, lead: 'Curls and waves love slip and light, flexible definition. Moisture first, then a definer that won’t leave them crunchy.' },
  { test: /fine|thin|flat|limp|volume|lift|body/, brands: ['loma', 'mks-eco'], categories: ['Cleanse', 'Style'], words: /daily|bounce|spray|shampoo|leave/i, lead: 'Fine hair does best with lightweight formulas. Skip heavy creams and choose a clean cleanse and an airy styler for lift.' },
  { test: /oily|greasy|scalp|buildup|build-up/, brands: ['loma', 'olaplex'], categories: ['Cleanse'], lead: 'For an oily scalp, a balancing, gentle daily cleanse usually works better than stripping it. Ask us about a scalp consultation if it’s irritated.' },
  { test: /color|colour|dye|tone|brass|fade/, brands: ['olaplex', 'mks-eco', 'neuma'], words: /bond|color|moist|condition/i, lead: 'To keep color vivid, cleanse gently, condition well and protect the bonds between salon visits.' },
  { test: /heat|blow|dryer|straight|flat iron|curling|tool|iron|wand|style fast|sleek/, brands: ['gama', 'sutra', 'olaplex'], categories: ['Tools', 'Treat'], words: /dryer|iron|wand|oil/i, lead: 'For heat styling, pair a professional tool with a protective finishing oil. Smooth results with less stress on the hair.' },
  { test: /makeup|make-up|mascara|face|skin|remov|travel|low.?waste/, brands: ['goomee'], lead: 'For a gentle, low-waste ritual, our reusable removal pads lift makeup with just water.' },
];

const GLASS_PALETTES: [RegExp, RegExp][] = [
  [/green|emerald|forest|moss|nature|earthy/, /fern|tide|aurora|lagoon/i],
  [/blue|ocean|sea|teal|aqua|water/, /lagoon|tide|midnight|ocean/i],
  [/purple|violet|lavender|galaxy|cosmic|space/, /nebula|aurora|midnight|cosmos/i],
  [/pink|rose|blush|soft|romantic|feminine/, /rose|botanica|bloom/i],
  [/warm|orange|amber|gold|copper|fire|sunset|autumn/, /ember|sunstone|fire/i],
  [/bold|statement|dramatic|evening|black/, /midnight|nebula|ember/i],
];

function pick(items: Indexed[], n: number) {
  return [...items.filter((i) => i.inStock), ...items.filter((i) => !i.inStock)].slice(0, n);
}

const markers = (items: Indexed[]) => items.map((i) => `[[product:${i.slug}]]`).join('\n');

export function guideReply(message: string, catalog: Indexed[]): string {
  const q = message.toLowerCase();
  const hair = catalog.filter((i) => i.kind === 'hair');
  const glass = catalog.filter((i) => i.kind === 'glass');

  if (/\b(book|booking|appointment|schedule|reserve|haircut|hair cut|trim|cut)\b/.test(q) && !/pendant|glass|jewel/.test(q)) {
    const lines = haircutPackages.slice(0, 4).map((p) => `- ${p.name}: ${p.includes} (${p.price}, ${p.duration})`);
    return `I’d love to get you in the chair. Our haircut packages:\n${lines.join('\n')}\n\nChoose a package, a preferred day and time window, and how to reach you. The studio will confirm personally.\n[[book]]`;
  }

  if (/cynthia|artist|story|founder|who (makes|made)|about (you|synergy)|kiln|how .*made|process/.test(q)) {
    const [foundation, craft, philosophy, artistry] = milestones;
    return `Synergy 44 is the work of Cynthia Reedy, a licensed cosmetologist and glass artist. ${foundation?.body ?? ''}\n\n${craft?.body ?? ''} ${philosophy?.body ?? ''}\n\n${artistry?.body ?? ''} Would you like to see a few pieces, or hear about our hair rituals?`;
  }

  if (/pendant|glass|jewel|necklace|dichroic|gift|present|birthday|anniversary|mother|mom|wife|sister|friend|her\b/.test(q) && glass.length) {
    const palette = GLASS_PALETTES.find(([t]) => t.test(q));
    const matched = palette ? glass.filter((g) => palette[1].test(`${g.name} ${g.collection} ${g.description}`)) : [];
    const chosen = pick(matched.length ? matched : glass, 3);
    const gift = /gift|present|birthday|anniversary|mother|mom|wife|sister|friend|her\b/.test(q);
    return `${
      gift
        ? 'A dichroic pendant makes a deeply personal gift. Each one is cut, layered and kiln-fused by hand, so no one else will ever wear the same piece.'
        : 'Each pendant is handmade and one of a kind. The dichroic layers shift color as the light and your movement change.'
    } A few I’d look at:\n${markers(chosen)}\n\nStyling note: an 18" chain sits beautifully at a crew or V neckline; go 20–24" over knits. Warm tones glow against gold, while ocean and cosmic tones sing with silver.`;
  }

  const rule = HAIR_RULES.find((r) => r.test.test(q));
  if (rule) {
    let pool = hair.filter((p) => !rule.brands || rule.brands.includes(p.brandSlug ?? ''));
    if (rule.categories) pool = pool.filter((p) => rule.categories!.includes(p.category ?? '')).concat(pool);
    if (rule.words) pool = pool.filter((p) => rule.words!.test(`${p.name} ${p.description}`)).concat(pool);
    const seen = new Set<string>();
    const chosen = pick(pool.filter((p) => !seen.has(p.slug) && seen.add(p.slug)), 3);
    if (chosen.length) {
      return `${rule.lead}\n${markers(chosen)}\n\nTell me a little more, like your texture or how often you heat style, and I can fine-tune this. A salon consultation is always an option too.`;
    }
  }

  return `I can help you build a hair routine (tell me your hair type and main concern), find a dichroic glass pendant or gift, share Cynthia’s story, or book a haircut package. What would you like to explore?`;
}
