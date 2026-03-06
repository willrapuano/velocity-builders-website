import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import { LocationCtas } from "@/components/LocationCtas";
import { MarketMetricsPanel } from "@/components/MarketMetricsPanel";
import { RelatedLinks } from "@/components/RelatedLinks";
import { findCity, findCommunity, locationSeed } from "@/lib/seo/locations";
import { getMarketMetrics } from "@/lib/seo/market-data";
import { getQualityForCommunityPage, shouldIndexPage } from "@/lib/seo/page-quality";
import { articleSchema, breadcrumbSchema, faqSchema, professionalServiceSchema } from "@/lib/seo/schema";

type Props = { params: Promise<{ county: string; city: string; community: string }> };

export function generateStaticParams() {
  return locationSeed.counties.flatMap((county) =>
    county.cities.flatMap((city) =>
      city.communities
        .filter((community) => {
          const quality = getQualityForCommunityPage(county.slug, city.slug, community.slug);
          return quality ? shouldIndexPage(quality) : false;
        })
        .map((community) => ({
          county: county.slug,
          city: city.slug,
          community: community.slug,
        })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county, city, community } = await params;
  const communityData = findCommunity(county, city, community);

  if (!communityData) return {};

  const path = `/locations/${county}/${city}/${community}`;
  const quality = getQualityForCommunityPage(county, city, community);

  return {
    title: `${communityData.name} Real Estate Marketing Playbook | Velocity Builders`,
    description: communityData.intro,
    alternates: {
      canonical: path,
    },
    robots: {
      index: quality ? shouldIndexPage(quality) : false,
      follow: true,
    },
  };
}

export default async function CommunityPage({ params }: Props) {
  const { county, city, community } = await params;
  const cityData = findCity(county, city);
  const communityData = findCommunity(county, city, community);

  if (!cityData || !communityData) notFound();

  const quality = getQualityForCommunityPage(county, city, community);
  const path = `/locations/${county}/${city}/${community}`;
  const prettyCounty = county
    .split("-")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: prettyCounty, path: `/locations/${county}` },
    { name: cityData.name, path: `/locations/${county}/${city}` },
    { name: communityData.name, path },
  ];

  const marketMetrics = getMarketMetrics({
    scope: "community",
    countySlug: county,
    citySlug: city,
    communitySlug: community,
  });

  const schemaBlocks = [
    professionalServiceSchema({ description: communityData.intro, areaServed: communityData.name, path }),
    breadcrumbSchema(crumbs),
    faqSchema(communityData.faqs),
    articleSchema({
      headline: `${communityData.name} Local Marketing Playbook`,
      description: communityData.intro,
      path,
      dateModified: marketMetrics.generatedAt,
    }),
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-14">
      {schemaBlocks.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <BreadcrumbTrail crumbs={crumbs} />

      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Community Playbook</p>
        <h1 className="text-4xl font-semibold text-white">{communityData.name}</h1>
        <p className="text-lg text-slate-300">{communityData.intro}</p>
        {quality && !quality.passes ? <p className="text-xs text-amber-300">Quality guardrail active: this page is excluded from indexation.</p> : null}
      </header>

      <MarketMetricsPanel title={`${communityData.name} market snapshot`} metrics={marketMetrics} />

      <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Market focus</p>
          <p className="mt-2 text-sm text-white">{communityData.marketFocus}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Primary audience</p>
          <p className="mt-2 text-sm text-white">{communityData.audience}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Coverage route</p>
          <p className="mt-2 text-sm text-white">Hub → County → City → Community</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Execution highlights</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {communityData.highlights.map((highlight) => (
            <li key={highlight} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-200">
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-white">Frequently asked questions</h2>
        <div className="space-y-4">
          {communityData.faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <LocationCtas route={{ depth: "community", countySlug: county, citySlug: city, communitySlug: community, path }} />

      <RelatedLinks
        title="Related pages in this city"
        links={cityData.communities
          .filter((entry) => entry.slug !== communityData.slug)
          .slice(0, 4)
          .map((entry) => ({
            href: `/locations/${county}/${city}/${entry.slug}`,
            label: entry.name,
            description: entry.marketFocus,
          }))}
      />
    </div>
  );
}
