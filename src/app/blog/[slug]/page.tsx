import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog/api";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_MAP: Record<string, { name: string; color: string }> = {
  "marketing-systems": { name: "Marketing Systems", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  "real-estate-news": { name: "Real Estate News", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  "ai-tools": { name: "AI News & Tools", color: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
  "title-insurance": { name: "Title Insurance", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
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

// Portable Text serializers styled to match existing prose design
const portableTextComponents = {
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => <p className="text-slate-300 text-[17px] leading-[1.85] mb-5">{children}</p>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ children }: any) => <h2 className="text-[1.6rem] font-bold text-white mt-14 mb-4 pb-3 border-b border-white/10">{children}</h2>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-emerald-300 mt-10 mb-3">{children}</h3>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h4: ({ children }: any) => <h4 className="text-base font-semibold text-slate-200 mt-6 mb-2">{children}</h4>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-emerald-400 bg-white/5 px-6 py-4 rounded-r-xl text-slate-300 text-[17px] my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bullet: ({ children }: any) => <ul className="text-slate-300 my-4 space-y-2 list-disc pl-6">{children}</ul>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    number: ({ children }: any) => <ol className="text-slate-300 my-4 space-y-2 list-decimal pl-6">{children}</ol>,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listItem: ({ children }: any) => <li className="text-[17px] leading-[1.8] pl-1">{children}</li>,
  marks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    strong: ({ children }: any) => <strong className="text-white font-semibold">{children}</strong>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    em: ({ children }: any) => <em className="italic">{children}</em>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ children }: any) => (
      <code className="text-emerald-300 bg-white/5 px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: ({ value, children }: any) => (
      <a href={value?.href} className="text-emerald-400 font-medium hover:underline" target={value?.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
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
            <figcaption className="text-center text-sm text-slate-500 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
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
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-8 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
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
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          {post.title}
        </h1>

        {/* Byline */}
        <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
          By <span className="text-white font-medium">{post.author}</span>
          <span className="mx-2 text-slate-600">|</span>
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
        <div className="mt-16 p-6 rounded-2xl border border-white/10 bg-white/5 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold text-lg">W</span>
          </div>
          <div>
            <p className="font-semibold text-white">Will Rapuano</p>
            <p className="text-sm text-slate-400">Founder, Velocity Builders LLC. Business Development Officer at Pruitt Title. Helping real estate agents and loan officers scale with better marketing systems.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 p-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 text-center">
          <h3 className="text-xl font-bold text-white mb-2">{cta.title}</h3>
          <p className="text-slate-400 text-sm mb-5">{cta.body}</p>
          <Link href="/contact" className="inline-block rounded-full bg-emerald-400 px-8 py-3 text-sm font-bold text-slate-900 hover:bg-emerald-300 transition">
            {cta.button}
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-slate-500 hover:text-white transition">← Back to all posts</Link>
        </div>
      </div>
    </>
  );
}
