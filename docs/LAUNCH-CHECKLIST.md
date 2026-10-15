# Launch Checklist

## 1. Owner decisions (blocking — require Ring Lot / the owner)

| # | Decision | Why it matters | Where to change |
| --- | --- | --- | --- |
| 1 | **Confirm the domain** (ringlotmorong.com ownership) | Canonicals, sitemap, OG, JSON-LD use it | `NEXT_PUBLIC_SITE_URL` (Vercel env) |
| 2 | **Lead delivery**: Resend account + verified sending domain, and/or a webhook | Production form returns 503 without a channel (then offers Fiverr) | `RESEND_API_KEY`, `LEAD_FROM_EMAIL`, `LEAD_TO_EMAIL`, `LEAD_WEBHOOK_URL` |
| 3 | **Review the 4 drafted articles** | They stay noindex until reviewed | `data/articles.ts` → `status: 'published'`, `reviewedOn` |
| 4 | Approve display of the 15 verbatim Fiverr reviews (usernames already withheld) | Third-party content | `data/testimonials.ts` |
| 5 | Approved profile photo (optional) | Replaces monogram | `data/identity.ts` → `photo` |
| 6 | Supply real profile URLs (LinkedIn, GitHub, Behance…) if they exist | Entity SEO, links hub | `data/social-profiles.ts` + ledger |
| 7 | Confirm solo vs team (TL-052) | Voice ("I" vs "we") | Copy |
| 8 | Client permissions for screenshots/names/metrics | Upgrades case files | `data/projects.ts`, `data/case-studies.ts` |
| 9 | Clean conflicting claims on Fiverr (see ACCOUNT-AUDIT.md) | Cross-platform consistency | Fiverr (owner action) |
| 10 | Optional: contact email to publish | Not shown until confirmed | `data/site-config.ts` → `contactChannels.email` |

## 2. Deploy (Vercel — requires owner authorisation)

1. Import `z-programmeryt/shopify-dev` in Vercel (framework auto-detected: Next.js; build `next build`).
2. Environment variables (Production): `NEXT_PUBLIC_SITE_URL`, `SITE_ENV=production`, lead delivery vars,
   optional `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, optional `INDEXNOW_KEY`. Preview: leave `SITE_ENV` unset (noindex).
   Never set `ALLOW_EMBEDDING` in production.
3. Add the domain; set the apex or `www` as primary (redirect the other).
4. Deploy, then verify:
   - [ ] `https://<domain>/robots.txt` allows crawling and lists the sitemap
   - [ ] `https://<domain>/sitemap.xml` lists 26 URLs (plus newly published articles/case studies)
   - [ ] Response headers include HSTS and CSP; no `X-Robots-Tag: noindex`
   - [ ] Preview deployments return `X-Robots-Tag: noindex` and a `Disallow: /` robots.txt
   - [ ] Submit a test brief → email/webhook arrives with the summary; confirmation screen shows a reference
   - [ ] `/ring-lot-morong-resume.pdf` downloads
   - [ ] OG preview renders (e.g. LinkedIn Post Inspector, Facebook Sharing Debugger)
   - [ ] Lighthouse mobile/desktop on the live URL; record in PERFORMANCE-BUDGET.md

## 3. Search engines (requires owner accounts)

- [ ] Google Search Console: Domain property (DNS TXT) → submit sitemap → URL inspection for `/`
- [ ] Bing Webmaster Tools: import from GSC → submit sitemap
- [ ] IndexNow: `INDEXNOW_KEY` set → `npx tsx scripts/indexnow.ts` (production env vars) — notification only
- [ ] Update Fiverr bio with the website link (and LinkedIn if created)

## 4. Pre-launch content checks

- [ ] Re-verify Fiverr figures (rating, review count, level) and update `siteConfig.lastVerified` + ledger dates
- [ ] `npm run check` passes (typecheck, lint, tests, build)
- [ ] `npm run docs:ledger` regenerated after any ledger change
