import type { MetadataRoute } from "next";
import { getIndexableLocationPaths, getQualityForHubPage, shouldIndexPage } from "@/lib/seo/page-quality";
import { getAllPostSlugs } from "@/lib/blog/api";

const siteUrl = "https://velocitybuilders.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const locationHub = shouldIndexPage(getQualityForHubPage()) ? ["/locations"] : [];
  const blogSlugs = getAllPostSlugs().map((s) => `/blog/${s}`);
  const blogCategories = ["/blog/category/marketing-systems", "/blog/category/real-estate-news", "/blog/category/ai-tools", "/blog/category/title-insurance"];
  const routes = ["", "/about", "/services", "/contact", "/blog", ...blogCategories, "/legal", ...locationHub, ...getIndexableLocationPaths(), ...blogSlugs];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route.startsWith("/blog") ? "weekly" : route.startsWith("/locations") ? "weekly" : route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/blog" ? 0.9 : route.startsWith("/blog/") ? 0.8 : route.startsWith("/locations/") ? 0.8 : 0.7,
  }));
}
