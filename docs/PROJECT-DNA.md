# Project DNA

Every portfolio record and case study is generated from one typed structure (`data/projects.ts`,
`data/case-studies.ts`). Pages, the work explorer, the knowledge graph, the résumé and OG images all read it.

```ts
type ProjectDNA = {
  title: string
  industry: string
  platform: string
  role: string
  contribution: string[]
  challenge: string | null      // null = not documented (never guessed)
  solution: string | null
  services: string[]            // service slugs → /services/[slug]
  technologies: string[]
  evidence: { label: string; url: string }[]
  outcomes: string[]            // empty until a client-verified metric exists
  liveUrl?: string              // only with attribution proof
  screenshots: string[]         // only with client permission
  timeline?: string
  confidence: 'high' | 'medium' | 'low'
  authenticity: { owner; source; publicUrl; attribution; permission; evidence[]; confidence }
}
```

The brief's type has `challenge`/`solution` as required strings; here they are nullable so that missing
information is represented honestly instead of filled with assumptions.

## Current records (summary)

| Slug | Industry | Role | Services | Confidence | Case file |
| --- | --- | --- | --- | --- | --- |
| pawfecthouse-personalized-store | Personalized products | Designer & developer | design, development, landing pages | medium | ✓ |
| allairds-fashion-store | Fashion & apparel | Designer & developer | design, development, performance | medium | ✓ |
| beekind-jewelry-store | Jewelry | Designer | design, performance | medium | ✓ |
| beauty-products-store | Beauty & cosmetics | Designer & developer | design, development, theme customization | medium | — |
| crates-clothing-store | Fashion & apparel | Designer & developer | development, design | medium | — |
| facebook-shop-setup | Social commerce | Setup specialist | tracking | medium | — |
| instagram-shop-setup | Social commerce | Setup specialist | tracking | medium | — |
| naja-store | General | Designer | design | low | — |
| mobile-friendly-store | General | Developer | performance, theme customization | low | — |

## Case study format (20 sections)

Overview · Context · Industry · Problem · Goal · Audience · Constraints · Role · Responsibilities · Strategy ·
Information architecture · Design decisions · Technical implementation · Shopify customization · Apps &
integrations · Performance · Accessibility · Results · Evidence · Lessons. A section renders **only** when
documented; the rest appear as "Pending owner or client input". Optional modules: "Why this design?"
(problem → user need → business goal → decision → expected effect), Engineering notes, Design notes.

Status `case-file` = evidence-limited ⇒ `noindex`, excluded from sitemap. Status `published` = complete,
owner-approved ⇒ indexable.

## Upgrading a case file to a case study

1. Collect facts from Ring Lot/client: problem, goal, audience, constraints, what was built (theme, sections, apps),
   design decisions with reasons, before/after evidence and measurement method.
2. Add each as a `CaseSection` in `data/case-studies.ts`; remove it from `pending`.
3. Add screenshots only with permission (`public/work/<slug>/…`, optimised AVIF/WebP via `next/image`).
4. Add ledger entries for any metric (source, method, date, permission).
5. Set `status: 'published'`; run `npm run check`.
