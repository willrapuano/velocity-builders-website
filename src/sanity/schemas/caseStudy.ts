import { defineField, defineType } from "sanity";

const governed = { readOnly: true } as const;

export const caseStudy = defineType({
  name: "caseStudy",
  title: "REbuilder Case Study Projection",
  type: "document",
  description: "Approved public projection from REbuilder. Governed fields are read-only; corrections start in REbuilder and arrive as a new projection.",
  fields: [
    defineField({ name: "projectionSchemaVersion", title: "Projection schema", type: "string", ...governed, validation: (Rule) => Rule.required().custom((value) => value === "rebuilder-case-study-projection-v1" || "Unsupported projection schema") }),
    defineField({ name: "sourceCaseStudyId", title: "REbuilder case study ID", type: "string", ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "sourceVersionId", title: "Immutable REbuilder version ID", type: "string", ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "projectionSha256", title: "Projection SHA-256", type: "string", ...governed, validation: (Rule) => Rule.required().regex(/^[a-f0-9]{64}$/) }),
    defineField({ name: "title", title: "Title", type: "string", ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "publicClientLabel", title: "Approved public client label", type: "string", ...governed }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "challenge", title: "Challenge", type: "text", rows: 6, ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "approach", title: "Approach", type: "text", rows: 6, ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "outcome", title: "Outcome", type: "text", rows: 6, ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "verifiedMetrics", title: "Verified metrics", type: "array", ...governed, of: [{ type: "object", fields: [
      defineField({ name: "key", title: "Key", type: "string" }),
      defineField({ name: "label", title: "Label", type: "string" }),
      defineField({ name: "value", title: "Value", type: "number" }),
      defineField({ name: "unit", title: "Unit", type: "string" }),
      defineField({ name: "comparisonPeriod", title: "Comparison period", type: "string" })
    ], preview: { select: { title: "label", subtitle: "value" } } }] }),
    defineField({ name: "compliance", title: "Locked compliance language", type: "array", ...governed, of: [{ type: "object", fields: [
      defineField({ name: "key", title: "Key", type: "string" }),
      defineField({ name: "exactText", title: "Exact text", type: "text" }),
      defineField({ name: "sha256", title: "SHA-256", type: "string" })
    ] }] }),
    defineField({ name: "releasedAt", title: "Released in REbuilder", type: "datetime", ...governed, validation: (Rule) => Rule.required() }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2 })
  ],
  preview: { select: { title: "title", subtitle: "projectionSha256", media: "coverImage" } }
});
