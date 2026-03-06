import type { Metadata } from "next";
import { portalData, type StatusTone } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Realtor Portal | Velocity Builders",
  description:
    "Realtor-facing portal with aggregated business stats and performance snapshots across Google Business Profile, Thanks.io mailings, and Database Recreator workflows.",
  alternates: {
    canonical: "/portal",
  },
  openGraph: {
    title: "Velocity Builders Realtor Portal",
    description:
      "Aggregated performance snapshots built for realtor partners. Privacy-safe, PII-free metrics only.",
    url: "https://velocitybuilders.io/portal",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const toneStyles: Record<StatusTone, string> = {
  healthy: "bg-emerald-400/15 text-emerald-200 border-emerald-300/40",
  watch: "bg-amber-300/10 text-amber-200 border-amber-300/40",
  action: "bg-rose-300/10 text-rose-200 border-rose-300/40",
};

function Badge({ tone, children }: { tone: StatusTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
      {children}
    </span>
  );
}

function MiniTrendChart({ values, label }: { values: number[]; label: string }) {
  const width = 260;
  const height = 64;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-20 w-full"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <polyline points={points} fill="none" stroke="rgba(52,211,153,0.9)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function PortalPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14">
      <header className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Realtor Partner Portal</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Business performance snapshot</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Monitor campaign momentum, visibility performance, and service delivery trends in one privacy-safe view.
            </p>
          </div>
          <Badge tone="healthy">Updated {portalData.lastUpdated}</Badge>
        </div>

        <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm text-emerald-100" role="note">
          <strong>Privacy mode:</strong> {portalData.privacyNotice}
        </div>
      </header>

      <section aria-labelledby="overall-stats-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="overall-stats-heading" className="text-2xl font-semibold text-white">
            1) Overall business stats
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portalData.overallStats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-slate-300">{stat.label}</p>
                <Badge tone={stat.tone}>{stat.delta}</Badge>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-400">{stat.context}</p>
            </article>
          ))}
        </div>

        <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h3 className="text-base font-semibold text-white">Lead influence trend (last 6 months)</h3>
          <MiniTrendChart
            values={portalData.leadTrend.map((point) => point.value)}
            label="Line chart showing six month lead influence trend"
          />
          <div className="grid grid-cols-6 gap-2 text-center text-xs text-slate-300">
            {portalData.leadTrend.map((point) => (
              <div key={point.label}>
                <p>{point.label}</p>
                <p className="font-semibold text-slate-100">{point.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section aria-labelledby="google-heading" className="space-y-6">
        <h2 id="google-heading" className="text-2xl font-semibold text-white">
          2) Google Business Profile optimization
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:col-span-2 lg:col-span-1">
            <p className="text-sm text-slate-300">Profile health score</p>
            <p className="mt-2 text-3xl font-semibold text-white">{portalData.google.profileHealthScore}</p>
            <p className="mt-2 text-xs text-slate-400">{portalData.google.visibilityTrend}</p>
          </article>
          {portalData.google.metrics.map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-300">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
              <div className="mt-2">
                <Badge tone={metric.tone}>{metric.trend}</Badge>
              </div>
            </article>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <table className="w-full text-left text-sm" aria-label="Google profile optimization checklist">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Optimization area
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Completion
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Last update
                </th>
              </tr>
            </thead>
            <tbody>
              {portalData.google.optimizationChecklist.map((item) => (
                <tr key={item.area} className="border-t border-white/5 text-slate-100">
                  <td className="px-4 py-3">{item.area}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 rounded-full bg-white/10" aria-hidden="true">
                        <div className="h-2 rounded-full bg-emerald-300" style={{ width: `${item.completion}%` }} />
                      </div>
                      <span>{item.completion}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={item.status === "Needs review" ? "action" : item.status === "In progress" ? "watch" : "healthy"}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="thanks-heading" className="space-y-6">
        <h2 id="thanks-heading" className="text-2xl font-semibold text-white">
          3) Thanks.io mailing performance
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Mailings sent</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.thanks.summary.mailingsSent}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Scans recorded</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.thanks.summary.scansRecorded}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Deliveries confirmed</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.thanks.summary.deliveriesConfirmed}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Response rate</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.thanks.summary.responseRate}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Avg. scan → lead</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.thanks.summary.averageScanToLeadHours}</p>
          </article>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <table className="w-full text-left text-sm" aria-label="Monthly Thanks.io mailing summary">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 font-medium">Mailings</th>
                <th className="px-4 py-3 font-medium">Scans</th>
                <th className="px-4 py-3 font-medium">Deliveries</th>
                <th className="px-4 py-3 font-medium">Quality</th>
              </tr>
            </thead>
            <tbody>
              {portalData.thanks.monthlyPerformance.map((row) => (
                <tr key={row.month} className="border-t border-white/5 text-slate-100">
                  <td className="px-4 py-3">{row.month}</td>
                  <td className="px-4 py-3">{row.mailings.toLocaleString()}</td>
                  <td className="px-4 py-3">{row.scans.toLocaleString()}</td>
                  <td className="px-4 py-3">{row.deliveries.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge tone={row.quality === "Monitor" ? "watch" : "healthy"}>{row.quality}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="database-heading" className="space-y-6 pb-6">
        <h2 id="database-heading" className="text-2xl font-semibold text-white">
          4) Database Recreator overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Pipeline coverage</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.databaseRecreator.snapshot.pipelineCoverage}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Records processed</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.databaseRecreator.snapshot.recordsProcessed}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Address verification</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {portalData.databaseRecreator.snapshot.addressVerificationRate}
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Audience readiness</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.databaseRecreator.snapshot.audienceReadyRate}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Automation health</p>
            <div className="mt-2">
              <Badge tone={portalData.databaseRecreator.snapshot.automationHealth === "Healthy" ? "healthy" : "watch"}>
                {portalData.databaseRecreator.snapshot.automationHealth}
              </Badge>
            </div>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Sync latency</p>
            <p className="mt-2 text-2xl font-semibold text-white">{portalData.databaseRecreator.snapshot.syncLatency}</p>
          </article>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <table className="w-full text-left text-sm" aria-label="Database Recreator anonymized audience segments">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Segment</th>
                <th className="px-4 py-3 font-medium">Volume</th>
                <th className="px-4 py-3 font-medium">Share</th>
                <th className="px-4 py-3 font-medium">Readiness</th>
              </tr>
            </thead>
            <tbody>
              {portalData.databaseRecreator.segments.map((segment) => (
                <tr key={segment.segment} className="border-t border-white/5 text-slate-100">
                  <td className="px-4 py-3">{segment.segment}</td>
                  <td className="px-4 py-3">{segment.volume}</td>
                  <td className="px-4 py-3">{segment.share}</td>
                  <td className="px-4 py-3">
                    <Badge tone={segment.readiness === "QA" ? "watch" : segment.readiness === "Queued" ? "action" : "healthy"}>
                      {segment.readiness}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
