import assert from "node:assert/strict";
import test from "node:test";

import {
  containsBlockedMlsDisplayLanguage,
  PUBLIC_BLOG_CONTENT_FILTER,
} from "../src/lib/content-policy.ts";

test("blocks public MLS/IDX display language across nested CMS values", () => {
  const blocked = [
    "IDX website",
    "Bright MLS display",
    "BrightMLS logo",
    "Internet Data Exchange",
    { body: [{ children: [{ text: "Includes an idx feed" }] }] },
    { image: { alt: "Bright MLS attribution" } },
  ];

  for (const value of blocked) {
    assert.equal(containsBlockedMlsDisplayLanguage(value), true);
  }
});

test("allows honest website and lead-capture language", () => {
  const allowed = {
    title: "Agent Website + Lead Capture Program",
    description: "Conversion-focused local pages with clear source attribution.",
  };

  assert.equal(containsBlockedMlsDisplayLanguage(allowed), false);
});

test("public GROQ filter covers text, metadata, and image attribution", () => {
  for (const field of [
    "title",
    "slug.current",
    "pt::text(body)",
    "mainImage.asset->originalFilename",
    'body[_type == "image"',
    'body[_type == "callout"',
    'body[_type == "table"',
    'body[_type == "accordion"',
  ]) {
    assert.match(PUBLIC_BLOG_CONTENT_FILTER, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
