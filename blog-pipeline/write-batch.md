# Blog Batch Writer — Taz Orchestration Guide

*How to turn a manifest into drafted blog posts via sub-agent spawning.*

---

## Workflow

```
generate-batch.py → manifest.json → Taz reads manifest → spawns blog-writer per post → drafts land in queue/
```

## Step 1: Generate Topics

```bash
cd ~/.openclaw/workspace/velocity-builders-website/blog-pipeline

# Single pillar
python3 generate-batch.py --pillar lead-generation --count 10

# All Phase 1 pillars
python3 generate-batch.py --phase 1 --count 50

# Check status
python3 generate-batch.py --status

# Dry run (preview without registering)
python3 generate-batch.py --pillar hyper-local-seo --count 20 --dry-run
```

## Step 2: Read Manifest

The generator outputs a manifest at:
`manifests/manifest-{pillar}-{timestamp}.json`

Each entry has: id, title, primaryKeyword, audiences, city, state, county.

## Step 3: Spawn Writers

For each entry in the manifest, Taz spawns a blog-writer sub-agent:

```
sessions_spawn(
  task: [WRITER_PROMPT with template + variables filled in],
  label: "vb-blog-{post-id}",
  mode: "run",
  model: "sonnet",
  runTimeoutSeconds: 180
)
```

### Writer Prompt Template

```
You are a blog writer for Velocity Builders LLC.

Here is your writing template (system prompt):
---
[INSERT CONTENTS OF templates/{pillar-id}.md with variables filled in]
---

Write a blog post with these specifications:
- Title: {title}
- Primary keyword: {primaryKeyword}
- Target audience: {audience}
- City/State: {city}, {state} (if geo-targeted)
- County: {county} (if geo-targeted)
- Year: 2026

Save the complete post to:
/Users/jarvis/.openclaw/workspace/velocity-builders-website/blog-pipeline/queue/{post-id}.md

Include this front matter:
---
id: {post-id}
title: "{title}"
slug: "{slug}"
pillar: "{pillar}"
audience: "{audience}"
primaryKeyword: "{primaryKeyword}"
city: {city or null}
state: {state or null}
author: "Will Rapuano"
status: draft
schema: ["BlogPosting"]
---
```

## Step 4: Post-Write

After all writers complete:
1. Update registry status from "registered" to "draft" for each post
2. Run quality check on each draft (word count, keyword density, heading structure)
3. Run compliance review on title/settlement pillar posts
4. Move passing posts to "publish-ready" status

## Batch Size Guidelines

- **Max concurrent sub-agents:** 8 (per config)
- **Recommended batch:** 4-6 at a time, wait for completion, spawn next batch
- **Fully-auto pillars:** Can run larger batches with less review
- **Semi-auto pillars:** Spawn in batches of 4, review between batches

## Cron Automation

For sustained content production, Taz can set up a cron job:

```
Schedule: Daily at 6:00 AM ET
Task: "Run the blog batch generator for Phase 1 pillars (count=14), then spawn writers for the manifest. Save all drafts to queue/. Update the topic registry."
```

This produces the daily 14-post target on autopilot.

---

*Created: 2026-03-16 | Owner: Taz (CMO)*
