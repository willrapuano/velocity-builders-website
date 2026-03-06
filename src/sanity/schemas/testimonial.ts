import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Client Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Client Title / Role", type: "string" }),
    defineField({ name: "company", title: "Company / Brokerage", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "rating", title: "Rating (1-5)", type: "number", validation: (Rule) => Rule.min(1).max(5), initialValue: 5 }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: { list: ["Google", "Direct", "LinkedIn", "Facebook", "Referral"] },
      initialValue: "Google",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "photo" },
  },
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
