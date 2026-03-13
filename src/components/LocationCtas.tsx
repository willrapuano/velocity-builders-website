"use client";

import Link from "next/link";
import { trackConversionEvent, type RouteContext } from "@/lib/analytics/events";

type Props = { route: RouteContext };

export function LocationCtas({ route }: Props) {
  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-6" aria-label="Conversion actions">
      <h2 className="text-2xl font-bold text-gray-900">Ready to deploy this market strategy?</h2>
      <p className="mt-2 text-sm text-gray-600">Get a route-specific launch plan with CRM wiring, SEO structure, and partner handoff automation.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/contact" onClick={() => trackConversionEvent("primary_cta_click", route)} className="inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-600/25">
          Book growth blueprint
        </Link>
        <Link href="/contact" onClick={() => trackConversionEvent("contact_intent", route)} className="inline-flex rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-blue-600 hover:text-blue-600">
          Contact Velocity
        </Link>
        <Link href="/portal" onClick={() => trackConversionEvent("portal_intent", route)} className="inline-flex rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-blue-600 hover:text-blue-600">
          View performance portal
        </Link>
      </div>
    </section>
  );
}
