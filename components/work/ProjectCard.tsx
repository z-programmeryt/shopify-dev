import Link from 'next/link'
import { ProjectCover } from './ProjectCover'
import { ConfidenceBadge } from '@/components/ui/primitives'
import type { ProjectDNA } from '@/data/projects'
import { getService } from '@/data/services'

export function ProjectCard({ project, headingLevel = 'h3' }: { project: ProjectDNA; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  const href = project.caseStudySlug ? `/case-studies/${project.caseStudySlug}` : `/work#${project.slug}`
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow duration-[var(--dur-ui)] hover:shadow-lift">
      <Link href={href} data-cursor={project.caseStudySlug ? 'view-case' : 'explore'} data-track="project_open" data-track-label={project.slug} className="block" tabIndex={-1} aria-hidden="true">
        <ProjectCover project={project} className="aspect-[16/10] w-full transition-transform duration-[var(--dur-section)] ease-[var(--ease-out-expo)] group-hover:scale-[1.015]" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="label-mono text-emerald-700">{project.industry}</p>
          <ConfidenceBadge confidence={project.confidence} />
        </div>
        <Heading className="mt-3 text-xl font-semibold tracking-tight text-ink">
          <Link href={href} data-cursor={project.caseStudySlug ? 'view-case' : 'explore'} data-track="project_open" data-track-label={project.slug} className="hover:text-emerald-700">
            {project.title}
          </Link>
        </Heading>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.services.map((slug) => (
            <li key={slug} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {getService(slug)?.navLabel ?? slug}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-6 text-sm font-medium text-ink">
          {project.caseStudySlug ? 'Read the case file →' : 'See record details →'}
        </p>
      </div>
    </article>
  )
}
