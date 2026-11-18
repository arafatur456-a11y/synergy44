import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { CATALOG_TAG } from '@/lib/woocommerce';

/**
 * POST /api/revalidate — WooCommerce webhook receiver.
 *
 * In WordPress → WooCommerce → Settings → Advanced → Webhooks, add webhooks for
 * "Product created", "Product updated" and "Product deleted" with:
 *   Delivery URL: https://<your-site>/api/revalidate
 *   Secret:       the same value as WC_WEBHOOK_SECRET
 * Each delivery is verified (HMAC-SHA256, header X-WC-Webhook-Signature) and then purges the
 * cached catalog so price/stock changes appear on the next request instead of after the
 * ISR window.
 */
export async function POST(req: Request) {
  const secret = process.env.WC_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });

  const raw = await req.text();
  const signature = req.headers.get('x-wc-webhook-signature') ?? '';

  // WooCommerce sends an unsigned form-encoded ping ("webhook_id=…") when a webhook is saved.
  if (!signature && raw.startsWith('webhook_id=')) return NextResponse.json({ ok: true, ping: true });

  const expected = createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  revalidateTag(CATALOG_TAG);
  return NextResponse.json({ ok: true, revalidated: CATALOG_TAG, topic: req.headers.get('x-wc-webhook-topic') });
}
