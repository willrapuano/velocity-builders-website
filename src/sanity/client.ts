import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = "2024-01-01";

if (!projectId || !dataset) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required.");
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Queries
export const homepageQuery = `*[_type == "homepage"][0]`;
export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;
export const aboutQuery = `*[_type == "about"][0]`;
export const servicesQuery = `*[_type == "service"] | order(order asc)`;
export const featuredServicesQuery = `*[_type == "service" && featured == true] | order(order asc)`;
export const testimonialsQuery = `*[_type == "testimonial"] | order(order asc)`;
export const featuredTestimonialsQuery = `*[_type == "testimonial" && featured == true] | order(order asc)`;
const caseStudyProjection = `{ _id, title, slug, publicClientLabel, summary, challenge, approach, outcome, verifiedMetrics, compliance, releasedAt, projectionSha256, sourceVersionId, featured, "coverImageUrl": coverImage.asset->url }`;
export const caseStudiesQuery = `*[_type == "caseStudy" && projectionSchemaVersion == "rebuilder-case-study-projection-v1" && defined(projectionSha256) && !(_id in path("drafts.**"))] | order(releasedAt desc) ${caseStudyProjection}`;
export const featuredCaseStudiesQuery = `*[_type == "caseStudy" && projectionSchemaVersion == "rebuilder-case-study-projection-v1" && defined(projectionSha256) && featured == true && !(_id in path("drafts.**"))] | order(releasedAt desc) ${caseStudyProjection}`;
export const caseStudyBySlugQuery = `*[_type == "caseStudy" && projectionSchemaVersion == "rebuilder-case-study-projection-v1" && slug.current == $slug && defined(projectionSha256) && !(_id in path("drafts.**"))][0] ${caseStudyProjection}`;
export const allPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) { _id, title, slug, excerpt, author, publishedAt, category, tags, "featuredImage": mainImage.asset->url }`;
export const postBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] { ..., "featuredImage": mainImage.asset->url }`;
