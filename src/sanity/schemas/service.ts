import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "icon", title: "Icon (emoji or name)", type: "string" }),
    defineField({ name: "shortDescription", title: "Short Description (card)", type: "text", rows: 2 }),
    defineField({
      name: "body",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "features",
      title: "Features / Bullet Points",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "cta", title: "CTA Text", type: "string", initialValue: "Learn More" }),
    defineField({ name: "ctaLink", title: "CTA Link", type: "string" }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
    defineField({ name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: false }),
    defineField({ name: "image", title: "Service Image", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "title", subtitle: "shortDescription", media: "image" },
  },
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
