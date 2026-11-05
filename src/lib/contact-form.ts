/**
 * Validation, escaping and rate limiting for the public contact form
 * (POST /api/contact). Pure helpers so they can be unit tested without a
 * request context.
 */

export const CONTACT_LIMITS = {
  name: 200,
  company: 200,
  email: 254,
  message: 5000,
} as const;

export const RATE_LIMIT = {
  max: 5,
  windowMs: 10 * 60 * 1000,
} as const;

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
};

/** Escape the five characters that matter inside an HTML text node or attribute. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Deliberately loose: one "@", no whitespace, something after the dot.
// It rejects garbage and header-ish input, not every RFC 5322 corner case.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns an error message for a 400 response, or null when the payload is
 * acceptable. Required-field checks come first so the caller's existing
 * "Missing required fields" response is preserved.
 */
export function validateContactPayload(payload: ContactPayload): string | null {
  if (!payload.name || !payload.email || !payload.message) {
    return "Missing required fields";
  }
  if (payload.name.length > CONTACT_LIMITS.name) return "Name is too long";
  if (payload.company.length > CONTACT_LIMITS.company) return "Company is too long";
  if (payload.email.length > CONTACT_LIMITS.email || !EMAIL_SHAPE.test(payload.email)) {
    return "Invalid email address";
  }
  if (payload.message.length > CONTACT_LIMITS.message) return "Message is too long";
  return null;
}

/**
 * Fixed-window per-key counter.
 *
 * This is per-instance and best-effort: on Vercel each warm function instance
 * has its own map, so the effective limit is roughly max x instances and resets
 * on cold start. It bounds casual abuse of a metered send; it is not a
 * substitute for an edge/WAF rule or a shared store.
 */
export function createRateLimiter(
  { max, windowMs }: { max: number; windowMs: number } = RATE_LIMIT,
  now: () => number = Date.now,
) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function allow(key: string): boolean {
    const t = now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= t) {
      // Opportunistic sweep so the map cannot grow without bound.
      if (hits.size > 1000) {
        for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
      }
      hits.set(key, { count: 1, resetAt: t + windowMs });
      return true;
    }
    if (entry.count >= max) return false;
    entry.count += 1;
    return true;
  };
}

/** First hop of x-forwarded-for, which Vercel sets to the client IP. */
export function clientIpFromHeaders(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip")?.trim() || "unknown";
}
