import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import { LocationCtas } from "@/components/LocationCtas";
import { MarketMetricsPanel } from "@/components/MarketMetricsPanel";
import { RelatedLinks } from "@/components/RelatedLinks";
import { findCity, locationSeed } from "@/lib/seo/locations";
import { getMarketMetrics } from "@/lib/seo/market-data";
import { getQualityForCityPage, shouldIndexPage } from "@/lib/seo/page-quality";
import { breadcrumbSchema, professionalServiceSchema } from "@/lib/seo/schema";

type Props = { params: Promise<{ county: string; city: string }> };

export function generateStaticParams() {
  return locationSeed.counties.flatMap((county) =>
    county.cities
      .filter((city) => {
        const quality = getQualityForCityPage(county.slug, city.slug);
        return quality ? shouldIndexPage(quality) : false;
      })
      .map((city) => ({ county: county.slug, city: city.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county, city } = await params;
  const cityData = findCity(county, city);
  if (!cityData) return {};

  const path = `/locations/${county}/${city}`;
  const quality = getQualityForCityPage(county, city);
  return {
    title: `${cityData.name} Community Marketing Cluster | Velocity Builders`,
    description: cityData.blurb,
    alternates: { canonical: path },
    robots: {
      index: quality ? shouldIndexPage(quality) : false,
      follow: true,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { county, city } = await params;
  const cityData = findCity(county, city);
  if (!cityData) notFound();

  const quality = getQualityForCityPage(county, city);
  const path = `/locations/${county}/${city}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: county.replaceAll("-", " "), path: `/locations/${county}` },
    { name: cityData.name, path },
  ];

  const schemaBlocks = [
    professionalServiceSchema({ description: cityData.blurb, areaServed: cityData.name, path }),
    breadcrumbSchema(crumbs),
  ];

  const marketMetrics = getMarketMetrics({ scope: "city", countySlug: county, citySlug: city });

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-14">
      {schemaBlocks.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <BreadcrumbTrail crumbs={crumbs} />
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-gray-900">{cityData.name} Community Pages</h1>
        <p className="text-gray-600">{cityData.blurb}</p>
        {quality && !quality.passes ? <p className="text-xs text-amber-300">Quality guardrail active: this page is noindex until score threshold is met.</p> : null}
      </header>

      <MarketMetricsPanel title={`${cityData.name} market snapshot`} metrics={marketMetrics} />

      <section className="grid gap-4 sm:grid-cols-2">
        {cityData.communities.map((community) => (
          <article key={community.slug} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-xl font-semibold text-gray-900">{community.name}</h2>
            <p className="mt-2 text-sm text-gray-600">{community.marketFocus}</p>
            <Link href={`${path}/${community.slug}`} className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-600">
              View {community.name} strategy →
            </Link>
          </article>
        ))}
      </section>

      <LocationCtas route={{ depth: "city", countySlug: county, citySlug: city, path }} />

      <RelatedLinks
        title="Related city clusters"
        links={locationSeed.counties
          .flatMap((entry) => entry.cities.map((candidateCity) => ({ county: entry.slug, city: candidateCity })))
          .filter((entry) => !(entry.county === county && entry.city.slug === city))
          .slice(0, 4)
          .map((entry) => ({ href: `/locations/${entry.county}/${entry.city.slug}`, label: entry.city.name, description: entry.city.blurb }))}
      />
    </div>
  );
}
