#!/usr/bin/env node
/**
 * Blog Dedup Check — run before publishing ANY post
 * Usage: node dedup-check.js <sanity-project-id> <sanity-token> <doc-type> <proposed-title> <proposed-keyword>
 * Returns: "OK" if unique, "DUPLICATE: <existing-title>" if too similar
 */

const { createClient } = require('@sanity/client');

const [,, projectId, token, docType, title, keyword] = process.argv;

if (!projectId || !token || !docType || !title) {
  console.log('Usage: node dedup-check.js <projectId> <token> <docType> <title> [keyword]');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

function normalize(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a, b) {
  const wordsA = new Set(normalize(a).split(' '));
  const wordsB = new Set(normalize(b).split(' '));
  const intersection = [...wordsA].filter(w => wordsB.has(w));
  const union = new Set([...wordsA, ...wordsB]);
  return intersection.length / union.size; // Jaccard similarity
}

async function main() {
  // Get all existing posts from last 60 days
  const cutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  const posts = await client.fetch(
    `*[_type == "${docType}" && publishedAt > "${cutoff}"]{title, "slug": slug.current, publishedAt}`
  );

  const normalTitle = normalize(title);
  const normalKeyword = keyword ? normalize(keyword) : '';

  for (const post of posts) {
    const existingTitle = normalize(post.title || '');
    
    // Check title similarity (Jaccard > 0.6 = too similar)
    const titleSim = similarity(title, post.title || '');
    if (titleSim > 0.6) {
      console.log(`DUPLICATE: "${post.title}" (similarity: ${(titleSim * 100).toFixed(0)}%)`);
      process.exit(1);
    }

    // Check if keyword appears in existing title
    if (normalKeyword && existingTitle.includes(normalKeyword)) {
      console.log(`DUPLICATE: "${post.title}" (contains keyword "${keyword}")`);
      process.exit(1);
    }

    // Check exact slug match
    const proposedSlug = normalTitle.replace(/\s+/g, '-').slice(0, 60);
    if (post.slug === proposedSlug) {
      console.log(`DUPLICATE: "${post.title}" (same slug)`);
      process.exit(1);
    }
  }

  console.log('OK');
  process.exit(0);
}

main().catch(e => { console.log('ERROR: ' + e.message); process.exit(2); });
