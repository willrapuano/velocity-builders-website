#!/usr/bin/env node
/**
 * check-duplication.js
 * 
 * Pre-write similarity check against the topic registry.
 * Implements Layers 1 & 2 of the Anti-Duplication System:
 *   Layer 1: Topic Registry — exact keyword match, semantic similarity, city+pillar combo
 *   Layer 2: Content Calendar — no duplicate angle per audience per week
 * 
 * Usage: node check-duplication.js --title "Post Title" --pillar hyper-local-seo --keyword "keyword" [--city "Vienna"] [--audience agents]
 *        node check-duplication.js --manifest manifests/manifest-2026-03-10.json
 * 
 * Exit codes: 0 = clear, 1 = blocked, 2 = flagged (proceed with caution)
 */

const fs = require('fs');
const path = require('path');

// --- Config ---
const DATA_DIR = path.join(__dirname, '..', 'data');
const REGISTRY_PATH = path.join(DATA_DIR, 'topic-registry.json');

const SIMILARITY_BLOCK_THRESHOLD = 0.80;
const SIMILARITY_FLAG_THRESHOLD = 0.70;
const QUARTER_DAYS = 90;

// --- CLI Args ---
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    title: null,
    pillar: null,
    keyword: null,
    city: null,
    audience: null,
    manifestPath: null,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) opts.title = args[++i];
    if (args[i] === '--pillar' && args[i + 1]) opts.pillar = args[++i];
    if (args[i] === '--keyword' && args[i + 1]) opts.keyword = args[++i];
    if (args[i] === '--city' && args[i + 1]) opts.city = args[++i];
    if (args[i] === '--audience' && args[i + 1]) opts.audience = args[++i];
    if (args[i] === '--manifest' && args[i + 1]) opts.manifestPath = args[++i];
  }
  return opts;
}

// --- Similarity Engine ---
// Token-based Jaccard similarity (lightweight, no embeddings needed)
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2); // drop short words
}

function bigramize(tokens) {
  const bigrams = new Set();
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.add(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function computeSimilarity(textA, textB) {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  // Weighted: 60% bigram similarity + 40% unigram similarity
  const unigramSim = jaccardSimilarity(new Set(tokensA), new Set(tokensB));
  const bigramSim = jaccardSimilarity(bigramize(tokensA), bigramize(tokensB));

  return bigramSim * 0.6 + unigramSim * 0.4;
}

// --- Checks ---
function loadRegistry() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  } catch {
    return { meta: {}, entries: [] };
  }
}

function isWithinQuarter(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - date) / (1000 * 60 * 60 * 24);
  return diffDays <= QUARTER_DAYS;
}

function isWithinWeek(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = (now - date) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

function checkEntry(entry, registry) {
  const results = {
    status: 'clear', // clear | flagged | blocked
    checks: [],
    similarityScore: 0,
    similarTo: null,
  };

  const published = registry.entries.filter(e =>
    ['draft', 'review', 'editor', 'fact-check', 'seo', 'published', 'publish-ready', 'manifest'].includes(e.status)
  );

  // Check 1: Exact keyword match
  if (entry.keyword) {
    const exactMatch = published.find(e =>
      e.primaryKeyword && e.primaryKeyword.toLowerCase() === entry.keyword.toLowerCase()
    );
    if (exactMatch) {
      results.status = 'blocked';
      results.checks.push({
        check: 'exact-keyword',
        result: 'BLOCKED',
        detail: `Exact keyword match: "${entry.keyword}" already used in ${exactMatch.id}`,
        matchId: exactMatch.id,
      });
    }
  }

  // Check 2: Semantic similarity (title-based)
  let highestSim = 0;
  let mostSimilarId = null;

  for (const existing of published) {
    if (!existing.title) continue;
    const sim = computeSimilarity(
      `${entry.title} ${entry.keyword || ''}`,
      `${existing.title} ${existing.primaryKeyword || ''}`
    );

    if (sim > highestSim) {
      highestSim = sim;
      mostSimilarId = existing.id;
    }
  }

  results.similarityScore = Math.round(highestSim * 100) / 100;
  results.similarTo = mostSimilarId;

  if (highestSim >= SIMILARITY_BLOCK_THRESHOLD) {
    results.status = 'blocked';
    results.checks.push({
      check: 'semantic-similarity',
      result: 'BLOCKED',
      detail: `Similarity ${(highestSim * 100).toFixed(1)}% ≥ ${SIMILARITY_BLOCK_THRESHOLD * 100}% threshold with ${mostSimilarId}`,
      score: highestSim,
      matchId: mostSimilarId,
    });
  } else if (highestSim >= SIMILARITY_FLAG_THRESHOLD) {
    if (results.status !== 'blocked') results.status = 'flagged';
    results.checks.push({
      check: 'semantic-similarity',
      result: 'FLAGGED',
      detail: `Similarity ${(highestSim * 100).toFixed(1)}% ≥ ${SIMILARITY_FLAG_THRESHOLD * 100}% flag threshold with ${mostSimilarId}`,
      score: highestSim,
      matchId: mostSimilarId,
    });
  } else {
    results.checks.push({
      check: 'semantic-similarity',
      result: 'CLEAR',
      detail: `Highest similarity: ${(highestSim * 100).toFixed(1)}%${mostSimilarId ? ` (${mostSimilarId})` : ''}`,
      score: highestSim,
    });
  }

  // Check 3: Same city + pillar combo this quarter
  if (entry.city && entry.pillar) {
    const cityPillarMatch = published.find(e =>
      e.city === entry.city &&
      e.pillar === entry.pillar &&
      e.publishDate && isWithinQuarter(e.publishDate)
    );
    if (cityPillarMatch) {
      results.status = 'blocked';
      results.checks.push({
        check: 'city-pillar-quarter',
        result: 'BLOCKED',
        detail: `${entry.city} × ${entry.pillar} already published this quarter: ${cityPillarMatch.id} (${cityPillarMatch.publishDate})`,
        matchId: cityPillarMatch.id,
      });
    }
  }

  // Check 4: Same audience + angle within past week
  if (entry.audience) {
    const weeklyAngleMatch = published.find(e =>
      e.audiences && e.audiences.includes(entry.audience) &&
      e.pillar === entry.pillar &&
      e.publishDate && isWithinWeek(e.publishDate)
    );
    if (weeklyAngleMatch) {
      if (results.status !== 'blocked') results.status = 'flagged';
      results.checks.push({
        check: 'weekly-audience-pillar',
        result: 'FLAGGED',
        detail: `Same audience (${entry.audience}) + pillar (${entry.pillar}) posted within past 7 days: ${weeklyAngleMatch.id}`,
        matchId: weeklyAngleMatch.id,
      });
    }
  }

  return results;
}

// --- Main ---
function main() {
  const opts = parseArgs();
  const registry = loadRegistry();

  if (opts.manifestPath) {
    // Check entire manifest
    const manifest = JSON.parse(fs.readFileSync(opts.manifestPath, 'utf8'));
    console.log(`\n🔍 Checking manifest: ${opts.manifestPath} (${manifest.entries.length} entries)\n`);

    let blocked = 0;
    let flagged = 0;
    let clear = 0;

    for (const entry of manifest.entries) {
      const check = checkEntry({
        title: entry.title,
        pillar: entry.pillar,
        keyword: entry.primaryKeyword,
        city: entry.city,
        audience: entry.audiences[0],
      }, registry);

      const icon = check.status === 'blocked' ? '🚫' : check.status === 'flagged' ? '⚠️' : '✅';
      console.log(`   ${icon} [${check.status.toUpperCase()}] ${entry.title.slice(0, 60)}...`);

      if (check.checks.some(c => c.result !== 'CLEAR')) {
        for (const c of check.checks.filter(c => c.result !== 'CLEAR')) {
          console.log(`      └─ ${c.check}: ${c.detail}`);
        }
      }

      if (check.status === 'blocked') blocked++;
      else if (check.status === 'flagged') flagged++;
      else clear++;
    }

    console.log(`\n📊 Results: ${clear} clear, ${flagged} flagged, ${blocked} blocked`);
    console.log(`   Total: ${manifest.entries.length} entries\n`);

    process.exit(blocked > 0 ? 1 : flagged > 0 ? 2 : 0);

  } else if (opts.title) {
    // Check single entry
    const check = checkEntry({
      title: opts.title,
      pillar: opts.pillar,
      keyword: opts.keyword,
      city: opts.city,
      audience: opts.audience,
    }, registry);

    const icon = check.status === 'blocked' ? '🚫' : check.status === 'flagged' ? '⚠️' : '✅';
    console.log(`\n${icon} Duplication check: ${check.status.toUpperCase()}`);
    console.log(`   Title: "${opts.title}"`);
    console.log(`   Similarity: ${(check.similarityScore * 100).toFixed(1)}%${check.similarTo ? ` (vs ${check.similarTo})` : ''}`);

    for (const c of check.checks) {
      console.log(`   ${c.result === 'CLEAR' ? '✅' : c.result === 'FLAGGED' ? '⚠️' : '🚫'} ${c.check}: ${c.detail}`);
    }

    console.log('');
    process.exit(check.status === 'blocked' ? 1 : check.status === 'flagged' ? 2 : 0);

  } else {
    console.error('Usage:');
    console.error('  node check-duplication.js --title "Title" --pillar <id> --keyword "keyword" [--city "City"] [--audience agents]');
    console.error('  node check-duplication.js --manifest manifests/manifest-2026-03-10.json');
    process.exit(1);
  }
}

main();
