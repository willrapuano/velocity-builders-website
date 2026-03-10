#!/usr/bin/env node
/**
 * run-pipeline.js — Daily blog pipeline orchestrator
 *
 * Executes the full pipeline in sequence:
 *   1. generate-manifest.js  — pick today's topics
 *   2. write-post.js         — draft each manifest entry
 *   3. review-council.js     — run 3-stage review on each draft
 *   4. publish-to-sanity.js  — push approved posts to CMS
 *
 * Usage:
 *   node run-pipeline.js                    # full pipeline
 *   node run-pipeline.js --stage manifest   # only generate manifest
 *   node run-pipeline.js --stage write      # only write drafts
 *   node run-pipeline.js --stage review     # only review drafts
 *   node run-pipeline.js --stage publish    # only publish approved
 *   node run-pipeline.js --dry-run          # preview all stages
 *   node run-pipeline.js --limit 2          # max posts per run
 *
 * Env: See individual scripts for required keys.
 *      BLOG_PIPELINE_POSTS_PER_DAY — posts to generate (default: 1)
 *
 * Cron example (daily at 6am ET):
 *   0 6 * * * cd /path/to/velocity-builders-website && node blog-pipeline/scripts/run-pipeline.js >> blog-pipeline/logs/pipeline.log 2>&1
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// --- Paths ---
const SCRIPTS_DIR = __dirname;
const PIPELINE_DIR = path.join(__dirname, "..");
const MANIFESTS_DIR = path.join(PIPELINE_DIR, "manifests");
const DRAFTS_DIR = path.join(PIPELINE_DIR, "drafts");
const APPROVED_DIR = path.join(PIPELINE_DIR, "approved");
const LOGS_DIR = path.join(PIPELINE_DIR, "logs");

// --- Ensure directories ---
[MANIFESTS_DIR, DRAFTS_DIR, APPROVED_DIR, LOGS_DIR].forEach((d) =>
  fs.mkdirSync(d, { recursive: true })
);

// --- CLI Args ---
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    stage: "all",
    dryRun: false,
    limit: parseInt(process.env.BLOG_PIPELINE_POSTS_PER_DAY || "1", 10),
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--stage" && args[i + 1]) opts.stage = args[++i];
    if (args[i] === "--dry-run") opts.dryRun = true;
    if (args[i] === "--limit" && args[i + 1]) opts.limit = parseInt(args[++i], 10);
  }
  return opts;
}

// --- Run a script ---
function run(script, extraArgs = "", { dryRun = false, ignoreError = false } = {}) {
  const cmd = `node ${path.join(SCRIPTS_DIR, script)} ${extraArgs}${dryRun ? " --dry-run" : ""}`;
  console.log(`\n${"=".repeat(60)}`);
  console.log(`▶ ${cmd}`);
  console.log(`${"=".repeat(60)}`);

  try {
    execSync(cmd, {
      cwd: PIPELINE_DIR,
      stdio: "inherit",
      env: { ...process.env },
      timeout: 300_000, // 5 min per script
    });
    return true;
  } catch (err) {
    if (ignoreError) {
      console.warn(`⚠ ${script} exited with error (continuing):\n  ${err.message}`);
      return false;
    }
    throw err;
  }
}

// --- Today's date ---
function today() {
  return new Date().toISOString().split("T")[0];
}

// --- Stage: Manifest ---
function stageManifest(opts) {
  console.log("\n📋 STAGE 1: Generate Manifest");
  run("generate-manifest.js", `--limit ${opts.limit}`, opts);
}

// --- Stage: Write ---
function stageWrite(opts) {
  console.log("\n✍️  STAGE 2: Write Posts");
  const manifestFile = path.join(MANIFESTS_DIR, `manifest-${today()}.json`);

  if (!fs.existsSync(manifestFile)) {
    // Try the most recent manifest
    const manifests = fs
      .readdirSync(MANIFESTS_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();

    if (manifests.length === 0) {
      console.log("⚠ No manifest found. Run manifest stage first.");
      return;
    }
    console.log(`  Using latest manifest: ${manifests[0]}`);
    const latestManifest = path.join(MANIFESTS_DIR, manifests[0]);

    const entries = JSON.parse(fs.readFileSync(latestManifest, "utf-8"));
    for (let i = 0; i < Math.min(entries.length, opts.limit); i++) {
      run("write-post.js", `--manifest ${latestManifest} --index ${i}`, {
        ...opts,
        ignoreError: true,
      });
    }
    return;
  }

  const entries = JSON.parse(fs.readFileSync(manifestFile, "utf-8"));
  for (let i = 0; i < Math.min(entries.length, opts.limit); i++) {
    run("write-post.js", `--manifest ${manifestFile} --index ${i}`, {
      ...opts,
      ignoreError: true,
    });
  }
}

// --- Stage: Review ---
function stageReview(opts) {
  console.log("\n🔍 STAGE 3: Review Council");
  const drafts = fs
    .readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.includes("-reviewed"));

  if (drafts.length === 0) {
    console.log("  📭 No new drafts to review.");
    return;
  }

  for (const draft of drafts.slice(0, opts.limit)) {
    run("review-council.js", `--draft ${path.join(DRAFTS_DIR, draft)} --stage all`, {
      ...opts,
      ignoreError: true,
    });
  }
}

// --- Stage: Publish ---
function stagePublish(opts) {
  console.log("\n📤 STAGE 4: Publish to Sanity");
  run("publish-to-sanity.js", "--all", opts);
}

// --- Main ---
function main() {
  const opts = parseArgs();
  const startTime = Date.now();
  const logLine = `[${new Date().toISOString()}] Pipeline run — stage: ${opts.stage}, limit: ${opts.limit}, dryRun: ${opts.dryRun}`;

  console.log(`\n🚀 Velocity Builders Blog Pipeline`);
  console.log(logLine);

  try {
    const stages = {
      manifest: stageManifest,
      write: stageWrite,
      review: stageReview,
      publish: stagePublish,
    };

    if (opts.stage === "all") {
      stageManifest(opts);
      stageWrite(opts);
      stageReview(opts);
      stagePublish(opts);
    } else if (stages[opts.stage]) {
      stages[opts.stage](opts);
    } else {
      console.error(`Unknown stage: ${opts.stage}. Use: manifest, write, review, publish, or all.`);
      process.exit(1);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Pipeline complete in ${elapsed}s`);

    // Append to log
    fs.appendFileSync(
      path.join(LOGS_DIR, "pipeline.log"),
      `${logLine} — completed in ${elapsed}s\n`
    );
  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`\n❌ Pipeline failed after ${elapsed}s:`, err.message);
    fs.appendFileSync(
      path.join(LOGS_DIR, "pipeline.log"),
      `${logLine} — FAILED after ${elapsed}s: ${err.message}\n`
    );
    process.exit(1);
  }
}

main();
