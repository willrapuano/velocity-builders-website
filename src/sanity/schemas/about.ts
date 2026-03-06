import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About Page",
  type: "document",
  
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string", initialValue: "About Velocity Builders" }),
    defineField({ name: "subheadline", title: "Subheadline", type: "text", rows: 2 }),
    defineField({ name: "founderName", title: "Founder Name", type: "string", initialValue: "Will Rapuano" }),
    defineField({ name: "founderTitle", title: "Founder Title", type: "string", initialValue: "Founder & Business Development Officer" }),
    defineField({ name: "founderPhoto", title: "Founder Photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "founderBio",
      title: "Founder Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "mission",
      title: "Mission Statement",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "values",
      title: "Core Values",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Value", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),
    defineField({
      name: "credentials",
      title: "Credentials / Associations",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
