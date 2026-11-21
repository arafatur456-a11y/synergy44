/**
 * Haircut package booking — shared by the concierge booking flow (client) and /api/booking (server).
 * Packages are built from the salon menu in lib/data.ts so prices never drift between pages.
 */
import { serviceGroups } from './data';
import { site } from './site';

export type HaircutPackage = {
  id: string;
  name: string;
  includes: string;
  price: string;
  duration: string;
  audience: 'Women' | 'Men' | 'Everyone';
};

const svc = (group: string, name: string) => serviceGroups.find((g) => g.id === group)?.services.find((s) => s.name === name);

function pkg(id: string, audience: HaircutPackage['audience'], group: string, name: string, extra?: Partial<HaircutPackage>): HaircutPackage | null {
  const s = svc(group, name);
  if (!s) return null;
  return { id, name: s.name, includes: s.detail, price: s.price, duration: s.duration ?? '', audience, ...extra };
}

export const haircutPackages: HaircutPackage[] = [
  pkg('womens-cut', 'Women', 'women', 'Women’s Haircut'),
  pkg('cut-blowout', 'Women', 'women', 'Haircut & Blowout'),
  pkg('cut-bond', 'Everyone', 'women', 'Women’s Haircut', {
    name: 'Cut & Bond Repair Ritual',
    includes: 'Precision cut, Olaplex bond treatment & finish',
    price: '$100',
    duration: '80 min',
  }),
  pkg('mens-cut', 'Men', 'men', 'Men’s Haircut'),
  pkg('mens-cut-beard', 'Men', 'men', 'Men’s Haircut', {
    name: 'Cut & Beard Shape-Up',
    includes: 'Consultation, wash, cut, style & beard line-up',
    price: '$55',
    duration: '60 min',
  }),
  pkg('clipper-cut', 'Men', 'men', 'Clipper Cut'),
].filter((p): p is HaircutPackage => p !== null);

export const timeWindows = [
  { value: 'morning', label: 'Morning', hint: '9 am – 12 pm' },
  { value: 'afternoon', label: 'Afternoon', hint: '12 – 4 pm' },
  { value: 'evening', label: 'Evening', hint: '4 – 7 pm' },
  { value: 'flexible', label: 'Flexible', hint: 'Any time' },
] as const;

export type TimeWindow = (typeof timeWindows)[number]['value'];
export const bookingLocations = site.locations;

export type BookingPayload = {
  packageId: string;
  date: string; // YYYY-MM-DD
  window: TimeWindow;
  location: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  /** Honeypot — must stay empty */
  company?: string;
};

export type BookingErrors = Partial<Record<keyof BookingPayload, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Local calendar date (YYYY-MM-DD), offset by `days`. */
export function isoDay(days = 0, from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function validateBooking(input: Partial<BookingPayload>): BookingErrors {
  const e: BookingErrors = {};
  if (!haircutPackages.some((p) => p.id === input.packageId)) e.packageId = 'Please choose a package.';
  const date = input.date ?? '';
  // Allow "yesterday" to absorb time-zone differences between the visitor and the server.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) e.date = 'Please choose a preferred date.';
  else if (date < isoDay(-1) || date > isoDay(180)) e.date = 'Please choose a date within the next six months.';
  if (!timeWindows.some((w) => w.value === input.window)) e.window = 'Please choose a time window.';
  if (!bookingLocations.includes(input.location ?? '')) e.location = 'Please choose a studio.';
  const name = input.name?.trim() ?? '';
  if (name.length < 2 || name.length > 120) e.name = 'Please share your name.';
  const email = input.email?.trim() ?? '';
  const phone = input.phone?.trim() ?? '';
  if (email && !EMAIL.test(email)) e.email = 'Please enter a valid email address.';
  if (phone && !/^[\d\s()+.-]{7,20}$/.test(phone)) e.phone = 'Please enter a valid phone number.';
  if (!email && !phone) e.email = 'Add an email or phone number so we can confirm.';
  if ((input.notes?.length ?? 0) > 1000) e.notes = 'Please keep notes under 1,000 characters.';
  return e;
}

export const packageById = (id: string) => haircutPackages.find((p) => p.id === id);
export const windowLabel = (w: string) => timeWindows.find((t) => t.value === w);

export function formatBookingDate(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
