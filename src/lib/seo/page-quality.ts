import { findCity, findCommunity, findCounty, locationSeed } from "@/lib/seo/locations";
import { getMarketMetrics } from "@/lib/seo/market-data";

export type RouteDepth = "hub" | "county" | "city" | "community";

export type PageQualitySignal = {
  depth: RouteDepth;
  title: string;
  description: string;
  highlightsCount: number;
  faqCount: number;
  linkCount: number;
  hasMarketMetrics: boolean;
};

export type PageQualityResult = {
  score: number;
  threshold: number;
  passes: boolean;
  reasons: string[];
};

const QUALITY_THRESHOLDS: Record<RouteDepth, number> = {
  hub: 52,
  county: 56,
  city: 60,
  community: 64,
};

export function scoreProgrammaticPage(signal: PageQualitySignal): PageQualityResult {
  const reasons: string[] = [];
  let score = 0;

  const descriptionLength = signal.description.trim().length;
  score += clamp(Math.round(descriptionLength / 4), 0, 25);
  if (descriptionLength < 120) reasons.push("Description is too short for strong local relevance.");

  score += clamp(signal.highlightsCount * 5, 0, 20);
  if (signal.depth === "community" && signal.highlightsCount < 3) reasons.push("Community page needs at least 3 concrete highlights.");

  score += clamp(signal.faqCount * 4, 0, 20);
  if ((signal.depth === "city" || signal.depth === "community") && signal.faqCount < 2) reasons.push("Page should include at least 2 FAQs.");

  score += clamp(signal.linkCount * 4, 0, 16);
  if (signal.linkCount < 2) reasons.push("Internal linking density is below baseline.");

  if (signal.hasMarketMetrics) score += 15;
  else reasons.push("Missing market metrics block.");

  if (signal.title.trim().length < 10) reasons.push("Title lacks specificity.");

  const threshold = QUALITY_THRESHOLDS[signal.depth];
  return {
    score,
    threshold,
    passes: score >= threshold,
    reasons,
  };
}

export function assertQualityShape(result: PageQualityResult) {
  if (!Number.isFinite(result.score) || result.score < 0 || result.score > 100) {
    throw new Error(`Invalid quality score: ${result.score}`);
  }
  if (!Number.isFinite(result.threshold) || result.threshold < 0 || result.threshold > 100) {
    throw new Error(`Invalid quality threshold: ${result.threshold}`);
  }
}

export function shouldIndexPage(result: PageQualityResult) {
  return result.passes;
}

export function getQualityForHubPage() {
  const highlights = locationSeed.topics.length;
  const linkCount = locationSeed.counties.length;
  const hasMarketMetrics = Boolean(
    locationSeed.counties[0] &&
      getMarketMetrics({ scope: "county", countySlug: locationSeed.counties[0].slug }),
  );

  const result = scoreProgrammaticPage({
    depth: "hub",
    title: "Markets We Serve",
    description: "Explore county, city, and community-level pages designed for discoverability and conversion.",
    highlightsCount: highlights,
    faqCount: 0,
    linkCount,
    hasMarketMetrics,
  });
  assertQualityShape(result);
  return result;
}

export function getQualityForCountyPage(countySlug: string) {
  const county = findCounty(countySlug);
  if (!county) return null;
  const result = scoreProgrammaticPage({
    depth: "county",
    title: county.name,
    description: county.positioning,
    highlightsCount: county.cities.length,
    faqCount: county.cities.reduce((sum, city) => sum + city.communities.length, 0) > 0 ? 1 : 0,
    linkCount: county.cities.length,
    hasMarketMetrics: Boolean(getMarketMetrics({ scope: "county", countySlug: county.slug })),
  });
  assertQualityShape(result);
  return result;
}

export function getQualityForCityPage(countySlug: string, citySlug: string) {
  const city = findCity(countySlug, citySlug);
  if (!city) return null;
  const result = scoreProgrammaticPage({
    depth: "city",
    title: city.name,
    description: city.blurb,
    highlightsCount: city.communities.length,
    faqCount: city.communities.reduce((sum, community) => sum + community.faqs.length, 0),
    linkCount: city.communities.length,
    hasMarketMetrics: Boolean(getMarketMetrics({ scope: "city", countySlug, citySlug })),
  });
  assertQualityShape(result);
  return result;
}

export function getQualityForCommunityPage(countySlug: string, citySlug: string, communitySlug: string) {
  const community = findCommunity(countySlug, citySlug, communitySlug);
  if (!community) return null;

  const result = scoreProgrammaticPage({
    depth: "community",
    title: community.name,
    description: community.intro,
    highlightsCount: community.highlights.length,
    faqCount: community.faqs.length,
    linkCount: 4,
    hasMarketMetrics: Boolean(
      getMarketMetrics({ scope: "community", countySlug, citySlug, communitySlug }),
    ),
  });
  assertQualityShape(result);
  return result;
}

export function getIndexableLocationPaths() {
  const paths: string[] = [];

  for (const county of locationSeed.counties) {
    const countyResult = getQualityForCountyPage(county.slug);
    if (countyResult && shouldIndexPage(countyResult)) {
      paths.push(`/locations/${county.slug}`);
    }

    for (const city of county.cities) {
      const cityResult = getQualityForCityPage(county.slug, city.slug);
      if (cityResult && shouldIndexPage(cityResult)) {
        paths.push(`/locations/${county.slug}/${city.slug}`);
      }

      for (const community of city.communities) {
        const communityResult = getQualityForCommunityPage(county.slug, city.slug, community.slug);
        if (communityResult && shouldIndexPage(communityResult)) {
          paths.push(`/locations/${county.slug}/${city.slug}/${community.slug}`);
        }
      }
    }
  }

  return paths;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
