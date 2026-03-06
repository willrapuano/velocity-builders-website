import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
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
export const caseStudiesQuery = `*[_type == "caseStudy"] | order(publishedAt desc)`;
export const featuredCaseStudiesQuery = `*[_type == "caseStudy" && featured == true] | order(publishedAt desc)`;
export const allPostsQuery = `*[_type == "post"] | order(publishedAt desc) { _id, title, slug, excerpt, author, publishedAt, category, tags, mainImage }`;
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]`;
