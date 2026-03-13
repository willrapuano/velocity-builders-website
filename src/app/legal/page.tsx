import { getSiteContent } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "Legal | Velocity Builders",
  description: "Velocity Builders legal terms and privacy details, with clear contact options for policy and compliance questions.",
};

export default async function LegalPage() {
  const content = await getSiteContent();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
        <SectionHeader eyebrow="Legal" title="Plain-language policies" align="center" />
        <div className="space-y-8">
          {content.legal.map((policy) => (
            <article key={policy.title} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">{policy.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{policy.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
