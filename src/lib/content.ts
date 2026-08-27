import { client } from "@/sanity/client";
import { fallbackContent, SiteContent } from "@/data/site";
import { containsBlockedMlsDisplayLanguage } from "@/lib/content-policy";

type HomepageDocument = {
  heroCta1Text?: string;
  heroCta2Text?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  stats?: Array<{ label?: string; value?: string }>;
};

type ServiceDocument = {
  cta?: string;
  features?: string[];
  shortDescription?: string;
  title?: string;
};

type SettingsDocument = {
  address?: string;
  email?: string;
  phone?: string;
  siteName?: string;
  tagline?: string;
};

type TestimonialDocument = {
  company?: string;
  name?: string;
  quote?: string;
  title?: string;
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [homepage, settings, services, testimonials] = await Promise.all([
      client.fetch<HomepageDocument | null>(`*[_type == "homepage"][0]`),
      client.fetch<SettingsDocument | null>(`*[_type == "siteSettings"][0]`),
      client.fetch<ServiceDocument[]>(`*[_type == "service"] | order(order asc)`),
      client.fetch<TestimonialDocument[]>(`*[_type == "testimonial"] | order(order asc)`),
    ]);

    const safeHomepage = containsBlockedMlsDisplayLanguage(homepage)
      ? null
      : homepage;
    const safeSettings = containsBlockedMlsDisplayLanguage(settings)
      ? null
      : settings;

    const allowedServices = services?.filter(
      (service) => !containsBlockedMlsDisplayLanguage(service)
    );

    const mappedServices = allowedServices?.length
      ? allowedServices.map((s) => ({
          title: s.title ?? "",
          description: s.shortDescription ?? "",
          bullets: s.features ?? [],
          cta: s.cta ?? "Learn More",
        }))
      : fallbackContent.services;

    const allowedTestimonials = testimonials?.filter(
      (testimonial) => !containsBlockedMlsDisplayLanguage(testimonial)
    );

    const mappedTestimonials = allowedTestimonials?.length
      ? allowedTestimonials.map((t) => ({
          quote: t.quote ?? "",
          name: t.name ?? "",
          role: t.title ?? "",
          company: t.company ?? "",
        }))
      : fallbackContent.testimonials;

    const mappedStats = safeHomepage?.stats?.length
      ? safeHomepage.stats.map((s) => ({
          label: s.label ?? "",
          value: s.value ?? "",
        }))
      : fallbackContent.hero.stats;

    return {
      ...fallbackContent,
      company: {
        ...fallbackContent.company,
        name: safeSettings?.siteName ?? fallbackContent.company.name,
        tagline: safeSettings?.tagline ?? fallbackContent.company.tagline,
        email: safeSettings?.email ?? fallbackContent.company.email,
        phone: safeSettings?.phone ?? fallbackContent.company.phone,
        hq: safeSettings?.address ?? fallbackContent.company.hq,
      },
      hero: {
        ...fallbackContent.hero,
        title:
          safeHomepage?.heroHeadline &&
          !containsBlockedMlsDisplayLanguage(safeHomepage.heroHeadline)
            ? safeHomepage.heroHeadline
            : fallbackContent.hero.title,
        subtitle:
          safeHomepage?.heroSubheadline &&
          !containsBlockedMlsDisplayLanguage(safeHomepage.heroSubheadline)
            ? safeHomepage.heroSubheadline
            : fallbackContent.hero.subtitle,
        primaryCta: safeHomepage?.heroCta1Text ?? fallbackContent.hero.primaryCta,
        secondaryCta: safeHomepage?.heroCta2Text ?? fallbackContent.hero.secondaryCta,
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
