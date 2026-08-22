# RealLyfe Lawyer — Next.js

Migrated from WordPress/Elementor. All 53 original pages are here, statically generated —
verified with a full production build (`next build` → 60/60 pages, 0 errors).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project shape

```
app/                     App Router routes — see below
components/
  Header.tsx, Footer.tsx  site chrome
  BlockRenderer.tsx       renders the extracted content JSON (heading, text, faq, stat, etc.)
  ContactForm.tsx         the working contact form (client component)
content/                 the actual copy, as structured JSON (from Phase 1 extraction)
lib/
  types.ts                Block union type — one variant per content block type
  content.ts              typed loaders + lookup helpers (getState, getPracticeAreaCategory, etc.)
```

## Routes

Two sections are **template-driven**, not hand-built per page — this was the whole point of
moving off WordPress for them:

- `/practice-areas/[category]` and `/practice-areas/[category]/[slug]` — reads
  `content/practice-areas.json`, tree-built from the flat array via `parent` id in `lib/content.ts`.
- `/areas-we-serve/[state]` and `/areas-we-serve/[state]/[city]` — reads
  `content/areas-we-serve.json`, which stores one template + a small states/cities array rather
  than 14 near-duplicate pages.

Everything else (`/about/[slug]`, `/resources/[slug]`, `/[legalSlug]`) follows the same
pattern: one dynamic route per section, `generateStaticParams` from the matching JSON file.

`/blog` is a real top-level route (matches the live site's URL, even though the page lives
under "Resources" in the nav) — see `app/blog/page.tsx`.

## Contact form

`components/ContactForm.tsx` posts to `app/api/contact/route.ts`, which currently just
`console.log`s the submission. **Before launch**, wire it to real email delivery — the route
file has a commented example using [Resend](https://resend.com). You'll need an API key and
a verified sending domain.

## Content gaps carried over from the original site

These aren't migration bugs — they were already gaps in the live WordPress site (see the
Phase 1 README for the full list). The ones that show up visibly in this build:

- Testimonials (`testimonial-carousel` / `testimonial-placeholder` blocks) are placeholder
  copy — `[TESTIMONIAL]`, `[CLIENT NAME]`, etc. Rendered with a dashed gold border and a
  "Needs real data" label so they're easy to find and replace.
- Attorney credentials, awards, media mentions, and community involvement are unfilled
  placeholders, same visual treatment.
- Whitepaper "Download Now" buttons currently link to `/contact` — no PDFs or email capture
  exist yet.

Search the codebase for `-placeholder` block types or grep `content/*.json` for `[` to find
every remaining placeholder.

## Design tokens

Pulled directly from the original Elementor kit (`content/design-tokens.json`) and wired into
`tailwind.config.ts`: dark canvas (`#0A0A0A`), acid-green primary (`#FAFF69`), Inter typeface.
Gold (`#D4AF37`) was a recurring decorative accent in the original site's custom widgets
(testimonials, map, FAQ icon) — promoted to a proper token here rather than a one-off.

## Deploying

Zero-config on [Vercel](https://vercel.com) — connect the repo and it'll detect Next.js
automatically. Netlify and Cloudflare Pages also work well for a static-heavy App Router site
like this one.

## What's not done yet

- Real content for every placeholder listed above
- Blog: only 1 draft post existed in WordPress; there's no CMS wired up here yet. If you want
  to add posts regularly, consider MDX files in the repo (simplest, git-based) vs. a headless
  CMS (Sanity, Contentful) if you'll want a proper editing UI later.
- Images: currently linked straight to the old `reallyfelawyer.online` WordPress media
  library (already allow-listed in `next.config.js`). Worth migrating them into this repo's
  `public/` folder (or a CDN) before fully retiring WordPress.
- SEO metadata is minimal (title only, per-page) — add descriptions and Open Graph tags before
  launch.
- `sitemap.xml` / `robots.txt` — not generated yet; Next.js supports this natively via
  `app/sitemap.ts` / `app/robots.ts`.
