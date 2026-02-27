import { getSiteContent } from "@/lib/content";
import { StatGroup } from "@/components/StatGroup";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { EngagementCard } from "@/components/EngagementCard";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { TestimonialCard } from "@/components/TestimonialCard";
import Link from "next/link";

export default async function Home() {
  const content = await getSiteContent();
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-16">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">{content.hero.eyebrow}</p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="text-lg text-slate-300">{content.hero.subtitle}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-emerald-400/90 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
            >
              {content.hero.primaryCta}
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-emerald-300"
            >
              {content.hero.secondaryCta}
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6 shadow-glow">
          <StatGroup stats={content.hero.stats} />
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeader
          eyebrow="Solutions"
          title="Full-stack marketing operations for modern real estate partners"
          description={content.company.summary}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {content.services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeader
          eyebrow="Ways to work together"
          title="Pick a model that matches your velocity"
          description="Every engagement includes measurement dashboards, enablement, and post-launch optimization."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {content.engagement.map((plan) => (
            <EngagementCard key={plan.title} {...plan} />
          ))}
        </div>
      </section>

      <section className="grid gap-12 md:grid-cols-2">
        <SectionHeader
          eyebrow="How we build"
          title="Blueprint to scale with you"
          description="Systems launches are fast, collaborative, and relentlessly measured."
        />
        <ProcessTimeline steps={content.processSteps} />
      </section>

      <section className="space-y-10">
        <SectionHeader
          eyebrow="Proof"
          title="Teams we help stay top of mind"
          description="Velocity partners are producers, lenders, and builders across Northern Virginia."
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {content.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </section>
    </div>
  );
}
