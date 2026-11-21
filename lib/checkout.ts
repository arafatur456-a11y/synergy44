/**
 * Checkout contract shared by the client form and the server routes.
 * No secrets or server imports here — safe for client components.
 */

export const MAX_QTY_PER_LINE = 10;
export const MAX_LINES = 30;

/** What the browser sends: product IDs and quantities only. Never prices. */
export type CheckoutLine = { wcId: number; variationId?: number; qty: number };

export type CheckoutCustomer = {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: 'US';
  note?: string;
  /** Honeypot — must stay empty */
  company?: string;
};

export type QuoteLine = {
  wcId: number;
  variationId?: number;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  /** false when the item can't be bought as requested */
  available: boolean;
  /** Highest quantity WooCommerce will sell right now (null = unlimited) */
  maxQty: number | null;
  issue?: string;
  permalink?: string;
};

export type Quote = {
  ok: boolean;
  currency: 'USD';
  lines: QuoteLine[];
  subtotal: number;
  shipping: { title: string; total: number } | null;
  /** Taxes are calculated by WooCommerce on the payment page */
  estimatedTotal: number;
};

export type CheckoutResult = { orderId: number; orderNumber: string; paymentUrl: string };

export type CustomerErrors = Partial<Record<keyof CheckoutCustomer, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCustomer(c: Partial<CheckoutCustomer>): CustomerErrors {
  const e: CustomerErrors = {};
  const req = (k: keyof CheckoutCustomer, label: string, max = 120) => {
    const v = String(c[k] ?? '').trim();
    if (!v) e[k] = `${label} is required.`;
    else if (v.length > max) e[k] = `${label} is too long.`;
  };
  if (!EMAIL.test(String(c.email ?? '').trim())) e.email = 'Enter a valid email address.';
  req('firstName', 'First name');
  req('lastName', 'Last name');
  req('address1', 'Address', 200);
  req('city', 'City');
  if (!US_STATES.some(([code]) => code === c.state)) e.state = 'Choose a state.';
  if (!/^\d{5}(-\d{4})?$/.test(String(c.postcode ?? '').trim())) e.postcode = 'Enter a valid ZIP code.';
  if (c.phone && !/^[\d\s()+.-]{7,20}$/.test(c.phone)) e.phone = 'Enter a valid phone number.';
  if (c.note && c.note.length > 1000) e.note = 'Please keep notes under 1,000 characters.';
  if (c.country !== 'US') e.country = 'We currently ship within the United States.';
  return e;
}

/** Normalizes untrusted line input; returns null if it's malformed. */
export function sanitizeLines(raw: unknown): CheckoutLine[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_LINES) return null;
  const merged = new Map<string, CheckoutLine>();
  for (const l of raw) {
    const wcId = Number((l as CheckoutLine)?.wcId);
    const qty = Number((l as CheckoutLine)?.qty);
    const rawVid = (l as CheckoutLine)?.variationId;
    const variationId = rawVid === undefined || rawVid === null ? undefined : Number(rawVid);
    if (!Number.isInteger(wcId) || wcId <= 0 || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) return null;
    if (variationId !== undefined && (!Number.isInteger(variationId) || variationId <= 0)) return null;
    const key = `${wcId}:${variationId ?? 0}`;
    const prev = merged.get(key);
    merged.set(key, { wcId, variationId, qty: Math.min(MAX_QTY_PER_LINE, (prev?.qty ?? 0) + qty) });
  }
  return [...merged.values()];
}

export const US_STATES: [string, string][] = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'],
  ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'],
  ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];
