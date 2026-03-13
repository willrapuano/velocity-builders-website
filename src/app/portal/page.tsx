import type { Metadata } from "next";
import { portalData, type StatusTone } from "@/lib/portal-data";

export const metadata: Metadata = {
  title: "Realtor Portal | Velocity Builders",
  description:
    "Realtor-facing portal with aggregated business stats and performance snapshots across Google Business Profile, Thanks.io mailings, and Database Recreator workflows.",
  alternates: { canonical: "/portal" },
  openGraph: {
    title: "Velocity Builders Realtor Portal",
    description:
      "Aggregated performance snapshots built for realtor partners. Privacy-safe, PII-free metrics only.",
    url: "https://velocity-builders.com/portal",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const toneStyles: Record<StatusTone, string> = {
  healthy: "bg-green-50 text-green-700 border-green-200",
  watch: "bg-amber-50 text-amber-700 border-amber-200",
  action: "bg-red-50 text-red-700 border-red-200",
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
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full" role="img" aria-label={label} focusable="false">
      <polyline points={points} fill="none" stroke="rgba(37,99,235,0.8)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function PortalPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-14">
        {/* Header */}
        <header className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Realtor Partner Portal</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Business performance snapshot</h1>
              <p className="mt-3 max-w-3xl text-gray-600">
                Monitor campaign momentum, visibility performance, and service delivery trends in one privacy-safe view.
              </p>
            </div>
            <Badge tone="healthy">Updated {portalData.lastUpdated}</Badge>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800" role="note">
            <strong>Privacy mode:</strong> {portalData.privacyNotice}
          </div>
        </header>

        {/* Overall stats */}
        <section aria-labelledby="overall-stats-heading" className="space-y-6">
          <h2 id="overall-stats-heading" className="text-2xl font-bold text-gray-900">1) Overall business stats</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {portalData.overallStats.map((stat) => (
              <article key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <Badge tone={stat.tone}>{stat.delta}</Badge>
                </div>
                <p className="mt-4 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-2 text-xs text-gray-500">{stat.context}</p>
              </article>
            ))}
          </div>
          <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Lead influence trend (last 6 months)</h3>
            <MiniTrendChart values={portalData.leadTrend.map((p) => p.value)} label="Line chart showing six month lead influence trend" />
            <div className="grid grid-cols-6 gap-2 text-center text-xs text-gray-600">
              {portalData.leadTrend.map((point) => (
                <div key={point.label}>
                  <p>{point.label}</p>
                  <p className="font-semibold text-gray-900">{point.value}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Google */}
        <section aria-labelledby="google-heading" className="space-y-6">
          <h2 id="google-heading" className="text-2xl font-bold text-gray-900">2) Google Business Profile optimization</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-600">Profile health score</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{portalData.google.profileHealthScore}</p>
              <p className="mt-2 text-xs text-gray-500">{portalData.google.visibilityTrend}</p>
            </article>
            {portalData.google.metrics.map((metric) => (
              <article key={metric.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="mt-2"><Badge tone={metric.tone}>{metric.trend}</Badge></div>
              </article>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm" aria-label="Google profile optimization checklist">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Optimization area</th>
                  <th scope="col" className="px-4 py-3 font-medium">Completion</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last update</th>
                </tr>
              </thead>
              <tbody>
                {portalData.google.optimizationChecklist.map((item) => (
                  <tr key={item.area} className="border-t border-gray-100 text-gray-800">
                    <td className="px-4 py-3">{item.area}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 rounded-full bg-gray-200" aria-hidden="true">
                          <div className="h-2 rounded-full bg-blue-600" style={{ width: `${item.completion}%` }} />
                        </div>
                        <span>{item.completion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={item.status === "Needs review" ? "action" : item.status === "In progress" ? "watch" : "healthy"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Thanks.io */}
        <section aria-labelledby="thanks-heading" className="space-y-6">
          <h2 id="thanks-heading" className="text-2xl font-bold text-gray-900">3) Thanks.io mailing performance</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(portalData.thanks.summary).map(([key, val]) => (
              <article key={key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{val}</p>
              </article>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm" aria-label="Monthly Thanks.io mailing summary">
              <thead className="bg-gray-50 text-gray-700">
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
                  <tr key={row.month} className="border-t border-gray-100 text-gray-800">
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

        {/* Database Recreator */}
        <section aria-labelledby="database-heading" className="space-y-6 pb-6">
          <h2 id="database-heading" className="text-2xl font-bold text-gray-900">4) Database Recreator overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(portalData.databaseRecreator.snapshot).map(([key, val]) => (
              <article key={key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-600">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                {key === "automationHealth" ? (
                  <div className="mt-2">
                    <Badge tone={val === "Healthy" ? "healthy" : "watch"}>{val}</Badge>
                  </div>
                ) : (
                  <p className="mt-2 text-2xl font-bold text-gray-900">{val}</p>
                )}
              </article>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm" aria-label="Database Recreator anonymized audience segments">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Segment</th>
                  <th className="px-4 py-3 font-medium">Volume</th>
                  <th className="px-4 py-3 font-medium">Share</th>
                  <th className="px-4 py-3 font-medium">Readiness</th>
                </tr>
              </thead>
              <tbody>
                {portalData.databaseRecreator.segments.map((segment) => (
                  <tr key={segment.segment} className="border-t border-gray-100 text-gray-800">
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
    </div>
  );
}
