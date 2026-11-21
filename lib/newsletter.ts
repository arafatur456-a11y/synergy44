/**
 * Newsletter — shared validation, the client submit helper, and the global "open popup" trigger.
 * Any button can open the popup with `openNewsletter()`; the footer form posts through `subscribe()`.
 */
export type NewsletterPayload = {
  email: string;
  name?: string;
  source?: 'popup' | 'footer' | 'concierge';
  /** Honeypot — must stay empty */
  website?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateNewsletter(input: Partial<NewsletterPayload>): { email?: string; name?: string } {
  const errors: { email?: string; name?: string } = {};
  const email = input.email?.trim() ?? '';
  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL.test(email) || email.length > 254) errors.email = 'That email doesn’t look quite right.';
  if ((input.name?.trim().length ?? 0) > 80) errors.name = 'Please keep your name under 80 characters.';
  return errors;
}

export type SubscribeResult = { ok: true } | { ok: false; error: string; field?: 'email' | 'name' };

export async function subscribe(payload: NewsletterPayload): Promise<SubscribeResult> {
  const local = validateNewsletter(payload);
  if (local.email) return { ok: false, error: local.email, field: 'email' };
  if (local.name) return { ok: false, error: local.name, field: 'name' };
  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      markSubscribed();
      return { ok: true };
    }
    if (data.errors?.email) return { ok: false, error: data.errors.email, field: 'email' };
    return { ok: false, error: data.error || 'Something went wrong — please try again.' };
  } catch {
    return { ok: false, error: 'You appear to be offline — please try again.' };
  }
}

export const NEWSLETTER_EVENT = 's44:newsletter';
export const SUBSCRIBED_KEY = 'synergy44.newsletter.subscribed';
export const DISMISSED_KEY = 'synergy44.newsletter.dismissed';

export function openNewsletter() {
  window.dispatchEvent(new Event(NEWSLETTER_EVENT));
}

function markSubscribed() {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, '1');
  } catch {
    /* storage unavailable */
  }
}
