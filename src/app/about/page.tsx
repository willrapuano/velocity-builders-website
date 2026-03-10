import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Velocity Builders",
  description:
    "About Velocity Builders: a growth partner for real estate teams helping agents, lenders, and title teams improve lead response, handoffs, and closing consistency.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <section className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">About</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Built for Teams That Want Results.</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-300">
          Velocity Builders helps agents, lenders, and title partners turn lead flow into closings through practical systems, not theory.
        </p>
      </section>

      <section className="space-y-4 text-slate-300">
        <p>I built Velocity Builders after seeing the same problem on repeat: good people losing real business because follow-up was slow, handoffs were messy, and marketing looked busy but didn't convert.</p>
        <p>In real estate, that gets expensive fast.</p>
        <p>Leads compare options quickly. Sellers expect precision. Buyers need answers now. If your systems lag, someone else wins.</p>
        <p>So we built a company around one job: make growth execution simple, local, and measurable.</p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">Our Position</h2>
        <p className="mt-3 text-slate-300">We're built for real estate teams that want systems, not guesswork.</p>
        <p className="mt-3 text-slate-300">We know the referral dynamics, listing cycles, and lender-agent-title handoff points here because we work inside them.</p>
        <ul className="mt-5 space-y-2 text-slate-200">
          <li>• Fairfax County: school-bound timing and move-up pressure</li>
          <li>• Loudoun County: relocation demand and new-construction velocity</li>
          <li>• Prince William County: value-first buyers and speed-first decision windows</li>
        </ul>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold text-white">What We Believe</h3>
          <ul className="mt-4 space-y-2 text-slate-200">
            <li>• Fast response beats perfect branding.</li>
            <li>• Clear process beats more software.</li>
            <li>• Local relevance beats generic content every time.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold text-white">Who We Work With</h3>
          <ul className="mt-4 space-y-2 text-slate-200">
            <li>• Real estate teams who need better conversion from existing leads</li>
            <li>• Loan officers who want consistent consult flow</li>
            <li>• Title professionals who want tighter partner systems and cleaner communication</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Want Us to Diagnose Your Follow-Up?</h2>
        <p className="mt-3 text-slate-300">We'll show you exactly where deals are stalling and what to fix first.</p>
        <a href="/contact" className="mt-6 inline-block rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300">
          See How We'd Fix Your Follow-Up in 14 Days
        </a>
      </section>
    </div>
  );
}
