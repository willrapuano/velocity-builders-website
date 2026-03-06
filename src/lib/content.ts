import { createClient } from "@sanity/client";
import { fallbackContent, SiteContent } from "@/data/site";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const sanityToken = process.env.SANITY_TOKEN_VELOCITY ?? process.env.SANITY_API_TOKEN ?? process.env.SANITY_AUTH_TOKEN;

const hasSanityConfig = Boolean(sanityProjectId && sanityDataset && sanityToken);

const client = hasSanityConfig
  ? createClient({
      projectId: sanityProjectId!,
      dataset: sanityDataset,
      apiVersion: "2024-01-01",
      token: sanityToken,
      useCdn: false,
    })
  : null;

export async function getSiteContent(): Promise<SiteContent> {
  if (!client) return fallbackContent;

  try {
    const [homepage, settings, services, testimonials] = await Promise.all([
      client.fetch(`*[_type == "homepage"][0]`),
      client.fetch(`*[_type == "siteSettings"][0]`),
      client.fetch(`*[_type == "service"] | order(order asc)`),
      client.fetch(`*[_type == "testimonial"] | order(order asc)`),
    ]);

    // Map Sanity services → SiteContent services
    const mappedServices = services?.length
      ? services.map((s: any) => ({
          title: s.title ?? "",
          description: s.shortDescription ?? "",
          bullets: s.features ?? [],
          cta: s.cta ?? "Learn More",
        }))
      : fallbackContent.services;

    // Map Sanity testimonials → SiteContent testimonials
    const mappedTestimonials = testimonials?.length
      ? testimonials.map((t: any) => ({
          quote: t.quote ?? "",
          name: t.name ?? "",
          role: t.title ?? "",
          company: t.company ?? "",
        }))
      : fallbackContent.testimonials;

    // Map Sanity homepage stats → hero stats
    const mappedStats = homepage?.stats?.length
      ? homepage.stats.map((s: any) => ({ label: s.label, value: s.value }))
      : fallbackContent.hero.stats;

    return {
      ...fallbackContent,
      company: {
        ...fallbackContent.company,
        name: settings?.siteName ?? fallbackContent.company.name,
        tagline: settings?.tagline ?? fallbackContent.company.tagline,
        email: settings?.email ?? fallbackContent.company.email,
        phone: settings?.phone ?? fallbackContent.company.phone,
        hq: settings?.address ?? fallbackContent.company.hq,
      },
      hero: {
        ...fallbackContent.hero,
        title: homepage?.heroHeadline ?? fallbackContent.hero.title,
        subtitle: homepage?.heroSubheadline ?? fallbackContent.hero.subtitle,
        primaryCta: homepage?.heroCta1Text ?? fallbackContent.hero.primaryCta,
        secondaryCta: homepage?.heroCta2Text ?? fallbackContent.hero.secondaryCta,
        stats: mappedStats,
      },
      services: mappedServices,
      testimonials: mappedTestimonials,
    };
  } catch (error) {
    console.warn("Sanity fetch failed, falling back to local content", error);
    return fallbackContent;
  }
}
