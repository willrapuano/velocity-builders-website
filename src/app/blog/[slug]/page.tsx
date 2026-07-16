import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog/api";
import type { Metadata } from "next";
import type { ComponentProps } from "react";
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

/** Extract the plain-text string from a portable-text block's children array. */
function blockText(value: PortableTextBlock): string {
  const children = Array.isArray(value.children) ? value.children : [];

  return children
    .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
    .join("");
}

// Equal Housing pattern removed — Velocity Builders is not a real estate brokerage (2026-03-29)
// const EQUAL_HOUSING_RE = /equal\s+housing\s+opportunit/i;

/** Matches HTML-style comments Sanity sometimes stores as plain text: <!-- ... --> */
const HTML_COMMENT_RE = /^<!--[\s\S]*?-->$/;

/** Matches Q&A paragraph prefixes */
const QA_Q_RE = /^Q:\s/;
const QA_A_RE = /^A:\s/;

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ value, children }) => {
      const raw = blockText(value);
      const trimmed = raw.trim();

      // Issue 1a: render "---" (plain text) as <hr>
      if (trimmed === "---" || trimmed === "- - -" || trimmed === "—") {
        return <hr className="my-8 border-t border-gray-200" />;
      }

      // Issue 1b: hide Sanity editor comment markers <!-- ... -->
      if (HTML_COMMENT_RE.test(trimmed)) {
        return null;
      }


      // Issue 4: Q&A / FAQ blocks — style Q: and A: pairs for readability
      if (QA_Q_RE.test(raw)) {
        return (
          <p className="text-[17px] font-semibold text-gray-900 leading-[1.7] mt-6 mb-1">
            {children}
          </p>
        );
      }
      if (QA_A_RE.test(raw)) {
        return (
          <p className="text-gray-700 text-[17px] leading-[1.85] mb-5 pl-4 border-l-2 border-blue-100">
            {children}
          </p>
        );
      }

      // Step N: pattern — bold the "Step N:" label
      if (/^Step \d+:/i.test(trimmed)) {
        const match = trimmed.match(/^(Step \d+:)(.*)/is);
        if (match) {
          return (
            <p className="text-gray-700 text-[17px] leading-[1.85] mb-3 mt-6">
              <strong className="text-gray-900">{match[1]}</strong>{match[2]}
            </p>
          );
        }
      }

      // Blockquote / email script lines starting with ">"
      if (trimmed.startsWith(">")) {
        const clean = trimmed.replace(/^>\s?/, "").trim();
        if (!clean) return <div className="h-2" />;
        return (
          <p className="text-gray-700 text-[15px] leading-relaxed pl-4 border-l-2 border-gray-300 my-1 font-mono">
            {clean}
          </p>
        );
      }

      // Boilerplate footer blocks wrapped in *asterisks* — strip and render italic
      if (trimmed.startsWith("*") && trimmed.endsWith("*") && trimmed.length > 2) {
        const clean = trimmed.slice(1, -1).trim();
        return <p className="text-sm italic text-gray-500 mt-6 mb-2">{clean}</p>;
      }

      // Issue 5: Plain-paragraph FAQ questions — detect questions by:
      //   1. Text ends with "?"
      //   2. Under ~120 chars (short question, not a long sentence ending mid-thought)
      //   3. Does NOT start with a lowercase word (rules out mid-paragraph sentences)
      const isImpliedQuestion =
        trimmed.endsWith("?") &&
        trimmed.length < 120 &&
        /^[A-Z0-9"'"\u2018\u201C]/.test(trimmed);

      if (isImpliedQuestion) {
        return (
          <p className="font-bold text-blue-700 mt-10 mb-1 text-[17px] leading-snug border-l-4 border-blue-500 pl-3">
            {children}
          </p>
        );
      }

      return <p className="text-gray-700 text-[17px] leading-[1.85] mb-5">{children}</p>;
    },
    caption: ({ children }) => <p className="text-center text-sm italic text-gray-500 mt-2 mb-4">{children}</p>,
    h2: ({ children }) => <h2 className="text-[1.6rem] font-bold text-gray-900 mt-14 mb-5 pb-3 border-b border-gray-200">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-blue-800 mt-10 mb-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base font-semibold text-gray-800 mt-8 mb-3">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 bg-blue-50 px-6 py-4 rounded-r-xl text-gray-700 text-[17px] my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="text-gray-700 my-4 space-y-2 list-disc pl-6">{children}</ul>,
    number: ({ children }) => <ol className="text-gray-700 my-4 space-y-2 list-decimal pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-[17px] leading-[1.8] pl-1">{children}</li>,
    number: ({ children }) => <li className="text-[17px] leading-[1.8] pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-gray-900 font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : undefined;

      return (
        <a href={href} className="text-blue-600 font-medium hover:underline" target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const asset = isRecord(value.asset) ? value.asset : null;
      const imageUrl = readString(asset?.url) ?? readString(value.url);

      if (!imageUrl) return null;

      const alt = readString(value.alt) ?? "";
      const caption = readString(value.caption);

      return (
        <figure className="my-10">
          <Image
            src={imageUrl}
            alt={alt}
            width={1200}
            height={675}
            className="rounded-xl w-full object-cover"
          />
          {caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => <Callout value={value as ComponentProps<typeof Callout>["value"]} />,
    table: ({ value }) => <Table value={value as ComponentProps<typeof Table>["value"]} />,
    accordion: ({ value }) => <Accordion value={value as ComponentProps<typeof Accordion>["value"]} />,
    // Issue 1c: native Sanity hr block type
    hr: () => <hr className="my-8 border-t border-gray-200" />,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

// Allow slugs published after the last build to render via SSR instead of 404
export const dynamicParams = true;

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
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        {/* Article body — Portable Text */}
        {/* Issue 3: strip first block if it duplicates the post title */}
        <div className="blog-body">
          <PortableText
            value={(() => {
              const body = post.body as PortableTextBlock[];
              if (!body?.length) return body;
              const first = body[0];
              const firstText = first ? blockText(first).trim() : "";
              const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
              if (normalize(firstText) === normalize(post.title)) return body.slice(1);
              return body;
            })() as Parameters<typeof PortableText>[0]["value"]}
            components={portableTextComponents}
          />
        </div>

        {/* Caption line */}
        <p className="mt-16 text-center text-sm italic text-gray-500">
          Velocity Builders helps real estate agents, lenders, and brokerages build websites and marketing systems that generate and convert leads automatically.
        </p>

        {/* Author card */}
        <div className="mt-6 p-6 rounded-xl border border-gray-200 bg-gray-50 flex gap-4 items-start">
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
