"use client";

import { useEffect } from "react";

interface CaseStudySignalProps {
  projectionSha256: string;
}

export function CaseStudySignal({ projectionSha256 }: CaseStudySignalProps) {
  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_REBUILDER_PLATFORM_URL;
    if (!endpoint) return;
    const controller = new AbortController();
    const sessionKey = `rebuilder-case-study:${projectionSha256}`;
    let eventId = sessionStorage.getItem(sessionKey);
    if (!eventId) {
      eventId = crypto.randomUUID();
      sessionStorage.setItem(sessionKey, eventId);
      void send(endpoint, projectionSha256, eventId, "release_viewed", controller.signal);
    }
    const timer = window.setTimeout(() => {
      void send(endpoint, projectionSha256, `${eventId}-engaged`, "release_engaged", controller.signal);
    }, 15_000);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [projectionSha256]);
  return null;
}

async function send(endpoint: string, projectionSha256: string, seed: string, eventType: "release_viewed" | "release_engaged", signal: AbortSignal) {
  const eventId = seed.includes("-engaged") ? await uuidFromSeed(seed) : seed;
  await fetch(`${endpoint.replace(/\/$/, "")}/api/public/case-studies/events`, {
    method: "POST", headers: { "content-type": "application/json" }, signal, keepalive: true,
    body: JSON.stringify({ projectionSha256, eventId, eventType, occurredAt: new Date().toISOString() })
  }).catch(() => undefined);
}

async function uuidFromSeed(seed: string) {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed))).slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
