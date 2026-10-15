/**
 * Generates docs/TRUTH-LEDGER.md and docs/KEYWORD-MAP.md from the machine-readable sources
 * (data/truth-ledger.ts, data/seo.ts) so documentation can never drift from what the site enforces.
 * Usage: npm run docs:ledger
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { LEDGER_VERIFIED_ON, truthLedger } from '../data/truth-ledger'
import { keywordMap } from '../data/seo'

const esc = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ')

const statusCounts = truthLedger.reduce<Record<string, number>>((acc, entry) => {
  acc[entry.status] = (acc[entry.status] ?? 0) + 1
  return acc
}, {})

const ledger = `# Truth Ledger

> Generated from \`data/truth-ledger.ts\` by \`npm run docs:ledger\`. Do not edit by hand — edit the data file.
> Verified on **${LEDGER_VERIFIED_ON}**. The claim firewall test (\`tests/content/claims.test.ts\`) fails the build if public
> content references a non-publishable claim or contains a forbidden marketing claim.

## Rules

1. Every public factual claim references a ledger ID. Only \`publishable: true\` entries may be referenced.
2. Conflicting sources are **documented, never averaged, merged or rounded up**.
3. Platform figures are shown with their context ("on Fiverr") and the verification date.
4. Status vocabulary: VERIFIED · OWNER-CONFIRMED · SELF-REPORTED · THIRD-PARTY-CORROBORATED · CONFLICTED · UNVERIFIED · DO-NOT-PUBLISH.

## Summary

${Object.entries(statusCounts)
  .map(([status, count]) => `- **${status}**: ${count}`)
  .join('\n')}
- **Publishable**: ${truthLedger.filter((entry) => entry.publishable).length} of ${truthLedger.length}

## Ledger

| ID | CLAIM | SOURCE | SOURCE TYPE | DATE VERIFIED | CONFIDENCE | STATUS | PUBLISHABLE? | NOTES |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${truthLedger
  .map(
    (entry) =>
      `| ${entry.id} | ${esc(entry.claim)} | ${esc(entry.source)}${entry.sourceUrl ? ` ([link](${entry.sourceUrl}))` : ''} | ${entry.sourceType} | ${entry.dateVerified} | ${entry.confidence} | ${entry.status} | ${entry.publishable ? 'YES' : 'NO'} | ${esc(entry.notes)} |`,
  )
  .join('\n')}

## Conflicts documented (not resolved by guessing)

| Topic | Source A | Source B | Resolution |
| --- | --- | --- | --- |
| Experience length | "Since 2019" (Fiverr bio, 2026) | "7+ years" (portfolio entries uploaded Jul 2023 ⇒ ~2016) | Neither published. Only "Fiverr member since Dec 2021" (platform-verified) is shown. |
| Client count | "200+ clients" (earlier bio) | "500+ clients" (current bio) | Neither published. 143 platform reviews are shown instead. |
| Project count | "100+ stores" (store gig) | "up to 700 projects" (bio); "500+ landing pages" (landing gig) | None published. |
| Revenue | "$300k sales for one client" (earlier bio) | "$50M generated" (current bio) | Neither published — no evidence or attribution method. |
| Credentials | "Certified Shopify experts" (gig) | No certification or Partner directory evidence found | Not published. |
`

const keywords = `# Keyword Map

> Generated from \`data/seo.ts\` by \`npm run docs:ledger\`. Intent-led clusters, one primary target URL per cluster.
> No geographic doorway pages, no keyword blocks. Rankings are never promised.

| Cluster | Intent | Primary query | Secondary queries | Target URL |
| --- | --- | --- | --- | --- |
${keywordMap.map((row) => `| ${row.cluster} | ${row.intent} | ${esc(row.primary)} | ${esc(row.secondary.join(', '))} | \`${row.target}\` |`).join('\n')}

## Rules

- One page per intent. Service pages answer a commercial/transactional intent; insights answer informational intent and link to the service.
- Cannibalisation check: no two URLs target the same primary query.
- PageFly and GemPages pages exist because the intents are distinct ("PageFly designer" ≠ "GemPages designer") and each page carries builder-specific content.
- Location terms are not used in URLs or titles. Bangladesh appears only as country-level identity information.
`

writeFileSync(join(process.cwd(), 'docs/TRUTH-LEDGER.md'), ledger)
writeFileSync(join(process.cwd(), 'docs/KEYWORD-MAP.md'), keywords)
console.info(`Wrote docs/TRUTH-LEDGER.md (${truthLedger.length} claims) and docs/KEYWORD-MAP.md (${keywordMap.length} clusters).`)
