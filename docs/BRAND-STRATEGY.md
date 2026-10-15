# Brand Strategy & Visual System

## Personality

Technical · commercial · premium · calm · intelligent. Quality benchmarks (not templates): Apple-level restraint,
Stripe-level clarity, Linear-level interaction quality. Nothing is copied from them, from Shopify or from competitors.

## Voice

- First person singular on identity copy ("I design and build…"); third person on proof pages ("Ring Lot reviews…").
- Specific scope over adjectives. Never: "10x", "guaranteed results", "world's best", "#1", "ultimate expert", guru language.
- No response-time or availability promises (unknown). No prices on the site (owner decision).

## Signature object — the Commerce Engine

Six stacked plates, one per layer of a working store: **Design → Development → Performance → UX → CRO → Conversion.**
Each plate shows what that layer *is* (storefront grid, code fragments, gauge + analytics nodes, UI cards + CTA,
A/B bars, conversion node); data particles flow down into one conversion node. It is functional, not decorative:

- Homepage: pinned beside the layer walkthrough — the focused layer slides out and plates separate on scroll; each
  layer links to its service.
- Process page: the 2D engine evolves step by step (each step lights the layer it moves forward).
- Every surface reuses it: 404, OG images, banners, favicon (monogram + node).

Tiers: HIGH / MEDIUM / LOW (WebGL, lazy, idle-loaded) and FALLBACK (SVG — phones, reduced motion, save-data, no WebGL).
User toggle: "Use 2D / Try 3D".

## Tokens (`app/globals.css` → `@theme`)

| Role | Token | Value |
| --- | --- | --- |
| Primary | navy-900 / navy-950 | #0A1630 / #050B1A |
| Secondary | emerald-700 (text on light) / emerald-400 (on dark) | #0B7A57 / #3CC594 |
| Accent | teal-400 (data flow) / teal-700 (text) | #45C2C2 / #13777B |
| Base | paper / white | #F7F6F2 / #FFFFFF |
| Text | ink / muted / subtle | #0B1222 / #50607A / #5F6B82 |
| Lines | line / line-strong | #E3E6EC / #CDD3DD |

Tailwind's default palette is reset (`--color-*: initial`) so only brand tokens exist.

**Type:** Instrument Sans (display + text, variable), JetBrains Mono 500 (labels), Instrument Serif italic (accents).
Fluid scale: display `clamp(3rem, 8.2vw, 7.25rem)`, h1, h2, h3, lead, mono label (0.7rem, 0.14em tracking, uppercase).

**Motion:** micro 160ms · UI 320ms · section 720ms; easing `cubic-bezier(0.16,1,0.3,1)`. Hero is static except the
engine; reveal-on-scroll never applies to above-the-fold content; `prefers-reduced-motion` disables animation.

**Avoided by design:** neon, cyberpunk, rainbow gradients, glassmorphism, oversized glowing text, particle storms,
an oversized Shopify logo.

## Components (reusable)

Header · NavLinks · MobileNav · Footer (studio signature) · LinkButton · SectionHeader · PageHero · Breadcrumbs
(+JSON-LD) · ProofBadge · ConfidenceBadge · SourceLink · Notice · Chip · ReviewCard · RatingBreakdown · ProofWall ·
ProjectCard · ProjectCover · WorkExplorer · KnowledgeGraph · ProcessJourney · IntakeForm · StoreTeardown · CroLab ·
CommerceEngine · EngineScene · EngineFallback · AssistantLauncher/Panel · SemanticCursor · ArticleBody · JsonLd.

## Asset kit (`/brand`, noindex)

Generated from the same tokens/copy (`data/brand.ts`, `lib/og.tsx`): OG image 1200×630 · LinkedIn banner 1584×396
(avatar-safe) · social banner 1500×500 · avatar monogram 800×800 · project thumbnail 1200×750 · résumé cover
1240×1754 · presentation cover 1920×1080 · plain-text email signature. Favicon: `app/icon.svg`; Apple icon generated.
