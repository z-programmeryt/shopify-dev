# Accessibility Audit

Target: WCAG 2.2 AA. Date: 2026-10-15.

## Automated

- Lighthouse accessibility: **100** on `/`, `/work`, `/services/shopify-cro`, `/contact`, `/lab`, `/case-studies/jewelry-store`,
  `/insights/meta-pixel-…`, desktop `/`, `/work`, `/lab`.
- Route crawl (36 routes): exactly one `<h1>` per page, no images without `alt`, valid JSON-LD, no console errors.

Issues found and fixed during the audit:

| Issue | Fix |
| --- | --- |
| `subtle` text #7D889C = 3.3:1 on paper | Token → #5F6B82 (4.96:1 paper, 4.58:1 paper-2, 5.37:1 white) |
| Teal badge text 3.2:1 | New `teal-700` #13777B (5.3:1) for text on light |
| Amber "draft" labels 3.9:1 | Token → #965A00 (5.2:1) |
| White on emerald-600 badges 4.08:1 | Use emerald-700 (5.3:1) |
| Page H1s hidden until hydration (reveal animation) | Above-the-fold headers never use reveal (also fixed LCP) |

## Manual checks implemented

- **Landmarks & structure:** skip link → `main#main`; header/nav/main/footer; breadcrumbs `nav[aria-label]` with `aria-current`.
- **Keyboard:** all interactive elements are native buttons/links; visible `:focus-visible` ring (emerald, 3px offset);
  mobile menu and assistant close on `Esc` and return focus; assistant traps Tab while open; knowledge-graph nodes
  are focusable with the same highlighting as hover.
- **Forms:** every input has a `<label>`; hints and errors linked via `aria-describedby`; `aria-invalid` on errors;
  errors announced with `role="alert"`; success screen receives focus (`role="status"`); choice chips are real
  radio/checkbox inputs (visually hidden) with focus rings.
- **Motion:** `prefers-reduced-motion` disables animations and selects the static SVG engine; users can switch 3D→2D
  manually (persisted).
- **3D:** canvas is `aria-hidden`; the same information is in HTML (layer panels, captions, status line with
  `aria-live="polite"`).
- **Semantic cursor:** decorative, native cursor kept, fine pointers only.
- **Voice:** explicit activation, visible listening state with Stop, keyboard fallback, no recording stored.
- **Colour:** information never conveyed by colour alone (badges carry text labels: VERIFIED, SELF-REPORTED…).
- **Language:** `<html lang="en">`.

## Known limitations / to verify with assistive tech

- Screen-reader pass (NVDA/VoiceOver) not performed in this environment — recommended before launch.
- Reviews are verbatim, including client spelling; this is intentional for authenticity.
- Country flags are decorative emoji paired with country names (`aria-hidden`).
