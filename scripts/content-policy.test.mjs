import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  containsBlockedMlsDisplayLanguage,
  isBlockedPublicAssetUrl,
  PUBLIC_BLOG_CONTENT_FILTER,
} from "../src/lib/content-policy.ts";
const blogApiSource = await readFile(
  new URL("../src/lib/blog/api.ts", import.meta.url),
  "utf8",
);
const rootLayoutSource = await readFile(
  new URL("../src/app/layout.tsx", import.meta.url),
  "utf8",
);
const runtimeGuardSource = await readFile(
  new URL("../public/mls-display-guard.js", import.meta.url),
  "utf8",
);
const globalCssSource = await readFile(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);

const blogPostPageSource = await readFile(
  new URL("../src/app/blog/[slug]/page.tsx", import.meta.url),
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

test("blocks the pixel-only IDX image by immutable Sanity asset digest", () => {
  const blockedAsset =
    "https://cdn.sanity.io/images/xifumfa3/production/0a2cacda999999cdec3d43150dbf59a151e702b9-1376x768.png";

  assert.equal(isBlockedPublicAssetUrl(blockedAsset), true);
  assert.equal(isBlockedPublicAssetUrl(`${blockedAsset}?w=1200&fit=max`), true);
  assert.equal(
    isBlockedPublicAssetUrl(
      "https://cdn.sanity.io/images/xifumfa3/production/b650cebe21daa41a2df4fb5ad34f0c896136ae8a-1376x768.png",
    ),
    false,
  );
});

test("all public blog image render paths apply the pixel-level denylist", () => {
  assert.match(blogApiSource, /!isBlockedPublicAssetUrl\(featuredImage\)/);
  assert.match(blogPostPageSource, /isBlockedPublicAssetUrl\(imageUrl\)/);
});

test("the root layout loads the MLS display guard before hydration", () => {
  assert.match(rootLayoutSource, /src="\/mls-display-guard\.js"/);
  assert.match(rootLayoutSource, /strategy="beforeInteractive"/);
});

test("the runtime guard removes conditional and dynamically injected badges", () => {
  assert.match(runtimeGuardSource, /MutationObserver/);
  assert.match(runtimeGuardSource, /bright\[\\s_-\]\*mls\|brightmls\|\\bidx\\b/);
  assert.match(runtimeGuardSource, /data-rebuilder-mls-display-blocked/);
  assert.match(runtimeGuardSource, /element\.remove\(\)/);
});

test("the runtime guard removes anonymous fixed bottom-right overlays", () => {
  assert.match(runtimeGuardSource, /function isBottomRightOverlay/);
  assert.match(runtimeGuardSource, /style\.position !== "fixed"/);
  assert.match(runtimeGuardSource, /getBoundingClientRect/);
  assert.match(runtimeGuardSource, /window\.innerWidth - 96/);
  assert.match(runtimeGuardSource, /window\.innerHeight - 96/);
  assert.match(runtimeGuardSource, /Element\.prototype\.attachShadow/);
  assert.match(runtimeGuardSource, /shadowRoots\.set\(this, root\)/);
});

test("critical BrightMLS selectors fail closed before JavaScript executes", () => {
  assert.match(globalCssSource, /img\[src\*="brightmls" i\]/);
  assert.match(globalCssSource, /iframe\[src\*="brightmls" i\]/);
  assert.match(globalCssSource, /display: none !important/);
  assert.match(
    globalCssSource,
    /\[style\*="position:fixed" i\]\[style\*="bottom:" i\]\[style\*="right:" i\]/,
  );
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
