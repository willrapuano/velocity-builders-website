import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client, caseStudyBySlugQuery } from "@/sanity/client";
import { CaseStudySignal } from "@/components/CaseStudySignal";

type CaseStudy = { title: string; summary: string; publicClientLabel?: string | null; challenge: string; approach: string; outcome: string; releasedAt: string; projectionSha256: string; verifiedMetrics: Array<{ key: string; label: string; value: number; unit: string; comparisonPeriod?: string | null }>; compliance: Array<{ key: string; exactText: string; sha256: string }> };

async function load(slug: string) { return client.fetch<CaseStudy | null>(caseStudyBySlugQuery, { slug }, { next: { revalidate: 300 } }); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const study = await load(slug);
  return study ? { title: `${study.title} | Velocity Builders`, description: study.summary } : {};
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const study = await load(slug); if (!study) notFound();
  return <article className="bg-white text-slate-900"><CaseStudySignal projectionSha256={study.projectionSha256} /><header className="border-b border-slate-200 bg-slate-950 py-20 text-white"><div className="mx-auto max-w-4xl px-6">
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Evidence-backed case study</p><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{study.title}</h1>
    <p className="mt-6 text-lg leading-8 text-slate-300">{study.summary}</p><p className="mt-4 text-sm text-slate-400">{study.publicClientLabel ?? "Client identity protected"}</p>
  </div></header><div className="mx-auto max-w-4xl px-6 py-16">
    <section aria-label="Verified metrics" className="grid gap-4 sm:grid-cols-2">{study.verifiedMetrics.map((metric) => <div key={metric.key} className="rounded-2xl border border-slate-200 p-6"><p className="font-mono text-3xl font-semibold">{metric.value}{metric.unit === "percent" ? "%" : ""}</p><p className="mt-2 font-medium">{metric.label}</p>{metric.comparisonPeriod ? <p className="mt-1 text-sm text-slate-500">{metric.comparisonPeriod}</p> : null}</div>)}</section>
    <div className="mt-16 space-y-12">{[["The challenge", study.challenge], ["The approach", study.approach], ["The outcome", study.outcome]].map(([heading, copy]) => <section key={heading}><h2 className="text-2xl font-bold">{heading}</h2><p className="mt-4 whitespace-pre-wrap text-lg leading-8 text-slate-600">{copy}</p></section>)}</div>
    <aside className="mt-16 rounded-2xl bg-slate-50 p-6"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verification record</p><p className="mt-2 text-sm leading-6 text-slate-600">Released {new Date(study.releasedAt).toLocaleDateString("en-US", { dateStyle: "long" })}. Projection fingerprint: <code className="break-all font-mono text-xs">{study.projectionSha256}</code></p>
      {study.compliance.map((item) => <p key={item.key} className="mt-3 text-sm leading-6 text-slate-600">{item.exactText}</p>)}</aside>
  </div></article>;
}
