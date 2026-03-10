# Blog Pipeline — Velocity Builders

Automated content pipeline: topic selection → AI writing → 3-stage review → Sanity CMS publish.

## Pipeline Stages

| Stage | Script | What it does |
|-------|--------|-------------|
| 1. Manifest | `generate-manifest.js` | Picks topics from pillar rotation, avoids duplicates |
| 2. Write | `write-post.js` | AI-generates draft from pillar template + topic |
| 3. Review | `review-council.js` | 3-stage review: Editor → Fact-Check → SEO |
| 4. Publish | `publish-to-sanity.js` | Pushes approved posts to Sanity CMS |
| **Full** | `run-pipeline.js` | Orchestrates all 4 stages in sequence |

## Setup

### Required Environment Variables

Add to `.env.local` in the repo root or set in your environment:

```bash
# AI Provider — at least one required for writing + review
OPENAI_API_KEY=sk-...          # GPT-4 for content generation
# or
ANTHROPIC_API_KEY=sk-ant-...   # Claude for content generation

# Sanity CMS — required for publish stage
SANITY_API_TOKEN=sk...         # Write-capable token
SANITY_PROJECT_ID=xifumfa3     # or set NEXT_PUBLIC_SANITY_PROJECT_ID
SANITY_DATASET=production      # default

# Optional
BLOG_PIPELINE_POSTS_PER_DAY=1  # Posts per pipeline run (default: 1)
PERPLEXITY_API_KEY=pplx-...    # For fact-checking stage (optional)
```

### Running

```bash
# Full pipeline
node blog-pipeline/scripts/run-pipeline.js

# Single stage
node blog-pipeline/scripts/run-pipeline.js --stage manifest
node blog-pipeline/scripts/run-pipeline.js --stage write
node blog-pipeline/scripts/run-pipeline.js --stage review
node blog-pipeline/scripts/run-pipeline.js --stage publish

# Preview without changes
node blog-pipeline/scripts/run-pipeline.js --dry-run

# Generate 3 posts instead of 1
node blog-pipeline/scripts/run-pipeline.js --limit 3
```

### Daily Cron (recommended)

```bash
# Run at 6am ET daily
0 6 * * * cd /path/to/velocity-builders-website && node blog-pipeline/scripts/run-pipeline.js >> blog-pipeline/logs/pipeline.log 2>&1
```

Or via OpenClaw cron:
```
openclaw cron add --schedule "0 6 * * *" --command "cd /Users/jarvis/.openclaw/workspace/velocity-builders-website && node blog-pipeline/scripts/run-pipeline.js"
```

## Directory Structure

```
blog-pipeline/
├── data/
│   ├── pillars.json          # 13 content pillars with rotation config
│   ├── topic-registry.json   # All generated topics + status tracking
│   └── geography.json        # NoVA geography for local content
├── templates/                # Pillar-specific writing templates
├── manifests/                # Daily topic selections
├── drafts/                   # AI-generated drafts (pre-review)
├── approved/                 # Review-passed posts (pre-publish)
├── published/                # Successfully published to Sanity
├── logs/                     # Pipeline run logs
└── scripts/
    ├── generate-manifest.js  # Stage 1: Topic selection
    ├── write-post.js         # Stage 2: AI writing
    ├── check-duplication.js  # Dedup utility
    ├── review-council.js     # Stage 3: 3-stage review
    ├── publish-to-sanity.js  # Stage 4: CMS publish
    └── run-pipeline.js       # Full orchestrator
```

## Content Pillars (13)

1. CRM Automation
2. Lead Generation
3. Follow-Up Automation
4. Hyper-Local SEO
5. Builder Marketing
6. Lender Marketing
7. Market Intelligence
8. Case Studies
9. Title Insurance
10. Title News
11. Business Systems
12. Tech Tools
13. Regulations
