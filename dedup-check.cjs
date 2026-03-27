#!/usr/bin/env node
/**
 * Blog Dedup Check v2 — MANDATORY before publishing ANY post
 * 
 * Usage: node dedup-check.js <sanity-project-id> <sanity-token> <doc-type> "<proposed title>" "<target keyword>"
 * 
 * Returns:
 *   "OK" — safe to publish
 *   "DUPLICATE: <reason>" — DO NOT publish, pick a different topic
 *   "WARNING: <reason>" — review manually before publishing
 *
 * Detection methods:
 *   1. Jaccard word similarity (catches near-identical titles)
 *   2. Bigram similarity (catches reworded titles)
 *   3. Core topic extraction (strips filler, compares subject matter)
 *   4. Keyword containment (catches same keyword targeted twice)
 *   5. Keyword Jaccard (catches keyword paraphrasing)
 *   6. Slug collision
 *
 * Sites:
 *   - DMV Title Guy: projectId=4s0dloxi, docType=post
 *   - Velocity Builders: projectId=xifumfa3, docType=blogPost
 *   - Candee Currie: projectId from .env.local, docType=post
 */

const { createClient } = require('@sanity/client');

const [,, projectId, token, docType, title, keyword] = process.argv;

if (!projectId || !token || !docType || !title) {
  console.log('Usage: node dedup-check.js <projectId> <token> <docType> "<title>" "[keyword]"');
  console.log('\nSites:');
  console.log('  DMVtitleguy: projectId=4s0dloxi, docType=post');
  console.log('  Velocity:    projectId=xifumfa3, docType=blogPost');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

// --- Utility functions ---

function normalize(str) {
  return (str || '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Words to strip when extracting core topic (keep "up" — it matters in "set up")
const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
  'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
  'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too',
  'very', 'just', 'because', 'if', 'when', 'where', 'how', 'what',
  'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'i', 'me',
  'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'it', 'its', 'they', 'them', 'their', 'here', 'there', 'about',
  'down', 'why', 'complete', 'guide', 'ultimate', 'everything',
  'know', 'best', 'top', 'new', 'vs', 'versus',
]);

// Simple stemming: collapse common suffixes and spelling variants
const STEM_MAP = {
  'setup': 'setup', 'set': 'setup', 'setting': 'setup', 'settings': 'setup',
  'services': 'service', 'service': 'service',
  'tools': 'tool', 'tool': 'tool',
  'agents': 'agent', 'agent': 'agent',
  'companies': 'company', 'company': 'company',
  'marketing': 'market', 'markets': 'market', 'market': 'market',
  'strategies': 'strategy', 'strategy': 'strategy',
  'websites': 'website', 'website': 'website', 'site': 'website', 'sites': 'website',
  'homes': 'home', 'home': 'home', 'houses': 'home', 'house': 'home',
  'buying': 'buy', 'buyers': 'buy', 'buyer': 'buy', 'buy': 'buy',
  'selling': 'sell', 'sellers': 'sell', 'seller': 'sell', 'sell': 'sell',
  'listings': 'listing', 'listing': 'listing',
  'neighborhoods': 'neighborhood', 'neighborhood': 'neighborhood',
  'guides': 'guide', 'guide': 'guide',
  'tips': 'tip', 'tip': 'tip',
  'costs': 'cost', 'cost': 'cost',
  'prices': 'price', 'price': 'price', 'pricing': 'price',
  'insurance': 'insurance',
  'mortgages': 'mortgage', 'mortgage': 'mortgage',
  'lenders': 'lender', 'lender': 'lender', 'lending': 'lender',
};

// Year patterns to strip (2024, 2025, 2026, etc.)
const YEAR_RE = /\b20\d{2}\b/g;

function getWords(str) {
  return normalize(str).split(' ').filter(w => w.length > 0);
}

function stem(word) {
  return STEM_MAP[word] || word;
}

function getCoreWords(str) {
  return getWords(str.replace(YEAR_RE, ''))
    .filter(w => !FILLER_WORDS.has(w) && w.length > 1)
    .map(stem);
}

function getBigrams(words) {
  const bigrams = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(words[i] + ' ' + words[i + 1]);
  }
  return bigrams;
}

function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  const a = setA instanceof Set ? setA : new Set(setA);
  const b = setB instanceof Set ? setB : new Set(setB);
  const intersection = [...a].filter(x => b.has(x));
  const union = new Set([...a, ...b]);
  return intersection.length / union.size;
}

// Containment: what fraction of A's words appear in B?
function containment(wordsA, wordsB) {
  if (wordsA.length === 0) return 0;
  const setB = new Set(wordsB);
  const overlap = wordsA.filter(w => setB.has(w));
  return overlap.length / wordsA.length;
}

// --- Similarity checks ---

function checkSimilarity(proposedTitle, proposedKeyword, existingTitle) {
  const issues = [];

  const propWords = getWords(proposedTitle);
  const existWords = getWords(existingTitle);
  const propCore = getCoreWords(proposedTitle);
  const existCore = getCoreWords(existingTitle);

  // 1. Jaccard word similarity (original check, lowered threshold)
  const wordJaccard = jaccard(new Set(propWords), new Set(existWords));
  if (wordJaccard > 0.50) {
    issues.push({ level: 'DUPLICATE', reason: `word similarity ${(wordJaccard * 100).toFixed(0)}%` });
  }

  // 2. Bigram similarity (catches reworded titles)
  const propBigrams = getBigrams(propWords);
  const existBigrams = getBigrams(existWords);
  if (propBigrams.size > 0 && existBigrams.size > 0) {
    const bigramJaccard = jaccard(propBigrams, existBigrams);
    if (bigramJaccard > 0.35) {
      issues.push({ level: 'DUPLICATE', reason: `bigram similarity ${(bigramJaccard * 100).toFixed(0)}%` });
    }
  }

  // 3. Core topic similarity (strips filler, years — catches "same topic, different framing")
  if (propCore.length > 0 && existCore.length > 0) {
    const coreJaccard = jaccard(new Set(propCore), new Set(existCore));
    if (coreJaccard > 0.60) {
      issues.push({ level: 'DUPLICATE', reason: `core topic overlap ${(coreJaccard * 100).toFixed(0)}%` });
    }
    // Also check containment: if one title's core is fully inside the other
    const cont1 = containment(propCore, existCore);
    const cont2 = containment(existCore, propCore);
    if (cont1 > 0.70 || cont2 > 0.70) {
      issues.push({ level: 'DUPLICATE', reason: `topic containment ${(Math.max(cont1, cont2) * 100).toFixed(0)}%` });
    }
  }

  // 4. Keyword in existing title (exact substring)
  if (proposedKeyword) {
    const normKeyword = normalize(proposedKeyword);
    const normExisting = normalize(existingTitle);
    if (normExisting.includes(normKeyword) || normKeyword.includes(normExisting.replace(/[^a-z0-9\s]/g, '').trim())) {
      issues.push({ level: 'DUPLICATE', reason: `keyword "${proposedKeyword}" found in existing title` });
    }
  }

  // 5. Keyword-to-keyword similarity (if we can extract keywords from titles)
  if (proposedKeyword) {
    const kwCore = getCoreWords(proposedKeyword);
    if (kwCore.length > 0 && existCore.length > 0) {
      const kwCont = containment(kwCore, existCore);
      if (kwCont > 0.75) {
        issues.push({ level: 'WARNING', reason: `keyword topic overlap with existing title ${(kwCont * 100).toFixed(0)}%` });
      }
    }
  }

  return issues;
}

// --- Also check content-tracker.md ---

const fs = require('fs');
const path = require('path');

function checkContentTracker(proposedTitle, proposedKeyword) {
  const trackerPath = path.join(__dirname, 'content-tracker.md');
  const issues = [];

  try {
    const content = fs.readFileSync(trackerPath, 'utf8');
    const lines = content.split('\n').filter(l => l.match(/^\d{4}-\d{2}-\d{2}\s*\|/));
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    for (const line of lines) {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length < 5) continue;

      const [dateStr, , , existingTitle, existingKeyword] = parts;
      const postDate = new Date(dateStr);

      // Check keyword exact match within 30 days
      if (proposedKeyword && existingKeyword && postDate > thirtyDaysAgo) {
        const normProp = normalize(proposedKeyword);
        const normExist = normalize(existingKeyword);
        if (normProp === normExist) {
          issues.push({ level: 'DUPLICATE', reason: `exact keyword match in tracker: "${existingKeyword}" (${dateStr})`, source: 'tracker' });
        }
        // Keyword Jaccard
        const kwJaccard = jaccard(new Set(getWords(normProp)), new Set(getWords(normExist)));
        if (kwJaccard > 0.60) {
          issues.push({ level: 'WARNING', reason: `keyword similarity ${(kwJaccard * 100).toFixed(0)}% with tracker: "${existingKeyword}" (${dateStr})`, source: 'tracker' });
        }
      }

      // Check title similarity within 60 days
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      if (postDate > sixtyDaysAgo) {
        const titleIssues = checkSimilarity(proposedTitle, proposedKeyword, existingTitle);
        for (const issue of titleIssues) {
          issue.source = 'tracker';
          issue.reason += ` — tracker: "${existingTitle}" (${dateStr})`;
          issues.push(issue);
        }
      }
    }
  } catch (e) {
    // Tracker doesn't exist — not fatal
  }

  return issues;
}

// --- Main ---

async function main() {
  const allIssues = [];

  // 1. Check Sanity (last 90 days for broader coverage)
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  let posts = [];
  try {
    posts = await client.fetch(
      `*[_type == "${docType}" && publishedAt > "${cutoff}"]{title, "slug": slug.current, publishedAt}`
    );
  } catch (e) {
    console.log('WARNING: Could not query Sanity — ' + e.message);
    console.log('Falling back to content-tracker.md only');
  }

  for (const post of posts) {
    if (!post.title) continue;
    const issues = checkSimilarity(title, keyword, post.title);
    for (const issue of issues) {
      issue.source = 'sanity';
      issue.existing = post.title;
      issue.slug = post.slug;
      allIssues.push(issue);
    }

    // Slug collision check
    const proposedSlug = normalize(title).replace(/\s+/g, '-').slice(0, 96);
    if (post.slug && post.slug === proposedSlug) {
      allIssues.push({ level: 'DUPLICATE', reason: 'exact slug match', source: 'sanity', existing: post.title });
    }
  }

  // 2. Check content-tracker.md
  const trackerIssues = checkContentTracker(title, keyword);
  allIssues.push(...trackerIssues);

  // 3. Report results
  const dupes = allIssues.filter(i => i.level === 'DUPLICATE');
  const warnings = allIssues.filter(i => i.level === 'WARNING');

  if (dupes.length > 0) {
    console.log('DUPLICATE — DO NOT PUBLISH\n');
    // Deduplicate by existing title
    const seen = new Set();
    for (const d of dupes) {
      const key = d.existing || d.reason;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  ❌ ${d.reason}`);
      if (d.existing) console.log(`     Existing: "${d.existing}"`);
      console.log(`     Source: ${d.source}`);
      console.log('');
    }
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log('WARNING — Review before publishing\n');
    const seen = new Set();
    for (const w of warnings) {
      const key = w.existing || w.reason;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  ⚠️  ${w.reason}`);
      if (w.existing) console.log(`     Existing: "${w.existing}"`);
      console.log(`     Source: ${w.source}`);
      console.log('');
    }
    process.exit(0); // Warnings don't block — but must be acknowledged
  }

  console.log('OK');
  process.exit(0);
}

main().catch(e => { console.log('ERROR: ' + e.message); process.exit(2); });
