# SEO Strategy

Official guidance re-checked on 2026-10-15 (Google Search Central updates through October 2026). Internal SEO
quality scores are never shown publicly. Rankings and indexing are never promised.

## Architecture

- Static generation for every content route (67 prerendered routes); only `/api/contact` and `/indexnow.txt` are dynamic.
- Critical content is HTML. The 3D canvas is `aria-hidden` and has a text equivalent (layer captions + panels).
- Clean, descriptive, stable URLs; services organised **by intent**, never by geography.
- Filters/search on `/work` and `/reviews` are client-side state only — no indexable filter URLs.

## Indexation rules (`lib/metadata.ts`, `app/robots.ts`, `app/sitemap.ts`, `next.config.ts`)

| Environment (`SITE_ENV` / `VERCEL_ENV`) | robots.txt | Meta robots | X-Robots-Tag | Sitemap |
| --- | --- | --- | --- | --- |
| `production` | Allow `/`, disallow `/api/`, `/brand` | index, follow (+ large image previews) | — | 26 URLs |
| anything else (preview, staging, dev) | Disallow `/` | noindex, nofollow | `noindex, nofollow` | empty |

Always `noindex, follow` (even in production): case files (evidence-limited), draft articles, brand kit, 404.
Canonical URLs come from `NEXT_PUBLIC_SITE_URL` (owner must confirm the domain).

**Verified on a local production-mode build:** robots.txt, 26-URL sitemap, HSTS, canonical tags, case files and
drafts `noindex, follow`. Lighthouse SEO = **100** on `/`, `/services/shopify-cro`, `/about`.

## Structured data policy (`lib/schema.ts`)

| Type | Where | Why |
| --- | --- | --- |
| Person + WebSite | every page (root layout) | Entity definition; `sameAs` = verified profiles only |
| ProfilePage | `/about` | Page about one person (mainEntity → Person) |
| BreadcrumbList | inner pages | Visible breadcrumbs |
| Service | each service page | Describes the visible offer; provider → Person |
| Article | insights **only when published** | Drafts carry none |

Deliberately **not** used: `AggregateRating`/`Review` (reviews live on Fiverr; self-serving review markup is not
appropriate), `FAQPage` (Google deprecated the FAQ rich result in May 2026 and removed the docs in June 2026).
Visible FAQs remain for users.

## Metadata quality gates (tests)

Titles ≤ 60 chars (with brand suffix), descriptions 100–170 chars, unique titles/descriptions, every metadata entry
maps to a real page, no geo-doorway slugs — enforced in `tests/content/structure.test.ts`.

## Open Graph

File-based `opengraph-image` per route family (home, services, case studies, insights), generated with `next/og`
from brand tokens; `twitter:card = summary_large_image`.

## AI search

Google: no special markup or files are needed for AI Overviews/AI Mode; llms.txt is not used by Google Search
(June 2026). No llms.txt was added for SEO. Focus: crawlable HTML, internal linking, non-commodity content,
consistent entity data.

## Search engine setup (after launch — owner authorisation required)

1. **Google Search Console:** add a Domain property (DNS TXT), submit `https://<domain>/sitemap.xml`, inspect `/`.
2. **Bing Webmaster Tools:** import from Search Console or verify via DNS; submit the sitemap.
3. **IndexNow (Bing, Yandex, Seznam, Naver…):** set `INDEXNOW_KEY` in Vercel, deploy, then run
   `INDEXNOW_KEY=… NEXT_PUBLIC_SITE_URL=https://<domain> SITE_ENV=production npx tsx scripts/indexnow.ts`.
   The key file is served at `/indexnow.txt`. IndexNow is a crawl hint, not an indexing guarantee.
4. Monitor coverage, Core Web Vitals and queries (see POST-LAUNCH.md).

## Off-site (entity) actions

Align Fiverr display name/bio, create LinkedIn with the same name/title/link, link every profile back to the
website. No purchased links, no directories spam, no mass AI content.
