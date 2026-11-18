export const site = {
  name: 'Synergy 44',
  url: 'https://synergy44.com',
  tagline: 'Organic hair care, salon artistry & handmade dichroic glass',
  locations: ['Michigan', 'California'],
  /** Set a real inbox to show it on /contact. Left empty so nothing unverified is published. */
  contactEmail: '',
  hours: 'Salon visits by appointment',
};

export type NavItem = { label: string; href: string; mega?: boolean };

export const nav: NavItem[] = [
  { label: 'Hair Care', href: '/products/hair-care', mega: true },
  { label: 'Glass Jewelry', href: '/jewelry' },
  { label: 'Hair Styling', href: '/hair-styling' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
