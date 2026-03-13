import type { MarketMetrics } from "@/lib/seo/market-data";

type Props = { title: string; metrics: MarketMetrics };

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function TrendValue({ label, value }: { label: string; value: number }) {
  return (
    <li className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700">
      <p className="text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{formatPercent(value)}</p>
    </li>
  );
}

export function MarketMetricsPanel({ title, metrics }: Props) {
  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6" aria-label={`${title} market metrics`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">
          Updated {new Date(metrics.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {metrics.sourceLabel}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Inventory", value: String(metrics.inventory) },
          { label: "Median list price", value: `$${metrics.medianListPriceUsd.toLocaleString()}` },
          { label: "Days on market", value: String(metrics.daysOnMarket) },
          { label: "Sale-to-list", value: `${(metrics.saleToListRatio * 100).toFixed(1)}%` },
        ].map((stat) => (
          <article key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
          </article>
        ))}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Market metric trends">
        <TrendValue label={`Inventory (${metrics.trends.inventoryDeltaPct.periodLabel})`} value={metrics.trends.inventoryDeltaPct.value} />
        <TrendValue label={`Price (${metrics.trends.medianListPriceDeltaPct.periodLabel})`} value={metrics.trends.medianListPriceDeltaPct.value} />
        <TrendValue label={`DOM (${metrics.trends.daysOnMarketDeltaPct.periodLabel})`} value={metrics.trends.daysOnMarketDeltaPct.value} />
        <TrendValue label={`Sale/list (${metrics.trends.saleToListDeltaPct.periodLabel})`} value={metrics.trends.saleToListDeltaPct.value} />
      </ul>
      <p className="text-xs text-gray-400">Privacy mode: {metrics.privacyMode}. Individual consumer records are never shown.</p>
    </section>
  );
}
