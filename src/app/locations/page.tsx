import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import { LocationCtas } from "@/components/LocationCtas";
import { MarketMetricsPanel } from "@/components/MarketMetricsPanel";
import { locationSeed } from "@/lib/seo/locations";
import { getMarketMetrics } from "@/lib/seo/market-data";
import { getQualityForHubPage, shouldIndexPage } from "@/lib/seo/page-quality";
import { buildCanonical, breadcrumbSchema, professionalServiceSchema } from "@/lib/seo/schema";

const path = "/locations";
const hubQuality = getQualityForHubPage();

export const metadata: Metadata = {
  title: "Markets We Serve | Velocity Builders",
  description: "Velocity Builders serves real estate agents, lenders, builders, and financial institutions nationwide with websites, SEO, and marketing automation.",
  alternates: { canonical: path },
  robots: { index: shouldIndexPage(hubQuality), follow: true },
};

export default function LocationsHubPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path },
  ];

  const schemas = [
    professionalServiceSchema({
      description: "County and city-level marketing operations for real estate teams.",
      areaServed: "United States",
      path,
    }),
    breadcrumbSchema(crumbs),
  ];

  const marketMetrics = getMarketMetrics({ scope: "county", countySlug: locationSeed.counties[0].slug });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-14">
        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}

        <BreadcrumbTrail crumbs={crumbs} />
        <header className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Service Areas</p>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">{locationSeed.region} SEO Growth Architecture</h1>
          <p className="max-w-3xl text-gray-600">
            Explore county, city, and community-level pages designed for discoverability, conversion, and long-term local authority.
          </p>
        </header>

        <MarketMetricsPanel title="Regional market benchmark" metrics={marketMetrics} />

        <section className="grid gap-4 md:grid-cols-3">
          {locationSeed.topics.map((topic) => (
            <article key={topic.title} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="font-semibold text-gray-900">{topic.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{topic.summary}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {locationSeed.counties.map((county) => (
            <article key={county.slug} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-bold text-gray-900">{county.name}</h2>
              <p className="mt-3 text-gray-600">{county.positioning}</p>
              <p className="mt-4 text-sm text-gray-500">
                {county.cities.length} city clusters • {county.cities.reduce((sum, city) => sum + city.communities.length, 0)} community pages
              </p>
              <Link
                href={`/locations/${county.slug}`}
                className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md shadow-blue-600/25"
              >
                Explore {county.name}
              </Link>
            </article>
          ))}
        </section>

        <LocationCtas route={{ depth: "hub", path }} />

        <p className="text-xs text-gray-400">Canonical: {buildCanonical(path)}</p>
      </div>
    </div>
  );
}
