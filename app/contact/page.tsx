import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import ContactForm from '@/components/contact/ContactForm';
import Reveal from '@/components/ui/Reveal';
import { isTopic } from '@/lib/contact';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact & Bookings',
  description: 'Book a salon appointment or consultation, ask about products, or commission a dichroic glass pendant.',
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const initialTopic = isTopic(topic) ? topic : 'salon';

  return (
    <>
      <PageHeader
        eyebrow="Contact & bookings"
        crumbs={[{ label: 'Contact' }]}
        title={
          <>
            Let’s <em className="text-iridescent">talk</em> hair — or glass.
          </>
        }
        intro="Request an appointment, book a consultation, ask about a product, or start a custom jewelry commission. We read every message personally."
      />

      <section className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <Reveal className="space-y-10 lg:col-span-4">
          <div className="flex gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-sage" strokeWidth={1.5} />
            <div>
              <h2 className="font-display text-2xl">Salon studios</h2>
              <p className="mt-1 text-sm leading-relaxed text-espresso-500">{site.locations.join(' & ')}. Exact studio details are shared when your appointment is confirmed.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-sage" strokeWidth={1.5} />
            <div>
              <h2 className="font-display text-2xl">Hours</h2>
              <p className="mt-1 text-sm leading-relaxed text-espresso-500">{site.hours}.</p>
            </div>
          </div>
          {site.contactEmail && (
            <div className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-sage" strokeWidth={1.5} />
              <div>
                <h2 className="font-display text-2xl">Email</h2>
                <a href={`mailto:${site.contactEmail}`} className="link-underline mt-1">
                  {site.contactEmail}
                </a>
              </div>
            </div>
          )}
          <div className="rounded-[28px] bg-sage-mist p-7">
            <p className="font-display text-xl italic leading-snug">“Every great service starts with a conversation about your hair’s health.”</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-espresso-500">The Synergy 44 approach</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          <ContactForm initialTopic={initialTopic} />
        </Reveal>
      </section>
    </>
  );
}
