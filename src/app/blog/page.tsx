import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Velocity Builders",
  description:
    "NoVA real estate growth blog: practical playbooks for lead response, CRM automation, local SEO, and retention across Fairfax, Loudoun, and Prince William.",
  openGraph: {
    title: "Blog | Velocity Builders",
    description:
      "Real estate growth blog: practical playbooks for lead response, CRM automation, local SEO, and retention across Fairfax, Loudoun, and Prince William.",
    type: "website",
    url: "/blog",
  },
};

const CATEGORIES = [
  { slug: "marketing-systems", name: "Marketing Systems", teaser: "CRM, follow-up, lead routing, conversion operations", color: "bg-blue-50 border-blue-200 hover:border-blue-400" },
  { slug: "real-estate-news", name: "Real Estate News", teaser: "Local market shifts and what they change in your pipeline", color: "bg-green-50 border-green-200 hover:border-green-400" },
  { slug: "ai-tools", name: "AI Tools", teaser: "Practical automation that saves time without hurting trust", color: "bg-purple-50 border-purple-200 hover:border-purple-400" },
  { slug: "title-insurance", name: "Title Insurance", teaser: "Cleaner handoffs and better partner communication", color: "bg-amber-50 border-amber-200 hover:border-amber-400" },
];

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            No-Fluff Growth Playbooks for Real Estate Agents, Lenders, Builders and Financial Institutions
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl">
            What&apos;s working now in Fairfax, Loudoun, and Prince William — from speed-to-lead to post-close retention.
          </p>
          <p className="text-gray-600 mt-4 max-w-3xl">
            This is where we publish practical systems your team can use right away. No theory pieces. No trend-chasing. Just workflows, scripts, and structure that help you convert more of the leads you already have.
          </p>
        </div>
      </section>

      <main className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Category cards */}
          <div className="grid gap-3 mb-12 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/blog/category/${cat.slug}`} className={`rounded-xl border p-4 transition ${cat.color}`}>
                <p className="font-semibold text-gray-900">{cat.name}</p>
                <p className="text-sm text-gray-600 mt-1">{cat.teaser}</p>
              </Link>
            ))}
          </div>

          {/* Posts grid */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No posts yet. Check back soon.</p>
              <Link href="/" className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 transition">
                ← Back to home
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.slug} className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all">
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Image
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                        alt={post.title}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{post.title}</h2>
                    </Link>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{post.date}</span>
                      <Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                        Read the Playbook →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
