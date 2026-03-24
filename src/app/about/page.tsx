import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Velocity Builders",
  description:
    "About Velocity Builders — a real estate marketing agency helping agents, lenders & title teams fix lead response, handoffs, and closing rates.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 py-20">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="Modern office"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">About</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Built for Teams That Want Results.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-300">
            Velocity Builders helps agents, lenders, and title partners turn lead flow into closings through practical systems, not theory.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p className="text-lg">I built Velocity Builders after seeing the same problem on repeat: good people losing real business because follow-up was slow, handoffs were messy, and marketing looked busy but didn&apos;t convert.</p>
              <p>In real estate, that gets expensive fast.</p>
              <p>Leads compare options quickly. Sellers expect precision. Buyers need answers now. If your systems lag, someone else wins.</p>
              <p>So we built a company around one job: <strong className="text-gray-900">make growth execution simple, local, and measurable.</strong></p>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                alt="Team collaboration"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Position */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Our Position</h2>
            <p className="mt-3 text-gray-700">We&apos;re built for real estate teams that want systems, not guesswork.</p>
            <p className="mt-3 text-gray-700">We know the referral dynamics, listing cycles, and lender-agent-title handoff points because we work inside them every day.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { area: "Real Estate Agents", desc: "SEO websites, listing launch kits, and CRM automation that turn leads into closings" },
                { area: "Lenders & Credit Unions", desc: "Co-branded campaigns, mortgage marketing systems, and loan officer enablement" },
                { area: "Builders & Developers", desc: "New construction marketing, community pages, and buyer pipeline automation" },
              ].map((item) => (
                <div key={item.area} className="rounded-lg bg-blue-50 p-5">
                  <h3 className="font-semibold text-blue-800">{item.area}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values + Who We Work With */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">What We Believe</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "Fast response beats perfect branding.",
                  "Clear process beats more software.",
                  "Local relevance beats generic content every time.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Who We Work With</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "Real estate teams who need better conversion from existing leads",
                  "Loan officers who want consistent consult flow",
                  "Title professionals who want tighter partner systems and cleaner communication",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Want Us to Diagnose Your Follow-Up?</h2>
          <p className="mt-4 text-blue-100">We&apos;ll show you exactly where deals are stalling and what to fix first.</p>
          <Link href="/contact" className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-gray-100">
            See How We&apos;d Fix Your Follow-Up in 14 Days
          </Link>
        </div>
      </section>
    </>
  );
}
