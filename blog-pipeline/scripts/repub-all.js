#!/usr/bin/env node
/**
 * repub-all.js
 *
 * Re-publishes all 23 blogPost documents through the updated converter
 * (with full inline-mark parsing). Reads source markdown from:
 *   - cornerstones/  (14 posts)
 *   - blog-pipeline/published/  (9 pipeline posts)
 *
 * Uses createOrReplace — safe to run multiple times.
 * Does NOT move files.
 *
 * Usage:
 *   node repub-all.js           # re-publish all
 *   node repub-all.js --dry-run # preview mutations only
 */

const fs = require("fs");
const path = require("path");

// --- Source dirs ---
const CORNERSTONES_DIR = "/Users/jarvis/.openclaw/workspace/taz/drafts/velocity-blog/cornerstones";
const PIPELINE_DIR = path.join(__dirname, "..", "published");

// --- Load .env.local ---
function loadEnv() {
  const envPaths = [
    path.join(__dirname, "..", "..", ".env.local"),
    path.join(__dirname, "..", "..", ".env"),
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
  let cleaned = content.replace(/^```(?:markdown|md|yaml)?\s*\n?/m, "").replace(/\n?```\s*$/m, "");
  const stdMatch = cleaned.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (stdMatch) return { meta: parseMetaLines(stdMatch[1]), body: stdMatch[2].trim() };

  const lines = cleaned.split("\n");
  let fmEnd = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^[\w][\w-]*\s*:/.test(line)) { fmEnd = i + 1; }
    else if (line.trim() === "") { if (fmEnd > 0) break; }
    else break;
  }
  if (fmEnd > 0) {
    return { meta: parseMetaLines(lines.slice(0, fmEnd).join("\n")), body: lines.slice(fmEnd).join("\n").trim() };
  }

  const headingMatch = cleaned.match(/^#{1,2}\s+(.+)/m);
  if (headingMatch) {
    return { meta: { title: headingMatch[1].trim() }, body: cleaned.replace(/^#{1,2}\s+.+\n?/, "").trim() };
  }
  return { meta: {}, body: cleaned };
}

function parseMetaLines(block) {
  const meta = {};
  for (const line of block.split("\n")) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim().replace(/^["']|["']$/g, "");
      if (val.startsWith("[") && val.endsWith("]")) {
        val = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
      }
      meta[kv[1]] = val;
    }
  }
  return meta;
}

// --- Slug ---
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
  "case-studies": "marketingSystems",
  "credit-union-marketing": "marketingSystems",
};

// Case studies must arrive as approved REbuilder projections. The bulk blog
// republisher is intentionally incapable of creating or updating them.
delete CATEGORY_MAP["case-studies"];

function assertNotGovernedCaseStudy(meta, filePath) {
  const category = String(meta.category || meta.pillar || "").toLowerCase();
  if (category === "case-studies" || category.includes("case stud")) {
    throw new Error(`Refusing to republish governed case-study content through the blog pipeline: ${filePath}`);
  }
}

// --- Sanity API ---
async function sanityMutate(mutations, dryRun = false) {
  if (!CONFIG.projectId || !CONFIG.token) {
    throw new Error("Missing SANITY_PROJECT_ID or SANITY_API_TOKEN.");
  }
  if (dryRun) {
    console.log("  [DRY RUN] mutations count:", mutations.length);
    return { results: mutations.map(() => ({ id: "dry-run" })) };
  }
  const url = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/mutate/${CONFIG.dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${CONFIG.token}` },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity API error ${res.status}: ${text}`);
  }
  return res.json();
}

// --- Inline mark parser ---
let _blockCounter = 0;
function bkey() { return `block-${_blockCounter++}`; }
function skey(i) { return `span-${i}`; }

function parseInline(text, markDefs) {
  const children = [];
  const pattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let spanIdx = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({ _type: "span", _key: skey(spanIdx++), text: text.slice(lastIndex, match.index), marks: [] });
    }
    if (match[2]) {
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[2], marks: ["strong", "em"] });
    } else if (match[3]) {
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[3], marks: ["strong"] });
    } else if (match[4]) {
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[4], marks: ["em"] });
    } else if (match[5]) {
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[5], marks: ["code"] });
    } else if (match[6] && match[7]) {
      const linkKey = `link-${markDefs.length}`;
      markDefs.push({ _key: linkKey, _type: "link", href: match[7] });
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[6], marks: [linkKey] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    children.push({ _type: "span", _key: skey(spanIdx++), text: text.slice(lastIndex), marks: [] });
  }
  if (children.length === 0) {
    children.push({ _type: "span", _key: skey(0), text: text, marks: [] });
  }
  return children;
}

function makeBlock(style, text, markDefs, extra = {}) {
  const md = markDefs || [];
  return { _type: "block", _key: bkey(), style, markDefs: md, children: parseInline(text, md), ...extra };
}

function markdownToPortableText(markdown, postTitle) {
  _blockCounter = 0;
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  const titleNorm = (postTitle || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
  let paraLines = [];

  function flushPara() {
    if (paraLines.length === 0) return;
    const text = paraLines.join(" ").trim();
    if (text) { const md = []; blocks.push(makeBlock("normal", text, md)); }
    paraLines = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === "") { flushPara(); continue; }

    const h4 = line.match(/^####\s+(.*)/);
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);

    if (h4) { flushPara(); const md = []; blocks.push(makeBlock("h3", h4[1].trim(), md)); continue; }
    if (h3) { flushPara(); const md = []; blocks.push(makeBlock("h3", h3[1].trim(), md)); continue; }
    if (h2) { flushPara(); const md = []; blocks.push(makeBlock("h2", h2[1].trim(), md)); continue; }
    if (h1) {
      flushPara();
      const h1norm = h1[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
      const isTitleDupe = titleNorm && (h1norm === titleNorm || h1norm.includes(titleNorm) || titleNorm.includes(h1norm));
      if (!isTitleDupe) { const md = []; blocks.push(makeBlock("h2", h1[1].trim(), md)); }
      continue;
    }
    if (/^(---+|\*\*\*+|___+)\s*$/.test(line)) { flushPara(); continue; }

    const bq = line.match(/^>\s*(.*)/);
    if (bq) { flushPara(); const md = []; blocks.push(makeBlock("blockquote", bq[1].trim(), md)); continue; }

    const bullet = line.match(/^[-*+]\s+(.*)/);
    if (bullet) { flushPara(); const md = []; blocks.push(makeBlock("normal", bullet[1].trim(), md, { listItem: "bullet", level: 1 })); continue; }

    const num = line.match(/^\d+\.\s+(.*)/);
    if (num) { flushPara(); const md = []; blocks.push(makeBlock("normal", num[1].trim(), md, { listItem: "number", level: 1 })); continue; }

    paraLines.push(line.trim());
  }
  flushPara();
  return blocks;
}

function buildSanityDoc(meta, body) {
  const slug = meta.slug || slugify(meta.title || "untitled");
  const pillarKey = (meta.pillar || meta.category || "").toLowerCase().replace(/\s+/g, "-");
  const category = CATEGORY_MAP[pillarKey] || "marketingSystems";
  const blocks = markdownToPortableText(body, meta.title);

  return {
    _type: "blogPost",
    _id: `blogPost-${slug}`,
    title: meta.title || "Untitled Post",
    slug: { _type: "slug", current: slug },
    category,
    excerpt: meta.description || meta.excerpt || meta.metaDescription || "",
    publishedAt: meta.date || new Date().toISOString().split("T")[0],
    body: blocks,
    seoTitle: meta.seoTitle || meta.title || "",
    seoDescription: meta.seoDescription || meta.description || meta.metaDescription || "",
    featured: meta.featured === "true" || meta.featured === true,
  };
}

// --- Collect all source files ---
function collectFiles() {
  const files = [];
  // Cornerstones
  if (fs.existsSync(CORNERSTONES_DIR)) {
    for (const f of fs.readdirSync(CORNERSTONES_DIR).sort()) {
      if (f.endsWith(".md")) files.push({ src: "cornerstone", path: path.join(CORNERSTONES_DIR, f) });
    }
  } else {
    console.warn("⚠ Cornerstones dir not found:", CORNERSTONES_DIR);
  }
  // Pipeline published
  if (fs.existsSync(PIPELINE_DIR)) {
    for (const f of fs.readdirSync(PIPELINE_DIR).sort()) {
      if (f.endsWith(".md")) files.push({ src: "pipeline", path: path.join(PIPELINE_DIR, f) });
    }
  } else {
    console.warn("⚠ Pipeline published dir not found:", PIPELINE_DIR);
  }
  return files;
}

// --- Deduplicate by slug (cornerstones win over pipeline duplicates) ---
function dedupBySlug(files, dryRun) {
  const seen = new Map();
  const results = [];
  for (const f of files) {
    const content = fs.readFileSync(f.path, "utf-8");
    const { meta, body } = parseFrontmatter(content);
    assertNotGovernedCaseStudy(meta, f.path);
    if (!meta.title) {
      console.warn(`⚠ Skipping ${path.basename(f.path)} — no title`);
      continue;
    }
    const slug = meta.slug || slugify(meta.title);
    if (seen.has(slug)) {
      // Keep whichever was first (cornerstone), skip duplicate
      console.log(`  ↩ Skipping duplicate slug "${slug}" from ${f.src} (${path.basename(f.path)})`);
      continue;
    }
    seen.set(slug, true);
    results.push({ ...f, meta, body, slug });
  }
  return results;
}

// --- Main ---
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log(`\n🔧 Velocity Builders — Re-publish All BlogPosts`);
  console.log(`   Project: ${CONFIG.projectId} | Dataset: ${CONFIG.dataset} | Dry run: ${dryRun}\n`);

  const allFiles = collectFiles();
  console.log(`📁 Found ${allFiles.length} total source files (before dedup)`);

  const posts = dedupBySlug(allFiles, dryRun);
  console.log(`📋 ${posts.length} unique posts to re-publish\n`);

  let published = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      const doc = buildSanityDoc(post.meta, post.body);
      // Count spans with marks to verify inline parsing worked
      const boldSpans = doc.body.flatMap(b => (b.children || []).filter(c => c.marks && c.marks.includes("strong"))).length;
      const emSpans = doc.body.flatMap(b => (b.children || []).filter(c => c.marks && c.marks.includes("em"))).length;
      console.log(`📤 [${post.src}] "${doc.title.slice(0, 60)}"`);
      console.log(`     _id: ${doc._id} | blocks: ${doc.body.length} | bold spans: ${boldSpans} | em spans: ${emSpans}`);

      await sanityMutate([{ createOrReplace: doc }], dryRun);
      console.log(`   ✅ Published`);
      published++;
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🏁 Done: ${published} published, ${failed} failed${dryRun ? " (dry run)" : ""}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
