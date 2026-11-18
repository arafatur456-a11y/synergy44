import { NextResponse } from 'next/server';
import { sanitizeLines } from '@/lib/checkout';
import { buildQuote } from '@/lib/checkout-server';
import { isWooConfigured, WooError } from '@/lib/woocommerce';
import { clientIp, rateLimited } from '@/lib/rate-limit';

/**
 * POST /api/checkout/quote  { lines: [{ wcId, qty }] }
 * Returns live WooCommerce prices, stock and availability for the bag.
 */
export async function POST(req: Request) {
  if (!isWooConfigured()) return NextResponse.json({ error: 'Online checkout is not configured.' }, { status: 503 });
  if (rateLimited(`quote:${clientIp(req)}`, 60, 60_000)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

  const body = await req.json().catch(() => null);
  const lines = sanitizeLines(body?.lines);
  if (!lines) return NextResponse.json({ error: 'Your bag could not be read.' }, { status: 400 });

  try {
    return NextResponse.json(await buildQuote(lines), { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[checkout/quote]', err);
    const status = err instanceof WooError && err.status < 500 ? 502 : 503;
    return NextResponse.json({ error: 'We couldn’t reach the store just now. Please try again in a moment.' }, { status });
  }
}
