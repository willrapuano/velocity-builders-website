import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "clientName", title: "Client Name", type: "string" }),
    defineField({ name: "clientType", title: "Client Type", type: "string", options: { list: ["Realtor", "Loan Officer", "Real Estate Team", "Mortgage Company", "Brokerage"] } }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 2 }),
    defineField({
      name: "results",
      title: "Key Results",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "metric", title: "Metric", type: "string" }),
          defineField({ name: "value", title: "Value", type: "string" }),
        ],
        preview: { select: { title: "value", subtitle: "metric" } },
      }],
    }),
    defineField({
      name: "body",
      title: "Full Case Study",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "title", subtitle: "clientType", media: "coverImage" },
  },
});
