# Velocity Builders Website

Marketing + automation services website for Velocity Builders, LLC. Built with Next.js (App Router), Tailwind, and optional Sanity CMS content sourcing.

## Stack

- Next.js 15 / App Router
- Tailwind CSS with custom theme
- Optional Sanity content (`velocitySite` document) via `@sanity/client`
- Contact form posts to `/api/contact` (extend with SMTP or Make/Zapier)

## Quick start

```bash
npm install
cp .env.example .env.local # fill in Sanity + email credentials if needed
npm run dev
```

Visit http://localhost:3000.

## Content model (Sanity)

The app will use local fallback copy unless the following env vars are provided:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN_VELOCITY=
```

Create a document of type `velocitySite` with the fields shown in `src/data/site.ts` to drive all pages from Sanity.

## Deploy

Deploy to Vercel with a team-scoped token:

```bash
VERCEL_TOKEN=... npm run build
VERCEL_TOKEN=... npx vercel --prod --token $VERCEL_TOKEN
```

Set the following env vars in Vercel:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_TOKEN_VELOCITY`
- `VELOCITY_CONTACT_EMAIL`

## Scripts

- `npm run dev` – local development
- `npm run build` – production build
- `npm run lint` – linting via ESLint

## License

© {current-year} Velocity Builders, LLC. All rights reserved.
## Governed case-study projections

Case studies are not blog posts. Export an explicitly released projection from
the REbuilder dashboard, then stage it as a Sanity draft:

```bash
npm run case-studies:stage -- --input ./case-study-release.json --dry-run
npm run case-studies:stage -- --input ./case-study-release.json
```

The staging command verifies the canonical SHA-256 and only writes a `drafts.*`
document. Review and publish it manually in Sanity Studio. Governed source,
metric, and compliance fields are read-only; corrections originate in REbuilder.
The generic blog publishers fail closed for the `case-studies` category.

Set `NEXT_PUBLIC_REBUILDER_PLATFORM_URL` to the REbuilder application origin to
enable privacy-safe, idempotent view and engagement signals. If it is unset,
the public pages remain functional and emit nothing.
