export type RouteDepth = "hub" | "county" | "city" | "community";
export type ConversionIntent = "primary_cta_click" | "contact_intent" | "portal_intent";

export type RouteContext = {
  depth: RouteDepth;
  countySlug?: string;
  citySlug?: string;
  communitySlug?: string;
  path: string;
};

export type ConversionEvent = {
  eventName: "velocity_conversion";
  intent: ConversionIntent;
  route: RouteContext;
  timestamp: string;
};

export interface AnalyticsAdapter {
  track(event: ConversionEvent): void;
}

class BrowserDefaultAdapter implements AnalyticsAdapter {
  track(event: ConversionEvent) {
    if (typeof window === "undefined") return;

    const payload = { ...event };

    // Segment/GTM friendly payload shim. Swap/extend this adapter when wiring a real vendor.
    (window as Window & { dataLayer?: unknown[] }).dataLayer?.push(payload);

    if (process.env.NODE_ENV !== "production") {
      console.info("[analytics]", payload);
    }
  }
}

let activeAdapter: AnalyticsAdapter = new BrowserDefaultAdapter();

export function setAnalyticsAdapter(adapter: AnalyticsAdapter) {
  activeAdapter = adapter;
}

export function trackConversionEvent(intent: ConversionIntent, route: RouteContext) {
  activeAdapter.track({
    eventName: "velocity_conversion",
    intent,
    route,
    timestamp: new Date().toISOString(),
  });
}
