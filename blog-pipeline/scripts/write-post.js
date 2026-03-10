#!/usr/bin/env node
/**
 * write-post.js
 * 
 * AI writer stage — takes a manifest entry, loads the pillar template,
 * generates a blog post draft using the configured AI provider.
 * 
 * Usage: node write-post.js --manifest manifests/manifest-2026-03-10.json --index 0
 *        node write-post.js --entry '{"id":"post-2026-0310-001",...}'
 * 
 * Env: OPENAI_API_KEY or ANTHROPIC_API_KEY
 */

const fs = require('fs');
const path = require('path');

// --- Config ---
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const DRAFTS_DIR = path.join(__dirname, '..', 'drafts');
const DATA_DIR = path.join(__dirname, '..', 'data');
const REGISTRY_PATH = path.join(DATA_DIR, 'topic-registry.json');

// --- CLI Args ---
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { manifestPath: null, index: null, entry: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--manifest' && args[i + 1]) opts.manifestPath = args[++i];
    if (args[i] === '--index' && args[i + 1]) opts.index = parseInt(args[++i], 10);
    if (args[i] === '--entry' && args[i + 1]) opts.entry = JSON.parse(args[++i]);
    if (args[i] === '--dry-run') opts.dryRun = true;
  }
  return opts;
}

// --- Template Loader ---
function loadTemplate(templateFile) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

// --- Variable Interpolation ---
function interpolateTemplate(template, entry) {
  const vars = {
    audience: formatAudience(entry.audiences[0]),
    city: entry.city || '',
    county: entry.county || '',
    state: entry.state || '',
    year: entry.publishDate.slice(0, 4),
    tactic: entry.title,
    concept: entry.title,
    strategy: entry.title,
    outcome: entry.title,
    role: formatAudience(entry.audiences[0]),
    system: 'automation',
    topic: entry.title,
    event: entry.title,
    month: new Date().toLocaleString('en-US', { month: 'long' }),
    regulation: entry.title,
    institution: entry.audiences.includes('credit-unions') ? 'Credit Union' : 'Loan Officer',
    location: entry.city || entry.county || 'DMV',
    report: 'Market Report',
    period: new Date().toLocaleString('en-US', { month: 'long' }),
    category: entry.title,
    format: 'Ranked',
    type: entry.title,
    client: 'Northern Virginia professional',
    result: 'increased production',
    service: 'CRM automation',
  };

  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

function formatAudience(audience) {
  const map = {
    'agents': 'Real Estate Agents',
    'loan-officers': 'Loan Officers',
    'builders': 'Builders',
    'credit-unions': 'Credit Unions & Banks',
  };
  return map[audience] || audience;
}

// --- AI Writer ---
async function callAI(systemPrompt, userPrompt, provider) {
  if (provider === 'anthropic') {
    return callAnthropic(systemPrompt, userPrompt);
  }
  return callOpenAI(systemPrompt, userPrompt);
}

async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
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
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Anthropic error: ${JSON.stringify(data)}`);
  return data.content[0].text;
}

// --- Registry Update ---
function updateRegistry(entry, status) {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const existing = registry.entries.findIndex(e => e.id === entry.id);
  
  const registryEntry = {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    pillar: entry.pillar,
    audiences: entry.audiences,
    primaryKeyword: entry.primaryKeyword,
    secondaryKeywords: entry.secondaryKeywords || [],
    city: entry.city,
    county: entry.county,
    state: entry.state,
    angle: entry.angle,
    publishDate: entry.publishDate,
    status,
    similarityScore: entry.similarityScore,
    similarTo: entry.similarTo,
    flagged: entry.flagged || false,
    flagReason: entry.flagReason || null,
    createdAt: entry.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    registry.entries[existing] = registryEntry;
  } else {
    registry.entries.push(registryEntry);
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

// --- Main ---
async function writePost() {
  const opts = parseArgs();
  let entry;

  if (opts.entry) {
    entry = opts.entry;
  } else if (opts.manifestPath && opts.index !== null) {
    const manifest = JSON.parse(fs.readFileSync(opts.manifestPath, 'utf8'));
    entry = manifest.entries[opts.index];
    if (!entry) {
      console.error(`❌ No entry at index ${opts.index} in manifest`);
      process.exit(1);
    }
  } else {
    console.error('Usage: node write-post.js --manifest <path> --index <n>');
    console.error('       node write-post.js --entry \'<json>\'');
    process.exit(1);
  }

  console.log(`\n✍️  Writing: "${entry.title}"`);
  console.log(`   Pillar: ${entry.pillar} | Audience: ${entry.audiences.join(', ')}`);

  // Load and interpolate template
  const rawTemplate = loadTemplate(entry.templateFile);
  const systemPrompt = interpolateTemplate(rawTemplate, entry);

  const userPrompt = `Write a blog post with this title: "${entry.title}"

Target audience: ${entry.audiences.map(formatAudience).join(', ')}
Pillar: ${entry.pillar}
${entry.city ? `City: ${entry.city}, ${entry.state}` : ''}
${entry.county ? `County: ${entry.county}` : ''}
Year: ${entry.publishDate.slice(0, 4)}

Follow the structure and rules in your system prompt exactly. Output the full blog post in Markdown format with frontmatter:

---
title: "${entry.title}"
slug: "${entry.slug}"
pillar: "${entry.pillar}"
audiences: ${JSON.stringify(entry.audiences)}
publishDate: "${entry.publishDate}"
author: "Will Rapuano"
---

Write the full post now.`;

  if (opts.dryRun) {
    console.log('\n--- DRY RUN: System Prompt ---');
    console.log(systemPrompt.slice(0, 500) + '...');
    console.log('\n--- DRY RUN: User Prompt ---');
    console.log(userPrompt);
    console.log('\n✅ Dry run complete. No API call made.');
    return;
  }

  // Determine AI provider
  const provider = process.env.ANTHROPIC_API_KEY ? 'anthropic' : 'openai';
  console.log(`   Provider: ${provider}`);

  try {
    const draft = await callAI(systemPrompt, userPrompt, provider);

    // Save draft
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
    const draftPath = path.join(DRAFTS_DIR, `${entry.id}.md`);
    fs.writeFileSync(draftPath, draft);

    // Update registry
    updateRegistry(entry, 'draft');

    console.log(`\n✅ Draft saved: ${draftPath}`);
    console.log(`   Word count: ~${draft.split(/\s+/).length}`);
    console.log(`   Registry updated: status=draft`);
  } catch (err) {
    console.error(`\n❌ AI write failed: ${err.message}`);
    updateRegistry(entry, 'failed');
    process.exit(1);
  }
}

writePost();
