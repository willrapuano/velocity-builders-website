/**
 * Blog API — reads from Sanity CMS (blogPost documents).
 * Previously read from local markdown files; rewired 2026-03-12.
 */
import { client } from "@/sanity/client";
import {
  containsBlockedMlsDisplayLanguage,
  PUBLIC_BLOG_CONTENT_FILTER,
} from "@/lib/content-policy";

// Blog routes should read fresh published content so newly-published posts don't 404
const blogClient = client.withConfig({ useCdn: false, perspective: "published" });

// Map Sanity category values to frontend URL slugs
const SANITY_CATEGORY_TO_SLUG: Record<string, string> = {
  marketingSystems: "marketing-systems",
  realEstateNews: "real-estate-news",
  aiTools: "ai-tools",
  seo: "seo",
};

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  excerpt: string;
  author: string;
  tags: string[];
  category: string; // frontend slug, e.g. "marketing-systems"
  featuredImage?: string;
}

export interface Post extends PostMeta {
  body: unknown[]; // Portable Text blocks
  seoTitle?: string;
  seoDescription?: string;
}

const META_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  seoTitle,
  seoDescription,
  featured,
  "featuredImage": mainImage.asset->url
`;

const FULL_FIELDS = `
  ${META_FIELDS},
  body
`;

function toPostMeta(doc: Record<string, unknown>): PostMeta {
  return {
    slug: (doc.slug as string) || "",
    title: (doc.title as string) || "",
    date: doc.publishedAt
      ? new Date(doc.publishedAt as string).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    excerpt: (doc.excerpt as string) || "",
    author: "Will Rapuano | Velocity Builders",
    tags: [],
    category:
      SANITY_CATEGORY_TO_SLUG[(doc.category as string) || ""] ||
      "marketing-systems",
    dateISO: (doc.publishedAt as string)?.slice(0, 10) || "",
    featuredImage: (doc.featuredImage as string) || undefined,
  };
}

/** Fetch all published blog posts, newest first. */
export async function getAllPosts(): Promise<PostMeta[]> {
  const docs = await blogClient.fetch(
    `*[_type == "blogPost" && ${PUBLIC_BLOG_CONTENT_FILTER}] | order(publishedAt desc) {${META_FIELDS}}`,
    {},
    { next: { revalidate: 60 } }
  );
  return (docs as Record<string, unknown>[])
    .filter((doc) => !containsBlockedMlsDisplayLanguage(doc))
    .map(toPostMeta);
}

/** Fetch all post slugs (for generateStaticParams). */
export async function getAllPostSlugs(): Promise<string[]> {
  const docs = await blogClient.fetch(
    `*[_type == "blogPost" && ${PUBLIC_BLOG_CONTENT_FILTER}] { "slug": slug.current }`,
    {},
    { next: { revalidate: 3600 } }
  );
  return (docs as { slug: string }[]).map((d) => d.slug).filter(Boolean);
}

/** Fetch a single post by its slug. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const doc = await blogClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug && ${PUBLIC_BLOG_CONTENT_FILTER}][0] {${FULL_FIELDS}}`,
    { slug },
    { next: { revalidate: 60 } }
  );
  if (!doc || containsBlockedMlsDisplayLanguage(doc)) return null;
  const meta = toPostMeta(doc as Record<string, unknown>);
  return {
    ...meta,
    body: (doc.body as unknown[]) || [],
    seoTitle: (doc.seoTitle as string) || undefined,
    seoDescription: (doc.seoDescription as string) || undefined,
  };
}

/** Fetch posts filtered by a frontend category slug. */
export async function getPostsByCategory(
  categorySlug: string
): Promise<PostMeta[]> {
  const sanityCategories = Object.entries(SANITY_CATEGORY_TO_SLUG)
    .filter(([, slug]) => slug === categorySlug)
    .map(([key]) => key);

  if (sanityCategories.length === 0) return [];

  const docs = await blogClient.fetch(
    `*[_type == "blogPost" && category in $cats && ${PUBLIC_BLOG_CONTENT_FILTER}] | order(publishedAt desc) {${META_FIELDS}}`,
    { cats: sanityCategories },
    { next: { revalidate: 60 } }
  );
  return (docs as Record<string, unknown>[])
    .filter((doc) => !containsBlockedMlsDisplayLanguage(doc))
    .map(toPostMeta);
}
