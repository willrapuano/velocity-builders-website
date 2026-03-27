import { defineType, defineField } from "sanity";

export const calloutBlock = defineType({
  name: "callout",
  type: "object",
  title: "Callout",
  fields: [
    defineField({
      name: "tone",
      type: "string",
      title: "Tone",
      options: {
        list: [
          { title: "Info (blue)", value: "info" },
          { title: "Warning (yellow)", value: "warning" },
          { title: "Success (green)", value: "success" },
          { title: "Tip (purple)", value: "tip" },
        ],
      },
      initialValue: "info",
    }),
    defineField({ name: "title", type: "string", title: "Title (optional)" }),
    defineField({ name: "body", type: "text", title: "Body text", rows: 3 }),
  ],
  preview: {
    select: { title: "title", body: "body", tone: "tone" },
    prepare({ title, body, tone }) {
      return { title: title || "Callout", subtitle: `[${tone}] ${body?.slice(0, 60) || ""}` };
    },
  },
});

export const tableBlock = defineType({
  name: "table",
  type: "object",
  title: "Table",
  fields: [
    defineField({
      name: "caption",
      type: "string",
      title: "Caption (optional)",
    }),
    defineField({
      name: "rows",
      type: "array",
      title: "Rows",
      of: [
        {
          name: "tableRow",
          type: "object",
          title: "Row",
          fields: [
            defineField({
              name: "cells",
              type: "array",
              title: "Cells",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "isHeader",
              type: "boolean",
              title: "Header row?",
              initialValue: false,
            }),
          ],
          preview: {
            select: { cells: "cells" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare({ cells }: any) {
              return { title: (cells || []).join(" | ").slice(0, 60) };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { caption: "caption", rows: "rows" },
    prepare({ caption, rows }) {
      return { title: caption || "Table", subtitle: `${(rows || []).length} rows` };
    },
  },
});

export const accordionBlock = defineType({
  name: "accordion",
  type: "object",
  title: "Accordion (FAQ)",
  fields: [
    defineField({
      name: "items",
      type: "array",
      title: "Items",
      of: [
        {
          name: "accordionItem",
          type: "object",
          title: "Item",
          fields: [
            defineField({ name: "question", type: "string", title: "Question" }),
            defineField({ name: "answer", type: "text", title: "Answer", rows: 4 }),
          ],
          preview: {
            select: { question: "question" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare({ question }: any) {
              return { title: question };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }) {
      return { title: "Accordion", subtitle: `${(items || []).length} items` };
    },
  },
});
