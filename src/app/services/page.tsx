import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Velocity Builders",
  description:
    "NoVA real estate and lending services: SEO websites, CRM automation, listing workflows, and follow-up systems that improve response speed and closing outcomes.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    title: "NoVA SEO Website Systems",
    solve: "Traffic without conversion.",
    build: "Local landing pages, neighborhood content clusters, and clear conversion paths tied to intent.",
    outcome: "More qualified inquiries from NoVA search terms and fewer dead-end visits.",
    proof: "We structure pages around county and neighborhood behavior so people self-select faster.",
    cta: "Get a NoVA SEO Site Plan",
  },
  {
    title: "CRM Automation and Speed-to-Lead",
    solve: "Slow first response and lead drop-off.",
    build: "Instant routing, channel-triggered follow-up, and stage-based task automation.",
    outcome: "Faster first touch, better consult booking consistency, less pipeline drift.",
    proof: "In competitive Fairfax and Loudoun pockets, the first clear response often sets the appointment.",
    cta: "Find My Response-Time Gaps",
  },
  {
    title: "Listing Launch and Seller Workflows",
    solve: "Launch chaos and inconsistent execution.",
    build: "Pre-listing communication systems, launch-day sequences, and post-launch follow-up.",
    outcome: "Better early momentum and stronger seller confidence in your process.",
    proof: "",
    cta: "Get My Listing Launch Flow",
  },
  {
    title: "Buyer and Relocation Nurture Systems",
    solve: "Warm leads that go cold before consult.",
    build: "Segment-specific nurture for move-up buyers, relocations, and value-driven shoppers.",
    outcome: "More conversations from leads already in your database.",
    proof: "Commute patterns, school-zone questions, and financing clarity drive response behavior.",
    cta: "Turn Warm Leads into Consults",
  },
  {
    title: "Referral and Post-Close Retention",
    solve: "One-and-done client relationships.",
    build: "Post-close check-ins, homeownership value content, and referral reactivation campaigns.",
    outcome: "More repeat transactions and referral opportunities over time.",
    proof: "",
    cta: "Turn Past Clients into Repeat Closings",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <section className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Services</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Services Built to Fix Pipeline Leaks and Increase Closings.</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-300">
          Most teams don’t need more tools. They need clean handoffs, faster response times, and follow-up that runs without babysitting.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <a href="/contact" className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300">Find Your 3 Biggest Pipeline Leaks</a>
          <a href="/contact" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-emerald-300">Book a Launch Blueprint Call</a>
        </div>
      </section>

      <section className="grid gap-6">
        {services.map((service) => (
          <article key={service.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
            <p className="mt-4 text-slate-300"><span className="font-semibold text-white">What we solve:</span> {service.solve}</p>
            <p className="mt-2 text-slate-300"><span className="font-semibold text-white">What we build:</span> {service.build}</p>
            <p className="mt-2 text-slate-300"><span className="font-semibold text-white">Outcome focus:</span> {service.outcome}</p>
            {service.proof && <p className="mt-2 text-slate-300"><span className="font-semibold text-white">NoVA context:</span> {service.proof}</p>}
            <a href="/contact" className="mt-5 inline-block text-sm font-semibold text-emerald-300 hover:text-emerald-200">{service.cta}</a>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-200">
        <h3 className="text-xl font-semibold text-white">Service Delivery</h3>
        <p className="mt-3">You get clear priorities, direct implementation, and measurable checkpoints.</p>
        <ul className="mt-4 space-y-2">
          <li>• What to fix first</li>
          <li>• What to automate next</li>
          <li>• What to stop doing</li>
        </ul>
        <p className="mt-4">No bloated plans. No jargon. Just execution.</p>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Ready to Build the Version of Your Pipeline That Actually Closes?</h2>
        <p className="mt-3 text-slate-300">We’ll map your biggest leaks and show you the fastest route to better conversion.</p>
        <a href="/contact" className="mt-6 inline-block rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300">
          Find Your 3 Biggest Pipeline Leaks
        </a>
      </section>
    </div>
  );
}
