import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  containsBlockedMlsDisplayLanguage,
  PUBLIC_BLOG_CONTENT_FILTER,
} from "../src/lib/content-policy.ts";

const blogPostPageSource = await readFile(
  new URL("../src/app/blog/[slug]/page.tsx", import.meta.url),
  "utf8",
);
const rootLayoutSource = await readFile(
  new URL("../src/app/layout.tsx", import.meta.url),
  "utf8",
);

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

test("blocked legacy slugs return a removal response instead of redirecting", () => {
  assert.doesNotMatch(blogPostPageSource, /permanentRedirect/);
  assert.match(
    blogPostPageSource,
    /containsBlockedMlsDisplayLanguage\(slug\)\) notFound\(\)/,
  );
  assert.match(blogPostPageSource, /robots: \{ index: false, follow: false \}/);
  assert.doesNotMatch(rootLayoutSource, /robots:\s*\{\s*index:\s*true/);
});
