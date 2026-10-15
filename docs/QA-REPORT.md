# QA Report

Date: 2026-10-15 · Build: Next.js 16.4.1 (Turbopack), React 19.3, Node 22.22.

## Static checks

| Check | Command | Result |
| --- | --- | --- |
| TypeScript (strict, `noUncheckedIndexedAccess`) | `npm run typecheck` | ✅ 0 errors |
| ESLint (next core-web-vitals + typescript + React Compiler rules) | `npm run lint` | ✅ 0 problems |
| Unit/content tests | `npm test` | ✅ 174 passed (4 files) |
| Production build | `npm run build` | ✅ 67 routes prerendered; 2 dynamic (`/api/contact`, `/indexnow.txt`) |
| Dependency audit (prod) | `npm audit --omit=dev` | ✅ 0 vulnerabilities |

### Test suites

- `tests/content/claims.test.ts` — **claim firewall**: ledger integrity; every public claim reference is publishable;
  forbidden-claim scan over all data and source files (volume counts, revenue, years, "10x", guarantees, superlatives,
  credentials, rating claims, banned email openers); projects have no outcomes/screenshots/live URLs without evidence.
- `tests/content/structure.test.ts` — content graph integrity (all references resolve), case files never render
  pending sections, metadata length/uniqueness, routeSeo ↔ real pages, no geo-doorway slugs.
- `tests/lead.test.ts` — schema validation, summary never fabricates ("Not provided"), email escaping, API: success,
  422 field errors, honeypot/timing silent discard, 403 cross-origin, 415 content type, 429 rate limit.
- `tests/assistant-seo.test.ts` — assistant answers only approved data (pricing/availability without promises,
  honest fallback), no review/rating/FAQ markup, `sameAs` = verified only, JSON-LD escaping, robots/sitemap by
  environment, résumé from master data, valid PDF, WinAnsi sanitising.

## Browser QA (headless Chromium, production server)

Route crawl — 36 URLs: all 200 except the intentional 404 route (returns **404** with the custom page); every page
has exactly one H1, valid JSON-LD, no images without alt, **no console errors, no hydration warnings**.

End-to-end interactions — 11/11 passed:

1. `?intent=landing-page` preselects the landing-page branch
2. Live brief summary reflects inputs ("PageFly", "Not provided")
3. Form submits and shows confirmation with reference (`RL-…`); server logged the deterministic summary
4. Store review requires a store URL
5. Assistant answers pricing from approved data (no numbers)
6. Assistant closes with Escape
7. Work search filters client-side without changing the URL
8. Reviews filter by service (5 tracking reviews)
9. Mobile menu opens (`aria-expanded=true`)
10. Mobile menu closes with Escape
11. Lab teardown hotspot reveals the finding detail

Visual QA (desktop 1440/1280, mobile 390): home hero + engine, engine scroll states, proof wall, work, contact,
service, case file, proof, lab, process; OG image and LinkedIn banner. Issues found and fixed: engine framing on tall
stages (aspect-aware camera fit), clipped SVG labels, 3-column squeeze on `/contact`, mobile engine whitespace,
floating assistant overlap on mobile, proof-strip label wrap, OG node overlap, LinkedIn avatar safe area.

## Lighthouse

See PERFORMANCE-BUDGET.md (mobile perf 94–98, desktop 97–100, accessibility 100, best practices 100, production SEO 100).

## Known issues / accepted

- Simulated mobile LCP 2.6–2.8 s on 3 routes (lab estimate; observed LCP = FCP). Monitor field data.
- `THREE.Clock` deprecation warning originates inside @react-three/fiber (dev console only); harmless.
- Dev-only `braces` advisory (no patched release) — see SECURITY-AUDIT.md.
- Screen-reader pass with NVDA/VoiceOver still recommended.
