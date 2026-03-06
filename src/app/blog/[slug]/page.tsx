import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog/api";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const NEWS_TAGS = ["real estate news", "news", "market", "regulation", "NAR"];

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
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const isNews = post.tags.some((t) => NEWS_TAGS.some((nt) => t.toLowerCase().includes(nt)));
  const articleType = isNews ? "NewsArticle" : "BlogPosting";
  const categorySlug = isNews ? "real-estate-news"
    : post.tags.some((t) => t.toLowerCase().includes("ai")) ? "ai-tools"
    : post.tags.some((t) => t.toLowerCase().includes("title")) ? "title-insurance"
    : "marketing-systems";

  const categoryName: Record<string, string> = {
    "marketing-systems": "Marketing Systems",
    "real-estate-news": "Real Estate News",
    "ai-tools": "AI News & Tools",
    "title-insurance": "Title Insurance",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": articleType,
        "@id": `https://velocitybuilders.io/blog/${slug}/#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: "Will Rapuano",
          url: "https://velocitybuilders.io/about",
          jobTitle: "Founder",
          worksFor: { "@type": "Organization", name: "Velocity Builders" },
        },
        publisher: {
          "@type": "Organization",
          name: "Velocity Builders",
          url: "https://velocitybuilders.io",
          logo: { "@type": "ImageObject", url: "https://velocitybuilders.io/logo.png" },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://velocitybuilders.io/blog/${slug}/` },
        ...(post.featuredImage && { image: post.featuredImage }),
        articleSection: categoryName[categorySlug],
        keywords: post.tags,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://velocitybuilders.io/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://velocitybuilders.io/blog/" },
          { "@type": "ListItem", position: 3, name: categoryName[categorySlug], item: `https://velocitybuilders.io/blog/category/${categorySlug}/` },
          { "@type": "ListItem", position: 4, name: post.title },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-8 flex flex-wrap gap-1 items-center">
          <Link href="/blog" className="hover:text-emerald-400 transition">Blog</Link>
          <span>›</span>
          <Link href={`/blog/category/${categorySlug}`} className="hover:text-emerald-400 transition">
            {categoryName[categorySlug]}
          </Link>
          <span>›</span>
          <span className="text-slate-400 truncate max-w-[200px]">{post.title}</span>
        </nav>

        <header className="mb-10">
          <time className="text-sm text-slate-500">{post.date}</time>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4 leading-tight">{post.title}</h1>
          <p className="text-slate-400 text-lg">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white/5 text-slate-400 border border-white/10 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-3">By <span className="text-slate-300">{post.author}</span></p>
        </header>

        {post.featuredImage && (
          <div className="mb-10 rounded-xl overflow-hidden aspect-video bg-slate-800">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-slate-300
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-li:text-slate-300
            prose-blockquote:border-emerald-400 prose-blockquote:text-slate-400
            prose-code:text-emerald-300 prose-code:bg-white/5
            prose-table:text-slate-300
            prose-th:text-white prose-th:border-slate-600
            prose-td:border-slate-700"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="mt-16 pt-8 border-t border-white/10">
          <p className="text-slate-400 text-sm mb-4">
            Velocity Builders helps real estate agents and loan officers build
            marketing systems that generate leads and close more deals.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-emerald-400 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400/10"
          >
            Work With Us →
          </Link>
        </footer>
      </article>
    </>
  );
}
