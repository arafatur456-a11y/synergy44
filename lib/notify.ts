/**
 * Server-side delivery helpers shared by the booking and newsletter endpoints.
 * Each returns false when its integration isn't configured, so callers can fall back to logging.
 */

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Email the studio inbox through Resend (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL). */
export async function emailStudio(opts: { subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL], reply_to: opts.replyTo, subject: opts.subject, html: opts.html }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}

/** POST a JSON payload to an external webhook (booking system, Zapier/Make, CRM…). */
export async function postWebhook(url: string | undefined, payload: unknown, secret?: string): Promise<boolean> {
  if (!url) return false;
  if (!/^https:\/\//.test(url) && !/^http:\/\/localhost[:/]/.test(url)) throw new Error('Webhook URL must use HTTPS');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return true;
}

export const htmlTable = (rows: [string, string | undefined][]) =>
  `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(String(v))}</td></tr>`)
    .join('')}</table>`;
