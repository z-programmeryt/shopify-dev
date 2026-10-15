/**
 * CLAIM FIREWALL — the build fails if public content references an unpublishable claim or
 * contains a forbidden marketing claim (brief §4, §50). This is the truth ledger enforced as code.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { truthLedger, getLedgerEntry } from '@/data/truth-ledger'
import { identity } from '@/data/identity'
import { positioning, proofFacts } from '@/data/professional'
import { services } from '@/data/services'
import { projects } from '@/data/projects'
import { skillGroups } from '@/data/skills'
import { testimonials } from '@/data/testimonials'
import { identityNodes } from '@/data/social-profiles'
import * as articles from '@/data/articles'
import * as caseStudies from '@/data/case-studies'
import * as industries from '@/data/industries'
import * as lab from '@/data/lab'
import * as processData from '@/data/process'
import * as seo from '@/data/seo'
import * as engine from '@/data/engine'
import * as brand from '@/data/brand'

const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  { pattern: /\b(500|700|200|100)\s?\+/, why: 'unverified volume claim (TL-042/043/045/046)' },
  { pattern: /\b700\s+(shopify\s+)?(website\s+)?projects/i, why: 'unverified project count (TL-043)' },
  { pattern: /\$\s?50\s?m\b|\$50,000,000|50 million/i, why: 'unverified revenue claim (TL-044)' },
  { pattern: /\$\s?300\s?k/i, why: 'unverified revenue claim (TL-045)' },
  { pattern: /\b\d+\+?\s*(years|yrs)\b\s*(of\s+)?(experience|exp)/i, why: 'years-of-experience claim (TL-040/041)' },
  { pattern: /\b10x\b/i, why: 'hype claim (TL-047)' },
  { pattern: /guaranteed\s+(results|sales|revenue|conversions?|rankings?)/i, why: 'guarantee language' },
  { pattern: /world'?s\s+best|#1\b|number one/i, why: 'superlative' },
  { pattern: /ultimate\s+expert|top\s+freelancer|expert\s+level/i, why: 'unverifiable status claim' },
  { pattern: /shopify\s+expert|certified\s+shopify|official\s+shopify\s+partner|shopify\s+partner/i, why: 'credential claim (TL-048)' },
  { pattern: /5[- ]star\s+rated|five[- ]star\s+rated|top[- ]rated/i, why: 'rating claim out of context (TL-011)' },
  { pattern: /hope this (email )?finds you well/i, why: 'banned email opener' },
]

function collectStrings(value: unknown, out: string[] = [], seen = new WeakSet<object>()): string[] {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out, seen))
  else if (value && typeof value === 'object') {
    if (seen.has(value)) return out
    seen.add(value)
    Object.values(value).forEach((item) => collectStrings(item, out, seen))
  }
  return out
}

function walk(dir: string, exts: string[], out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path, exts, out)
    else if (exts.some((ext) => path.endsWith(ext))) out.push(path)
  }
  return out
}

describe('truth ledger integrity', () => {
  it('has unique ids and complete entries', () => {
    const ids = truthLedger.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const entry of truthLedger) {
      expect(entry.claim.length, entry.id).toBeGreaterThan(5)
      expect(entry.dateVerified, entry.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(entry.notes.length, entry.id).toBeGreaterThan(5)
    }
  })

  it('never marks conflicted, unverified or do-not-publish claims as publishable', () => {
    for (const entry of truthLedger) {
      if (['CONFLICTED', 'UNVERIFIED', 'DO-NOT-PUBLISH'].includes(entry.status)) {
        expect(entry.publishable, `${entry.id} (${entry.status})`).toBe(false)
      }
    }
  })
})

describe('public content references only publishable claims', () => {
  const references: { where: string; id: string }[] = [
    ...identity.claimIds.map((id) => ({ where: 'identity', id })),
    ...positioning.claimIds.map((id) => ({ where: 'positioning', id })),
    ...proofFacts.map((fact) => ({ where: `proofFact:${fact.id}`, id: fact.claimId })),
    ...services.flatMap((service) => service.evidence.claimIds.map((id) => ({ where: `service:${service.slug}`, id }))),
    ...projects.flatMap((project) => project.claimIds.map((id) => ({ where: `project:${project.slug}`, id }))),
    ...skillGroups.flatMap((group) => group.skills.flatMap((skill) => skill.claimIds.map((id) => ({ where: `skill:${skill.name}`, id })))),
    ...testimonials.map((item) => ({ where: `testimonial:${item.id}`, id: item.claimId })),
    ...identityNodes.filter((node) => node.showPublicly).map((node) => ({ where: `profile:${node.id}`, id: node.claimId })),
  ]

  it.each(references)('$where → $id is publishable', ({ id }) => {
    const entry = getLedgerEntry(id)
    expect(entry, `missing ledger entry ${id}`).toBeDefined()
    expect(entry?.publishable, `${id} is not publishable`).toBe(true)
  })

  it('only shows identity nodes that are verified', () => {
    for (const node of identityNodes.filter((item) => item.showPublicly)) {
      expect(node.status).toBe('verified')
      expect(node.url).toMatch(/^https:\/\//)
    }
  })
})

describe('forbidden claims scan', () => {
  // Testimonials are verbatim client words and are excluded from marketing-phrase rules.
  const dataStrings = collectStrings({
    identity,
    positioning,
    proofFacts,
    services,
    projects,
    skillGroups,
    identityNodes: identityNodes.filter((node) => node.showPublicly),
    articles,
    caseStudies,
    industries,
    lab,
    processData,
    seo,
    engine,
    brand,
  })

  const root = join(process.cwd())
  const sourceFiles = [...walk(join(root, 'app'), ['.tsx', '.ts']), ...walk(join(root, 'components'), ['.tsx', '.ts']), join(root, 'lib/email-templates.ts'), join(root, 'lib/assistant.ts')]

  it.each(FORBIDDEN)('data never contains: $why', ({ pattern }) => {
    const hits = dataStrings.filter((text) => pattern.test(text))
    expect(hits).toEqual([])
  })

  it.each(FORBIDDEN)('source files never contain: $why', ({ pattern }) => {
    const hits = sourceFiles.filter((file) => pattern.test(readFileSync(file, 'utf8'))).map((file) => file.replace(root, ''))
    expect(hits).toEqual([])
  })

  it('no project publishes outcomes, live URLs or screenshots without evidence', () => {
    for (const project of projects) {
      expect(project.outcomes, project.slug).toEqual([])
      expect(project.screenshots, project.slug).toEqual([])
      expect(project.liveUrl, project.slug).toBeUndefined()
      expect(project.evidence.length, project.slug).toBeGreaterThan(0)
    }
  })
})
