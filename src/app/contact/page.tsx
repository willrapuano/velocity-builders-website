import { ContactForm } from "@/components/ContactForm";
import { getSiteContent } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "Contact Velocity Builders",
  description: "Ready to scale your marketing and automation? Reach out to Velocity Builders.",
};

export default async function ContactPage() {
  const content = await getSiteContent();
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2">
      <SectionHeader
        eyebrow="Contact"
        title="Tell us what you want to scale"
        description="We reply within one business day. Include context—current stack, biggest friction, and target timelines."
      />
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <ContactForm />
        <div className="mt-6 space-y-2 text-sm text-slate-200">
          <p className="font-semibold text-white">Prefer email?</p>
          <a href={`mailto:${content.company.email}`} className="text-emerald-300">
            {content.company.email}
          </a>
          <p>{content.company.phone}</p>
        </div>
      </div>
    </div>
  );
}
