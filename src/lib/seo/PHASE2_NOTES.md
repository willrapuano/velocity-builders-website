# Phase 2 integration notes

## Market data feed adapter

- Current pages read market metrics via `getMarketMetrics(...)` in `market-data.ts`.
- Replace `SeededMarketDataSource` with a real adapter implementing:

```ts
interface MarketDataSource {
  getMetrics(query: MarketMetricsQuery): MarketMetrics;
}
```

- Keep output aggregated only (no lead names, addresses, or contact records).

## Thin-page guardrails

- `page-quality.ts` is the central scoring + threshold utility.
- `shouldIndexPage(...)` drives:
  - metadata robots index/follow on location templates
  - sitemap inclusion via `getIndexableLocationPaths()`
  - static params filtering for city/community/county routes

## Analytics destination adapter

- `trackConversionEvent(...)` is route-depth aware and emits:
  - `primary_cta_click`
  - `contact_intent`
  - `portal_intent`
- Replace the default adapter with your analytics provider:

```ts
setAnalyticsAdapter({ track: (event) => analyticsVendor.send(event) });
```

- Current default sends payload to `window.dataLayer` when available and logs in non-prod.
