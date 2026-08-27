/**
 * Public content must not advertise or display MLS/IDX capabilities that are
 * not currently licensed and available through Velocity Builders.
 */
export const BLOCKED_MLS_DISPLAY_PATTERN =
  /\bidx\b|bright\s*mls|brightmls|internet data exchange/i;

const GROQ_BLOCKED_TERMS = [
  "*idx*",
  "*bright mls*",
  "*brightmls*",
  "*internet data exchange*",
] as const;

const GROQ_PUBLIC_TEXT_FIELDS = [
  "title",
  "slug.current",
  "excerpt",
  "seoTitle",
  "seoDescription",
  "pt::text(body)",
  "mainImage.alt",
  "mainImage.caption",
  "mainImage.asset->originalFilename",
  "mainImage.asset->title",
  "mainImage.asset->description",
  "mainImage.asset->altText",
] as const;

const groqTextChecks = GROQ_BLOCKED_TERMS.flatMap((term) =>
  GROQ_PUBLIC_TEXT_FIELDS.map((field) => `${field} match "${term}"`)
);

const groqBodyImageChecks = GROQ_BLOCKED_TERMS.map(
  (term) =>
    `count(body[_type == "image" && (` +
    [
      "alt",
      "caption",
      "asset->originalFilename",
      "asset->title",
      "asset->description",
      "asset->altText",
    ]
      .map((field) => `${field} match "${term}"`)
      .join(" || ") +
    `)]) > 0`
);

const groqCustomBlockChecks = GROQ_BLOCKED_TERMS.flatMap((term) => [
  `count(body[_type == "callout" && (title match "${term}" || body match "${term}")]) > 0`,
  `count(body[_type == "table" && (caption match "${term}" || rows[].cells[] match "${term}")]) > 0`,
  `count(body[_type == "accordion" && (items[].question match "${term}" || items[].answer match "${term}")]) > 0`,
  `count(body[_type == "block" && markDefs[].href match "${term}"]) > 0`,
]);

/**
 * GROQ predicate used on every public blog query. Keeping the policy in the
 * query prevents blocked posts from appearing in indexes, categories,
 * metadata, static params, or the sitemap.
 */
export const PUBLIC_BLOG_CONTENT_FILTER = `!(${[
  ...groqTextChecks,
  ...groqBodyImageChecks,
  ...groqCustomBlockChecks,
].join(" || ")})`;

/** Runtime defense for fields or custom Portable Text blocks not named above. */
export function containsBlockedMlsDisplayLanguage(value: unknown): boolean {
  if (typeof value === "string") {
    return BLOCKED_MLS_DISPLAY_PATTERN.test(value);
  }

  if (Array.isArray(value)) {
    return value.some(containsBlockedMlsDisplayLanguage);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(containsBlockedMlsDisplayLanguage);
  }

  return false;
}
