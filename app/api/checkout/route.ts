import { NextResponse } from 'next/server';
import { sanitizeLines, validateCustomer, type CheckoutCustomer, type CheckoutResult } from '@/lib/checkout';
import { buildQuote, placeOrder } from '@/lib/checkout-server';
import { isWooConfigured, WooError } from '@/lib/woocommerce';
import { clientIp, rateLimited } from '@/lib/rate-limit';

/**
 * POST /api/checkout  { lines: [{ wcId, qty }], customer: CheckoutCustomer }
 *
 * 1. Validates the customer details and re-quotes every line against live WooCommerce data.
 * 2. Creates a *pending* order through the REST API (WooCommerce prices it; taxes applied by WC).
 * 3. Returns WooCommerce's own `payment_url` — the customer pays there with the store's
 *    configured gateways, so card data never touches this application.
 */
export async function POST(req: Request) {
  if (!isWooConfigured()) return NextResponse.json({ error: 'Online checkout is not configured.' }, { status: 503 });
  if (rateLimited(`checkout:${clientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many checkout attempts — please wait a few minutes.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const lines = sanitizeLines(body?.lines);
  const customer = (body?.customer ?? {}) as CheckoutCustomer;
  if (!lines) return NextResponse.json({ error: 'Your bag could not be read.' }, { status: 400 });

  // Honeypot: bots fill hidden fields — reject quietly without creating anything.
  if (customer.company) return NextResponse.json({ error: 'Unable to place order.' }, { status: 400 });

  const errors = validateCustomer(customer);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  try {
    const quote = await buildQuote(lines);
    if (!quote.ok) {
      return NextResponse.json({ error: 'Some items in your bag have changed. Please review them.', quote }, { status: 409 });
    }

    const order = await placeOrder(lines, customer, quote);
    if (!order.payment_url) throw new Error(`Order ${order.id} created without a payment_url`);

    const result: CheckoutResult = { orderId: order.id, orderNumber: order.number, paymentUrl: order.payment_url };
    return NextResponse.json(result, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[checkout]', err);
    const message =
      err instanceof WooError && err.status === 400
        ? 'The store couldn’t accept this order. Please check your details or contact us.'
        : 'We couldn’t reach the store just now. Your card has not been charged — please try again.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
