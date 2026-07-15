# Case-study staging publication runbook

This runbook is only for a shared, non-production acceptance environment. It
does not authorize a production deployment, a production Sanity mutation, or a
merge. REbuilder remains authoritative; Sanity stores a downstream public
projection.

## Preconditions

Record these identifiers in the acceptance log before changing external state:

- REbuilder branch, commit, preview project, and preview URL
- website branch, commit, preview project, and preview URL
- Supabase project name/reference explicitly classified as non-production
- private Sanity dataset explicitly classified as non-production
- projection SHA-256 and REbuilder release identifier
- operator responsible for publication and rollback

Stop if any target is unnamed, shared with production data, or ambiguously
classified. Preview configuration must use these boundaries:

| Surface | Required staging value |
| --- | --- |
| REbuilder | `CASE_STUDY_OPTIMIZER_SALT` unique to staging |
| REbuilder | `CASE_STUDY_PUBLIC_ORIGIN` equal to the exact website preview origin |
| REbuilder | `REBUILDER_OWNER_KEYS` containing only a staging-scoped owner key |
| Optimizer workstation | matching Keychain secret under service `rebuilder-owner` |
| Website | `NEXT_PUBLIC_REBUILDER_PLATFORM_URL` equal to the REbuilder preview origin |
| Website and Studio | `NEXT_PUBLIC_SANITY_PROJECT_ID` and a private, non-production dataset |
| Website and Studio | a staging-scoped `SANITY_API_TOKEN` |

Do not copy a production optimizer salt, signing secret, Supabase service-role
key, or Sanity dataset into preview configuration.

## Stage a reviewed draft

1. Explicitly release the approved immutable version in REbuilder.
2. Export the projection envelope and record its SHA-256.
3. Validate without writing:

   ```bash
   npm run case-studies:stage -- --input ./case-study-release.json --dry-run
   ```

4. Confirm the dry run contains only approved public prose, verified aggregate
   metrics, exact locked compliance wording, source identifiers, and the
   expected projection hash. It must not contain PII, private evidence, consent
   records, credentials, or unverified claims.
5. Set the explicit non-production dataset and stage the draft:

   ```bash
   npm run case-studies:stage -- --input ./case-study-release.json
   ```

6. In Sanity Studio, open the `drafts.rebuilder-case-study-*` document and
   compare its projection hash with the REbuilder release. The import command
   must not publish it.

## Manual publication

Publication is a separate human action in Sanity Studio:

1. Reconfirm the Studio dataset is the recorded private staging dataset.
2. Reconfirm the title, slug, public identity treatment, verified metrics,
   compliance text, and projection hash against the reviewed export.
3. Select **Publish** in Studio and record the operator and timestamp.
4. Verify the website preview index and detail routes.
5. Verify one view and one engagement event arrive at REbuilder, then replay the
   same browser session and confirm idempotent row counts.

No CLI, import script, scheduled job, optimizer recommendation, or generic blog
publisher may perform the publication action.

## Revocation and manual unpublication

Revocation is intentionally two explicit actions; neither triggers the other:

1. In REbuilder, revoke the latest release with a durable reason. Confirm a new
   feedback request for its projection hash returns HTTP 410.
2. In the recorded staging Sanity Studio dataset, open the matching published
   document and select **Unpublish**. Record the operator and timestamp.
3. Verify the website preview no longer lists the case study and its detail
   route no longer renders published content after cache revalidation.
4. Preserve the resulting draft for audit unless the acceptance owner approves
   deletion. Never edit verified metrics or compliance wording in Sanity; make
   corrections as a new immutable REbuilder version and release.

If Studio unpublication fails, keep the REbuilder release revoked, do not create
another release to work around it, and escalate with the document ID, dataset,
projection hash, and error. The HTTP 410 feedback guard remains the containment
boundary while the public projection is removed.

## Acceptance evidence

The final staging record must contain:

- deployment IDs and preview URLs for both web applications
- migration version and schema inspection output
- projection SHA-256 and Sanity document ID
- publication, revocation, and unpublication timestamps
- redaction and immutable-input inspection results
- signal, proposal, decision, and feedback idempotency counts
- publisher authentication, tenant-scope, and nonce-replay results
- repository verification commands and any unrelated baseline failures

Production promotion requires a new, separately authorized gate.
