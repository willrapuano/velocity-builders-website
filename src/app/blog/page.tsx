import Link from "next/link";
import { getAllPosts } from "@/lib/blog/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Velocity Builders",
  description:
    "Real estate growth blog: practical playbooks for lead response, CRM automation, local SEO, and retention across Fairfax, Loudoun, and Prince William.",
  openGraph: {
    title: "Blog | Velocity Builders",
    description:
      "Real estate growth blog: practical playbooks for lead response, CRM automation, local SEO, and retention across Fairfax, Loudoun, and Prince William.",
    type: "website",
    url: "/blog",
  },
};

const CATEGORIES = [
  { slug: "marketing-systems", name: "Marketing Systems", teaser: "CRM, follow-up, lead routing, conversion operations" },
  { slug: "real-estate-news", name: "Real Estate News", teaser: "local market shifts and what they change in your pipeline" },
  { slug: "ai-tools", name: "AI Tools", teaser: "practical automation that saves time without hurting trust" },
];

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">No-Fluff Growth Playbooks for real estate Agents and Lenders.</h1>
        <p className="text-slate-400 text-lg max-w-3xl">
          What's working now in Fairfax, Loudoun, and Prince William—from speed-to-lead to post-close retention.
        </p>
        <p className="text-slate-300 mt-4 max-w-3xl">
          This is where we publish practical systems your team can use right away. No theory pieces. No trend-chasing. Just workflows, scripts, and structure that help you convert more of the leads you already have.
        </p>
      </div>

      <div className="grid gap-3 mb-10 md:grid-cols-2">
        {CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/blog/category/${cat.slug}`} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-emerald-400/40">
            <p className="font-semibold text-white">{cat.name}</p>
            <p className="text-sm text-slate-400">{cat.teaser}</p>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] transition-all">
              {post.featuredImage && (
                <div className="aspect-[16/9] overflow-hidden bg-slate-800">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex flex-col flex-1 p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">{post.title}</h2>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-xs text-slate-500"><span>{post.date}</span></p>
                  <Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-emerald-400 hover:underline shrink-0">
                    Read the Playbook
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
