import { NextResponse } from 'next/server';
import { topics, validateContact, type ContactPayload } from '@/lib/contact';

/**
 * POST /api/contact
 * Validates the inquiry and delivers it by email through Resend when configured:
 *   RESEND_API_KEY      – API key from resend.com
 *   CONTACT_TO_EMAIL    – inbox that receives inquiries
 *   CONTACT_FROM_EMAIL  – verified sender, e.g. "Synergy 44 <hello@yourdomain.com>"
 * Without those variables it logs the inquiry server-side (useful in development).
 */

// Basic per-IP throttle (per server instance). Use a shared store (e.g. Upstash) for multi-region limits.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(req: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing
  if (body.company) return NextResponse.json({ ok: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many messages — please try again a little later.' }, { status: 429 });
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const data = body as ContactPayload;
  const topicLabel = topics.find((t) => t.value === data.topic)?.label ?? data.topic;
  const rows: [string, string | undefined][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Topic', topicLabel],
    ['Location', data.location],
    ['Preferred date', data.preferredDate],
  ];

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.info('[contact] Email delivery not configured — inquiry received:', { ...data, company: undefined });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const html = `
    <h2 style="font-family:Georgia,serif">New inquiry — ${escape(topicLabel)}</h2>
    <table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">
      ${rows.filter(([, v]) => v).map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(String(v))}</td></tr>`).join('')}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escape(data.message)}</p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `Synergy 44 inquiry: ${topicLabel} — ${data.name}`,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[contact] delivery failed', err);
    return NextResponse.json({ ok: false, error: 'We couldn’t send your message just now. Please try again shortly.' }, { status: 502 });
  }
}
