import type { Metadata } from "next";
import Link from "next/link";
import { client, caseStudiesQuery } from "@/sanity/client";

export const metadata: Metadata = {
  title: "Verified Case Studies | Velocity Builders",
  description: "Evidence-backed outcomes from Velocity Builders engagements, verified and explicitly released through REbuilder."
};

type CaseStudyCard = { _id: string; title: string; slug: { current: string }; summary: string; publicClientLabel?: string | null; verifiedMetrics?: Array<{ key: string; label: string; value: number; unit: string }> };

export default async function CaseStudiesPage() {
  const studies = await client.fetch<CaseStudyCard[]>(caseStudiesQuery, {}, { next: { revalidate: 300 } });
  return <div className="bg-slate-950 text-white"><section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Verified outcomes</p>
    <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">The work should prove itself.</h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Every published result below passed evidence, compliance, consent, and human-approval gates in REbuilder.</p>
  </section><section className="bg-white py-16 text-slate-900"><div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
    {studies.length ? studies.map((study) => <article key={study._id} className="rounded-2xl border border-slate-200 p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">{study.publicClientLabel ?? "Client identity protected"}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight">{study.title}</h2><p className="mt-3 leading-7 text-slate-600">{study.summary}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">{study.verifiedMetrics?.slice(0, 4).map((metric) => <div key={metric.key} className="rounded-xl bg-slate-50 p-4"><p className="font-mono text-xl font-semibold">{formatMetric(metric.value, metric.unit)}</p><p className="mt-1 text-xs text-slate-500">{metric.label}</p></div>)}</div>
      <Link href={`/case-studies/${study.slug.current}`} className="mt-7 inline-flex min-h-11 items-center font-semibold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">Read the verified case study →</Link>
    </article>) : <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-600">No case studies have completed the release workflow yet.</div>}
  </div></section></div>;
}

function formatMetric(value: number, unit: string) {
  if (unit === "percent") return `${value}%`;
  if (unit === "currency") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  return new Intl.NumberFormat("en-US").format(value) + (unit === "hours" ? " hrs" : unit === "days" ? " days" : "");
}
