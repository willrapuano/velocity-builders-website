"use client";

import Link from "next/link";
import { trackConversionEvent, type RouteContext } from "@/lib/analytics/events";

type Props = {
  route: RouteContext;
};

export function LocationCtas({ route }: Props) {
  return (
    <section className="rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-6" aria-label="Conversion actions">
      <h2 className="text-2xl font-semibold text-white">Ready to deploy this market strategy?</h2>
      <p className="mt-2 text-sm text-emerald-100/90">Get a route-specific launch plan with CRM wiring, SEO structure, and partner handoff automation.</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/contact"
          onClick={() => trackConversionEvent("primary_cta_click", route)}
          className="inline-flex rounded-full bg-emerald-300 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-200"
        >
          Book growth blueprint
        </Link>
        <Link
          href="/contact"
          onClick={() => trackConversionEvent("contact_intent", route)}
          className="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Contact Velocity
        </Link>
        <Link
          href="/portal"
          onClick={() => trackConversionEvent("portal_intent", route)}
          className="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          View performance portal
        </Link>
      </div>
    </section>
  );
}
