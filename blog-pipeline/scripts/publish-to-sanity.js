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

// --- Frontmatter parser (handles AI output variations) ---
function parseFrontmatter(content) {
  // Strip markdown code fences that AI sometimes wraps output in
  let cleaned = content.replace(/^```(?:markdown|md|yaml)?\s*\n?/m, '').replace(/\n?```\s*$/m, '');

  // Try standard --- delimited frontmatter first
  const stdMatch = cleaned.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (stdMatch) {
    return { meta: parseMetaLines(stdMatch[1]), body: stdMatch[2].trim() };
  }

  // Fallback: detect YAML-like key: value block at the top (no --- delimiters)
  const lines = cleaned.split('\n');
  let fmEnd = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Frontmatter line: key: value (or key: "value" or key: [...])
    if (/^[\w][\w-]*\s*:/.test(line)) {
      fmEnd = i + 1;
    } else if (line.trim() === '') {
      // Blank line after frontmatter block = end of frontmatter
      if (fmEnd > 0) break;
    } else {
      break; // Non-frontmatter content
    }
  }

  if (fmEnd > 0) {
    const fmBlock = lines.slice(0, fmEnd).join('\n');
    const body = lines.slice(fmEnd).join('\n').trim();
    return { meta: parseMetaLines(fmBlock), body };
  }

  // Last resort: extract title from first heading (# or ##)
  const headingMatch = cleaned.match(/^#{1,2}\s+(.+)/m);
  if (headingMatch) {
    const title = headingMatch[1].trim();
    const body = cleaned.replace(/^#{1,2}\s+.+\n?/, '').trim();
    return { meta: { title }, body };
  }

  return { meta: {}, body: cleaned };
}

function parseMetaLines(block) {
  const meta = {};
  for (const line of block.split('\n')) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim().replace(/^["']|["']$/g, '');
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
      }
      meta[kv[1]] = val;
    }
  }
  return meta;
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
  "case-studies": "marketingSystems",
  "direct-mail": "marketingSystems",
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

// --- Markdown → Sanity Portable Text converter ---
// Full inline-mark support: **bold**, *italic*, `code`, [link](url), blockquotes, lists.
// Heading hierarchy: # and ## → h2, ### → h3, #### → h3 (no H4+ in blog posts).
// H1 that duplicates the post title is stripped entirely.

let _blockCounter = 0;
function bkey() { return `block-${_blockCounter++}`; }
function skey(i) { return `span-${i}`; }

/**
 * Parse inline markdown text into Sanity span children + markDefs.
 * Handles: **bold**, *italic*, ***bold+italic***, `code`, [text](url)
 */
function parseInline(text, markDefs) {
  const children = [];
  // Regex: match bold+italic, bold, italic, code, links in order of precedence
  const pattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let spanIdx = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      children.push({ _type: "span", _key: skey(spanIdx++), text: text.slice(lastIndex, match.index), marks: [] });
    }

    if (match[2]) {
      // ***bold+italic***
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[2], marks: ["strong", "em"] });
    } else if (match[3]) {
      // **bold**
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[3], marks: ["strong"] });
    } else if (match[4]) {
      // *italic*
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[4], marks: ["em"] });
    } else if (match[5]) {
      // `code`
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[5], marks: ["code"] });
    } else if (match[6] && match[7]) {
      // [text](url) — link markDef
      const linkKey = `link-${markDefs.length}`;
      markDefs.push({ _key: linkKey, _type: "link", href: match[7] });
      children.push({ _type: "span", _key: skey(spanIdx++), text: match[6], marks: [linkKey] });
    }
    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    children.push({ _type: "span", _key: skey(spanIdx++), text: text.slice(lastIndex), marks: [] });
  }

  // Fallback: empty text
  if (children.length === 0) {
    children.push({ _type: "span", _key: skey(0), text: text, marks: [] });
  }

  return children;
}

/** Build a Sanity block from a parsed paragraph or heading. */
function makeBlock(style, text, markDefs, extra = {}) {
  const md = markDefs || [];
  return {
    _type: "block",
    _key: bkey(),
    style,
    markDefs: md,
    children: parseInline(text, md),
    ...extra,
  };
}

/**
 * Convert a full markdown body string to an array of Sanity Portable Text blocks.
 *
 * Rules:
 *  - # Title  → strip (page template renders H1 from post.title)
 *  - ##        → h2
 *  - ###       → h3
 *  - ####+     → h3 (flatten; no H4 in blog)
 *  - - item / * item / + item  → bullet list block
 *  - N. item   → number list block
 *  - > text    → blockquote
 *  - ---/***   → ignored (decorative HR)
 *  - blank line → paragraph separator
 *  - everything else → normal paragraph (lines joined with space)
 */
function markdownToPortableText(markdown, postTitle) {
  _blockCounter = 0;
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];

  // Normalise the post title for H1-stripping comparison
  const titleNorm = (postTitle || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");

  let paraLines = []; // accumulate normal paragraph lines

  function flushPara() {
    if (paraLines.length === 0) return;
    const text = paraLines.join(" ").trim();
    if (text) {
      const md = [];
      blocks.push(makeBlock("normal", text, md));
    }
    paraLines = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // --- Blank line: flush accumulated paragraph ---
    if (line.trim() === "") {
      flushPara();
      continue;
    }

    // --- Headings ---
    const h4match = line.match(/^####\s+(.*)/);
    const h3match = line.match(/^###\s+(.*)/);
    const h2match = line.match(/^##\s+(.*)/);
    const h1match = line.match(/^#\s+(.*)/);

    if (h4match) {
      flushPara();
      const md = [];
      blocks.push(makeBlock("h3", h4match[1].trim(), md)); // flatten H4 → h3
      continue;
    }
    if (h3match) {
      flushPara();
      const md = [];
      blocks.push(makeBlock("h3", h3match[1].trim(), md));
      continue;
    }
    if (h2match) {
      flushPara();
      const md = [];
      blocks.push(makeBlock("h2", h2match[1].trim(), md));
      continue;
    }
    if (h1match) {
      flushPara();
      // Strip H1 if it matches the post title (page template renders it)
      const h1norm = h1match[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
      const isTitleDupe = titleNorm && (h1norm === titleNorm || h1norm.includes(titleNorm) || titleNorm.includes(h1norm));
      if (!isTitleDupe) {
        // Demote stray H1 to H2
        const md = [];
        blocks.push(makeBlock("h2", h1match[1].trim(), md));
      }
      // If it IS the title, skip entirely
      continue;
    }

    // --- Horizontal rule ---
    if (/^(---+|\*\*\*+|___+)\s*$/.test(line)) {
      flushPara();
      continue;
    }

    // --- Blockquote ---
    const bqMatch = line.match(/^>\s*(.*)/);
    if (bqMatch) {
      flushPara();
      const md = [];
      blocks.push(makeBlock("blockquote", bqMatch[1].trim(), md));
      continue;
    }

    // --- Bullet list item ---
    const bulletMatch = line.match(/^[-*+]\s+(.*)/);
    if (bulletMatch) {
      flushPara();
      const md = [];
      blocks.push(makeBlock("normal", bulletMatch[1].trim(), md, { listItem: "bullet", level: 1 }));
      continue;
    }

    // --- Numbered list item ---
    const numMatch = line.match(/^\d+\.\s+(.*)/);
    if (numMatch) {
      flushPara();
      const md = [];
      blocks.push(makeBlock("normal", numMatch[1].trim(), md, { listItem: "number", level: 1 }));
      continue;
    }

    // --- Normal paragraph line (accumulate) ---
    paraLines.push(line.trim());
  }

  // Flush remaining paragraph
  flushPara();

  return blocks;
}

// --- Build Sanity document from markdown ---
function buildSanityDoc(meta, body) {
  const slug = meta.slug || slugify(meta.title || "untitled");
  const category = CATEGORY_MAP[meta.pillar] || CATEGORY_MAP[meta.category] || "marketingSystems";

  const blocks = markdownToPortableText(body, meta.title);

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
