import { defineField, defineType } from "sanity";
import { calloutBlock, tableBlock, accordionBlock } from "./blockTypes";

const PILLARS = [
  { title: "Lead Generation Tactics", value: "lead-generation" },
  { title: "CRM & Automation Playbooks", value: "crm-automation" },
  { title: "Hyper-Local SEO", value: "hyper-local-seo" },
  { title: "Business Systems & Scaling", value: "business-systems" },
  { title: "Title Insurance & Settlement", value: "title-insurance" },
  { title: "Title & Real Estate News", value: "title-re-news" },
  { title: "Regulations & Compliance", value: "regulations-compliance" },
  { title: "Builder Marketing & Sales", value: "builder-marketing" },
  { title: "Lender Marketing & Growth", value: "lender-marketing" },
  { title: "Market Intelligence", value: "market-intelligence" },
  { title: "Tech Stack & Tools", value: "tech-tools" },
  { title: "Follow-Up Automation", value: "follow-up-automation" },
  { title: "Case Studies & ROI Proof", value: "case-studies" },
];

const AUDIENCES = [
  { title: "Agents", value: "agents" },
  { title: "Loan Officers", value: "loan-officers" },
  { title: "Builders", value: "builders" },
  { title: "Credit Unions / Banks", value: "credit-unions" },
];

const AUTOMATION_LEVELS = [
  { title: "Fully Auto", value: "fully-auto" },
  { title: "Semi-Auto", value: "semi-auto" },
  { title: "Manual", value: "manual" },
];

const PIPELINE_STATUSES = [
  { title: "Queued", value: "queued" },
  { title: "Writing", value: "writing" },
  { title: "Editing", value: "editing" },
  { title: "Fact-Checking", value: "fact-checking" },
  { title: "SEO Optimizing", value: "seo-optimizing" },
  { title: "Review Queue (Will)", value: "review-queue" },
  { title: "Published", value: "published" },
  { title: "Flagged", value: "flagged" },
  { title: "Killed", value: "killed" },
];

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "pipeline", title: "Pipeline" },
    { name: "seo", title: "SEO" },
    { name: "targeting", title: "Targeting" },
  ],
  fields: [
    // === CONTENT GROUP ===
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
      initialValue: "Will Rapuano | Velocity Builders",
    }),
    defineField({
      name: "authorBio",
      title: "Author Bio",
      type: "text",
      group: "content",
      rows: 2,
      initialValue:
        "Will Rapuano also leads Business Development for Pruitt Title, a settlement services company in Vienna, VA.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "content",
      rows: 3,
    }),
    defineField({
      name: "mainImage",
      title: "Featured Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
            { title: "Caption", value: "caption" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
        },
        { type: "callout" },
        { type: "table" },
        { type: "accordion" },
      ],
    }),

    // === TARGETING GROUP ===
    defineField({
      name: "pillar",
      title: "Content Pillar",
      type: "string",
      group: "targeting",
      options: { list: PILLARS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audiences",
      title: "Target Audiences",
      type: "array",
      group: "targeting",
      of: [{ type: "string" }],
      options: { list: AUDIENCES },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "automationLevel",
      title: "Automation Level",
      type: "string",
      group: "targeting",
      options: { list: AUTOMATION_LEVELS },
    }),
    defineField({
      name: "city",
      title: "Target City",
      type: "string",
      group: "targeting",
    }),
    defineField({
      name: "county",
      title: "Target County",
      type: "string",
      group: "targeting",
    }),
    defineField({
      name: "state",
      title: "Target State",
      type: "string",
      group: "targeting",
      options: {
        list: [
          { title: "Virginia", value: "VA" },
          { title: "Maryland", value: "MD" },
          { title: "District of Columbia", value: "DC" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "targeting",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    // === PIPELINE GROUP ===
    defineField({
      name: "pipelineStatus",
      title: "Pipeline Status",
      type: "string",
      group: "pipeline",
      options: { list: PIPELINE_STATUSES },
      initialValue: "queued",
    }),
    defineField({
      name: "primaryKeyword",
      title: "Primary Keyword",
      type: "string",
      group: "pipeline",
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Secondary Keywords",
      type: "array",
      group: "pipeline",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "angle",
      title: "Content Angle",
      type: "string",
      group: "pipeline",
      description: "Unique angle/hook for this post",
    }),
    defineField({
      name: "templateId",
      title: "Template ID",
      type: "string",
      group: "pipeline",
      description: "Which template variant generated this post",
    }),
    defineField({
      name: "similarityScore",
      title: "Similarity Score",
      type: "number",
      group: "pipeline",
      description: "Highest semantic similarity to existing posts (0-100)",
    }),
    defineField({
      name: "pipelineLog",
      title: "Pipeline Log",
      type: "array",
      group: "pipeline",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "stage", type: "string", title: "Stage" }),
            defineField({ name: "timestamp", type: "datetime", title: "Timestamp" }),
            defineField({ name: "status", type: "string", title: "Status" }),
            defineField({ name: "notes", type: "text", title: "Notes" }),
          ],
        },
      ],
    }),
    defineField({
      name: "internalLinks",
      title: "Internal Cross-Links",
      type: "array",
      group: "pipeline",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "url", type: "string", title: "URL" }),
            defineField({ name: "anchorText", type: "string", title: "Anchor Text" }),
            defineField({ name: "targetPillar", type: "string", title: "Target Pillar" }),
          ],
        },
      ],
    }),

    // === SEO GROUP ===
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides title for search engines (50-60 chars)",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "Meta Description",
      type: "text",
      group: "seo",
      rows: 2,
      description: "150-160 characters for search results",
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: "ogImage",
      title: "OG / Social Image",
      type: "image",
      group: "seo",
      description: "Social media preview image (1200x630 recommended)",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      group: "seo",
      description: "Set if this content exists elsewhere",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      group: "seo",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      pillar: "pillar",
      status: "pipelineStatus",
      media: "mainImage",
    },
    prepare({ title, pillar, status, media }) {
      const statusEmoji: Record<string, string> = {
        queued: "⏳",
        writing: "✍️",
        editing: "📝",
        "fact-checking": "🔍",
        "seo-optimizing": "🔧",
        "review-queue": "👀",
        published: "✅",
        flagged: "🚩",
        killed: "💀",
      };
      return {
        title,
        subtitle: `${statusEmoji[status] || "?"} ${status ?? "unknown"} · ${pillar ?? "no pillar"}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Pipeline Status",
      name: "pipelineStatusAsc",
      by: [{ field: "pipelineStatus", direction: "asc" }],
    },
  ],
});
