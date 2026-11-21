/**
 * Server-side checkout logic. Prices, stock and purchasability always come from a fresh
 * (uncached) WooCommerce read — the browser only ever supplies product IDs + quantities.
 *
 * Shipping: WooCommerce's REST API does not run shipping-zone calculation when an order is
 * created, so a single shipping line can be configured here:
 *   WC_SHIPPING_METHOD_ID     e.g. flat_rate        (must exist in WooCommerce → Shipping)
 *   WC_SHIPPING_METHOD_TITLE  e.g. Standard shipping
 *   WC_SHIPPING_TOTAL         e.g. 8.00
 *   WC_FREE_SHIPPING_MIN      optional subtotal at which shipping becomes free
 * Leave them unset to create orders without a shipping line (e.g. local pickup only).
 * Taxes are calculated by WooCommerce from its own tax settings when the order is created.
 */
import { createWooOrder, decode, fetchWooProductsByIds, fetchWooVariationsByIds, type WooOrder } from './woocommerce';
import type { CheckoutCustomer, CheckoutLine, Quote, QuoteLine } from './checkout';

const round = (n: number) => Math.round(n * 100) / 100;

function shippingFor(subtotal: number): Quote['shipping'] {
  const id = process.env.WC_SHIPPING_METHOD_ID;
  const total = Number(process.env.WC_SHIPPING_TOTAL);
  if (!id || !Number.isFinite(total)) return null;
  const freeMin = Number(process.env.WC_FREE_SHIPPING_MIN);
  const free = Number.isFinite(freeMin) && freeMin > 0 && subtotal >= freeMin;
  return { title: process.env.WC_SHIPPING_METHOD_TITLE || 'Shipping', total: free ? 0 : round(total) };
}

export async function buildQuote(lines: CheckoutLine[]): Promise<Quote> {
  const products = await fetchWooProductsByIds([...new Set(lines.map((l) => l.wcId))]);
  const byId = new Map(products.map((p) => [p.id, p]));

  // Fresh variation data for every variable line, grouped per parent product
  const variationIdsByParent = new Map<number, number[]>();
  for (const l of lines) if (l.variationId) variationIdsByParent.set(l.wcId, [...(variationIdsByParent.get(l.wcId) ?? []), l.variationId]);
  const variations = new Map<number, Awaited<ReturnType<typeof fetchWooVariationsByIds>>[number]>();
  await Promise.all(
    [...variationIdsByParent].map(async ([parent, ids]) => (await fetchWooVariationsByIds(parent, ids)).forEach((v) => variations.set(v.id, v))),
  );

  const quoteLines: QuoteLine[] = lines.map(({ wcId, variationId, qty }) => {
    const p = byId.get(wcId);
    if (!p || p.status !== 'publish') {
      return { wcId, variationId, name: 'Unavailable item', qty, unitPrice: 0, lineTotal: 0, available: false, maxQty: 0, issue: 'No longer available' };
    }
    const v = variationId ? variations.get(variationId) : undefined;
    // A variation stands in for its parent's price / stock / purchasability
    const src = v ?? p;
    const unitPrice = Number(src.price) || 0;
    const name = v ? `${decode(p.name)} — ${v.attributes.map((a) => a.option).filter(Boolean).join(' / ')}` : decode(p.name);
    const base = { wcId, variationId, name, qty, unitPrice, lineTotal: round(unitPrice * qty), permalink: p.permalink };

    if (p.type === 'variable' && !v) {
      return { ...base, available: false, maxQty: null, issue: variationId ? 'This option is no longer available' : 'Choose options on the product page' };
    }
    if (!src.purchasable || unitPrice <= 0) return { ...base, available: false, maxQty: 0, issue: 'Not available for online purchase' };
    if (src.stock_status === 'outofstock') return { ...base, available: false, maxQty: 0, issue: 'Sold out' };
    if (typeof src.stock_quantity === 'number' && src.stock_quantity >= 0 && src.stock_quantity < qty && src.stock_status !== 'onbackorder') {
      return { ...base, available: false, maxQty: src.stock_quantity, issue: src.stock_quantity === 0 ? 'Sold out' : `Only ${src.stock_quantity} left` };
    }
    return { ...base, available: true, maxQty: typeof src.stock_quantity === 'number' ? src.stock_quantity : null };
  });

  const subtotal = round(quoteLines.filter((l) => l.available).reduce((n, l) => n + l.lineTotal, 0));
  const shipping = shippingFor(subtotal);
  return {
    ok: quoteLines.every((l) => l.available),
    currency: 'USD',
    lines: quoteLines,
    subtotal,
    shipping,
    estimatedTotal: round(subtotal + (shipping?.total ?? 0)),
  };
}

/** Call only with a quote from buildQuote() whose `ok` is true. */
export async function placeOrder(lines: CheckoutLine[], c: CheckoutCustomer, quote: Quote): Promise<WooOrder> {
  const address = {
    first_name: c.firstName.trim(),
    last_name: c.lastName.trim(),
    address_1: c.address1.trim(),
    address_2: c.address2?.trim() ?? '',
    city: c.city.trim(),
    state: c.state,
    postcode: c.postcode.trim(),
    country: c.country,
  };
  const shipping = quote.shipping;

  return createWooOrder({
    billing: { ...address, email: c.email.trim(), phone: c.phone?.trim() ?? '' },
    shipping: address,
    line_items: lines.map((l) => ({ product_id: l.wcId, ...(l.variationId ? { variation_id: l.variationId } : {}), quantity: l.qty })),
    shipping_lines: shipping ? [{ method_id: process.env.WC_SHIPPING_METHOD_ID!, method_title: shipping.title, total: shipping.total.toFixed(2) }] : undefined,
    customer_note: c.note?.trim() || undefined,
  });
}
