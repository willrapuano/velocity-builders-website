import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-16">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Velocity Builders LLC</p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Get More Closings from the Leads You Already Have.
          </h1>
          <p className="text-lg text-slate-300">
            We build real estate focused websites, CRM automations, and follow-up systems that turn inquiries into appointments, contracts, and repeat business.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="rounded-full bg-emerald-400/90 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-emerald-300">
              Book a 20-Minute Growth Blueprint
            </Link>
            <Link href="/services" className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-emerald-300">
              See 3 NoVA System Builds
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6 shadow-glow">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">Trusted across DC, Maryland, & Virginia</p>
          <p className="mt-4 text-lg text-slate-100">
            Used by agents, lenders, builders, and credit union partners across Fairfax, Loudoun, Prince William, Montgomery, Prince George&#39;s and the District of Columbia.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">Where Most Teams Lose Deals</h2>
        <p className="mt-4 text-slate-300">Most teams don’t lose business on branding. They lose it in the handoff.</p>
        <ul className="mt-6 space-y-2 text-slate-200">
          <li>• Lead comes in. No fast response.</li>
          <li>• Inquiry gets buried in a busy inbox.</li>
          <li>• Follow-up stops after one call.</li>
          <li>• Past clients never hear from you again.</li>
        </ul>
        <p className="mt-4 text-slate-300">We fix those gaps with systems your team will actually use.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">What We Build</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">NoVA SEO Websites That Convert</h3>
            <p className="mt-3 text-sm text-slate-300">Local pages built around real search behavior in Northern Virginia. Clear calls to action. Clean routing into your CRM.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Speed-to-Lead Automation</h3>
            <p className="mt-3 text-sm text-slate-300">Instant routing, text/email triggers, and task creation so every inquiry gets a fast first touch.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Follow-Up That Runs Without Babysitting</h3>
            <p className="mt-3 text-sm text-slate-300">Nurture flows for buyers, sellers, and referral partners tied to real pipeline stages.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">What “Better” Looks Like</h2>
        <ul className="mt-5 space-y-2 text-slate-200">
          <li>• Faster first response across new inquiries</li>
          <li>• More consults booked from existing lead flow</li>
          <li>• Fewer dead leads sitting unworked</li>
          <li>• More repeat and referral business post-close</li>
        </ul>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">You Don&#39;t Have a Lead Problem. You Have a Follow-Up Problem.</h2>
        <p className="mt-4 text-slate-300">Top producers in the DMV aren&#39;t grinding Zillow for strangers. They&#39;re closing referrals, repeat clients, and sphere business — and the ones pulling away have systems doing the work their memory can&#39;t.</p>
        <ul className="mt-5 space-y-3 text-slate-200">
          <li><span className="font-semibold text-emerald-300">You close 30+ deals a year</span> but couldn&#39;t tell me which past clients are 6 months from their next move. That&#39;s money walking.</li>
          <li><span className="font-semibold text-emerald-300">You get referrals</span> — when someone happens to remember you. &ldquo;Happens to&rdquo; is not a strategy.</li>
          <li><span className="font-semibold text-emerald-300">Your lender and builder partners send you business</span> when you&#39;re top of mind. Without automated touchpoints, you&#39;re not top of mind. You&#39;re top of the pile.</li>
          <li><span className="font-semibold text-emerald-300">You know follow-up matters.</span> You also know you&#39;re not doing it. Not consistently. Not at scale.</li>
        </ul>
        <p className="mt-4 text-slate-300">Velocity builds the repeat-and-referral capture engine you keep saying you&#39;ll build yourself. Then we layer in the SEO and content that brings new business to the front door.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">How We Work</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-emerald-300">Step 1: Stop the Bleed</p>
            <p className="mt-2 text-sm text-slate-300">You already have a database full of past clients and referral partners. You&#39;re just not working it. We install CRM automations and follow-up systems that turn your existing sphere into a repeat-business machine — before you spend a dime chasing strangers.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-emerald-300">Step 2: Make the Follow-Up Automatic</p>
            <p className="mt-2 text-sm text-slate-300">Drip campaigns, anniversary triggers, referral nudges, market updates — all running without you. Every warm contact stays warm. Every closed client becomes a future closing.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-emerald-300">Step 3: Turn On the Traffic</p>
            <p className="mt-2 text-sm text-slate-300">Now that you&#39;re capturing what&#39;s already yours, we build the growth layer: a high-converting website, local SEO, and automated blog content that brings new leads to your door on autopilot.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center">
        <h2 className="text-3xl font-semibold text-white">Ready to Turn Pipeline Chaos Into Predictable Closings?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">We’ll show you what to fix first, what to automate next, and what to ignore.</p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/contact" className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300">
            Book a 20-Minute Growth Blueprint
          </Link>
          <Link href="/services" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-emerald-300">
            See 3 NoVA System Builds
          </Link>
        </div>
      </section>
    </div>
  );
}
