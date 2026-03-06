import { SectionHeader } from "@/components/SectionHeader";
import { client, aboutQuery, siteSettingsQuery } from "@/sanity/client";
import { fallbackContent } from "@/data/site";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch(aboutQuery).catch(() => null);
  return {
    title: about?.seoTitle ?? "About Velocity Builders",
    description: about?.seoDescription ?? "Learn why Will Rapuano built Velocity Builders to be the marketing ops engine for real estate professionals across the country.",
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    client.fetch(aboutQuery).catch(() => null),
    client.fetch(siteSettingsQuery).catch(() => null),
  ]);

  const founderName = about?.founderName ?? fallbackContent.company.owner;
  const mission = about?.mission ?? fallbackContent.company.mission;
  const focusAreas = fallbackContent.company.focusAreas;
  const email = settings?.email ?? fallbackContent.company.email;
  const phone = settings?.phone ?? fallbackContent.company.phone;
  const hq = settings?.address ?? fallbackContent.company.hq;
  const headline = about?.headline ?? "About Velocity Builders";
  const subheadline = about?.subheadline ?? fallbackContent.company.summary;
  const values = about?.values ?? [];
  const credentials = about?.credentials ?? [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
      <SectionHeader
        eyebrow="About"
        title={headline}
        description={subheadline}
        align="center"
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Founder bio */}
        <article className="space-y-4 text-sm leading-relaxed text-slate-300">
          {about?.founderBio ? (
            // Render Portable Text as plain paragraphs for now
            about.founderBio.map((block: any, i: number) => (
              <p key={i}>
                {block.children?.map((child: any) => child.text).join("") ?? ""}
              </p>
            ))
          ) : (
            <>
              <p>
                Velocity Builders was founded by {founderName}, Business Development Officer at Pruitt Title LLC. After helping hundreds of top agents and lenders, it became obvious that the missing ingredient wasn't ambition—it was bandwidth. The best relationship builders were drowning in tech and follow-up.
              </p>
              <p>
                We assembled a pod of marketers, developers, and automation architects who know real estate markets across the country. Every engagement is run like an ops sprint: discovery, build, enable, optimize.
              </p>
              <p>
                The result: partners stay front-of-mind, their data stays clean, and every launch is tied back to revenue.
              </p>
            </>
          )}
          {credentials.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {credentials.map((c: string) => (
                <span key={c} className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300">
                  {c}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Info card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Who we serve</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {focusAreas.map((area) => (
                <li key={area} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-300" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">Headquarters</p>
              <p>{hq}</p>
              <p className="mt-2 font-semibold text-white">Contact</p>
              <p>{email}</p>
              <p>{phone}</p>
            </div>
          </div>

          {/* Mission */}
          {mission && (
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Mission</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{mission}</p>
            </div>
          )}
        </div>
      </div>

      {/* Values */}
      {values.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Core Values</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((v: any) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-semibold text-white">{v.title}</p>
                <p className="mt-1 text-sm text-slate-400">{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
