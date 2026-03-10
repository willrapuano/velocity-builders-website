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

  'title-insurance': (audience, city, year) => {
    const topics = [
      `Title Insurance Explained: What Every ${city ? city.name + ' ' : ''}${audience === 'agents' ? 'Agent' : audience === 'loan-officers' ? 'Loan Officer' : 'Builder'} Should Tell Buyers`,
      `Wire Fraud Prevention Checklist for Real Estate Closings — ${year}`,
      `How Title Issues Kill Deals (And How to Catch Them Early)`,
      `Settlement Timeline in Virginia: What ${audience === 'agents' ? 'Agents' : 'Loan Officers'} Need to Know in ${year}`,
      `Owner's Title Insurance vs Lender's Title Insurance — The ${audience === 'agents' ? 'Agent' : 'LO'}'s Script`,
    ];
    return pickRandom(topics);
  },

  'title-news': (audience, city, year) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[new Date().getMonth()];
    const events = [
      `NAR Settlement Update ${month} ${year}: What Changes for Virginia ${audience === 'agents' ? 'Agents' : 'Professionals'}`,
      `Virginia Real Estate Commission Update — ${month} ${year} Recap`,
      `RESPA Enforcement Trends ${year}: What Title Companies Are Watching`,
    ];
    return pickRandom(events);
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

  'case-studies': (audience, city, year) => {
    const cases = [
      `How a Northern Virginia Agent Went from 12 to 47 Transactions with CRM Automation`,
      `Case Study: DMV Builder Sold 80% of Phase 1 Using Hyper-Local SEO`,
      `From 0 to 500 Organic Visits/Month: An Agent's Website Transformation`,
      `ROI Breakdown: What a $500/Month Content System Actually Returns`,
    ];
    return pickRandom(cases);
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

// --- Main ---
function generateManifest() {
  const opts = parseArgs();
  const { date, count, phase } = opts;
  const year = date.slice(0, 4);
  const activePillars = getActivePillars(phase);
  const registry = loadRegistry();
  const audienceSlots = balanceAudiences(count);
  const usedPillars = [];
  const entries = [];

  console.log(`\n📝 Generating manifest for ${date} | ${count} posts | Phase ${phase}`);
  console.log(`   Active pillars: ${activePillars.map(p => p.id).join(', ')}\n`);

  for (let i = 0; i < count; i++) {
    const audience = audienceSlots[i];
    const pillar = selectPillarForAudience(audience, activePillars, usedPillars);
    usedPillars.push(pillar.id);

    // Pick geo if pillar needs it
    const needsGeo = ['hyper-local-seo', 'builder-marketing', 'market-intelligence'].includes(pillar.id);
    const city = needsGeo ? pickWeightedCity(GEOGRAPHY) : null;

    // Generate topic
    const generator = TOPIC_GENERATORS[pillar.id];
    const title = generator ? generator(audience, city, year) : `${pillar.name} Post for ${audience} — ${year}`;
    const slug = slugify(title);
    const id = generateId(date, i + 1);

    const entry = {
      id,
      title,
      slug,
      pillar: pillar.id,
      audiences: [audience],
      primaryKeyword: slug.replace(/-/g, ' ').slice(0, 50),
      secondaryKeywords: [],
      city: city ? city.name : null,
      county: city ? city.county : null,
      state: city ? city.state : null,
      angle: title,
      publishDate: date,
      status: 'manifest',
      automationLevel: pillar.automationLevel,
      templateFile: pillar.templateFile,
      similarityScore: null,
      similarTo: null,
      flagged: false,
      flagReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    entries.push(entry);
    console.log(`   [${i + 1}/${count}] ${pillar.id} → ${audience} → "${title.slice(0, 70)}..."`);
  }

  // Write manifest
  fs.mkdirSync(MANIFEST_DIR, { recursive: true });
  const manifestPath = path.join(MANIFEST_DIR, `manifest-${date}.json`);
  const manifest = {
    date,
    phase,
    count: entries.length,
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
  console.log(`   Audience balance: ${JSON.stringify(manifest.audienceDistribution)}`);
  console.log(`   Pillar spread: ${JSON.stringify(manifest.pillarDistribution)}\n`);

  return manifest;
}

// Run
generateManifest();
