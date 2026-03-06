import { getSiteContent } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { breadcrumbSchema, faqSchema, professionalServiceSchema } from "@/lib/seo/schema";

const path = "/services";

export const metadata = {
  title: "Services | Velocity Builders, LLC",
  description: "CRM automation, IDX websites, listing launch marketing, and nurture campaigns built for growth teams.",
  alternates: {
    canonical: path,
  },
};

const serviceFaqs = [
  {
    question: "How fast can Velocity launch a new automation or campaign sprint?",
    answer: "Most launch intensives go live in roughly 10 business days after kickoff and data intake.",
  },
  {
    question: "Do these services support both title and real estate growth goals?",
    answer: "Yes. Engagements are structured to improve lead conversion while reinforcing partner relationships that drive title referrals.",
  },
];

export default async function ServicesPage() {
  const content = await getSiteContent();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path },
  ];
  const schemaBlocks = [
    professionalServiceSchema({
      description: "CRM automation, IDX websites, and listing launch marketing for Northern Virginia growth teams.",
      path,
    }),
    breadcrumbSchema(crumbs),
    faqSchema(serviceFaqs),
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-16">
      {schemaBlocks.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SectionHeader
        eyebrow="Offerings"
        title="Everything a modern title + marketing team needs"
        description="Pricing is scoped to each partner’s data sources, integrations, and velocity. Most engagements start at $4k/mo or $12k per sprint."
        align="center"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {content.services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm leading-loose text-slate-200">
        <p className="font-semibold text-white">What’s included by default</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <li>Kickoff + discovery workshop</li>
          <li>Dedicated Slack channel + weekly standups</li>
          <li>Measurement dashboard + KPI tracking</li>
          <li>Change management + enablement docs</li>
          <li>QA checklists + launch support</li>
          <li>Post-launch optimization window</li>
        </ul>
      </div>
    </div>
  );
}
