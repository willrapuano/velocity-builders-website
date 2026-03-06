import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string", initialValue: "Velocity Builders" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "email", title: "Contact Email", type: "string", initialValue: "hello@velocitybuilders.io" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "twitter", title: "X / Twitter", type: "url" }),
      ],
    }),
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
      initialValue: "The marketing engine for real estate professionals.",
    }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
