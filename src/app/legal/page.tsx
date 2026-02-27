import { getSiteContent } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "Legal | Velocity Builders",
  description: "Refund policy, cancellation terms, and service-level commitments for Velocity Builders.",
};

export default async function LegalPage() {
  const content = await getSiteContent();
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <SectionHeader eyebrow="Legal" title="Plain-language policies" align="center" />
      <div className="space-y-8">
        {content.legal.map((policy) => (
          <article key={policy.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">{policy.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{policy.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
