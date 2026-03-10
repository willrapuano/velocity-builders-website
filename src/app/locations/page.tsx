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
  title: "DMV Locations | Velocity Builders",
  description: "Explore county and city-specific real estate marketing systems across DC, Maryland, and Virginia.",
  alternates: {
    canonical: path,
  },
  robots: {
    index: shouldIndexPage(hubQuality),
    follow: true,
  },
};

export default function LocationsHubPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path },
  ];

  const schemas = [
    professionalServiceSchema({
      description: "County and city-level marketing operations for real estate teams.",
      areaServed: "DC, Maryland, and Virginia",
      path,
    }),
    breadcrumbSchema(crumbs),
  ];

  const marketMetrics = getMarketMetrics({ scope: "county", countySlug: locationSeed.counties[0].slug });

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-14">
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <BreadcrumbTrail crumbs={crumbs} />
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Service Areas</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">{locationSeed.region} SEO Growth Architecture</h1>
        <p className="max-w-3xl text-slate-300">
          Explore county, city, and community-level pages designed for discoverability, conversion, and long-term local authority.
        </p>
      </header>

      <MarketMetricsPanel title="Regional market benchmark" metrics={marketMetrics} />

      <section className="grid gap-4 md:grid-cols-3">
        {locationSeed.topics.map((topic) => (
          <article key={topic.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold text-white">{topic.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{topic.summary}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {locationSeed.counties.map((county) => (
          <article key={county.slug} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <h2 className="text-2xl font-semibold text-white">{county.name}</h2>
            <p className="mt-3 text-slate-300">{county.positioning}</p>
            <p className="mt-4 text-sm text-slate-400">
              {county.cities.length} city clusters • {county.cities.reduce((sum, city) => sum + city.communities.length, 0)} community pages
            </p>
            <Link
              href={`/locations/${county.slug}`}
              className="mt-6 inline-flex rounded-full border border-emerald-300/70 px-5 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-300/10"
            >
              Explore {county.name}
            </Link>
          </article>
        ))}
      </section>

      <LocationCtas route={{ depth: "hub", path }} />

      <p className="text-xs text-slate-500">Canonical: {buildCanonical(path)}</p>
    </div>
  );
}
