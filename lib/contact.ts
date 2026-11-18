/** Shared contact-form schema + validation (used by the client form and the API route). */

export const topics = [
  { value: 'salon', label: 'Salon appointment' },
  { value: 'consultation', label: 'Hair consultation' },
  { value: 'product', label: 'Product question or order' },
  { value: 'jewelry', label: 'Glass jewelry or commission' },
  { value: 'other', label: 'Something else' },
] as const;

export type Topic = (typeof topics)[number]['value'];

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  topic: Topic;
  location?: string;
  preferredDate?: string;
  message: string;
  /** Honeypot — must stay empty */
  company?: string;
};

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Partial<ContactPayload>): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name?.trim() ?? '';
  const message = input.message?.trim() ?? '';
  if (name.length < 2) errors.name = 'Please share your name.';
  if (name.length > 120) errors.name = 'That name is a little long.';
  if (!EMAIL.test(input.email?.trim() ?? '')) errors.email = 'Please enter a valid email address.';
  if (input.phone && !/^[\d\s()+.-]{7,20}$/.test(input.phone)) errors.phone = 'Please enter a valid phone number.';
  if (!topics.some((t) => t.value === input.topic)) errors.topic = 'Please choose a topic.';
  if (message.length < 10) errors.message = 'Tell us a little more (at least 10 characters).';
  if (message.length > 4000) errors.message = 'Please keep your message under 4,000 characters.';
  return errors;
}

export const isTopic = (v: unknown): v is Topic => topics.some((t) => t.value === v);
