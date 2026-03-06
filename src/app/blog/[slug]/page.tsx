import { notFound } from "next/navigation";
import Link from "next/link";
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

function detectCategory(tags: string[]): string {
  if (tags.some(t => t.toLowerCase().includes("title"))) return "title-insurance";
  if (tags.some(t => ["ai", "artificial intelligence"].some(w => t.toLowerCase().includes(w)))) return "ai-tools";
  if (tags.some(t => ["news", "market", "regulation", "nar"].some(w => t.toLowerCase().includes(w)))) return "real-estate-news";
  return "marketing-systems";
}

const NEWS_TAGS = ["real estate news", "news", "market", "regulation", "nar"];

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Velocity Builders Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `/blog/${slug}`,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const isNews = post.tags.some(t => NEWS_TAGS.some(nt => t.toLowerCase().includes(nt)));
  const articleType = isNews ? "NewsArticle" : "BlogPosting";
  const categorySlug = detectCategory(post.tags);
  const category = CATEGORY_MAP[categorySlug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": articleType,
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
        keywords: post.tags,
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

        {/* Article body */}
        <div
          className="
            prose prose-invert max-w-none
            prose-p:text-slate-300 prose-p:text-[17px] prose-p:leading-[1.85] prose-p:mb-5
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-[1.6rem] prose-h2:mt-14 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-emerald-300
            prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-slate-200 prose-h4:font-semibold
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-strong:text-white prose-strong:font-semibold
            prose-ul:text-slate-300 prose-ul:my-4 prose-ul:space-y-2
            prose-ol:text-slate-300 prose-ol:my-4 prose-ol:space-y-2
            prose-li:text-[17px] prose-li:leading-[1.8] prose-li:pl-1
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-400 prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
            prose-blockquote:text-slate-300 prose-blockquote:text-[17px]
            prose-img:rounded-xl prose-img:my-10 prose-img:w-full
            prose-hr:border-white/10 prose-hr:my-10
            prose-table:text-sm prose-table:w-full
            prose-th:text-white prose-th:font-semibold prose-th:border prose-th:border-slate-700 prose-th:bg-white/5 prose-th:px-4 prose-th:py-2
            prose-td:text-slate-300 prose-td:border prose-td:border-slate-800 prose-td:px-4 prose-td:py-2
            prose-code:text-emerald-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          "
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

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
          <h3 className="text-xl font-bold text-white mb-2">Ready to grow your real estate business?</h3>
          <p className="text-slate-400 text-sm mb-5">Velocity Builders builds marketing systems for agents and loan officers nationwide — CRM automation, websites, lead generation, and more.</p>
          <Link href="/contact" className="inline-block rounded-full bg-emerald-400 px-8 py-3 text-sm font-bold text-slate-900 hover:bg-emerald-300 transition">
            Work With Us →
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
