import Link from "next/link";
import { getAllPosts } from "@/lib/blog/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Velocity Builders",
  description:
    "Marketing strategies, automation tips, and growth insights for real estate agents and loan officers.",
  openGraph: {
    title: "Blog | Velocity Builders",
    description:
      "Marketing strategies, automation tips, and growth insights for real estate agents and loan officers.",
    type: "website",
    url: "/blog",
  },
};

const CATEGORIES = [
  { slug: "marketing-systems", name: "Marketing Systems" },
  { slug: "real-estate-news", name: "Real Estate News" },
  { slug: "ai-tools", name: "AI News & Tools" },
  { slug: "title-insurance", name: "Title Insurance" },
];

export default function BlogIndex() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Blog — Velocity Builders",
        description: "Marketing strategies, automation tips, and growth insights for real estate agents and loan officers.",
        url: "https://velocitybuilders.io/blog/",
        isPartOf: { "@type": "WebSite", name: "Velocity Builders", url: "https://velocitybuilders.io" },
      },
      {
        "@type": "Organization",
        name: "Velocity Builders",
        url: "https://velocitybuilders.io",
        description: "Real estate marketing agency specializing in automation, CRM, SEO, and lead generation for realtors and loan officers.",
        founder: { "@type": "Person", name: "Will Rapuano" },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
        <p className="text-slate-400 mb-8 text-lg">
          Growth strategies for real estate agents and loan officers — lead gen,
          CRM automation, AI tools, title insurance, and more.
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className="px-4 py-2 rounded-full border border-slate-600 text-sm font-medium text-slate-300 hover:border-emerald-400 hover:text-emerald-400 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-slate-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-emerald-400/40 hover:bg-white/10 transition-all"
              >
                {post.featuredImage && (
                  <div className="aspect-video overflow-hidden bg-slate-800">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <time className="text-xs text-slate-500">{post.date}</time>
                  <h2 className="text-base font-semibold text-white mt-1 mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
