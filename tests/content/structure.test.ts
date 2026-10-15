/** Content graph integrity + SEO metadata quality gates. */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { services, getService } from '@/data/services'
import { projects, getProject } from '@/data/projects'
import { caseStudies } from '@/data/case-studies'
import { articles } from '@/data/articles'
import { testimonials, getTestimonial } from '@/data/testimonials'
import { getIndustry } from '@/data/industries'
import { routeSeo } from '@/data/seo'
import { engineLayers } from '@/data/engine'

const unique = (values: string[]) => new Set(values).size === values.length
const SUFFIX = ' | Ring Lot Morong'

describe('content graph', () => {
  it('slugs are unique and URL-safe', () => {
    for (const list of [services.map((s) => s.slug), projects.map((p) => p.slug), caseStudies.map((c) => c.slug), articles.map((a) => a.slug)]) {
      expect(unique(list)).toBe(true)
      for (const slug of list) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('every service reference resolves', () => {
    for (const service of services) {
      for (const slug of service.related) expect(getService(slug), `${service.slug} → ${slug}`).toBeDefined()
      for (const id of service.evidence.testimonialIds) expect(getTestimonial(id), `${service.slug} → ${id}`).toBeDefined()
      for (const slug of service.evidence.projectIds) expect(getProject(slug), `${service.slug} → ${slug}`).toBeDefined()
      expect(engineLayers.some((layer) => layer.id === service.engineLayer)).toBe(true)
    }
  })

  it('every project reference resolves', () => {
    for (const project of projects) {
      expect(getIndustry(project.industryId), project.slug).toBeDefined()
      for (const slug of project.services) expect(getService(slug), `${project.slug} → ${slug}`).toBeDefined()
      for (const slug of project.related) expect(getProject(slug), `${project.slug} → ${slug}`).toBeDefined()
      if (project.caseStudySlug) expect(caseStudies.find((study) => study.slug === project.caseStudySlug)?.projectSlug).toBe(project.slug)
    }
  })

  it('case studies only render documented sections and list the rest as pending', () => {
    for (const study of caseStudies) {
      const documented = new Set(study.sections.map((section) => section.id))
      for (const pending of study.pending) expect(documented.has(pending), `${study.slug}: ${pending}`).toBe(false)
      for (const section of study.sections) expect(Boolean(section.body || section.items?.length), `${study.slug}: ${section.id}`).toBe(true)
      if (study.status === 'case-file') expect(documented.has('results')).toBe(false)
    }
  })

  it('testimonials map to real services and keep full context', () => {
    for (const item of testimonials) {
      expect(getService(item.serviceSlug), item.id).toBeDefined()
      expect(item.sourceUrl).toMatch(/^https:\/\/www\.fiverr\.com\//)
      expect(item.rating).toBeGreaterThan(0)
      expect(item.country.length).toBeGreaterThan(1)
    }
  })

  it('in-review articles are never marked as reviewed', () => {
    for (const article of articles) {
      if (article.status === 'in-review') expect(article.reviewedOn).toBeNull()
      expect(article.blocks.length).toBeGreaterThan(5)
    }
  })
})

describe('SEO metadata quality', () => {
  it('every routeSeo entry maps to a real page', () => {
    for (const path of Object.keys(routeSeo)) {
      const file = path === '/' ? 'app/page.tsx' : `app${path}/page.tsx`
      expect(existsSync(join(process.cwd(), file)), file).toBe(true)
    }
  })

  const pages = [
    ...Object.entries(routeSeo).map(([path, meta]) => ({ id: path, title: meta.absolute ? meta.title : meta.title + SUFFIX, description: meta.description })),
    ...services.map((s) => ({ id: s.slug, title: s.seo.title + SUFFIX, description: s.seo.description })),
    ...caseStudies.map((c) => ({ id: c.slug, title: c.seo.title + SUFFIX, description: c.seo.description })),
  ]

  it.each(pages)('$id has a title ≤ 60 chars and a 100–170 char description', ({ title, description }) => {
    expect(title.length).toBeLessThanOrEqual(60)
    expect(description.length).toBeGreaterThanOrEqual(100)
    expect(description.length).toBeLessThanOrEqual(170)
  })

  it('titles and descriptions are unique', () => {
    expect(unique(pages.map((page) => page.title))).toBe(true)
    expect(unique(pages.map((page) => page.description))).toBe(true)
  })

  it('article descriptions fit search snippets', () => {
    for (const article of articles) {
      expect(article.description.length).toBeLessThanOrEqual(170)
      expect(article.title.length).toBeLessThanOrEqual(90)
    }
  })

  it('no location-based doorway pages exist', () => {
    const paths = [...Object.keys(routeSeo), ...services.map((s) => `/services/${s.slug}`)]
    for (const path of paths) expect(path).not.toMatch(/bangladesh|dhaka|usa|london|near-me/i)
  })
})
