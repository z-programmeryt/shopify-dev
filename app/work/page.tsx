import { PageHero, SectionHeader } from '@/components/ui/primitives'
import { KnowledgeGraph } from '@/components/work/KnowledgeGraph'
import { WorkExplorer, type WorkItem } from '@/components/work/WorkExplorer'
import { projects } from '@/data/projects'
import { getService } from '@/data/services'
import { knowledgeGraph, relatedProjects, workFacets } from '@/lib/content'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/work' })

export default function WorkPage() {
  const items: WorkItem[] = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    publishedTitle: project.publishedTitle,
    summary: project.summary,
    industry: project.industry,
    industryId: project.industryId,
    role: project.role,
    contribution: project.contribution,
    challenge: project.challenge,
    solution: project.solution,
    technologies: project.technologies,
    timeline: project.timeline,
    confidence: project.confidence,
    authenticity: project.authenticity,
    caseStudySlug: project.caseStudySlug,
    cover: project.cover,
    evidence: project.evidence,
    services: project.services.map((slug) => ({ slug, label: getService(slug)?.navLabel ?? slug })),
    related: relatedProjects(project).map((related) => ({ slug: related.slug, title: related.title })),
  }))
  const facets = workFacets()
  const graph = knowledgeGraph()
  const nodes = [
    ...graph.nodes.industries.map((industry) => ({ id: `industry:${industry.id}`, label: industry.name, column: 0 as const })),
    ...graph.nodes.projects.map((project) => ({ id: `project:${project.slug}`, label: project.title.split(' — ')[0] ?? project.title, column: 1 as const })),
    ...graph.nodes.services.map((service) => ({ id: `service:${service.slug}`, label: service.navLabel, column: 2 as const })),
  ]

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Work', path: '/work' }]}
        label="Work"
        title="Portfolio records, with their sources."
        intro="Each record comes from Ring Lot’s published Fiverr portfolio. What is documented is shown; what is not documented stays blank instead of being guessed. Covers are generated art — client screenshots appear only with permission."
      />
      <section className="section-y pt-14">
        <div className="container-x">
          <WorkExplorer items={items} industries={facets.industries} services={facets.services} />
        </div>
      </section>
      <section className="section-y border-t border-line bg-navy-950">
        <div className="container-x">
          <SectionHeader
            tone="dark"
            label="Knowledge graph"
            title="How the work connects."
            intro="Industries, projects and services as one system. Hover or focus a node to trace it."
          />
          <div className="mt-12">
            <KnowledgeGraph nodes={nodes} edges={graph.edges} />
          </div>
        </div>
      </section>
    </>
  )
}
