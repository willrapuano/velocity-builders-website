import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Velocity Builders",
  description:
    "Real estate marketing services for NoVA agents and lenders: local SEO websites, CRM automation, listing workflows & follow-up systems that drive more closings.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    title: "Hyper-Local SEO Website Systems",
    icon: "🌐",
    solve: "Traffic without conversion.",
    build: "Local landing pages, neighborhood content clusters, and clear conversion paths tied to intent.",
    outcome: "More qualified inquiries from local search terms and fewer dead-end visits.",
    proof: "We structure pages around county and neighborhood behavior so people self-select faster.",
    cta: "Get a Hyper-Local SEO Site Plan",
  },
  {
    title: "CRM Automation and Speed-to-Lead",
    icon: "⚡",
    solve: "Slow first response and lead drop-off.",
    build: "Instant routing, channel-triggered follow-up, and stage-based task automation.",
    outcome: "Faster first touch, better consult booking consistency, less pipeline drift.",
    proof: "In competitive local markets, the first clear response often sets the appointment.",
    cta: "Find My Response-Time Gaps",
  },
  {
    title: "Listing Launch and Seller Workflows",
    icon: "🏠",
    solve: "Launch chaos and inconsistent execution.",
    build: "Pre-listing communication systems, launch-day sequences, and post-launch follow-up.",
    outcome: "Better early momentum and stronger seller confidence in your process.",
    proof: "",
    cta: "Get My Listing Launch Flow",
  },
  {
    title: "Buyer and Relocation Nurture Systems",
    icon: "🎯",
    solve: "Warm leads that go cold before consult.",
    build: "Segment-specific nurture for move-up buyers, relocations, and value-driven shoppers.",
    outcome: "More conversations from leads already in your database.",
    proof: "Commute patterns, school-zone questions, and financing clarity drive buyer response behavior.",
    cta: "Turn Warm Leads into Consults",
  },
  {
    title: "Referral and Post-Close Retention",
    icon: "🔄",
    solve: "One-and-done client relationships.",
    build: "Post-close check-ins, homeownership value content, and referral reactivation campaigns.",
    outcome: "More repeat transactions and referral opportunities over time.",
    proof: "",
    cta: "Turn Past Clients into Repeat Closings",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 py-20">
        <Image
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"
          alt="Digital marketing workspace"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Services</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Services Built to Fix Pipeline Leaks and Increase Closings.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-300">
            Most teams don&apos;t need more tools. They need clean handoffs, faster response times, and follow-up that runs without babysitting.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition">
              Find Your 3 Biggest Pipeline Leaks
            </Link>
            <Link href="/contact" className="rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:border-white hover:bg-white/10 transition">
              Book a Launch Blueprint Call
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6 space-y-8">
          {services.map((service, i) => (
            <article key={service.title} className={`rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl">{service.icon}</span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-700"><span className="font-semibold text-gray-900">What we solve:</span> {service.solve}</p>
                    <p className="text-gray-700"><span className="font-semibold text-gray-900">What we build:</span> {service.build}</p>
                    <p className="text-gray-700"><span className="font-semibold text-gray-900">Outcome focus:</span> {service.outcome}</p>
                    {service.proof && <p className="text-gray-700"><span className="font-semibold text-gray-900">Why it matters:</span> {service.proof}</p>}
                  </div>
                  <Link href="/contact" className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                    {service.cta} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Service Delivery */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Service Delivery</h3>
            <p className="mt-3 text-gray-600">You get clear priorities, direct implementation, and measurable checkpoints.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">1</div>
                <span className="text-sm font-medium text-gray-800">What to fix first</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">2</div>
                <span className="text-sm font-medium text-gray-800">What to automate next</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">3</div>
                <span className="text-sm font-medium text-gray-800">What to stop doing</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600">No bloated plans. No jargon. Just execution.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Build the Version of Your Pipeline That Actually Closes?</h2>
          <p className="mt-4 text-blue-100">We&apos;ll map your biggest leaks and show you the fastest route to better conversion.</p>
          <Link href="/contact" className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-gray-100">
            Find Your 3 Biggest Pipeline Leaks
          </Link>
        </div>
      </section>
    </>
  );
}
