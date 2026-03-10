#!/usr/bin/env node
/**
 * review-council.js
 * 
 * 3-stage review pipeline: Editor → Fact-Checker → SEO Optimizer
 * (Stage 1 / Writer is handled by write-post.js)
 * 
 * Takes a draft, runs it through each review agent sequentially.
 * Each stage produces an updated draft + review notes.
 * 
 * Usage: node review-council.js --draft drafts/post-2026-0310-001.md [--stage editor|fact-check|seo|all]
 * 
 * Env: OPENAI_API_KEY or ANTHROPIC_API_KEY
 */

const fs = require('fs');
const path = require('path');

// --- Config ---
const DRAFTS_DIR = path.join(__dirname, '..', 'drafts');
const REVIEWS_DIR = path.join(__dirname, '..', 'reviews');
const DATA_DIR = path.join(__dirname, '..', 'data');
const REGISTRY_PATH = path.join(DATA_DIR, 'topic-registry.json');
const PILLARS = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'pillars.json'), 'utf8'));

// --- CLI Args ---
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { draftPath: null, stage: 'all', dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--draft' && args[i + 1]) opts.draftPath = args[++i];
    if (args[i] === '--stage' && args[i + 1]) opts.stage = args[++i];
    if (args[i] === '--dry-run') opts.dryRun = true;
  }
  return opts;
}

// --- AI Call (shared) ---
async function callAI(systemPrompt, userPrompt) {
  if (process.env.ANTHROPIC_API_KEY) {
    return callAnthropic(systemPrompt, userPrompt);
  }
  return callOpenAI(systemPrompt, userPrompt);
}

async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 5000,
      temperature: 0.3,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`OpenAI error: ${JSON.stringify(data)}`);
  return data.choices[0].message.content;
}

async function callAnthropic(systemPrompt, userPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 5000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Anthropic error: ${JSON.stringify(data)}`);
  return data.content[0].text;
}

// --- Stage Prompts ---
const STAGE_PROMPTS = {
  editor: {
    system: `You are a senior content editor for a real estate marketing blog (Velocity Builders LLC).

Your job:
1. Improve readability and flow — cut fluff, tighten sentences
2. Enforce voice: "Teach like a professor, write like a closer" — aggressive, direct, no hedging
3. Kill soft language: "consider", "perhaps", "you might want to", "it's important to note"
4. Verify NO GoHighLevel mentions (should say "your CRM" or "automation platform")
5. Verify NO Pruitt Title selling/CTAs/endorsements
6. Verify NO geographic pigeon-holing unless the post is specifically about a city
7. Check H2/H3 hierarchy is clean
8. Ensure the post ends with a strong closer, not a soft "in conclusion"

Output format:
---REVIEW NOTES---
[Your editorial notes, issues found, changes made]

---EDITED DRAFT---
[The full edited post in Markdown]`,

    user: (draft) => `Edit this blog post draft. Apply all your editorial rules. Output the review notes first, then the full edited draft.

DRAFT:
${draft}`,
  },

  'fact-check': {
    system: `You are a fact-checker for a real estate marketing blog. You specialize in real estate regulations, title insurance, market data, and compliance.

Your job:
1. Flag any statistics, data points, or claims that appear fabricated or unverifiable
2. Check regulatory references — are statute numbers, rule names, dates correct?
3. Verify Virginia/DC/Maryland legal claims are accurate
4. Flag any AI hallucination patterns (overly specific fake stats, invented studies)
5. Check compliance language — nothing that could be construed as legal/financial advice
6. Mark confidence level for each claim: VERIFIED, PLAUSIBLE, UNCERTAIN, FLAG

Critical: For Title Insurance, Regulations, and News pillars — be extra strict.

Output format:
---FACT CHECK REPORT---
PASS | FLAG (overall status)

Claims checked:
1. [Claim] → [VERIFIED|PLAUSIBLE|UNCERTAIN|FLAG] — [reason]
2. ...

Issues found:
- [issue description and recommended fix]

---VERIFIED DRAFT---
[The draft with any corrections applied. If flagged, mark uncertain sections with [⚠️ NEEDS VERIFICATION: reason]]`,

    user: (draft) => `Fact-check this blog post. Check every stat, regulation reference, and factual claim. Be strict.

DRAFT:
${draft}`,
  },

  seo: {
    system: `You are an SEO optimizer for a real estate marketing blog. You handle the final stage before publishing.

Your job:
1. Slug structure — verify slug is clean, keyword-rich, max 60 chars
2. Meta description — write one if missing (150-160 chars, includes primary keyword)
3. H2/H3 hierarchy — verify logical structure, keyword placement in headings
4. Keyword density — primary keyword appears 3-5x naturally, not stuffed
5. Internal cross-links — suggest 2-3 links to related pillar content
6. Year tags — verify year appears in title and at least once in body
7. Schema suggestions — recommend Article schema properties
8. OG tags — suggest og:title, og:description
9. Cannibalization check — flag if title/keyword closely matches common patterns
10. Word count verification — meets pillar minimum

Output format:
---SEO REPORT---
Score: [1-10]
Slug: [optimized slug]
Meta Description: [150-160 chars]
Primary Keyword: [identified keyword]
Keyword Density: [X appearances / X words]
Internal Links Suggested:
- [anchor text] → [target URL pattern]
Schema: Article — headline, datePublished, author
OG Title: [optimized]
OG Description: [optimized]
Issues:
- [any SEO issues found]

---OPTIMIZED DRAFT---
[The final optimized post with updated frontmatter including SEO fields]`,

    user: (draft) => `SEO-optimize this blog post for publishing. Add meta description, verify keyword usage, suggest internal links, and output the final version.

DRAFT:
${draft}`,
  },
};

// --- Registry ---
function updateRegistryStatus(postId, status, flagged = false, flagReason = null) {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const entry = registry.entries.find(e => e.id === postId);
  if (entry) {
    entry.status = status;
    entry.flagged = flagged;
    entry.flagReason = flagReason;
    entry.updatedAt = new Date().toISOString();
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  }
}

// --- Extract post ID from draft path ---
function extractPostId(draftPath) {
  const basename = path.basename(draftPath, '.md');
  return basename; // e.g., post-2026-0310-001
}

// --- Parse stage output ---
function parseStageOutput(output) {
  // Split into notes/report and draft sections
  const draftMarkers = ['---EDITED DRAFT---', '---VERIFIED DRAFT---', '---OPTIMIZED DRAFT---'];
  const notesMarkers = ['---REVIEW NOTES---', '---FACT CHECK REPORT---', '---SEO REPORT---'];

  let notes = '';
  let draft = '';

  for (const marker of draftMarkers) {
    const idx = output.indexOf(marker);
    if (idx >= 0) {
      draft = output.slice(idx + marker.length).trim();
      break;
    }
  }

  for (const marker of notesMarkers) {
    const idx = output.indexOf(marker);
    if (idx >= 0) {
      const endIdx = draftMarkers.reduce((min, m) => {
        const i = output.indexOf(m);
        return i >= 0 && i < min ? i : min;
      }, output.length);
      notes = output.slice(idx + marker.length, endIdx).trim();
      break;
    }
  }

  // If we couldn't parse, treat whole output as draft
  if (!draft) draft = output;

  return { notes, draft };
}

// --- Main ---
async function runReviewCouncil() {
  const opts = parseArgs();

  if (!opts.draftPath) {
    console.error('Usage: node review-council.js --draft <path> [--stage editor|fact-check|seo|all]');
    process.exit(1);
  }

  const draftPath = path.resolve(opts.draftPath);
  if (!fs.existsSync(draftPath)) {
    console.error(`❌ Draft not found: ${draftPath}`);
    process.exit(1);
  }

  const postId = extractPostId(draftPath);
  const stages = opts.stage === 'all' ? ['editor', 'fact-check', 'seo'] : [opts.stage];

  console.log(`\n🏛️  Review Council for: ${postId}`);
  console.log(`   Stages: ${stages.join(' → ')}\n`);

  fs.mkdirSync(REVIEWS_DIR, { recursive: true });
  let currentDraft = fs.readFileSync(draftPath, 'utf8');
  let flagged = false;
  let flagReason = null;

  for (const stage of stages) {
    const stageConfig = STAGE_PROMPTS[stage];
    if (!stageConfig) {
      console.error(`❌ Unknown stage: ${stage}`);
      process.exit(1);
    }

    console.log(`   📋 Stage: ${stage.toUpperCase()}`);

    if (opts.dryRun) {
      console.log(`      [DRY RUN] Would call AI with ${stageConfig.system.length} char system prompt`);
      continue;
    }

    try {
      const output = await callAI(stageConfig.system, stageConfig.user(currentDraft));
      const { notes, draft } = parseStageOutput(output);

      // Save review notes
      const notesPath = path.join(REVIEWS_DIR, `${postId}-${stage}-notes.md`);
      fs.writeFileSync(notesPath, `# ${stage.toUpperCase()} Review — ${postId}\n\nDate: ${new Date().toISOString()}\n\n${notes}`);

      // Save updated draft
      const stageDraftPath = path.join(REVIEWS_DIR, `${postId}-${stage}-draft.md`);
      fs.writeFileSync(stageDraftPath, draft);

      // Check for flags (fact-check stage)
      if (stage === 'fact-check' && notes.includes('FLAG')) {
        flagged = true;
        flagReason = 'Fact-check flagged uncertain claims — needs Will\'s review';
        console.log(`      ⚠️  FLAGGED — uncertain claims detected`);
      }

      // Update current draft for next stage
      currentDraft = draft;

      console.log(`      ✅ Complete → ${notesPath}`);
      console.log(`      Draft: ~${draft.split(/\s+/).length} words`);

    } catch (err) {
      console.error(`      ❌ ${stage} failed: ${err.message}`);
      updateRegistryStatus(postId, `${stage}-failed`, true, err.message);
      process.exit(1);
    }
  }

  // Save final draft
  const finalPath = path.join(DRAFTS_DIR, `${postId}-final.md`);
  fs.writeFileSync(finalPath, currentDraft);

  // Update registry
  const finalStatus = flagged ? 'flagged' : 'publish-ready';
  updateRegistryStatus(postId, finalStatus, flagged, flagReason);

  console.log(`\n✅ Review council complete: ${postId}`);
  console.log(`   Final draft: ${finalPath}`);
  console.log(`   Status: ${finalStatus}${flagged ? ` — ${flagReason}` : ''}\n`);
}

runReviewCouncil();
