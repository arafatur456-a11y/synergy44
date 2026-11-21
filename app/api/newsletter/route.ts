import { NextResponse } from 'next/server';
import { validateNewsletter, type NewsletterPayload } from '@/lib/newsletter';
import { postWebhook } from '@/lib/notify';
import { clientIp, rateLimited } from '@/lib/rate-limit';

/**
 * POST /api/newsletter — newsletter sign-ups from the popup and the footer.
 *
 * Providers (configure one or both):
 *   RESEND_API_KEY + RESEND_AUDIENCE_ID — adds the contact to a Resend audience.
 *   NEWSLETTER_WEBHOOK_URL (+ optional NEWSLETTER_WEBHOOK_SECRET) — forwards the sign-up as JSON
 *     (Mailchimp/Klaviyo via Zapier or Make, a WordPress endpoint, a CRM…).
 * Without a provider the sign-up is logged server-side and the visitor sees success.
 */
async function addToResendAudience(email: string, name?: string): Promise<boolean> {
  const { RESEND_API_KEY, RESEND_AUDIENCE_ID } = process.env;
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) return false;
  const res = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(RESEND_AUDIENCE_ID)}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, first_name: name || undefined, unsubscribed: false }),
    signal: AbortSignal.timeout(8000),
  });
  // 409 = already on the list, which is a success from the visitor's point of view
  if (!res.ok && res.status !== 409) throw new Error(`Resend responded ${res.status}`);
  return true;
}

export async function POST(req: Request) {
  let body: Partial<NewsletterPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  if (rateLimited(`newsletter:${clientIp(req)}`, 6, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts — please try again a little later.' }, { status: 429 });
  }

  const errors = validateNewsletter(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const email = body.email!.trim().toLowerCase();
  const name = body.name?.trim() || undefined;
  const source = ['popup', 'footer', 'concierge'].includes(body.source ?? '') ? body.source : 'popup';

  const results = await Promise.allSettled([
    addToResendAudience(email, name),
    postWebhook(process.env.NEWSLETTER_WEBHOOK_URL, { type: 'newsletter.subscribed', email, name, source, at: new Date().toISOString() }, process.env.NEWSLETTER_WEBHOOK_SECRET),
  ]);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
  failed.forEach((f) => console.error('[newsletter] provider failed', f.reason));

  if (!delivered && failed.length) {
    return NextResponse.json({ ok: false, error: 'We couldn’t add you just now. Please try again shortly.' }, { status: 502 });
  }
  if (!delivered) console.info('[newsletter] No provider configured — sign-up received:', { email, name, source });
  return NextResponse.json({ ok: true });
}
