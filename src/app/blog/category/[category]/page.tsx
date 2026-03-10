import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog/api";
import type { Metadata } from "next";

const CATEGORIES: Record<string, { name: string; header: string; description: string; meta: string }> = {
  "marketing-systems": {
    name: "Marketing Systems",
    header: "Marketing Systems That Convert Faster in the DMV",
    description: "CRM and automation workflows that help agents and lenders respond faster, book more consults, and keep referrals warm.",
    meta: "CRM and automation systems that help Agents and lenders respond faster, convert more leads, and keep referrals warm.",
  },
  "real-estate-news": {
    name: "Real Estate News",
    header: "Real Estate News That Affects Your Next 90 Days",
    description: "Local market shifts, policy changes, and demand signals translated into clear action for agents, lenders, and title partners.",
    meta: "Real estate market shifts, regulation updates, and what they mean for agents, lenders, and title partners.",
  },
  "ai-tools": {
    name: "AI Tools",
    header: "AI Tools We Actually Use in Real Pipelines",
    description: "Practical AI workflows for faster response, better content production, and cleaner follow-up without losing the human touch.",
    meta: "AI tools and workflows we use to speed up lead response, content production, and follow-up in real estate operations.",
  },
  "title-insurance": {
    name: "Title Insurance",
    header: "Title Workflows and Partner Playbooks",
    description: "Systems for cleaner lender-agent-title coordination, fewer surprises, and better client communication from contract to close.",
    meta: "Title workflow insights for Real estate teams: cleaner handoffs, better communication, and fewer closing-stage surprises.",
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
    description: cat.meta,
    openGraph: { title: `${cat.name} — Velocity Builders Blog`, description: cat.meta, type: "website", url: `/blog/category/${category}` },
  };
}

function postMatchesCategory(postTags: string[], categorySlug: string): boolean {
  return postTags.some((tag) => {
    const tagLower = tag.toLowerCase();
    if (categorySlug === "marketing-systems" && ["marketing", "crm", "automation", "lead", "seo"].some((w) => tagLower.includes(w))) return true;
    if (categorySlug === "real-estate-news" && ["news", "market", "regulation", "nar"].some((w) => tagLower.includes(w))) return true;
    if (categorySlug === "ai-tools" && ["ai", "artificial intelligence", "chatgpt", "automation"].some((w) => tagLower.includes(w))) return true;
    if (categorySlug === "title-insurance" && ["title", "closing", "settlement", "escrow"].some((w) => tagLower.includes(w))) return true;
    return false;
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => postMatchesCategory(p.tags, category));

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-1">
        <Link href="/blog" className="hover:text-emerald-400 transition">Blog</Link>
        <span>›</span>
        <span className="text-slate-300">{cat.name}</span>
      </nav>

      <h1 className="text-4xl font-bold text-white mb-4">{cat.header}</h1>
      <p className="text-slate-400 mb-12 text-lg">{cat.description}</p>

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts in this category yet. Publish 2–3 foundational posts now or temporarily noindex this archive.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-emerald-400/40 hover:bg-white/10 transition-all">
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden bg-slate-800">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-5">
                <time className="text-xs text-slate-500">{post.date}</time>
                <h2 className="text-base font-semibold text-white mt-1 mb-2 group-hover:text-emerald-400 transition-colors leading-snug">{post.title}</h2>
                <p className="text-slate-400 text-sm line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
