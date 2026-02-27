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
      apiVersion: "2023-10-01",
      token: sanityToken,
      useCdn: false,
    })
  : null;

type SanityDoc = Partial<SiteContent>;

export async function getSiteContent(): Promise<SiteContent> {
  if (!client) {
    return fallbackContent;
  }

  try {
    const doc = await client.fetch<SanityDoc>(
      `*[_type == "velocitySite" && defined(company.name)][0]`
    );
    if (!doc) return fallbackContent;
    return {
      ...fallbackContent,
      ...doc,
      company: { ...fallbackContent.company, ...(doc.company ?? {}) },
      hero: { ...fallbackContent.hero, ...(doc.hero ?? {}) },
      services: doc.services?.length ? doc.services : fallbackContent.services,
      engagement: doc.engagement?.length ? doc.engagement : fallbackContent.engagement,
      processSteps: doc.processSteps?.length ? doc.processSteps : fallbackContent.processSteps,
      testimonials: doc.testimonials?.length ? doc.testimonials : fallbackContent.testimonials,
      legal: doc.legal?.length ? doc.legal : fallbackContent.legal,
    };
  } catch (error) {
    console.warn("Sanity fetch failed, falling back to local content", error);
    return fallbackContent;
  }
}
