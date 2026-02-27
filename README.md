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
