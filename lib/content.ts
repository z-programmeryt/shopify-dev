/**
 * Content graph helpers — the portfolio knowledge graph (project ↔ industry ↔ service ↔ technology
 * ↔ case study ↔ article ↔ related project). Pure functions over /data, shared by pages and tests.
 */
import { articles, isPublished, type Article } from '@/data/articles'
import { caseStudies } from '@/data/case-studies'
import { getIndustry, industries } from '@/data/industries'
import { projects, type ProjectDNA } from '@/data/projects'
import { getService, services, type Service } from '@/data/services'
import { getTestimonial, testimonials, type Testimonial } from '@/data/testimonials'

export function testimonialsForService(service: Service): Testimonial[] {
  return service.evidence.testimonialIds
    .map((id) => getTestimonial(id))
    .filter((item): item is Testimonial => Boolean(item))
}

export function projectsForService(slug: string): ProjectDNA[] {
  return projects.filter((project) => project.services.includes(slug))
}

export function articlesForService(slug: string): Article[] {
  return articles.filter((article) => article.relatedServices.includes(slug))
}

export function projectsForIndustry(id: string): ProjectDNA[] {
  return projects.filter((project) => project.industryId === id)
}

export function relatedProjects(project: ProjectDNA): ProjectDNA[] {
  return project.related
    .map((slug) => projects.find((candidate) => candidate.slug === slug))
    .filter((item): item is ProjectDNA => Boolean(item))
}

export function servicesForProject(project: ProjectDNA): Service[] {
  return project.services.map((slug) => getService(slug)).filter((item): item is Service => Boolean(item))
}

export function caseStudyForProject(project: ProjectDNA) {
  return caseStudies.find((study) => study.projectSlug === project.slug)
}

export function industryName(id: string): string {
  return getIndustry(id)?.name ?? id
}

/** Filter facets for the work explorer, derived from data (never hard-coded). */
export function workFacets() {
  const used = new Set(projects.map((project) => project.industryId))
  return {
    industries: industries.filter((industry) => used.has(industry.id)).map(({ id, name }) => ({ id, name })),
    services: services
      .filter((service) => projects.some((project) => project.services.includes(service.slug)))
      .map(({ slug, navLabel }) => ({ id: slug, name: navLabel })),
  }
}

export function publishedArticles(): Article[] {
  return articles.filter(isPublished)
}

export function reviewStats() {
  const ongoing = testimonials.filter((item) => item.ongoing).length
  const countries = Array.from(new Set(testimonials.map((item) => item.country)))
  return { collected: testimonials.length, ongoing, countries }
}

/** Knowledge-graph edges for the /work visualisation. */
export function knowledgeGraph() {
  const nodes = {
    industries: industries.filter((industry) => projects.some((project) => project.industryId === industry.id)),
    projects,
    services: services.filter((service) => projects.some((project) => project.services.includes(service.slug))),
  }
  const edges: { from: string; to: string }[] = []
  for (const project of projects) {
    edges.push({ from: `industry:${project.industryId}`, to: `project:${project.slug}` })
    for (const slug of project.services) edges.push({ from: `project:${project.slug}`, to: `service:${slug}` })
  }
  return { nodes, edges }
}
