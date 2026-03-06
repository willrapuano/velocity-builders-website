export type MarketMetricTrend = {
  value: number;
  periodLabel: string;
};

export type MarketMetrics = {
  inventory: number;
  medianListPriceUsd: number;
  daysOnMarket: number;
  saleToListRatio: number;
  trends: {
    inventoryDeltaPct: MarketMetricTrend;
    medianListPriceDeltaPct: MarketMetricTrend;
    daysOnMarketDeltaPct: MarketMetricTrend;
    saleToListDeltaPct: MarketMetricTrend;
  };
  generatedAt: string;
  sourceLabel: string;
  privacyMode: "aggregated";
};

export type MarketMetricsScope = "county" | "city" | "community";

export type MarketMetricsQuery = {
  scope: MarketMetricsScope;
  countySlug: string;
  citySlug?: string;
  communitySlug?: string;
};

export interface MarketDataSource {
  getMetrics(query: MarketMetricsQuery): MarketMetrics;
}

/**
 * Placeholder source for deterministic pseudo-market values.
 * Swap this with a real feed adapter (MLS, data warehouse, API) without
 * changing page templates.
 */
class SeededMarketDataSource implements MarketDataSource {
  getMetrics(query: MarketMetricsQuery): MarketMetrics {
    const seed = stableHash([query.countySlug, query.citySlug, query.communitySlug, query.scope].filter(Boolean).join(":"));
    const scale = query.scope === "county" ? 1 : query.scope === "city" ? 0.62 : 0.34;

    const inventory = Math.max(12, Math.round((140 + (seed % 280)) * scale));
    const medianListPriceUsd = Math.round((540_000 + (seed % 620_000)) / 1_000) * 1_000;
    const daysOnMarket = Math.max(8, Math.round((17 + (seed % 36)) * (query.scope === "community" ? 0.8 : 1)));
    const saleToListRatio = Number((0.965 + ((seed % 41) / 1000)).toFixed(3));

    return {
      inventory,
      medianListPriceUsd,
      daysOnMarket,
      saleToListRatio,
      trends: {
        inventoryDeltaPct: this.delta(seed, 0, "30d"),
        medianListPriceDeltaPct: this.delta(seed, 1, "90d"),
        daysOnMarketDeltaPct: this.delta(seed, 2, "30d"),
        saleToListDeltaPct: this.delta(seed, 3, "90d"),
      },
      generatedAt: new Date().toISOString(),
      sourceLabel: "Velocity synthetic benchmark feed",
      privacyMode: "aggregated",
    };
  }

  private delta(seed: number, offset: number, periodLabel: string): MarketMetricTrend {
    const value = Number((((seed >> (offset * 3)) % 180) / 10 - 9).toFixed(1));
    return { value, periodLabel };
  }
}

const defaultMarketDataSource = new SeededMarketDataSource();

export function getMarketMetrics(query: MarketMetricsQuery, source: MarketDataSource = defaultMarketDataSource) {
  return source.getMetrics(query);
}

function stableHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}
