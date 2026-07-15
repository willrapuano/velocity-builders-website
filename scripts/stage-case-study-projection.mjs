import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

const inputPath = valueAfter("--input");
if (!inputPath) throw new Error("Usage: npm run case-studies:stage -- --input <release.json> [--dry-run]");
const dryRun = process.argv.includes("--dry-run");
const envelope = JSON.parse(await readFile(inputPath, "utf8"));
const projection = envelope.public_projection ?? envelope.publicProjection ?? envelope.projection;
const expectedHash = envelope.projection_sha256 ?? envelope.projectionSha256;
assertProjection(projection, expectedHash);

const document = {
  _id: `drafts.rebuilder-case-study-${projection.sourceCaseStudyId}`,
  _type: "caseStudy",
  projectionSchemaVersion: projection.schemaVersion,
  sourceCaseStudyId: projection.sourceCaseStudyId,
  sourceVersionId: projection.sourceVersionId,
  projectionSha256: expectedHash,
  title: projection.title,
  slug: { _type: "slug", current: projection.slug },
  publicClientLabel: projection.publicClientLabel,
  summary: projection.summary,
  challenge: projection.challenge,
  approach: projection.approach,
  outcome: projection.outcome,
  verifiedMetrics: projection.verifiedMetrics.map((metric) => ({ ...metric, _key: metric.key })),
  compliance: projection.compliance.map((item) => ({ ...item, _key: item.key })),
  releasedAt: projection.releasedAt
};

if (dryRun) {
  console.log(JSON.stringify(document, null, 2));
} else {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) throw new Error("SANITY_API_TOKEN is required to stage a projection draft.");
  const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xifumfa3",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2026-07-15", token, useCdn: false });
  await client.createOrReplace(document);
  console.log(`Staged ${document._id}. Review and publish it manually in Sanity Studio.`);
}

function assertProjection(value, expectedHash) {
  if (!value || typeof value !== "object") throw new Error("Release file is missing a public projection.");
  if (value.schemaVersion !== "rebuilder-case-study-projection-v1") throw new Error("Unsupported projection schema.");
  for (const field of ["sourceCaseStudyId", "sourceVersionId", "slug", "title", "summary", "challenge", "approach", "outcome", "releasedAt"]) {
    if (typeof value[field] !== "string" || !value[field]) throw new Error(`Projection is missing ${field}.`);
  }
  if (!Array.isArray(value.verifiedMetrics) || !value.verifiedMetrics.length) throw new Error("Projection requires verified metrics.");
  if (!Array.isArray(value.compliance) || !value.compliance.length) throw new Error("Projection requires locked compliance language.");
  if (!/^[a-f0-9]{64}$/.test(expectedHash || "")) throw new Error("Release is missing a valid projection SHA-256.");
  if (sha256(canonicalJson(value)) !== expectedHash) throw new Error("Projection hash mismatch; refusing to stage altered content.");
}
function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function valueAfter(flag) { const index = process.argv.indexOf(flag); return index >= 0 ? process.argv[index + 1] : null; }
