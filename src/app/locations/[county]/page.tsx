import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import { LocationCtas } from "@/components/LocationCtas";
import { MarketMetricsPanel } from "@/components/MarketMetricsPanel";
import { RelatedLinks } from "@/components/RelatedLinks";
import { findCounty, locationSeed } from "@/lib/seo/locations";
import { getMarketMetrics } from "@/lib/seo/market-data";
import { getQualityForCountyPage, shouldIndexPage } from "@/lib/seo/page-quality";
import { breadcrumbSchema, professionalServiceSchema } from "@/lib/seo/schema";

type Props = { params: Promise<{ county: string }> };

export function generateStaticParams() {
  return locationSeed.counties
    .filter((county) => {
      const quality = getQualityForCountyPage(county.slug);
      return quality ? shouldIndexPage(quality) : false;
    })
    .map((county) => ({ county: county.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county } = await params;
  const countyData = findCounty(county);
  if (!countyData) return {};
  const path = `/locations/${countyData.slug}`;
  const quality = getQualityForCountyPage(countyData.slug);

  return {
    title: `${countyData.name} Real Estate Marketing Systems | Velocity Builders`,
    description: countyData.positioning,
    alternates: { canonical: path },
    robots: {
      index: quality ? shouldIndexPage(quality) : false,
      follow: true,
    },
  };
}

export default async function CountyPage({ params }: Props) {
  const { county } = await params;
  const countyData = findCounty(county);

  if (!countyData) notFound();

  const quality = getQualityForCountyPage(countyData.slug);
  const path = `/locations/${countyData.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: countyData.name, path },
  ];

  const schemaBlocks = [
    professionalServiceSchema({ description: countyData.positioning, areaServed: countyData.name, path }),
    breadcrumbSchema(crumbs),
  ];

  const marketMetrics = getMarketMetrics({ scope: "county", countySlug: countyData.slug });

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-14">
      {schemaBlocks.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <BreadcrumbTrail crumbs={crumbs} />

      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-gray-900">{countyData.name} Growth Hub</h1>
        <p className="text-gray-600">{countyData.positioning}</p>
        {quality && !quality.passes ? <p className="text-xs text-amber-300">Quality guardrail active: this page is noindex until content score improves.</p> : null}
      </header>

      <MarketMetricsPanel title={`${countyData.name} market snapshot`} metrics={marketMetrics} />

      <section className="grid gap-6 md:grid-cols-2">
        {countyData.cities.map((city) => (
          <article key={city.slug} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-2xl font-semibold text-gray-900">{city.name}</h2>
            <p className="mt-3 text-gray-600">{city.blurb}</p>
            <p className="mt-3 text-sm text-gray-500">{city.communities.length} indexed community pages</p>
            <Link href={`${path}/${city.slug}`} className="mt-5 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-600">
              Open {city.name} cluster →
            </Link>
          </article>
        ))}
      </section>

      <LocationCtas route={{ depth: "county", countySlug: countyData.slug, path }} />

      <RelatedLinks
        title="Related county clusters"
        links={locationSeed.counties
          .filter((candidate) => candidate.slug !== countyData.slug)
          .slice(0, 3)
          .map((candidate) => ({ href: `/locations/${candidate.slug}`, label: candidate.name, description: candidate.positioning }))}
      />
    </div>
  );
}
