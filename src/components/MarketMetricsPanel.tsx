import type { MarketMetrics } from "@/lib/seo/market-data";

type Props = {
  title: string;
  metrics: MarketMetrics;
};

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function TrendValue({ label, value }: { label: string; value: number }) {
  return (
    <li className="rounded-xl border border-white/10 bg-slate-900/40 p-3 text-xs text-slate-200">
      <p className="text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{formatPercent(value)}</p>
    </li>
  );
}

export function MarketMetricsPanel({ title, metrics }: Props) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6" aria-label={`${title} market metrics`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-xs text-slate-400">
          Updated {new Date(metrics.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {metrics.sourceLabel}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Inventory</p>
          <p className="mt-2 text-2xl font-semibold text-white">{metrics.inventory}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Median list price</p>
          <p className="mt-2 text-2xl font-semibold text-white">${metrics.medianListPriceUsd.toLocaleString()}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Days on market</p>
          <p className="mt-2 text-2xl font-semibold text-white">{metrics.daysOnMarket}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Sale-to-list</p>
          <p className="mt-2 text-2xl font-semibold text-white">{(metrics.saleToListRatio * 100).toFixed(1)}%</p>
        </article>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Market metric trends">
        <TrendValue label={`Inventory (${metrics.trends.inventoryDeltaPct.periodLabel})`} value={metrics.trends.inventoryDeltaPct.value} />
        <TrendValue label={`Price (${metrics.trends.medianListPriceDeltaPct.periodLabel})`} value={metrics.trends.medianListPriceDeltaPct.value} />
        <TrendValue label={`DOM (${metrics.trends.daysOnMarketDeltaPct.periodLabel})`} value={metrics.trends.daysOnMarketDeltaPct.value} />
        <TrendValue label={`Sale/list (${metrics.trends.saleToListDeltaPct.periodLabel})`} value={metrics.trends.saleToListDeltaPct.value} />
      </ul>
      <p className="text-xs text-slate-500">Privacy mode: {metrics.privacyMode}. Individual consumer records are never shown.</p>
    </section>
  );
}
