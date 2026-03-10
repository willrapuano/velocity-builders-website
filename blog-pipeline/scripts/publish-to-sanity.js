#!/usr/bin/env node
/**
 * publish-to-sanity.js
 *
 * Publishes approved blog post drafts to Sanity CMS.
 * Reads markdown drafts from the approved/ directory, parses frontmatter,
 * and creates/updates blogPost documents in Sanity.
 *
 * Usage:
 *   node publish-to-sanity.js --draft approved/post-2026-0310-001.md
 *   node publish-to-sanity.js --all          # publish all approved posts
 *   node publish-to-sanity.js --dry-run      # preview without publishing
 *
 * Env:
 *   SANITY_API_TOKEN    — write-capable Sanity token
 *   SANITY_PROJECT_ID   — Sanity project ID (or NEXT_PUBLIC_SANITY_PROJECT_ID)
 *   SANITY_DATASET      — dataset name (default: production)
 */

const fs = require("fs");
const path = require("path");

// --- Config ---
const APPROVED_DIR = path.join(__dirname, "..", "approved");
const PUBLISHED_DIR = path.join(__dirname, "..", "published");
const REGISTRY_PATH = path.join(__dirname, "..", "data", "topic-registry.json");

function loadEnv() {
  // Try loading .env from repo root
  const envPaths = [
    path.join(__dirname, "..", "..", ".env.local"),
    path.join(__dirname, "..", "..", ".env"),
    path.join(__dirname, "..", ".env"),
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, "utf-8").split("\n");
      for (const line of lines) {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
        }
      }
    }
  }
}

loadEnv();

const CONFIG = {
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN_VELOCITY || "",
  apiVersion: "2024-01-01",
};

// --- Frontmatter parser ---
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim().replace(/^["']|["']$/g, "");
      // Handle arrays like [tag1, tag2]
      if (val.startsWith("[") && val.endsWith("]")) {
        val = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      }
      meta[kv[1]] = val;
    }
  }
  return { meta, body: match[2].trim() };
}

// --- Slug generator ---
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// --- Category mapping ---
const CATEGORY_MAP = {
  "marketing-systems": "marketingSystems",
  "real-estate-news": "realEstateNews",
  "ai-tools": "aiTools",
  "title-insurance": "titleInsurance",
  "crm-automation": "marketingSystems",
  "lead-generation": "marketingSystems",
  "follow-up-automation": "marketingSystems",
  "hyper-local-seo": "marketingSystems",
  "builder-marketing": "marketingSystems",
  "lender-marketing": "marketingSystems",
  "market-intelligence": "realEstateNews",
  "regulations": "realEstateNews",
  "tech-tools": "aiTools",
  "business-systems": "aiTools",
  "title-news": "titleInsurance",
  "title-insurance": "titleInsurance",
  "case-studies": "marketingSystems",
};

// --- Sanity API ---
async function sanityMutate(mutations, dryRun = false) {
  if (!CONFIG.projectId || !CONFIG.token) {
    throw new Error(
      "Missing SANITY_PROJECT_ID or SANITY_API_TOKEN. Set in .env or environment."
    );
  }

  if (dryRun) {
    console.log("[DRY RUN] Would send mutations:", JSON.stringify(mutations, null, 2));
    return { results: mutations.map(() => ({ id: "dry-run" })) };
  }

  const url = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/mutate/${CONFIG.dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CONFIG.token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity API error ${res.status}: ${text}`);
  }

  return res.json();
}

// --- Build Sanity document from markdown ---
function buildSanityDoc(meta, body) {
  const slug = meta.slug || slugify(meta.title || "untitled");
  const category = CATEGORY_MAP[meta.pillar] || CATEGORY_MAP[meta.category] || "marketingSystems";

  // Convert markdown body to Sanity portable text (simplified — single block)
  // For production, use @sanity/block-tools for full conversion
  const blocks = body.split("\n\n").filter(Boolean).map((paragraph, i) => ({
    _type: "block",
    _key: `block-${i}`,
    style: paragraph.startsWith("## ")
      ? "h2"
      : paragraph.startsWith("### ")
      ? "h3"
      : "normal",
    children: [
      {
        _type: "span",
        _key: `span-${i}`,
        text: paragraph.replace(/^#{1,3}\s+/, ""),
        marks: [],
      },
    ],
    markDefs: [],
  }));

  return {
    _type: "blogPost",
    _id: `blogPost-${slug}`,
    title: meta.title || "Untitled Post",
    slug: { _type: "slug", current: slug },
    category,
    excerpt: meta.description || meta.excerpt || "",
    publishedAt: meta.date || new Date().toISOString().split("T")[0],
    body: blocks,
    seoTitle: meta.seoTitle || meta.title || "",
    seoDescription: meta.seoDescription || meta.description || "",
    featured: meta.featured === "true" || meta.featured === true,
  };
}

// --- Publish a single draft ---
async function publishDraft(filePath, dryRun = false) {
  const content = fs.readFileSync(filePath, "utf-8");
  const { meta, body } = parseFrontmatter(content);

  if (!meta.title) {
    console.error(`⚠ Skipping ${path.basename(filePath)} — no title in frontmatter`);
    return null;
  }

  const doc = buildSanityDoc(meta, body);
  console.log(`📤 Publishing: "${doc.title}" → ${doc._id} (${doc.category})`);

  const result = await sanityMutate(
    [{ createOrReplace: doc }],
    dryRun
  );

  // Move to published/
  if (!dryRun) {
    fs.mkdirSync(PUBLISHED_DIR, { recursive: true });
    const dest = path.join(PUBLISHED_DIR, path.basename(filePath));
    fs.renameSync(filePath, dest);
    console.log(`  ✅ Published and moved to published/${path.basename(filePath)}`);

    // Update registry
    updateRegistry(meta, doc);
  }

  return result;
}

// --- Update topic registry ---
function updateRegistry(meta, doc) {
  try {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
    const entry = registry.find(
      (r) => r.slug === doc.slug.current || r.title === doc.title
    );
    if (entry) {
      entry.status = "published";
      entry.publishedAt = new Date().toISOString();
      entry.sanityId = doc._id;
      fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
    }
  } catch {
    // Registry update is best-effort
  }
}

// --- CLI ---
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const publishAll = args.includes("--all");

  let files = [];

  if (publishAll) {
    fs.mkdirSync(APPROVED_DIR, { recursive: true });
    files = fs
      .readdirSync(APPROVED_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => path.join(APPROVED_DIR, f));

    if (files.length === 0) {
      console.log("📭 No approved posts to publish. Run review-council.js first.");
      return;
    }
    console.log(`📋 Found ${files.length} approved post(s) to publish`);
  } else {
    const draftIdx = args.indexOf("--draft");
    if (draftIdx === -1 || !args[draftIdx + 1]) {
      console.error("Usage: node publish-to-sanity.js --draft <file> | --all [--dry-run]");
      process.exit(1);
    }
    files = [args[draftIdx + 1]];
  }

  let published = 0;
  let failed = 0;

  for (const file of files) {
    try {
      await publishDraft(file, dryRun);
      published++;
    } catch (err) {
      console.error(`❌ Failed to publish ${path.basename(file)}:`, err.message);
      failed++;
    }
  }

  console.log(`\n🏁 Done: ${published} published, ${failed} failed${dryRun ? " (dry run)" : ""}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
