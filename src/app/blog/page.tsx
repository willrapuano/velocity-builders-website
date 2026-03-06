import Link from "next/link";
import { getAllPosts } from "@/lib/blog/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Velocity Builders",
  description: "Marketing strategies, automation tips, and growth insights for real estate agents and loan officers.",
  openGraph: {
    title: "Blog | Velocity Builders",
    description: "Marketing strategies, automation tips, and growth insights for real estate agents and loan officers.",
    type: "website",
    url: "/blog",
  },
};

const CATEGORIES = [
  { slug: "marketing-systems", name: "Marketing Systems", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  { slug: "real-estate-news", name: "Real Estate News", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  { slug: "ai-tools", name: "AI News & Tools", color: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
  { slug: "title-insurance", name: "Title Insurance", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "marketing-systems": "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  "real-estate-news": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "ai-tools": "text-violet-400 border-violet-400/30 bg-violet-400/10",
  "title-insurance": "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

function getCategory(tags: string[]) {
  if (tags.some(t => t.toLowerCase().includes("title"))) return { slug: "title-insurance", name: "Title Insurance" };
  if (tags.some(t => ["ai", "artificial intelligence"].some(w => t.toLowerCase().includes(w)))) return { slug: "ai-tools", name: "AI News & Tools" };
  if (tags.some(t => ["news", "market", "regulation"].some(w => t.toLowerCase().includes(w)))) return { slug: "real-estate-news", name: "Real Estate News" };
  return { slug: "marketing-systems", name: "Marketing Systems" };
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Velocity Builders Blog</h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Marketing strategy, automation, AI tools, and title insurance insights for real estate professionals.
        </p>
      </div>

      {/* Category nav */}
      <div className="flex flex-wrap gap-3 mb-12 pb-8 border-b border-white/10">
        <Link href="/blog" className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white">
          All Posts
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition hover:opacity-80 ${cat.color}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Featured post (first) */}
      {posts.length > 0 && (() => {
        const featured = posts[0];
        const cat = getCategory(featured.tags);
        const colorClass = CATEGORY_COLORS[cat.slug];
        return (
          <div className="mb-12">
            <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
              {featured.featuredImage && (
                <div className="aspect-video md:aspect-auto overflow-hidden bg-slate-800">
                  <img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-8 flex flex-col justify-center bg-white/5">
                <span className={`inline-block self-start px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide mb-4 ${colorClass}`}>
                  {cat.name}
                </span>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">By <span className="text-slate-400">{featured.author}</span> · <span>{featured.date}</span></p>
                  <span className="text-sm font-semibold text-emerald-400 group-hover:underline">Read More →</span>
                </div>
              </div>
            </Link>
          </div>
        );
      })()}

      {/* Post grid */}
      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(1).map((post) => {
            const cat = getCategory(post.tags);
            const colorClass = CATEGORY_COLORS[cat.slug];
            return (
              <article key={post.slug} className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] transition-all">
                {/* Image */}
                {post.featuredImage && (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-800">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                  {/* Category */}
                  <Link href={`/blog/category/${cat.slug}`} className={`inline-block self-start px-3 py-0.5 rounded-full border text-xs font-semibold uppercase tracking-wide mb-3 ${colorClass}`}>
                    {cat.name}
                  </Link>
                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Posted by <span className="text-slate-400">{post.author?.split("|")[0].trim()}</span><br /><span>{post.date}</span></p>
                    <Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-emerald-400 hover:underline shrink-0">
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
