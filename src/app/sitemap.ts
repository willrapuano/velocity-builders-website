import type { MetadataRoute } from "next";
import { getIndexableLocationPaths, getQualityForHubPage, shouldIndexPage } from "@/lib/seo/page-quality";

const siteUrl = "https://velocitybuilders.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const locationHub = shouldIndexPage(getQualityForHubPage()) ? ["/locations"] : [];
  const routes = ["", "/about", "/services", "/contact", "/legal", ...locationHub, ...getIndexableLocationPaths()];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route.startsWith("/locations") ? "weekly" : route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/locations/") ? 0.8 : 0.7,
  }));
}
