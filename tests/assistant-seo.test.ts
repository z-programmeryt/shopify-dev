import { describe, expect, it, vi } from 'vitest'
import { answerQuestion, knowledgeBase, FALLBACK_ANSWER } from '@/lib/assistant'
import { graph, personSchema, serializeJsonLd, websiteSchema, profilePageSchema, serviceSchema } from '@/lib/schema'
import { services } from '@/data/services'
import { publicProfiles } from '@/data/social-profiles'
import { getResumeData } from '@/lib/resume'
import { renderResumePdf, sanitizeWinAnsi } from '@/lib/resume-pdf'

describe('Ask Ring Lot assistant (approved data only)', () => {
  it('answers pricing without inventing numbers', () => {
    const answer = answerQuestion('How much does it cost?')
    expect(answer.id).toBe('price')
    expect(answer.answer).not.toMatch(/\$\d/)
  })

  it('routes tracking questions to the tracking service', () => {
    expect(answerQuestion('Can you fix my Meta Pixel and CAPI deduplication?').id).toBe('service-conversion-tracking')
  })

  it('falls back honestly for unknown questions', () => {
    expect(answerQuestion('What is the weather in Paris?').id).toBe(FALLBACK_ANSWER.id)
    expect(answerQuestion('   ').id).toBe(FALLBACK_ANSWER.id)
  })

  it('never promises response times or availability', () => {
    const availability = answerQuestion('Are you available to start soon?')
    expect(availability.answer).toMatch(/does not promise/)
  })

  it('knowledge entries link only to internal routes or verified profiles', () => {
    const allowedExternal = new Set(publicProfiles.map((profile) => profile.url))
    for (const entry of knowledgeBase) {
      for (const link of entry.links) expect(link.href.startsWith('/') || allowedExternal.has(link.href), `${entry.id}: ${link.href}`).toBe(true)
    }
  })
})

describe('structured data', () => {
  const documents = [graph(personSchema(), websiteSchema()), graph(profilePageSchema('/about', '2026-10-15')), ...services.map((service) => graph(serviceSchema(service)))]

  it('never emits review, rating or FAQ markup', () => {
    for (const doc of documents) expect(JSON.stringify(doc)).not.toMatch(/AggregateRating|"Review"|FAQPage/)
  })

  it('sameAs lists verified profiles only', () => {
    expect(personSchema().sameAs).toEqual(publicProfiles.map((profile) => profile.url))
  })

  it('escapes "<" when serialising', () => {
    expect(serializeJsonLd({ name: '</script><script>alert(1)</script>' })).not.toContain('<')
  })
})

describe('indexing rules by environment', () => {
  it('blocks crawling and returns an empty sitemap outside production', async () => {
    vi.resetModules()
    process.env.SITE_ENV = 'preview'
    const robots = (await import('@/app/robots')).default()
    const sitemap = (await import('@/app/sitemap')).default()
    expect(robots.rules).toEqual([{ userAgent: '*', disallow: '/' }])
    expect(sitemap).toEqual([])
  })

  it('in production, lists services but excludes case files and draft articles', async () => {
    vi.resetModules()
    process.env.SITE_ENV = 'production'
    const urls = (await import('@/app/sitemap')).default().map((entry) => entry.url)
    expect(urls.some((url) => url.endsWith('/services/conversion-tracking'))).toBe(true)
    expect(urls.some((url) => url.includes('/case-studies/'))).toBe(false)
    expect(urls.some((url) => url.includes('/insights/'))).toBe(false)
    expect(urls.some((url) => url.includes('/brand'))).toBe(false)
    process.env.SITE_ENV = 'development'
  })
})

describe('résumé', () => {
  it('is built from master data without experience-length claims', () => {
    const data = getResumeData()
    expect(JSON.stringify(data)).not.toMatch(/\d+\+?\s*years/i)
    expect(data.experience[0]?.period).toBe('Dec 2021 – present')
  })

  it('renders a valid PDF', async () => {
    const bytes = await renderResumePdf(getResumeData())
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe('%PDF-')
    expect(bytes.length).toBeGreaterThan(2000)
  })

  it('sanitises characters the standard PDF fonts cannot encode', () => {
    expect(sanitizeWinAnsi('Design → Build ★ ≈')).toBe('Design -> Build * ~')
  })
})
