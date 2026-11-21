import { NextResponse } from 'next/server';
import { formatBookingDate, packageById, validateBooking, windowLabel, type BookingPayload } from '@/lib/booking';
import { emailStudio, escapeHtml, htmlTable, postWebhook } from '@/lib/notify';
import { clientIp, rateLimited } from '@/lib/rate-limit';

/**
 * POST /api/booking — haircut package booking requests (from the concierge).
 *
 * Delivery, in order of preference (any that are configured run; at least one must succeed):
 *   BOOKING_WEBHOOK_URL (+ optional BOOKING_WEBHOOK_SECRET as a Bearer token) — your booking
 *     system, Zapier/Make hook or CRM receives the JSON request.
 *   RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL — the studio gets an email.
 * With neither configured the request is logged server-side and the visitor still gets a
 * confirmation that it was received (the studio follows up personally).
 */
export async function POST(req: Request) {
  let body: Partial<BookingPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const reference = `S44-${Date.now().toString(36).slice(-5).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
  if (body.company) return NextResponse.json({ ok: true, reference }); // honeypot

  if (rateLimited(`booking:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Too many requests — please try again a little later.' }, { status: 429 });
  }

  const errors = validateBooking(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const b = body as BookingPayload;
  const pkg = packageById(b.packageId)!;
  const request = {
    reference,
    submittedAt: new Date().toISOString(),
    package: { id: pkg.id, name: pkg.name, price: pkg.price, duration: pkg.duration },
    preferredDate: b.date,
    timeWindow: b.window,
    location: b.location,
    customer: { name: b.name.trim(), email: b.email?.trim() || undefined, phone: b.phone?.trim() || undefined },
    notes: b.notes?.trim() || undefined,
  };

  const rows: [string, string | undefined][] = [
    ['Reference', reference],
    ['Package', `${pkg.name} (${pkg.price} · ${pkg.duration})`],
    ['Preferred date', formatBookingDate(b.date)],
    ['Time window', `${windowLabel(b.window)?.label} (${windowLabel(b.window)?.hint})`],
    ['Studio', b.location],
    ['Name', request.customer.name],
    ['Email', request.customer.email],
    ['Phone', request.customer.phone],
  ];

  const results = await Promise.allSettled([
    postWebhook(process.env.BOOKING_WEBHOOK_URL, { type: 'booking.requested', ...request }, process.env.BOOKING_WEBHOOK_SECRET),
    emailStudio({
      subject: `Booking request ${reference}: ${pkg.name} — ${request.customer.name}`,
      replyTo: request.customer.email,
      html: `<h2 style="font-family:Georgia,serif">New booking request</h2>${htmlTable(rows)}${
        request.notes ? `<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(request.notes)}</p>` : ''
      }`,
    }),
  ]);

  const delivered = results.some((r) => r.status === 'fulfilled' && r.value);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
  failed.forEach((f) => console.error('[booking] delivery failed', f.reason));

  if (!delivered && failed.length) {
    // Something is configured but every channel failed — log the request so it isn't lost.
    console.info('[booking] request (undelivered):', request);
    return NextResponse.json({ ok: false, error: 'We couldn’t send your request just now. Please try again shortly.' }, { status: 502 });
  }
  if (!delivered) console.info('[booking] No booking integration configured — request received:', request);

  return NextResponse.json({ ok: true, reference, delivered });
}
