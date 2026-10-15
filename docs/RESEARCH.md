# Research — Ring Lot Morong (Phases 0–3)

**Date verified:** 2026-10-15 · **Method:** public web search + direct page fetches + GitHub API. No logins, no private data, no scraping behind authentication.

## Phase 0 — Repository & environment audit

| Item | Finding |
| --- | --- |
| Repository | `z-programmeryt/shopify-dev`, greenfield — only `README.md` (`# shopify-dev`). Nothing to preserve or migrate. |
| Owner account | `z-programmeryt` (12 public repos). A previous portfolio (`Web-Application-Security-Tester-Portfolio`) used Next.js 16.3 + R3F + Tailwind 4 and was deployed on Vercel — the same stack family was adopted for consistency. |
| Toolchain | Node 22.22, npm 10.9; 2 CPUs, 3.8 GiB RAM — builds kept lean (Turbopack, no heavy plugins). |
| Network constraints | Build cannot reach Google Fonts ⇒ fonts are self-hosted (SIL OFL) from npm packages, subset with fonttools. |

## Phase 1 — Identity research

Queries run (exact and variant forms): `"Ring Lot Morong"`, `"Ringlot Morong"`, `ringlotmorong`, `"ringlot465"`, `"Ringlot" Shopify`, `"Ecom R" Fiverr`, `Ringlot Shopify GemPages PageFly`, plus platform-scoped searches (LinkedIn, Behance, Upwork, Facebook, Instagram, YouTube) and GitHub username lookups (`ringlot`, `ringlotmorong`, `ringlot465`, `ringlotm`, `ring-lot-morong`, `ringlot-morong`).

### Findings

1. **Fiverr — verified primary identity.** `fiverr.com/ringlot465`, display name "Ecom R", headline "Full Stack Shopify Web Designer and eCommerce Pro!", Level 2, 4.9 from 143 reviews, member since Dec 2021, Bangladesh, Bengali/English. Bio and gigs self-identify as "RINGLOT" and describe GemPages/PageFly CRO and funnel pages — matching the owner brief.
2. **Domain `ringlotmorong.com`** — listed in a public new-registration feed for 2025-08-05. No site responded when fetched; DNS did not resolve from the sandbox. Ownership unconfirmed (TL-060).
3. **GitHub `@ringlot`** — created 2017, one `simple-calculator` repo, no profile data. "Ringlot" is also a European surname (Ancestry lists ~3k census records). **Rejected** — no cross-links (TL-061).
4. **Not found:** LinkedIn, Behance (`behance.net/ringlotmorong` → 404), Upwork, Instagram, Facebook, YouTube. Search results for "Ring Lot Morong" are dominated by unrelated topics (Morong, Rizal; jewelry "ring lots"; Tolkien's *Morgoth's Ring*).

### Name variants observed

| Variant | Where | Use on site |
| --- | --- | --- |
| Ring Lot Morong | Owner brief, domain | Canonical display name |
| Ringlot / RINGLOT | Fiverr bio, gig sign-offs | `alternateName` |
| Ringlot Morong | Domain spelling | `alternateName` |
| Ecom R | Fiverr display name | Handle reference only (not a personal name) |

## Phase 2 — Accounts

See `ACCOUNT-AUDIT.md` and `IDENTITY-GRAPH.md`. Only Fiverr is verified.

## Phase 3 — Projects & proof

- **Fiverr portfolio:** 9 entries (Beauty Products store, Allairds, CRATES responsive store, Beekind jewelry, Facebook Shop, Instagram Shop, NAJA, Pawfecthouse, Mobile-friendly store). Image asset timestamps place uploads in July–August 2023; one entry is dated "From: January 2024" with cost band $100–$200 and 1–7 days.
- **Live-store search:** "Allairds" — no store found (results are Allbirds). "Beekind" — several unrelated stores (beekind.shop, shopbeekind.com, a local shop). "Pawfect House" — a large established brand (3.5k Trustpilot reviews) plus clones. **No attribution can be established ⇒ no live links** (TL-050).
- **Gigs (6 listed, 4 reviewed):** store build 4.8 (55), tracking 5.0 (20), Shopify website build 4.9 (4), landing pages 5.0 (4).
- **Reviews collected:** 15 verbatim public reviews (US, Canada, UAE, Morocco, Mauritania); 11 marked "Ongoing collaboration"; price bands $50–$800; durations 1 day–8 weeks.

## Claims discovered that conflict (see TRUTH-LEDGER.md)

"Since 2019" vs "7+ years" (2023) · "200+ clients" vs "500+ clients" · "100+ stores" vs "700 projects" vs "500+ landing pages" · "$300k for one client" · "$50M generated" · "Certified Shopify experts". None are published.

## External guidance checked (current as of 2026-10-15)

- Google deprecated the FAQ rich result (May 2026) and removed its documentation (June 2026) ⇒ no FAQPage markup.
- Google: llms.txt is not used by Search and neither helps nor harms (June 2026) ⇒ not added for SEO.
- Google: generative-AI content guidance updated (Oct 2026) — accuracy review before publication ⇒ articles gated behind owner review.
- Google AI features: no special markup; standard technical SEO + helpful content.

## Limitations

- Fiverr pages can change; every platform figure carries the verification date.
- Relative review dates ("1 year ago") are shown as listed on the verification date.
- The owner should supply any profiles that exist but are not publicly discoverable.
