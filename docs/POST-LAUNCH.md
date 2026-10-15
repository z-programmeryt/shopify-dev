# Post-Launch Plan

## First 7 days

- Search Console: confirm sitemap processed, no unexpected `noindex`/`blocked by robots`, homepage indexed.
- Check that preview deployments are not indexed (`site:vercel.app ringlot` should return nothing).
- Verify lead delivery with a real enquiry; check spam folder placement of internal notifications.
- Watch server logs for `[lead:… ] delivery errors` and 429 spikes.

## Monthly

| Area | Check | Action threshold |
| --- | --- | --- |
| Core Web Vitals (field) | Search Console CWV report, PageSpeed Insights (CrUX) | Any template "Needs improvement" → investigate LCP/INP |
| Proof freshness | Re-check Fiverr rating, review count, level | Update `data/professional.ts`, ledger dates, `siteConfig.lastVerified` |
| Queries | Search Console performance by page | Service pages with impressions but low CTR → refine titles/descriptions (truthfully) |
| Leads | Count by intent and status (from email/webhook) | Low-quality leads → adjust fit copy and form branches |
| Analytics (if Plausible enabled) | `cta_click`, `contact_start` → `contact_submit` rate, `case_study_view` | Start-without-submit high → simplify the form |
| Dependencies | `npm outdated`, `npm audit` | Security fixes promptly; framework upgrades with full `npm run check` |

## 30 / 60 / 90 days

- **30:** Publish the four articles after Ring Lot's review; add LinkedIn and link it everywhere; align Fiverr bio.
- **60:** Upgrade at least one case file to a full case study with client permission and real evidence.
- **90:** Add one independent teardown (labelled "Independent UX/CRO analysis"); consider a store-review offer page
  only if leads show demand.

## Post-launch audit checklist

- [ ] Every number on the site still matches its source (and is dated)
- [ ] No new claim bypasses the ledger (tests green)
- [ ] All service pages still map to real, offered services
- [ ] Broken links: none (run the QA crawl)
- [ ] Lighthouse mobile/desktop within budget on live URLs
- [ ] Accessibility spot check with a screen reader
- [ ] Privacy notice still accurate (analytics/provider changes)
