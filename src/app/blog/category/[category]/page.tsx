import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog/api";
import type { Metadata } from "next";

const CATEGORIES: Record<string, { name: string; description: string }> = {
  "marketing-systems": {
    name: "Marketing Systems",
    description: "CRM automation, lead generation, and marketing strategies for real estate agents and loan officers.",
  },
  "real-estate-news": {
    name: "Real Estate News",
    description: "Industry trends, market shifts, regulation changes, and what they mean for your business.",
  },
  "ai-tools": {
    name: "AI News & Tools",
    description: "AI adoption, tool reviews, and automation workflows transforming real estate and mortgage.",
  },
  "title-insurance": {
    name: "Title Insurance",
    description: "Title insurance education, horror stories, wire fraud prevention, and closing process insights.",
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return {};
  return {
    title: `${cat.name} — Velocity Builders Blog`,
    description: cat.description,
    openGraph: { title: `${cat.name} — Velocity Builders Blog`, description: cat.description, type: "website", url: `/blog/category/${category}` },
  };
}

function postMatchesCategory(postTags: string[], categorySlug: string): boolean {
  const cat = CATEGORIES[categorySlug];
  if (!cat) return false;
  return postTags.some((tag) => {
    const tagLower = tag.toLowerCase();
    if (tagLower === categorySlug || tagLower === categorySlug.replace(/-/g, " ")) return true;
    if (categorySlug === "marketing-systems" && ["marketing", "crm", "automation", "lead", "seo"].some(w => tagLower.includes(w))) return true;
    if (categorySlug === "real-estate-news" && ["news", "market", "regulation", "nar"].some(w => tagLower.includes(w))) return true;
    if (categorySlug === "ai-tools" && ["ai", "artificial intelligence", "chatgpt", "automation"].some(w => tagLower.includes(w))) return true;
    if (categorySlug === "title-insurance" && ["title", "closing", "settlement", "escrow"].some(w => tagLower.includes(w))) return true;
    return false;
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => postMatchesCategory(p.tags, category));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} — Velocity Builders Blog`,
    description: cat.description,
    url: `https://velocitybuilders.io/blog/category/${category}/`,
    isPartOf: { "@type": "WebSite", name: "Velocity Builders", url: "https://velocitybuilders.io" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-1">
          <Link href="/blog" className="hover:text-emerald-400 transition">Blog</Link>
          <span>›</span>
          <span className="text-slate-300">{cat.name}</span>
        </nav>

        <h1 className="text-4xl font-bold text-white mb-4">{cat.name}</h1>
        <p className="text-slate-400 mb-12 text-lg">{cat.description}</p>

        {posts.length === 0 ? (
          <p className="text-slate-500">No posts in this category yet. Check back soon.</p>
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
