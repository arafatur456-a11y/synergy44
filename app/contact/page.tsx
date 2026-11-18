import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import StudioScene from '@/components/ui/StudioScene';
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

  const info = [
    { icon: MapPin, title: 'Salon studios', body: `${site.locations.join(' & ')}. Exact studio details are shared when your appointment is confirmed.` },
    { icon: Clock, title: 'Hours', body: `${site.hours}.` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact & bookings"
        crumbs={[{ label: 'Contact' }]}
        title={
          <>
            Let’s begin a <em className="accent">conversation.</em>
          </>
        }
        intro="Request an appointment, book a consultation, ask about a product, or start a custom jewelry commission. Every message is read personally."
        scene={
          <StudioScene tone="forest" plinth={false} className="h-full w-full">
            <div className="glass absolute bottom-8 left-8 right-8 max-w-sm p-6 sm:bottom-12 sm:left-12">
              <p className="font-display text-[1.45rem] font-medium italic leading-snug">“Every great service starts with a conversation about your hair’s health.”</p>
              <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-espresso-500">The Synergy 44 approach</p>
            </div>
          </StudioScene>
        }
      />

      <section className="container-x grid gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-4">
          <ul className="border-t border-ink">
            {info.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-5 border-b border-line py-7">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-sage-dark" strokeWidth={1.4} />
                <div>
                  <h2 className="font-display text-[1.5rem] font-semibold">{title}</h2>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-espresso-700">{body}</p>
                </div>
              </li>
            ))}
            {site.contactEmail && (
              <li className="flex gap-5 border-b border-line py-7">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-sage-dark" strokeWidth={1.4} />
                <div>
                  <h2 className="font-display text-[1.5rem] font-semibold">Email</h2>
                  <a href={`mailto:${site.contactEmail}`} className="link-underline mt-2">
                    {site.contactEmail}
                  </a>
                </div>
              </li>
            )}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <ContactForm initialTopic={initialTopic} />
        </Reveal>
      </section>
    </>
  );
}
