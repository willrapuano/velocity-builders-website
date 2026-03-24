import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostsByCategory } from "@/lib/blog/api";
import type { Metadata } from "next";

const CATEGORIES: Record<string, { name: string; header: string; description: string; meta: string }> = {
  "marketing-systems": {
    name: "Marketing Systems",
    header: "Marketing Systems That Convert Faster",
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
  "seo": {
    name: "SEO",
    header: "Local SEO & Organic Growth",
    description: "Google rankings, local search optimization, and organic lead generation strategies for real estate professionals.",
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

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const posts = await getPostsByCategory(category);

  return (
    <div className="bg-white">
      <main className="max-w-5xl mx-auto px-6 py-16">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
          <Link href="/blog" className="hover:text-blue-600 transition">Blog</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{cat.name}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{cat.header}</h1>
        <p className="text-gray-600 mb-12 text-lg">{cat.description}</p>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts in this category yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Image
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                      alt={post.title}
                      width={600}
                      height={338}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-5">
                  <time className="text-xs text-gray-500">{post.date}</time>
                  <h2 className="text-base font-bold text-gray-900 mt-1 mb-2 group-hover:text-blue-600 transition-colors leading-snug">{post.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
