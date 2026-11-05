import assert from "node:assert/strict";
import test from "node:test";

import {
  CONTACT_LIMITS,
  clientIpFromHeaders,
  createRateLimiter,
  escapeHtml,
  validateContactPayload,
} from "../src/lib/contact-form.ts";

const valid = {
  name: "Ada",
  email: "ada@example.com",
  company: "",
  message: "Hello",
};

test("escapeHtml neutralises markup and attribute breakouts", () => {
  assert.equal(
    escapeHtml(`<a href="x" onclick='y'>Tom & Jerry</a>`),
    "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;Tom &amp; Jerry&lt;/a&gt;",
  );
  assert.equal(escapeHtml("plain text"), "plain text");
});

test("validateContactPayload keeps the required-field message first", () => {
  assert.equal(validateContactPayload({ ...valid, name: "" }), "Missing required fields");
  assert.equal(validateContactPayload({ ...valid, message: "" }), "Missing required fields");
  assert.equal(validateContactPayload(valid), null);
});

test("validateContactPayload enforces size caps and email shape", () => {
  assert.equal(validateContactPayload({ ...valid, name: "a".repeat(CONTACT_LIMITS.name) }), null);
  assert.equal(validateContactPayload({ ...valid, name: "a".repeat(CONTACT_LIMITS.name + 1) }), "Name is too long");
  assert.equal(validateContactPayload({ ...valid, company: "a".repeat(CONTACT_LIMITS.company + 1) }), "Company is too long");
  assert.equal(validateContactPayload({ ...valid, message: "a".repeat(CONTACT_LIMITS.message + 1) }), "Message is too long");
  assert.equal(validateContactPayload({ ...valid, email: `${"a".repeat(250)}@x.io` }), "Invalid email address");
  assert.equal(validateContactPayload({ ...valid, email: "not an email" }), "Invalid email address");
  assert.equal(validateContactPayload({ ...valid, email: "a@b" }), "Invalid email address");
  assert.equal(validateContactPayload({ ...valid, email: "a@b.co\nBcc: x@y.z" }), "Invalid email address");
});

test("rate limiter allows max hits per window per key, then resets", () => {
  let t = 0;
  const allow = createRateLimiter({ max: 3, windowMs: 1000 }, () => t);
  assert.deepEqual([allow("ip1"), allow("ip1"), allow("ip1"), allow("ip1")], [true, true, true, false]);
  assert.equal(allow("ip2"), true, "other keys are independent");
  t = 999;
  assert.equal(allow("ip1"), false);
  t = 1000;
  assert.equal(allow("ip1"), true, "window has reset");
});

test("clientIpFromHeaders takes the first x-forwarded-for hop", () => {
  assert.equal(clientIpFromHeaders(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" })), "203.0.113.9");
  assert.equal(clientIpFromHeaders(new Headers({ "x-real-ip": "198.51.100.2" })), "198.51.100.2");
  assert.equal(clientIpFromHeaders(new Headers()), "unknown");
});
