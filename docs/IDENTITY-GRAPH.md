# Identity Graph

Source of truth in code: `data/social-profiles.ts` (nodes) and `data/identity.ts` (entity). Only nodes with
`showPublicly: true` render on the site and in JSON-LD `sameAs`. **Last verified: 2026-10-15.**

## Entity

| Field | Value | Ledger |
| --- | --- | --- |
| Canonical name | Ring Lot Morong | TL-001 (owner-confirmed) |
| Alternate names | Ringlot Morong, Ringlot | TL-001/TL-002 |
| Role | Shopify Developer & Designer | TL-003 |
| Country | Bangladesh (city not public) | TL-004 |
| Languages | English, Bengali | TL-005 |
| Canonical URL (candidate) | https://ringlotmorong.com — **owner must confirm** | TL-060 |

## Nodes

| Platform | URL | Username | Identity confidence | Status | Purpose | Evidence | Last verified | Branding consistency | Show publicly |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fiverr | https://www.fiverr.com/ringlot465 | ringlot465 ("Ecom R") | High | Verified | Services, reviews, portfolio, contact | Bio + gigs self-identify as RINGLOT; services match owner brief | 2026-10-15 | Partial — display name "Ecom R", conflicting numbers in bio | **Yes** |
| Personal website | https://ringlotmorong.com | — | Low | Candidate | Canonical identity hub | Registration feed (2025-08-05) only | 2026-10-15 | Reference design | No (until confirmed) |
| GitHub | https://github.com/ringlot | ringlot | None | Do not use | — | 2017 account, 1 repo, no profile data; common surname | 2026-10-15 | None | No |
| LinkedIn | — | — | None | Not found | — | Searched name/handle variants | 2026-10-15 | — | No |
| Behance | — | — | None | Not found | — | `behance.net/ringlotmorong` → 404 | 2026-10-15 | — | No |
| Upwork | — | — | None | Not found | — | Searched | 2026-10-15 | — | No |
| Instagram | — | — | None | Not found | — | Searched | 2026-10-15 | — | No |
| Facebook | — | — | None | Not found | — | Searched | 2026-10-15 | — | No |
| YouTube | — | — | None | Not found | — | Searched | 2026-10-15 | — | No |

## Merge rules applied

A profile is merged into the entity only when **at least two** of: matching photo, matching bio/services,
reciprocal cross-links, owner confirmation. Only Fiverr met the bar (self-identification + service match +
owner brief). GitHub `@ringlot` met none and was rejected.

## How to add a profile

1. Owner supplies the URL.
2. Verify: same name/photo/bio, and add a link back to the website from the profile.
3. Add a node in `data/social-profiles.ts` with `status: 'verified'`, `showPublicly: true`, and a ledger entry.
4. Tests confirm only verified nodes appear in `sameAs`.

## Target graph (after owner actions)

```
ringlotmorong.com (canonical) ── sameAs ──▶ Fiverr ─┐
        ▲                              LinkedIn ────┤ each profile links back to the website
        └──────────── link back ◀────── GitHub ─────┘ (only if real and maintained)
```
