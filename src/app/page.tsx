import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Velocity Builders | Websites, SEO & Marketing for Real Estate Agents, Lenders & Builders",
  description:
    "Velocity Builders builds high-converting websites, local SEO strategies, and automated marketing systems that help real estate agents, lenders, builders, and financial institutions generate leads, close more deals, and dominate their market.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  let recentPosts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    const all = await getAllPosts();
    recentPosts = all.slice(0, 6);
  } catch {
    // Blog may not have posts yet
  }

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80"
          alt="Washington DC skyline"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
            Real Estate Growth Systems
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Get More Closings from the Leads You Already Have.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed">
            SEO-optimized websites, CRM automations, and follow-up systems that turn inquiries into appointments — and appointments into closings.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-blue-600 px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
            >
              Book a 20-Minute Growth Blueprint
            </Link>
            <Link
              href="/services"
              className="rounded-full border-2 border-white/30 px-8 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              See 3 System Builds
            </Link>
          </div>
          {/* Trust Strip */}
          <div className="mt-10 inline-block rounded-xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-sm">
            <p className="text-sm text-gray-200">
              Trusted by agents, lenders, builders, banks, & credit unions nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== WHERE MOST TEAMS LOSE DEALS ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Where Most Teams Lose Deals
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Most teams don&apos;t lose business on branding. They lose it in the handoff.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Lead comes in. No fast response.",
              "Inquiry gets buried in a busy inbox.",
              "Follow-up stops after one call.",
              "Past clients never hear from you again.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-5">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg font-semibold text-gray-900">
            We fix those gaps with systems your team will actually use.
          </p>
        </div>
      </section>

      {/* ==================== WHAT WE BUILD ==================== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center sm:text-4xl">What We Build</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl mb-5">🌐</div>
              <h3 className="text-lg font-bold text-gray-900">SEO Websites That Convert</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Pages built around real search behavior in your market. Clear calls to action. Clean routing into your CRM.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl mb-5">⚡</div>
              <h3 className="text-lg font-bold text-gray-900">Speed-to-Lead Automation</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Instant routing, text/email triggers, and task creation so every inquiry gets a fast first touch.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl mb-5">🔄</div>
              <h3 className="text-lg font-bold text-gray-900">Follow-Up That Runs Without Babysitting</h3>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Nurture flows for buyers, sellers, and referral partners tied to real pipeline stages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHAT "BETTER" LOOKS LIKE ==================== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What &ldquo;Better&rdquo; Looks Like</h2>
          <ul className="mt-8 space-y-4">
            {[
              "Faster first response across new inquiries",
              "More consults booked from existing lead flow",
              "Fewer dead leads sitting unworked",
              "More repeat and referral business post-close",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <svg className="h-6 w-6 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================== BUILT FOR HOW NOVA ACTUALLY MOVES ==================== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Built for How Real Estate Actually Moves</h2>
          <p className="mt-4 text-lg text-gray-600">
            Every market is different. Your funnel has to match local behavior, not generic one-size-fits-all playbooks.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { county: "Suburban Markets", desc: "Move-up buyers and school-driven decisions" },
              { county: "Growth Corridors", desc: "New construction and relocation flow" },
              { county: "Urban Markets", desc: "Fast-moving inventory that demands speed to lead" },
            ].map((item) => (
              <div key={item.county} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-blue-700">{item.county}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW WE WORK ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">How We Work</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Diagnose the leak", desc: "We map where leads stall between inquiry and consult." },
              { step: "2", title: "Build the system", desc: "We deploy page, CRM, and follow-up improvements in priority order." },
              { step: "3", title: "Launch and tune", desc: "We monitor response, consult bookings, and handoff quality." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold shadow-lg shadow-blue-600/25">
                  {item.step}
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LATEST BLOG POSTS ==================== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Latest Blog Posts</h2>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Image
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                        alt={post.title}
                        width={600}
                        height={338}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-gray-500 mb-2">{post.date}</p>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      Read the Playbook →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Using Video Traffic Data to Power Smart Real Estate Marketing", img: "photo-1551434678-e076c223a692" },
                { title: "How to Choose the Right Title Company and Close with Confidence", img: "photo-1560518883-ce09059eeffa" },
                { title: "Closing Costs: What Buyers and Sellers Should Know", img: "photo-1582407947092-a87e42ce4946" },
              ].map((placeholder, i) => (
                <article key={i} className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition">
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <Image
                      src={`https://images.unsplash.com/${placeholder.img}?w=600&q=80`}
                      alt={placeholder.title}
                      width={600}
                      height={338}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-gray-500 mb-2">March 2026</p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {placeholder.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">
                      Practical insights for agents, lenders, builders, and financial institutions who want to grow.
                    </p>
                    <Link
                      href="/blog"
                      className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      Read the Playbook →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-block rounded-full border-2 border-blue-600 px-8 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Turn Pipeline Chaos Into Predictable Closings?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            We&apos;ll show you what to fix first, what to automate next, and what to ignore.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-gray-100"
            >
              Book a 20-Minute Growth Blueprint
            </Link>
            <Link
              href="/services"
              className="rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              See 3 System Builds
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
