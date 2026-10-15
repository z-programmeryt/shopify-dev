# Performance Budget

The site is described as fast **only where measured**. Lab numbers below come from Lighthouse 13 (headless
Chromium 14x, `next start` production build) on 2026-10-15. Field data (CrUX / Search Console) must confirm after launch.

## Budgets

| Metric | Budget | How enforced |
| --- | --- | --- |
| LCP | ≤ 2.5 s (mobile, simulated slow 4G) · ≤ 1.0 s desktop | Hero = HTML text; no JS/animation gating above the fold |
| CLS | ≤ 0.05 | `next/font` metric-matched fallbacks; fixed media ratios |
| INP | ≤ 200 ms (field) | Small client islands; one delegated click listener; 3D paused off-screen |
| TBT (lab proxy for INP) | ≤ 150 ms mobile | Lazy 3D/assistant/cursor; no third-party scripts by default |
| TTFB | ≤ 600 ms | Static prerendering + CDN |
| FCP | ≤ 1.5 s mobile | Inline critical path: 1 CSS file, 1 preloaded font |
| Initial JS (modern browsers) | ≤ 170 KB gz | Framework ≈ 120 KB; site code ≈ 25–30 KB |
| 3D chunk | ≤ 260 KB gz, never on the critical path | `next/dynamic` + idle + in-view + capable tier only |
| Fonts | ≤ 3 files, ≤ 70 KB total, 1 preloaded | Subset to Latin + used punctuation (fonttools) |

## Measured — mobile (Moto G-class, simulated slow 4G, 4× CPU)

| Route | Perf | A11y | Best pr. | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 98 | 100 | 100 | 1.39 s | 2.21 s | 53 ms | 0 |
| `/work` | 94 | 100 | 100 | 1.37 s | 2.82 s | 114 ms | 0 |
| `/services/shopify-cro` | 98 | 100 | 100 | 1.37 s | 2.20 s | 97 ms | 0 |
| `/contact` | 97 | 100 | 100 | 1.22 s | 2.61 s | 63 ms | 0 |
| `/lab` | 98 | 100 | 100 | 1.37 s | 2.22 s | 93 ms | 0 |
| `/case-studies/jewelry-store` | 95 | 100 | 100 | 1.37 s | 2.79 s | 98 ms | 0 |
| `/insights/meta-pixel-…` | 98 | 100 | 100 | 1.36 s | 2.18 s | 84 ms | 0 |

## Measured — desktop

| Route | Perf | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 97 | 0.38 s | 0.58 s | 105 ms* | 0 |
| `/work` | 100 | 0.39 s | 0.62 s | 0 ms | 0 |
| `/lab` | 100 | 0.39 s | 0.60 s | 0 ms | 0 |

\* Home desktop TBT includes the idle-loaded WebGL scene initialising (software rendering in the test machine).
SEO scored 66 in preview runs only because the preview is deliberately `noindex`; production-mode SEO = 100.

**Honest reading:** observed LCP equals FCP (≈130–175 ms unthrottled) — nothing blocks the hero. Simulated mobile LCP
(2.2–2.8 s) is Lighthouse's pessimistic estimate that counts every byte requested before first paint (mostly the
React/Next runtime). Three routes sit slightly above the 2.5 s lab budget; field data decides. Next lever if needed:
fewer bytes before first paint (route-level code splitting is already maximal; remaining weight is framework).

## Bundle (production build)

| Asset | Size (gzip) | Loaded |
| --- | --- | --- |
| Framework + app initial JS (modern browsers) | ≈ 149 KB | Every page (async, non-blocking) |
| Legacy polyfills | 38.5 KB | `nomodule` only — skipped by modern browsers |
| WebGL Commerce Engine (three + R3F + scene) | ≈ 237 KB | Desktop/tablet capable devices, after idle, in view |
| CSS | 10.5 KB | Every page |
| Instrument Sans (variable, subset) | 26.8 KB | Preloaded |
| JetBrains Mono 500 (subset) / Instrument Serif italic (subset) | 18.8 KB / 19.7 KB | On demand, `font-display: swap` |
| Assistant panel + knowledge base | lazy | Only when "Ask Ring Lot" is opened |
| Semantic cursor | lazy | Fine pointers, motion allowed, after idle |

Removed during review: `lucide-react` (unused). No animation library (CSS + IntersectionObserver instead of
GSAP/Framer Motion), no MDX runtime, no drei/postprocessing, zod server-only.

## 3D strategy

SVG engine renders first (server HTML) → tier detection (reduced motion, save-data, slow connection, coarse pointer
< 820 px, WebGL2, cores/memory) → idle → dynamic import → first frame → crossfade. Off-screen = `frameloop="never"`.
HIGH (DPR ≤ 2, 220 particles) · MEDIUM (DPR ≤ 1.5, 130) · LOW (DPR 1, 60, reduced detail) · FALLBACK (SVG).

## Re-measure

```bash
npm run build && npm start   # production server
npx lighthouse http://localhost:3000/ --preset=desktop
npx lighthouse http://localhost:3000/            # mobile (default)
```
