import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog/api";

const whyChooseReasons = [
  {
    num: "1",
    title: "Expertise in Real Estate Marketing and Mortgage Advertising",
    desc: "We specialize exclusively in real estate — agents, lenders, title companies. No generic marketing. Every system we build is designed for how real estate actually works.",
  },
  {
    num: "2",
    title: "Comprehensive Title Insurance and Escrow Service Network",
    desc: "Direct integration with Pruitt Title's title and escrow operations means smoother closings, faster communication, and fewer surprises at the settlement table.",
  },
  {
    num: "3",
    title: "Dedication to Professional Growth and Industry Innovation",
    desc: "We invest heavily in AI-powered automation, CRM optimization, and local SEO — staying ahead so our partners don't have to figure it out themselves.",
  },
];

const faqItems = [
  {
    q: "What types of real estate professionals do you work with?",
    a: "We work with residential real estate agents, loan officers, title companies, builders, and credit union mortgage teams across Northern Virginia, DC, and Maryland.",
  },
  {
    q: "How quickly can I expect to see results?",
    a: "Most clients see measurable improvements within 30-60 days. Speed-to-lead automation shows results immediately. SEO and content systems build momentum over 90 days.",
  },
  {
    q: "Do I need to switch my current CRM?",
    a: "No. We work with GoHighLevel, Follow Up Boss, KvCORE, and most major CRMs. We optimize what you have before recommending any changes.",
  },
  {
    q: "What's included in the Growth Blueprint call?",
    a: "A 20-minute focused conversation where we identify your 3 biggest pipeline leaks, map what to fix first, and outline what to automate next. No sales pitch — just a clear action plan.",
  },
];

const services = [
  { num: "1", title: "Unique Real Estate Marketing Strategies", desc: "Custom marketing systems built around your market, your strengths, and your pipeline — not cookie-cutter templates." },
  { num: "2", title: "Expertise in Video Marketing and Digital Advertising", desc: "Video content, social ads, and retargeting campaigns designed for agents and lenders who want to stand out locally." },
  { num: "3", title: "Comprehensive Title and Escrow Services", desc: "Direct partnership with Pruitt Title for seamless closings, title insurance, and escrow coordination." },
  { num: "4", title: "Access to Real Estate Tools and Resources", desc: "CRM automation, IDX integration, market data dashboards, and listing alert systems — all wired into your workflow." },
  { num: "5", title: "Professional Growth and Education", desc: "CE class partnerships, market update content, and ongoing training to keep your skills and visibility sharp." },
  { num: "6", title: "Dedicated Support for Real Estate Workflows", desc: "Speed-to-lead automation, follow-up sequences, and nurture campaigns that run without babysitting." },
  { num: "7", title: "Excellence in Using Latest Technologies", desc: "AI-powered content, automated reporting, smart CRM triggers — we build with the tools that actually move the needle." },
  { num: "8", title: "Local Expertise with National Presence", desc: "Deep roots in Fairfax, Loudoun, and Prince William counties with systems that scale to any market." },
];

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
            We build real estate focused websites, CRM automations, and follow-up systems that turn inquiries into appointments, contracts, and repeat business.
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
              See Build Velocity™ Systems
            </Link>
          </div>
          {/* Trust badge */}
          <div className="mt-10 inline-block rounded-xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              Trusted Across DC, Maryland, &amp; Virginia
            </p>
            <p className="mt-2 text-sm text-gray-200">
              Used by agents, lenders, builders, and credit union partners across Fairfax, Loudoun, Prince William, Montgomery, Prince George&apos;s and the District of Columbia.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== ARE YOU A REAL ESTATE AGENT ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Are You a Real Estate Agent or Mortgage Lender?
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                Join real estate professionals across DC, Maryland, and Virginia who are using smarter systems to close more deals, retain more clients, and grow with less manual effort.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Whether you&apos;re drowning in leads you can&apos;t follow up on, or struggling to get leads in the first place — we build the systems that fix both.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
              >
                Schedule a Free Strategy Session
              </Link>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Real estate professional meeting"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LET'S CHAT ==================== */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Let&apos;s Chat</h2>
          <p className="mt-4 text-gray-600">
            Do you have any real estate or title-related marketing questions?
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <a
              href="mailto:wrapuano@pruitt-title.com"
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              wrapuano@pruitt-title.com
            </a>
            <a
              href="tel:+17038591467"
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              (703) 859-1467
            </a>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE + FAQ ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose Velocity Builders?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-gray-600 leading-relaxed">
              When you partner with Velocity Builders, you&apos;re not just getting title and escrow services — you&apos;re getting a strategic growth partner who understands local real estate, mortgage advertising, and the systems that actually close deals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {whyChooseReasons.map((r) => (
              <div key={r.num} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                  {r.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{r.title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="mx-auto max-w-3xl">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="faq-item group rounded-xl border border-gray-200 bg-white">
                  <summary className="flex items-center justify-between px-6 py-4 text-left font-medium text-gray-900 hover:text-blue-600 transition">
                    <span>{item.q}</span>
                    <svg className="faq-chevron h-5 w-5 shrink-0 text-gray-400 ml-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-lg italic text-gray-700 leading-relaxed">
              &ldquo;Partnering with us means gaining a collaborative partner who is dedicated to helping real estate professionals and lenders succeed through smart marketing, strategic growth systems, and genuine industry expertise.&rdquo;
            </p>
            <p className="mt-4 font-semibold text-gray-900">— Will Rapuano, Pruitt Title</p>
          </div>
        </div>
      </section>

      {/* ==================== DISCOVER / SERVICES (Blue gradient BG) ==================== */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Discover How We Can Elevate Your Real Estate Business
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <div key={s.num} className="flex gap-4 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-blue-100 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-800 shadow-lg transition hover:bg-gray-100"
            >
              Get Started Today
            </Link>
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
                      Read More →
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
                { title: "Closing Costs in the DMV: What Buyers and Sellers Should Know", img: "photo-1582407947092-a87e42ce4946" },
                { title: "Title Insurance Requirements Every Homebuyer Must Understand", img: "photo-1600596542815-ffad4c1539a9" },
                { title: "The Role of Title Companies in Protecting Real Estate Investments", img: "photo-1600585154340-be6161a56a0c" },
                { title: "Why Title Insurance Matters: Protecting Your Biggest Investment", img: "photo-1560520031-3a4dc4e9de0c" },
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
                      Practical insights for agents and lenders in the DMV market.
                    </p>
                    <Link
                      href="/blog"
                      className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      Read More →
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

      {/* ==================== CTA / EMAIL SIGNUP ==================== */}
      <section className="relative overflow-hidden bg-blue-600 py-20">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt="Modern building"
          fill
          className="object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Need Any Help? Feel Free To Get In Touch
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Get a free growth blueprint for your real estate business. We&apos;ll show you what to fix first, what to automate next, and what to ignore.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-gray-100"
            >
              Contact Us
            </Link>
            <a
              href="tel:+17038591467"
              className="rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Call (703) 859-1467
            </a>
          </div>
        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Looking For Ideas To Grow Your Real Estate Business?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 leading-relaxed">
            Let&apos;s talk about how smarter systems, better follow-up, and local marketing can help you close more deals.
          </p>
          <p className="mt-2 text-sm text-gray-500">Will Rapuano, Pruitt Title, LLC</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Book a 20-Minute Growth Blueprint
            </Link>
            <Link
              href="/services"
              className="rounded-full border-2 border-gray-300 px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
            >
              See Build Velocity™ Systems
            </Link>
          </div>
          {/* Pruitt Title mention */}
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-gray-500">
            <span>Powered by</span>
            <span className="font-semibold text-gray-700">Pruitt Title, LLC</span>
          </div>
        </div>
      </section>
    </>
  );
}
