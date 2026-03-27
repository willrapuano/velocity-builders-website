import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog/api";
import type { Metadata } from "next";
import { Callout } from "@/components/portable-text/Callout";
import { Table } from "@/components/portable-text/Table";
import { Accordion } from "@/components/portable-text/Accordion";

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_MAP: Record<string, { name: string; color: string }> = {
  "marketing-systems": { name: "Marketing Systems", color: "text-blue-700 border-blue-200 bg-blue-50" },
  "real-estate-news": { name: "Real Estate News", color: "text-green-700 border-green-200 bg-green-50" },
  "ai-tools": { name: "AI News & Tools", color: "text-purple-700 border-purple-200 bg-purple-50" },
  "title-insurance": { name: "Title Insurance", color: "text-amber-700 border-amber-200 bg-amber-50" },
};

const CTA_OVERRIDES: Record<string, { title: string; body: string; button: string }> = {
  "crm-automation-roi-real-estate-teams": {
    title: "Get a 14-Day CRM Automation Plan",
    body: "We'll map the exact sequence changes to improve response time and consult conversion.",
    button: "Get a 14-Day CRM Automation Plan",
  },
  "loan-officers-digital-marketing-strategy-2026": {
    title: "Audit My LO Funnel",
    body: "See where local search visibility, follow-up cadence, and trust signals are leaking consult volume.",
    button: "Audit My LO Funnel",
  },
  "real-estate-agents-automated-marketing-leads": {
    title: "Fix My Speed-to-Lead in 10 Days",
    body: "We'll prioritize the response-time and nurture fixes that recover missed opportunities fast.",
    button: "Fix My Speed-to-Lead in 10 Days",
  },
};

const portableTextComponents = {
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => <p className="text-gray-700 text-[17px] leading-[1.85] mb-5">{children}</p>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ children }: any) => <h2 className="text-[1.6rem] font-bold text-gray-900 mt-14 mb-4 pb-3 border-b border-gray-200">{children}</h2>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-blue-800 mt-10 mb-3">{children}</h3>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h4: ({ children }: any) => <h4 className="text-base font-semibold text-gray-800 mt-6 mb-2">{children}</h4>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 bg-blue-50 px-6 py-4 rounded-r-xl text-gray-700 text-[17px] my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bullet: ({ children }: any) => <ul className="text-gray-700 my-4 space-y-2 list-disc pl-6">{children}</ul>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    number: ({ children }: any) => <ol className="text-gray-700 my-4 space-y-2 list-decimal pl-6">{children}</ol>,
  },
  listItem: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bullet: ({ children }: any) => <li className="text-[17px] leading-[1.8] pl-1">{children}</li>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    number: ({ children }: any) => <li className="text-[17px] leading-[1.8] pl-1">{children}</li>,
  },
  marks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    strong: ({ children }: any) => <strong className="text-gray-900 font-semibold">{children}</strong>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    em: ({ children }: any) => <em className="italic">{children}</em>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ children }: any) => (
      <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: ({ value, children }: any) => (
      <a href={value?.href} className="text-blue-600 font-medium hover:underline" target={value?.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: any) => {
      if (!value?.asset?.url && !value?.url) return null;
      return (
        <figure className="my-10">
          <img
            src={value.asset?.url || value.url}
            alt={value.alt || ""}
            className="rounded-xl w-full object-cover"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callout: ({ value }: any) => <Callout value={value} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: ({ value }: any) => <Table value={value} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accordion: ({ value }: any) => <Accordion value={value} />,
  },
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title: `${title} | Velocity Builders Blog`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `/blog/${slug}`,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `https://velocity-builders.com/blog/${slug}` },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const categorySlug = post.category || "marketing-systems";
  const category = CATEGORY_MAP[categorySlug] ?? CATEGORY_MAP["marketing-systems"];

  const cta = CTA_OVERRIDES[slug] ?? {
    title: "Book a 20-Minute Growth Blueprint",
    body: "See where your lead handoff and follow-up are leaking deals, then fix the right things first.",
    button: "Book a 20-Minute Growth Blueprint",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://velocity-builders.com/blog/${slug}/#article`,
        headline: post.title,
        description: post.seoDescription || post.excerpt || post.title,
        datePublished: post.dateISO || post.date,
        dateModified: post.dateISO || post.date,
        author: {
          "@type": "Person",
          name: "Will Rapuano",
          url: "https://velocity-builders.com/about",
          jobTitle: "Founder",
          worksFor: { "@type": "Organization", name: "Velocity Builders" },
        },
        publisher: {
          "@type": "Organization",
          name: "Velocity Builders",
          url: "https://velocity-builders.com",
          logo: { "@type": "ImageObject", url: "https://velocity-builders.com/logo.png" },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://velocity-builders.com/blog/${slug}/` },
        ...(post.featuredImage && { image: post.featuredImage }),
        articleSection: category.name,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://velocity-builders.com/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://velocity-builders.com/blog/" },
          { "@type": "ListItem", position: 3, name: category.name, item: `https://velocity-builders.com/blog/category/${categorySlug}/` },
          { "@type": "ListItem", position: 4, name: post.title },
        ],
      },
    ],
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-gray-900 transition">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-gray-900 transition">Blog</Link>
          <span>›</span>
          <Link href={`/blog/category/${categorySlug}`} className={`hover:opacity-80 transition font-medium ${category.color.split(" ")[0]}`}>
            {category.name}
          </Link>
        </nav>

        {/* Category pill */}
        <Link
          href={`/blog/category/${categorySlug}`}
          className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide mb-5 ${category.color}`}
        >
          {category.name}
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Byline */}
        <p className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          By <span className="text-gray-900 font-medium">{post.author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <time>{post.date}</time>
        </p>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <img src={post.featuredImage} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        {/* Article body — Portable Text */}
        <div className="blog-body">
          <PortableText value={post.body as Parameters<typeof PortableText>[0]["value"]} components={portableTextComponents} />
        </div>

        {/* Author card */}
        <div className="mt-16 p-6 rounded-xl border border-gray-200 bg-gray-50 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-blue-700 font-bold text-lg">W</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Will Rapuano</p>
            <p className="text-sm text-gray-600">Founder, Velocity Builders LLC. Business Development Officer at Pruitt Title. Helping real estate agents and loan officers scale with better marketing systems.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 p-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-center">
          <h3 className="text-xl font-bold text-white mb-2">{cta.title}</h3>
          <p className="text-blue-100 text-sm mb-5">{cta.body}</p>
          <Link href="/contact" className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-blue-700 hover:bg-gray-100 transition shadow-lg">
            {cta.button}
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition">← Back to all posts</Link>
        </div>
      </div>
    </div>
  );
}
