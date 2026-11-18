/**
 * Editorial content. ⚠️ Placeholders to confirm with the client before launch:
 *  - service prices & durations
 *  - testimonial quotes (replace with clients' verbatim reviews, with permission)
 *  - guarantee wording and biography details
 */

export type Service = { name: string; detail: string; price: string; duration?: string };
export type ServiceGroup = { id: string; title: string; note?: string; services: Service[] };

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'women',
    title: 'Women’s Haircuts',
    services: [
      { name: 'Women’s Haircut', detail: 'Consultation, wash, precision cut & finish', price: '$65', duration: '60 min' },
      { name: 'Haircut & Blowout', detail: 'Cut with a smoothing, volumizing blowout', price: '$85', duration: '75 min' },
      { name: 'Fringe / Bang Trim', detail: 'Between-visit refresh', price: '$15', duration: '15 min' },
    ],
  },
  {
    id: 'men',
    title: 'Men’s Haircuts',
    services: [
      { name: 'Men’s Haircut', detail: 'Consultation, wash, cut & style', price: '$40', duration: '45 min' },
      { name: 'Clipper Cut', detail: 'Clean, single-guard or tapered cut', price: '$30', duration: '30 min' },
      { name: 'Beard Shape-Up', detail: 'Line-up and trim', price: '$20', duration: '20 min' },
    ],
  },
  {
    id: 'color',
    title: 'Hi-Lights & Color',
    note: 'Color services include a strand-health consultation.',
    services: [
      { name: 'Partial Hi-Lights', detail: 'Face-framing & crown placement', price: 'from $95', duration: '90 min' },
      { name: 'Full Hi-Lights', detail: 'Dimensional, all-over lightening', price: 'from $140', duration: '2 hr' },
      { name: 'Glaze', detail: 'Tone, shine & color refresh', price: 'from $45', duration: '30 min' },
      { name: 'Roots', detail: 'Root touch-up, up to 1.5"', price: 'from $70', duration: '75 min' },
    ],
  },
  {
    id: 'treat',
    title: 'Treatments',
    services: [
      { name: 'Olaplex Bond Treatment', detail: 'Add-on to any service', price: '$35', duration: '20 min' },
      { name: 'Botanical Deep Condition', detail: 'Hydrating masque & scalp massage', price: '$30', duration: '20 min' },
    ],
  },
];

export type Testimonial = { name: string; context: string; quote: string };

export const testimonials: Testimonial[] = [
  { name: 'Lisa Mary', context: 'Salon client', quote: 'My hair has never felt healthier. Cynthia truly listens, and the organic products she recommended changed my whole routine.' },
  { name: 'Ru Knoedler', context: 'Salon & jewelry client', quote: 'An artist in every sense — with color, with cuts, and with glass. My pendant catches the light everywhere I go.' },
  { name: 'Salon Guest', context: 'Hi-lights & glaze', quote: 'Warm, knowledgeable and genuinely invested in the health of my hair. I leave every appointment feeling renewed.' },
  { name: 'Jewelry Collector', context: 'Dichroic glass', quote: 'Each piece is completely unique. The colors shift with the light — beautiful craftsmanship.' },
];

export type Pillar = { title: string; body: string; icon: 'leaf' | 'shield' | 'sparkle' | 'heart' };

export const guarantee: Pillar[] = [
  { icon: 'shield', title: 'Satisfaction, guaranteed', body: 'If a product or service isn’t right for you, talk to us — we’ll make it right.' },
  { icon: 'leaf', title: 'Clean, considered formulas', body: 'We curate organic, vegan-forward lines and avoid harsh, unnecessary ingredients.' },
  { icon: 'sparkle', title: 'Truly handmade', body: 'Every glass pendant is cut, layered and kiln-fired by hand — no two are alike.' },
  { icon: 'heart', title: 'Professional care', body: 'Guidance from a licensed cosmetologist who puts the health of your hair first.' },
];

export type Milestone = { phase: string; title: string; body: string };

export const milestones: Milestone[] = [
  { phase: 'Foundation', title: 'Eastern Michigan University', body: 'Cynthia’s studies at Eastern Michigan University grounded her in art, color and form — the same eye that guides every cut, color and kiln firing.' },
  { phase: 'Craft', title: 'Licensed cosmetologist', body: 'Professional training and years behind the chair, recorded in her professional cosmetology journals — a practice built on technique, listening and care.' },
  { phase: 'Philosophy', title: 'The Hair Healers', body: 'A commitment to healthier hair through clean chemistry — curating organic, vegan lines alongside proven bond-repair science.' },
  { phase: 'Artistry', title: 'The glass studio', body: 'Layer by layer, dichroic glass is cut, stacked and kiln-fused into wearable art — each pendant one of a kind.' },
];
