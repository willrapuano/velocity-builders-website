import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

const singletons = ["homepage", "about", "siteSettings"];
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required.");
}

export default defineConfig({
  name: "velocity-builders",
  title: "Velocity Builders",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("🏠 Homepage").child(S.document().schemaType("homepage").documentId("homepage")),
            S.listItem().title("👤 About Page").child(S.document().schemaType("about").documentId("about")),
            S.listItem().title("⚙️ Site Settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.listItem().title("📝 Blog Posts").child(S.documentTypeList("post").title("Blog Posts")),
            S.listItem().title("🛠 Services").child(S.documentTypeList("service").title("Services")),
            S.listItem().title("⭐ Testimonials").child(S.documentTypeList("testimonial").title("Testimonials")),
            S.listItem().title("📊 Case Studies").child(S.documentTypeList("caseStudy").title("Case Studies")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
});
