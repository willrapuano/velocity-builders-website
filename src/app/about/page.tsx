import { getSiteContent } from "@/lib/content";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "About Velocity Builders",
  description: "Learn why Will Rapuano built Velocity Builders to be the marketing ops engine for the DMV title ecosystem.",
};

export default async function AboutPage() {
  const content = await getSiteContent();
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <SectionHeader
        eyebrow="About"
        title="Built by operators who live inside title + lending deals"
        description={content.company.mission}
        align="center"
      />
      <div className="grid gap-8 md:grid-cols-2">
        <article className="space-y-4 text-sm leading-relaxed text-slate-200">
          <p>
            Velocity Builders was founded by {content.company.owner}, Business Development Officer at Pruitt Title LLC. After helping hundreds of top agents and lenders, it became obvious that the missing ingredient wasn’t ambition—it was bandwidth. The best relationship builders were drowning in tech and follow-up.
          </p>
          <p>
            We assembled a pod of marketers, developers, and automation architects who know Northern Virginia’s markets cold. Every engagement is run like an ops sprint: discovery, build, enable, optimize.
          </p>
          <p>
            The result: partners stay front-of-mind, their data stays clean, and every launch is tied back to revenue.
          </p>
        </article>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Who we serve</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            {content.company.focusAreas.map((area) => (
              <li key={area} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Headquarters</p>
            <p>{content.company.hq}</p>
            <p className="mt-2 font-semibold text-white">Contact</p>
            <p>{content.company.email}</p>
            <p>{content.company.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
