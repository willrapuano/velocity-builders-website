import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  
  fields: [
    // Hero
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", initialValue: "The Marketing Engine for Real Estate Professionals" }),
    defineField({ name: "heroSubheadline", title: "Hero Subheadline", type: "text", rows: 2 }),
    defineField({ name: "heroCta1Text", title: "Hero CTA 1 Text", type: "string", initialValue: "See Our Work" }),
    defineField({ name: "heroCta1Link", title: "Hero CTA 1 Link", type: "string", initialValue: "/services" }),
    defineField({ name: "heroCta2Text", title: "Hero CTA 2 Text", type: "string", initialValue: "Work With Us" }),
    defineField({ name: "heroCta2Link", title: "Hero CTA 2 Link", type: "string", initialValue: "/contact" }),
    defineField({ name: "heroImage", title: "Hero Background Image", type: "image", options: { hotspot: true } }),

    // Stats
    defineField({
      name: "stats",
      title: "Stats Bar",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Value", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
        ],
        preview: { select: { title: "value", subtitle: "label" } },
      }],
      initialValue: [
        { value: "87", label: "Agent Clients" },
        { value: "$2.4M", label: "Avg Client Revenue" },
        { value: "340%", label: "Avg Lead Increase" },
        { value: "48h", label: "Avg Onboarding Time" },
      ],
    }),

    // Services intro
    defineField({ name: "servicesHeadline", title: "Services Section Headline", type: "string", initialValue: "What We Build" }),
    defineField({ name: "servicesSubheadline", title: "Services Section Subheadline", type: "text", rows: 2 }),

    // Social proof / about strip
    defineField({ name: "aboutStripText", title: "About Strip Text", type: "text", rows: 3 }),

    // CTA section
    defineField({ name: "ctaHeadline", title: "CTA Section Headline", type: "string", initialValue: "Ready to Scale?" }),
    defineField({ name: "ctaSubheadline", title: "CTA Section Subheadline", type: "string" }),
    defineField({ name: "ctaButtonText", title: "CTA Button Text", type: "string", initialValue: "Let's Talk" }),
    defineField({ name: "ctaButtonLink", title: "CTA Button Link", type: "string", initialValue: "/contact" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
