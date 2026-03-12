#!/usr/bin/env node
/**
 * generate-manifest.js
 * 
 * Daily manifest generator for the Velocity Builders blog pipeline.
 * Produces 12 posts/day with balanced audience distribution (~3 per audience).
 * Reads pillars.json + geography.json, outputs a dated manifest.
 * 
 * Usage: node generate-manifest.js [--date YYYY-MM-DD] [--count 12] [--phase 1|2|3]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Config ---
const DATA_DIR = path.join(__dirname, '..', 'data');
const MANIFEST_DIR = path.join(__dirname, '..', 'manifests');
const PILLARS = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'pillars.json'), 'utf8'));
const GEOGRAPHY = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'geography.json'), 'utf8'));
const REGISTRY_PATH = path.join(DATA_DIR, 'topic-registry.json');

const AUDIENCES = ['agents', 'loan-officers', 'builders', 'credit-unions'];

// --- Keyword Gap Data ---
const SEO_DIR = path.join(__dirname, '..', '..', 'seo');
const KEYWORD_FILES = {
  'agents': 'keyword-gap-realtors.json',
  'loan-officers': 'keyword-gap-loan_officers.json',
  'builders': 'keyword-gap-builders.json',
  'credit-unions': 'keyword-gap-credit_unions_banks.json',
};

// Audience-specific filter thresholds (credit unions gets relaxed filters due to smaller keyword universe)
const AUDIENCE_FILTERS = {
  'agents':       { minVol: 50,  maxKD: 30 },
  'loan-officers': { minVol: 50,  maxKD: 30 },
  'builders':     { minVol: 50,  maxKD: 30 },
  'credit-unions': { minVol: 20,  maxKD: 40 },  // relaxed — smaller keyword pool
};

// Keywords from other audiences that also serve credit unions
const CU_CROSSOVER_TERMS = ['mortgage', 'lender', 'loan', 'banking', 'rate', 'refinance', 'origination', 'member', 'financial', 'community bank'];

function loadKeywordPool() {
  const pool = {};
  for (const [audience, file] of Object.entries(KEYWORD_FILES)) {
    try {
      const filters = AUDIENCE_FILTERS[audience] || { minVol: 50, maxKD: 30 };
      const data = JSON.parse(fs.readFileSync(path.join(SEO_DIR, file), 'utf8'));
      pool[audience] = (data.keywords || [])
        .filter(k => k.volume >= filters.minVol && k.kd <= filters.maxKD)
        .sort((a, b) => (b.score || 0) - (a.score || 0));
    } catch {
      pool[audience] = [];
    }
  }

  // Cross-pollinate: add loan officer keywords relevant to credit unions
  if (pool['loan-officers'] && pool['credit-unions']) {
    const cuKeywords = new Set(pool['credit-unions'].map(k => k.keyword.toLowerCase()));
    const crossover = pool['loan-officers']
      .filter(k => {
        if (cuKeywords.has(k.keyword.toLowerCase())) return false; // skip dupes
        const kw = k.keyword.toLowerCase();
        return CU_CROSSOVER_TERMS.some(term => kw.includes(term));
      })
      .map(k => ({ ...k, crossAudience: 'loan-officers' })); // tag source

    pool['credit-unions'] = [...pool['credit-unions'], ...crossover]
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  return pool;
}

// Map keywords to pillars based on topic matching
const KEYWORD_PILLAR_MAP = {
  'lead-generation': ['lead', 'leads', 'lead gen', 'referral', 'database reactivation', 'prospecting', 'cold call', 'sphere of influence', 'open house', 'facebook ads', 'ppc', 'google ads', 'landing page'],
  'crm-automation': ['crm', 'follow up', 'automation', 'drip', 'nurture', 'pipeline', 'speed to lead', 'response time', 'tag', 'workflow', 'contact management'],
  'hyper-local-seo': ['seo', 'google business', 'local search', 'neighborhood', 'blog', 'content', 'organic', 'keyword', 'rank', 'serp', 'backlink', 'sitemap', 'schema', 'gmb', 'google my business', 'idx', 'website'],
  'builder-marketing': ['builder', 'new construction', 'pre-sale', 'model home', 'community', 'new home', 'construction'],
  'lender-marketing': ['loan officer', 'mortgage', 'lender', 'rate', 'refinance', 'borrower', 'origination', 'loan originator'],
  'follow-up-automation': ['follow up', 'drip', 're-engagement', 'win back', 'post-closing', 'touchpoint', 'stay in touch', 'past client'],
  'credit-union-banking': ['credit union', 'community bank', 'bank marketing', 'member', 'fintech', 'banking', 'branch'],
  'tech-tools': ['tool', 'software', 'platform', 'zapier', 'make.com', 'ai tool', 'tech stack', 'app', 'integration'],
  'market-intelligence': ['market report', 'inventory', 'home price', 'interest rate', 'housing market', 'forecast', 'trend'],
  'case-studies': ['case study', 'roi', 'success story', 'result', 'transformation'],
  'direct-mail': ['direct mail', 'postcard', 'farming', 'mailer', 'just listed', 'just sold', 'mailing list', 'thanks.io', 'print marketing', 'mail campaign'],
};

function keywordMatchesPillar(keyword, pillarId) {
  const terms = KEYWORD_PILLAR_MAP[pillarId] || [];
  const kw = keyword.toLowerCase();
  return terms.some(t => kw.includes(t));
}

function getUsedKeywords() {
  const registry = loadRegistry();
  const used = new Set();
  for (const entry of (registry.entries || [])) {
    if (entry.primaryKeyword) used.add(entry.primaryKeyword.toLowerCase());
  }
  // Also check existing manifests from last 30 days
  try {
    const manifests = fs.readdirSync(MANIFEST_DIR).filter(f => f.endsWith('.json')).sort().reverse().slice(0, 30);
    for (const mf of manifests) {
      const data = JSON.parse(fs.readFileSync(path.join(MANIFEST_DIR, mf), 'utf8'));
      for (const entry of (data.entries || [])) {
        if (entry.primaryKeyword) used.add(entry.primaryKeyword.toLowerCase());
      }
    }
  } catch {}
  return used;
}

const AUDIENCE_LABELS = {
  'agents': 'Real Estate Agents',
  'loan-officers': 'Loan Officers',
  'builders': 'Builders',
  'credit-unions': 'Credit Unions and Banks',
};

function generateTitleFromKeyword(keyword, audience, year) {
  let kw = keyword.keyword;
  // Clean keyword: strip dates, dashes-as-spaces
  kw = kw.replace(/\b20\d{2}\b/g, '').replace(/ - /g, ': ').replace(/\s+/g, ' ').trim();
  const tc = titleCase(kw);
  const singular = {
    'agents': 'Real Estate Agent',
    'loan-officers': 'Loan Officer',
    'builders': 'Builder',
    'credit-unions': 'Credit Union or Community Bank',
  }[audience] || 'Professional';
  const plural = AUDIENCE_LABELS[audience] || audience;
  const wordCount = kw.split(' ').length;
  const vol = keyword.volume || 0;
  const hasNumber = /\d/.test(kw);

  // High-volume keywords (500+) get authority/definitive patterns
  // Low-volume long-tail keywords get action-oriented patterns
  // Keyword ALWAYS appears verbatim in the title for SEO

  const authorityPatterns = [
    `${tc}: The Definitive ${year} Guide for ${plural}`,
    `${tc} — What Top ${plural} Are Doing Differently in ${year}`,
    `The ${singular}'s Playbook for ${tc} in ${year}`,
    `${tc}: ${year} Strategies That Actually Work for ${plural}`,
  ];

  const actionPatterns = [
    `How to Master ${tc} as a ${singular} in ${year}`,
    `${tc}: ${Math.floor(Math.random() * 5) + 5} Proven Strategies for ${plural} in ${year}`,
    `Why ${tc} Matters for ${plural} — And How to Get It Right in ${year}`,
    `${tc} Done Right: A ${year} Blueprint for ${plural}`,
  ];

  const longTailPatterns = [
    `${tc}: A Step-by-Step Guide for ${plural}`,
    `${tc} in ${year} — What Every ${singular} Should Know`,
    `The Smart ${singular}'s Guide to ${tc}`,
    `${tc}: How ${plural} Can Win in ${year}`,
  ];

  // Branded/tool keywords get comparison/review patterns
  const isToolKeyword = /\b(crm|idx|software|platform|app|tool|zapier|make\.com|hubspot|sierra|kvcore|follow up boss|chime|boomtown|realgeeks)\b/i.test(kw);
  const toolPatterns = [
    `${tc} Review: Is It Worth It for ${plural} in ${year}?`,
    `${tc} vs the Competition: What ${plural} Need to Know`,
    `The ${singular}'s Honest Take on ${tc} in ${year}`,
    `${tc}: Setup Guide and ROI Analysis for ${plural}`,
  ];

  let pool;
  if (isToolKeyword) pool = toolPatterns;
  else if (wordCount >= 5) pool = longTailPatterns;
  else if (vol >= 500) pool = authorityPatterns;
  else pool = actionPatterns;

  return pickRandom(pool);
}

function titleCase(str) {
  const minor = new Set(['a','an','the','and','but','or','for','nor','at','by','in','of','on','to','up','is','it','as','vs']);
  return str.split(' ').map((w, i) => {
    if (i === 0 || !minor.has(w.toLowerCase())) return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    return w.toLowerCase();
  }).join(' ');
}

// --- CLI Args ---
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    date: new Date().toISOString().split('T')[0],
    count: 12,
    phase: 1,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) opts.date = args[++i];
    if (args[i] === '--count' && args[i + 1]) opts.count = parseInt(args[++i], 10);
    if (args[i] === '--phase' && args[i + 1]) opts.phase = parseInt(args[++i], 10);
  }
  return opts;
}

// --- Helpers ---
function generateId(date, index) {
  const dateCompact = date.replace(/-/g, '').slice(4); // MMDD
  return `post-${date.slice(0, 4)}-${dateCompact}-${String(index).padStart(3, '0')}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeightedCity(geography) {
  // Prefer high-priority cities 60%, medium 30%, low 10%
  const allCities = [];
  for (const region of geography.regions) {
    for (const city of region.cities) {
      const weight = city.priority === 'high' ? 6 : city.priority === 'medium' ? 3 : 1;
      for (let i = 0; i < weight; i++) {
        allCities.push({ ...city, state: region.state, stateName: region.stateName });
      }
    }
  }
  return pickRandom(allCities);
}

function getActivePillars(phase) {
  return PILLARS.pillars.filter(p => p.phase <= phase);
}

function loadRegistry() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  } catch {
    return { meta: {}, entries: [] };
  }
}

// --- Topic Generation ---
// Each pillar has topic idea generators
const TOPIC_GENERATORS = {
  'lead-generation': (audience, city, year) => {
    const tactics = [
      `${Math.floor(Math.random() * 5) + 5} Automated Lead Follow-Up Sequences Every ${audience === 'agents' ? 'Agent' : 'Loan Officer'} Needs`,
      `How Top-Producing ${audience === 'agents' ? 'Agents' : 'Loan Officers'}${city ? ` in ${city.name}` : ''} Generate 30+ Referrals/Month`,
      `The Lead Response Time Study: Why 5 Minutes Costs You $50K/Year`,
      `Facebook Lead Ads vs Google PPC for Real Estate ${audience === 'agents' ? 'Agents' : 'Loan Officers'} — ${year} Breakdown`,
      `Sphere of Influence Marketing: The System That Replaces Cold Leads`,
      `Open House Lead Capture: ${Math.floor(Math.random() * 5) + 3} Systems That Convert Visitors to Clients`,
      `Database Reactivation: How to Turn ${Math.floor(Math.random() * 300) + 200} Dead Leads Into ${Math.floor(Math.random() * 10) + 5} Closings`,
      `The Referral Script That Generates ${Math.floor(Math.random() * 5) + 3} Warm Introductions Per Month`,
    ];
    return pickRandom(tactics) + ` in ${year}`;
  },

  'crm-automation': (audience, city, year) => {
    const concepts = [
      `${Math.floor(Math.random() * 5) + 3} CRM Automations That Recover Dead Leads Without Lifting a Finger`,
      `The 90-Day CRM Setup Plan for Solo ${audience === 'agents' ? 'Agents' : 'Loan Officers'}`,
      `How to Build a Pipeline That Tracks Every Lead from Inquiry to Closing`,
      `The CRM Mistake That's Costing ${audience === 'agents' ? 'Agents' : 'Loan Officers'} 40% of Their Referrals`,
      `CRM Automation ROI Calculator: What's Your Follow-Up Actually Worth?`,
      `Speed-to-Lead Automation: The ${Math.floor(Math.random() * 3) + 2}-Minute Response System`,
      `Tag-Based Nurture Sequences: Stop Blasting, Start Converting`,
    ];
    return pickRandom(concepts) + ` — ${year}`;
  },

  'hyper-local-seo': (audience, city, year) => {
    if (!city) city = pickWeightedCity(GEOGRAPHY);
    const strategies = [
      `How to Rank #1 for 'Best Realtor in ${city.name}' — ${year} SEO Playbook`,
      `Hyper-Local SEO for Real Estate: ${city.name} Neighborhood Page Strategy`,
      `Google Business Profile Optimization for ${audience === 'agents' ? 'Agents' : 'Builders'} in ${city.county}, ${city.state}`,
      `The Neighborhood Blog Strategy That Generates 200+ Organic Leads/Month in ${city.name}`,
      `Local SEO Audit Checklist for Real Estate ${audience === 'agents' ? 'Agents' : 'Builders'} in ${city.name} — ${year}`,
      `${city.name}, ${city.state} Real Estate Keywords: What to Target in ${year}`,
    ];
    return pickRandom(strategies);
  },

  'business-systems': (audience, city, year) => {
    const systems = [
      `The $10M ${audience === 'agents' ? 'Agent' : 'Loan Officer'} Tech Stack: Tools That Replace 3 Assistants`,
      `How to Build a Referral Machine That Runs Without You`,
      `Transaction Coordinator Automation: What to Delegate vs Automate in ${year}`,
      `From Solo ${audience === 'agents' ? 'Agent' : 'LO'} to Team: The Systems You Need Before Hiring`,
      `${Math.floor(Math.random() * 5) + 3} Business Systems Every ${audience === 'agents' ? 'Agent' : 'Loan Officer'} Needs to Hit ${audience === 'agents' ? '50+' : '100+'} Units/Year`,
    ];
    return pickRandom(systems);
  },

  'regulations': (audience, city, year) => {
    const regs = [
      `Virginia Real Estate License Renewal Checklist — ${year}`,
      `TRID Compliance for ${audience === 'agents' ? 'Agents' : 'Loan Officers'}: The ${year} Quick Reference`,
      `Marketing Compliance for Real Estate ${audience === 'agents' ? 'Agents' : 'Loan Officers'}: What You Can't Say in ${year}`,
      `Fair Housing Advertising Rules Every ${audience === 'agents' ? 'Agent' : 'Lender'} Should Know`,
      `Anti-Kickback & RESPA: Co-Marketing Dos and Don'ts for ${year}`,
    ];
    return pickRandom(regs);
  },

  'builder-marketing': (audience, city, year) => {
    if (!city) city = pickWeightedCity(GEOGRAPHY);
    const strategies = [
      `How ${city.name} Builders Are Using SEO to Sell Out Communities Before Groundbreak`,
      `The Builder's Guide to Agent Co-Marketing in the DMV — ${year}`,
      `New Construction Landing Pages That Convert: ${year} Best Practices`,
      `Pre-Sale Funnel Automation for Residential Builders in ${city.state}`,
      `Builder CRM Setup: Tracking Prospects from Lot Interest to Closing`,
    ];
    return pickRandom(strategies);
  },

  'lender-marketing': (audience, city, year) => {
    const strategies = [
      `How Loan Officers Build Agent Referral Pipelines That Last in ${year}`,
      `Credit Union Mortgage Marketing: Digital Strategies for ${year}`,
      `The Loan Officer's Guide to Co-Branded Content with Agents`,
      `Community Bank vs Big Lender: How to Win on Local Service in ${year}`,
      `Automated Rate Alert Systems That Keep Borrowers Engaged`,
    ];
    return pickRandom(strategies);
  },

  'market-intelligence': (audience, city, year) => {
    if (!city) city = pickWeightedCity(GEOGRAPHY);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[new Date().getMonth()];
    const reports = [
      `${city.county} Real Estate Market Report — ${month} ${year}`,
      `New Construction Permits in ${city.name}, ${city.state}: Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${year} Trends`,
      `Interest Rate Impact on ${city.name} Home Sales — ${month} ${year}`,
      `Inventory Watch: ${city.county} Active Listings vs Closed Sales — ${month} ${year}`,
    ];
    return pickRandom(reports);
  },

  'tech-tools': (audience, city, year) => {
    const categories = [
      `Best Real Estate Website Platforms for ${audience === 'agents' ? 'Agents' : 'Loan Officers'} — ${year} Ranked`,
      `Zapier vs Make.com for Real Estate Automations: Which Saves More Time in ${year}?`,
      `AI Tools Every Real Estate ${audience === 'agents' ? 'Agent' : 'Loan Officer'} Should Be Using in ${year}`,
      `IDX Website Setup Guide: From Zero to Lead-Generating in 7 Days`,
      `The Best Email Marketing Platforms for Real Estate — ${year} Comparison`,
    ];
    return pickRandom(categories);
  },

  'follow-up-automation': (audience, city, year) => {
    const audienceLabel = {
      'agents': 'Agent',
      'loan-officers': 'Loan Officer',
      'builders': 'Builder',
      'credit-unions': 'Credit Union',
    }[audience] || 'Agent';
    const types = [
      `The ${audienceLabel}'s Follow-Up System: ${Math.floor(Math.random() * 8) + 8} Automated Touchpoints That Turn Past Clients Into Repeat Business`,
      `Follow-Up Automation for ${audienceLabel}s: How to Stay Top-of-Mind Without Lifting a Finger in ${year}`,
      `Post-Closing Follow-Up Blueprint: How to Generate ${Math.floor(Math.random() * 3) + 2} Referrals Per Closed Transaction`,
      `The ${Math.floor(Math.random() * 60) + 30}-Day Drip Sequence Every ${audienceLabel} Needs Running in ${year}`,
      `${audienceLabel} Re-Engagement Campaigns: Win Back Cold Leads in ${year}`,
    ];
    return pickRandom(types);
  },

  'credit-union-banking': (audience, city, year) => {
    const topics = [
      `Credit Union Digital Marketing Playbook: How to Compete with Big Banks in ${year}`,
      `Community Bank SEO Strategy: Owning Local Search in ${year}`,
      `Member Acquisition Funnels for Credit Unions — What Actually Works in ${year}`,
      `How Credit Unions Are Using Content Marketing to Beat Fintech Apps`,
      `Credit Union Email Automation: The Onboarding Sequence That Drives Cross-Sell`,
      `Community Bank Website Design: What Converts Members vs What Doesn't`,
      `Credit Union Social Media Strategy: Beyond Rate Posts in ${year}`,
      `Digital Marketing ROI for Credit Unions: How to Measure What Matters`,
      `Bank Marketing Automation: ${Math.floor(Math.random() * 5) + 3} Campaigns That Run Without Staff`,
      `Credit Union vs Fintech: Winning the Digital Marketing Battle in ${year}`,
      `Google Business Profile for Credit Unions: The Local SEO Playbook`,
      `Community Bank Lead Generation: From Branch Traffic to Digital Pipeline`,
      `Credit Union Mortgage Marketing: How to Grow Originations with Digital`,
      `Bank Branding in the Digital Age: Standing Out When Everyone Looks the Same`,
    ];
    return pickRandom(topics);
  },

  'case-studies': (audience, city, year) => {
    const cases = [
      `How a Northern Virginia Agent Went from 12 to 47 Transactions with CRM Automation`,
      `Case Study: DMV Builder Sold 80% of Phase 1 Using Hyper-Local SEO`,
      `From 0 to 500 Organic Visits/Month: An Agent's Website Transformation`,
      `ROI Breakdown: What a $500/Month Content System Actually Returns`,
    ];
    return pickRandom(cases);
  },

  'direct-mail': (audience, city, year) => {
    if (!city) city = pickWeightedCity(GEOGRAPHY);
    const audienceLabel = {
      'agents': 'Agent',
      'loan-officers': 'Loan Officer',
      'builders': 'Builder',
      'credit-unions': 'Credit Union',
    }[audience] || 'Agent';
    const audiencePlural = {
      'agents': 'Agents',
      'loan-officers': 'Loan Officers',
      'builders': 'Builders',
      'credit-unions': 'Credit Unions',
    }[audience] || 'Agents';
    const topics = [
      `Geographic Farming with Direct Mail: The ${city.name} ${audienceLabel} Playbook for ${year}`,
      `Just Listed / Just Sold Mailer Systems That Generate Listings in ${city.name} — ${year}`,
      `Thanks.io Direct Mail Automation for ${audiencePlural}: Set It Up in a Weekend`,
      `Direct Mail vs Digital Marketing ROI for ${audiencePlural}: The ${year} Data`,
      `List Building and Targeting Strategies for Real Estate Farming in ${city.county}`,
      `Postcard Design That Converts: What Top-Producing ${audiencePlural} Are Sending in ${year}`,
      `Direct Mail Drip Campaigns for Sphere of Influence: The ${Math.floor(Math.random() * 5) + 6}-Touch System`,
      `Seasonal Mailer Campaigns That Keep ${audiencePlural} Top-of-Mind Year-Round`,
      `Direct Mail for New Construction: How ${city.name} Builders Are Moving Communities Before Groundbreak`,
      `Credit Union Direct Mail Member Acquisition: Campaigns That Beat Digital CPL in ${year}`,
      `Co-Branded Mailers for ${audiencePlural} and Lenders: The Partnership Play That Works`,
    ];
    return pickRandom(topics);
  },
};

// --- Audience Balancer ---
function balanceAudiences(count) {
  // Target ~equal distribution across 4 audiences
  const perAudience = Math.floor(count / AUDIENCES.length);
  const remainder = count % AUDIENCES.length;
  const slots = [];

  for (let i = 0; i < AUDIENCES.length; i++) {
    const n = perAudience + (i < remainder ? 1 : 0);
    for (let j = 0; j < n; j++) {
      slots.push(AUDIENCES[i]);
    }
  }

  // Shuffle
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  return slots;
}

// --- Pillar Selector ---
function selectPillarForAudience(audience, activePillars, usedPillars) {
  // Find pillars that serve this audience
  const matching = activePillars.filter(p => p.audiences.includes(audience));
  if (matching.length === 0) {
    // Fallback: pillars serving all audiences
    const fallback = activePillars.filter(p => p.audiences.length === 4);
    return pickRandom(fallback) || pickRandom(activePillars);
  }

  // Weight by postsPerDay, reduce weight for already-used pillars
  const weighted = [];
  for (const p of matching) {
    const timesUsed = usedPillars.filter(id => id === p.id).length;
    const weight = Math.max(1, Math.round(p.postsPerDay * 3) - timesUsed * 2);
    for (let i = 0; i < weight; i++) {
      weighted.push(p);
    }
  }

  return pickRandom(weighted) || pickRandom(matching);
}

// --- Dedup Helper ---
// Normalize title to structural pattern: strip audience labels, numbers, years
function structuralKey(t) {
  return t.toLowerCase()
    .replace(/\b(agents?|loan officers?|builders?|credit unions?|banks?|lenders?|realtors?|professionals?|los?)\b/g, 'ROLE')
    .replace(/\b20\d{2}\b/g, 'YEAR')
    .replace(/\b\d+\b/g, 'N')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSimilarToEntries(title, entries, pillarId, audience) {
  const tokens = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);
  const tokenSet = new Set(tokens);
  const titleStruct = structuralKey(title);

  for (const existing of entries) {
    // Block exact pillar+audience combo within same manifest
    if (existing.pillar === pillarId && existing.audiences[0] === audience) return true;

    // Structural pattern match (catches "Agent's Follow-Up System: N Touchpoints" vs "Builder's Follow-Up System: N Touchpoints")
    if (structuralKey(existing.title) === titleStruct) return true;

    // Jaccard similarity at 0.45 threshold
    const exTokens = existing.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);
    const exSet = new Set(exTokens);
    const inter = new Set([...tokenSet].filter(t => exSet.has(t)));
    const uni = new Set([...tokenSet, ...exSet]);
    if (uni.size > 0 && inter.size / uni.size > 0.45) return true;

    // Block same primary keyword
    if (existing.primaryKeyword && existing.primaryKeyword.toLowerCase() === (tokens.join(' ').slice(0, 50))) return true;
  }
  return false;
}

// --- Main ---
function generateManifest() {
  const opts = parseArgs();
  const { date, count, phase } = opts;
  const year = date.slice(0, 4);
  const activePillars = getActivePillars(phase);
  const audienceSlots = balanceAudiences(count);
  const entries = [];

  // Load keyword pool and track what's been used
  const keywordPool = loadKeywordPool();
  const usedKeywords = getUsedKeywords();
  const sessionUsedKeywords = new Set(); // track within this manifest run
  const usedPillars = [];

  // Build per-audience available keyword queues (sorted by score, unused first)
  const kwQueues = {};
  for (const aud of AUDIENCES) {
    kwQueues[aud] = (keywordPool[aud] || []).filter(k => !usedKeywords.has(k.keyword.toLowerCase()));
  }

  const totalKw = Object.values(kwQueues).reduce((s, q) => s + q.length, 0);
  console.log(`\n📝 Generating manifest for ${date} | ${count} posts | Phase ${phase}`);
  console.log(`   Active pillars: ${activePillars.map(p => p.id).join(', ')}`);
  console.log(`   Keyword pool: ${totalKw} unused keywords across 4 audiences`);
  console.log(`   Source: SEO keyword gap data (640 total, KD ≤ 30, vol ≥ 50)\n`);

  for (let i = 0; i < count; i++) {
    const audience = audienceSlots[i];
    const id = generateId(date, i + 1);
    const needsGeo = false; // Keyword-driven titles don't need random geo

    // STRATEGY: Pick keyword first, then map to pillar
    let entry = null;
    const queue = kwQueues[audience] || [];

    for (let k = 0; k < queue.length; k++) {
      const kw = queue[k];
      if (sessionUsedKeywords.has(kw.keyword.toLowerCase())) continue;

      // Find which pillar this keyword maps to
      let matchedPillar = null;
      for (const p of activePillars) {
        if (keywordMatchesPillar(kw.keyword, p.id)) {
          matchedPillar = p;
          break;
        }
      }
      // Default to hyper-local-seo for unmapped keywords (most are content/SEO related)
      if (!matchedPillar) {
        matchedPillar = activePillars.find(p => p.id === 'hyper-local-seo') || activePillars[0];
      }

      const title = generateTitleFromKeyword(kw, audience, year);
      const slug = slugify(title);

      if (isSimilarToEntries(title, entries, matchedPillar.id, audience)) continue;

      entry = {
        id, title, slug,
        pillar: matchedPillar.id,
        audiences: [audience],
        primaryKeyword: kw.keyword,
        secondaryKeywords: [],
        targetVolume: kw.volume,
        targetKD: kw.kd,
        targetScore: kw.score || 0,
        city: null, county: null, state: null,
        angle: title,
        publishDate: date,
        status: 'manifest',
        automationLevel: matchedPillar.automationLevel,
        templateFile: matchedPillar.templateFile,
        similarityScore: null, similarTo: null,
        flagged: false, flagReason: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      sessionUsedKeywords.add(kw.keyword.toLowerCase());
      usedPillars.push(matchedPillar.id);
      entries.push(entry);
      console.log(`   [${i + 1}/${count}] 🔑 "${kw.keyword}" (vol=${kw.volume}, KD=${kw.kd}) → ${matchedPillar.id} → ${audience}`);
      console.log(`           → "${title.slice(0, 75)}..."`);
      break;
    }

    // FALLBACK: If no keyword available, try up to 5 pillar+topic combos from template generators
    if (!entry) {
      const MAX_FALLBACK = 5;
      const triedFallbackPillars = new Set();
      let placed = false;

      for (let attempt = 0; attempt < MAX_FALLBACK && !placed; attempt++) {
        const pillar = selectPillarForAudience(audience, activePillars, [...usedPillars, ...triedFallbackPillars]);
        triedFallbackPillars.add(pillar.id);
        const city = ['hyper-local-seo', 'builder-marketing', 'market-intelligence'].includes(pillar.id) ? pickWeightedCity(GEOGRAPHY) : null;
        const generator = TOPIC_GENERATORS[pillar.id];
        if (!generator) continue; // skip pillars without generators

        const title = generator(audience, city, year);
        const slug = slugify(title);

        if (!isSimilarToEntries(title, entries, pillar.id, audience)) {
          usedPillars.push(pillar.id);
          entries.push({
            id, title, slug, pillar: pillar.id,
            audiences: [audience], primaryKeyword: slug.replace(/-/g, ' ').slice(0, 50),
            secondaryKeywords: [], targetVolume: 0, targetKD: 0, targetScore: 0,
            city: city ? city.name : null, county: city ? city.county : null, state: city ? city.state : null,
            angle: title, publishDate: date, status: 'manifest',
            automationLevel: pillar.automationLevel, templateFile: pillar.templateFile,
            similarityScore: null, similarTo: null, flagged: false, flagReason: null,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          });
          console.log(`   [${i + 1}/${count}] 📝 (template fallback${attempt > 0 ? `, attempt ${attempt + 1}` : ''}) ${pillar.id} → ${audience} → "${title.slice(0, 70)}..."`);
          placed = true;
        }
      }

      if (!placed) {
        console.log(`   ⚠ Slot ${i + 1} skipped — exhausted ${MAX_FALLBACK} fallback attempts for ${audience}`);
      }
    }
  }

  // Write manifest
  fs.mkdirSync(MANIFEST_DIR, { recursive: true });
  const manifestPath = path.join(MANIFEST_DIR, `manifest-${date}.json`);
  const kwDriven = entries.filter(e => e.targetVolume > 0).length;
  const manifest = {
    date,
    phase,
    count: entries.length,
    keywordDriven: kwDriven,
    templateFallback: entries.length - kwDriven,
    audienceDistribution: AUDIENCES.reduce((acc, a) => {
      acc[a] = entries.filter(e => e.audiences.includes(a)).length;
      return acc;
    }, {}),
    pillarDistribution: [...new Set(entries.map(e => e.pillar))].reduce((acc, p) => {
      acc[p] = entries.filter(e => e.pillar === p).length;
      return acc;
    }, {}),
    entries,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Manifest written: ${manifestPath}`);
  console.log(`   Posts: ${entries.length} | Keyword-driven: ${kwDriven} | Template fallback: ${entries.length - kwDriven}`);
  console.log(`   Audience balance: ${JSON.stringify(manifest.audienceDistribution)}`);
  console.log(`   Pillar spread: ${JSON.stringify(manifest.pillarDistribution)}\n`);

  return manifest;
}

// Run
generateManifest();
