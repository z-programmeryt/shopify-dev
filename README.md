# Ring Lot Morong — Digital HQ

Personal brand, proof engine, portfolio and lead system for **Ring Lot Morong, Shopify Developer & Designer**.
Built on the idea that every claim must have a source: the site shows only platform-verified figures, verbatim
client reviews and clearly labelled self-reported records — enforced by tests.

> **Status:** production-ready code; launch requires owner decisions (domain, lead delivery, article review) —
> see [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md).

## Stack

Next.js 16 (App Router, Turbopack, static generation) · React 19 · TypeScript (strict) · Tailwind CSS 4 (CSS-first
tokens) · React Three Fiber + three.js (lazy 3D) · zod (server-only validation) · pdf-lib (résumé PDF) · Vitest.
No database, no CMS, no animation library, no analytics by default.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint + tests + production build
npm run test         # 174 tests incl. the claim firewall
npm run docs:ledger  # regenerate docs/TRUTH-LEDGER.md and docs/KEYWORD-MAP.md from /data
```

Copy `.env.example` to `.env.local` for local configuration. Key variables: `NEXT_PUBLIC_SITE_URL`, `SITE_ENV`
(`production` enables indexing — everything else is noindex), lead delivery (`RESEND_*`, `LEAD_*`), optional
Plausible and IndexNow.

## Architecture

```
app/            routes (App Router) — pages, API, sitemap/robots/manifest, OG images, brand kit, résumé PDF
components/     UI by domain: layout, home, engine (3D + SVG), proof, work, process, contact, lab, assistant, ui
data/           single source of truth — identity, professional, services, skills, social-profiles, projects,
                case-studies, testimonials, articles, seo, site-config, truth-ledger, engine, process, lab, brand
lib/            metadata, JSON-LD, content graph, lead pipeline, email templates, rate limit, résumé (web + PDF), OG renderer
tests/          claim firewall, content graph + SEO gates, lead/API, assistant/SEO/résumé
docs/           research → launch documentation (19 documents)
scripts/        ledger/keyword doc generator, IndexNow submitter, browser QA
```

**Truth engine:** `data/truth-ledger.ts` lists every claim with source, status and publishability. Public data
references ledger IDs; `tests/content/claims.test.ts` fails the build on non-publishable references or forbidden
marketing claims (inflated counts, revenue, years, "10x", certifications, superlatives).

**Commerce Engine:** the signature 3D object (Design → Development → Performance → UX → CRO → Conversion). SVG first
(server-rendered), WebGL only on capable devices after idle, paused off-screen, 2D/3D toggle, reduced-motion safe.

## Routes

`/` · `/about` · `/services` + 9 service pages · `/work` · `/case-studies` + case files · `/industries` · `/process` ·
`/skills` · `/proof` · `/reviews` · `/insights` + articles · `/lab` · `/links` · `/contact` · `/resume` (+ PDF) ·
`/privacy` · `/terms` · `/brand` (internal, noindex) · custom 404.

## Documentation

[Research](docs/RESEARCH.md) · [Truth ledger](docs/TRUTH-LEDGER.md) · [Identity graph](docs/IDENTITY-GRAPH.md) ·
[Account audit](docs/ACCOUNT-AUDIT.md) · [Project inventory](docs/PROJECT-INVENTORY.md) · [Project DNA](docs/PROJECT-DNA.md) ·
[Brand strategy](docs/BRAND-STRATEGY.md) · [Positioning](docs/POSITIONING.md) · [SEO strategy](docs/SEO-STRATEGY.md) ·
[Keyword map](docs/KEYWORD-MAP.md) · [Entity SEO](docs/ENTITY-SEO.md) · [Content strategy](docs/CONTENT-STRATEGY.md) ·
[Conversion strategy](docs/CONVERSION-STRATEGY.md) · [Performance budget](docs/PERFORMANCE-BUDGET.md) ·
[Security audit](docs/SECURITY-AUDIT.md) · [Accessibility audit](docs/ACCESSIBILITY-AUDIT.md) · [QA report](docs/QA-REPORT.md) ·
[Launch checklist](docs/LAUNCH-CHECKLIST.md) · [Post-launch](docs/POST-LAUNCH.md)

## Licences

Fonts: Instrument Sans, Instrument Serif, JetBrains Mono — SIL Open Font License (see `app/fonts`, `assets/fonts`).
Site code and Commerce Engine visuals are original work for this project.
