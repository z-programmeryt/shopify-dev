'use client'

import Link from 'next/link'
import { useDeferredValue, useMemo, useState } from 'react'
import { ProjectCover } from './ProjectCover'
import type { ProjectDNA } from '@/data/projects'
import { track } from '@/components/analytics/track'

export type WorkItem = Pick<
  ProjectDNA,
  | 'slug'
  | 'title'
  | 'publishedTitle'
  | 'summary'
  | 'industry'
  | 'industryId'
  | 'role'
  | 'contribution'
  | 'challenge'
  | 'solution'
  | 'technologies'
  | 'timeline'
  | 'confidence'
  | 'authenticity'
  | 'caseStudySlug'
  | 'cover'
  | 'evidence'
> & { services: { slug: string; label: string }[]; related: { slug: string; title: string }[] }

type Facet = { id: string; name: string }

/**
 * Client-side search and filters (brief §15). State lives in React only — no query-string filter
 * URLs are created, so search engines never see near-duplicate filtered pages. The full list is
 * server-rendered, so every record is crawlable without JavaScript.
 */
export function WorkExplorer({ items, industries, services }: { items: WorkItem[]; industries: Facet[]; services: Facet[] }) {
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState<string | null>(null)
  const [service, setService] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return items.filter((item) => {
      if (industry && item.industryId !== industry) return false
      if (service && !item.services.some((s) => s.slug === service)) return false
      if (!q) return true
      const haystack = [item.title, item.publishedTitle, item.summary, item.industry, ...item.contribution, ...item.technologies, ...item.services.map((s) => s.label)]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [items, deferredQuery, industry, service])

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-white text-muted hover:border-ink hover:text-ink'}`

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-xl border border-line bg-white p-5 shadow-card md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full md:max-w-sm">
            <span className="sr-only">Search work</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search: jewelry, PageFly, tracking…"
              className="w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-subtle focus:border-emerald-600 focus:outline-none"
            />
          </label>
          <p className="text-sm text-muted" aria-live="polite">
            {results.length} of {items.length} records
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by industry">
            <span className="label-mono mr-1 text-subtle">Industry</span>
            <button type="button" className={chip(industry === null)} aria-pressed={industry === null} onClick={() => setIndustry(null)}>
              All
            </button>
            {industries.map((facet) => (
              <button key={facet.id} type="button" className={chip(industry === facet.id)} aria-pressed={industry === facet.id} onClick={() => setIndustry(industry === facet.id ? null : facet.id)}>
                {facet.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by service">
            <span className="label-mono mr-1 text-subtle">Service</span>
            <button type="button" className={chip(service === null)} aria-pressed={service === null} onClick={() => setService(null)}>
              All
            </button>
            {services.map((facet) => (
              <button key={facet.id} type="button" className={chip(service === facet.id)} aria-pressed={service === facet.id} onClick={() => setService(service === facet.id ? null : facet.id)}>
                {facet.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-10 space-y-6">
        {results.map((item) => (
          <li key={item.slug} id={item.slug} className="scroll-mt-28">
            <article className="grid overflow-hidden rounded-xl border border-line bg-white shadow-card md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
              <ProjectCover project={item} className="aspect-[16/10] md:aspect-auto md:h-full md:min-h-[260px]" />
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="label-mono text-emerald-700">{item.industry}</p>
                  <span className="label-mono text-subtle">· {item.role}</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{item.title}</h2>
                <p className="mt-2 text-muted">{item.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-emerald-600 hover:text-ink">
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <details className="group mt-6 border-t border-line pt-4" onToggle={(event) => (event.currentTarget.open ? track('project_open', { slug: item.slug }) : undefined)}>
                  <summary className="cursor-pointer list-none text-sm font-medium text-ink">
                    <span className="group-open:hidden">Show the record (Project DNA) +</span>
                    <span className="hidden group-open:inline">Hide the record −</span>
                  </summary>
                  <dl className="mt-4 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="label-mono text-subtle">Contribution</dt>
                      <dd className="mt-1 text-ink">{item.contribution.join(' · ')}</dd>
                    </div>
                    <div>
                      <dt className="label-mono text-subtle">Technologies</dt>
                      <dd className="mt-1 text-ink">{item.technologies.join(' · ')}</dd>
                    </div>
                    {item.challenge ? (
                      <div>
                        <dt className="label-mono text-subtle">Challenge</dt>
                        <dd className="mt-1 text-ink">{item.challenge}</dd>
                      </div>
                    ) : null}
                    {item.solution ? (
                      <div>
                        <dt className="label-mono text-subtle">Solution</dt>
                        <dd className="mt-1 text-ink">{item.solution}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="label-mono text-subtle">Timeline</dt>
                      <dd className="mt-1 text-ink">{item.timeline ?? 'Not documented'}</dd>
                    </div>
                    <div>
                      <dt className="label-mono text-subtle">Outcomes</dt>
                      <dd className="mt-1 text-muted">No verified metrics published for this record.</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="label-mono text-subtle">Authenticity</dt>
                      <dd className="mt-1 text-muted">
                        Listed on Fiverr as “{item.publishedTitle}”. {item.authenticity.attribution}. Permission: {item.authenticity.permission}.
                      </dd>
                    </div>
                  </dl>
                </details>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                  {item.caseStudySlug ? (
                    <Link href={`/case-studies/${item.caseStudySlug}`} data-cursor="view-case" className="font-medium text-ink hover:text-emerald-700">
                      Read the case file →
                    </Link>
                  ) : null}
                  {item.evidence.map((evidence) => (
                    <a key={evidence.url} href={evidence.url} target="_blank" rel="noopener" data-cursor="verify" className="text-muted underline underline-offset-4 hover:text-ink">
                      {evidence.label} ↗
                    </a>
                  ))}
                  {item.related.length ? <span className="text-subtle">Related: {item.related.map((r) => r.title).join(', ')}</span> : null}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {results.length === 0 ? (
        <p className="mt-10 rounded-lg border border-line bg-white p-6 text-muted">
          No records match. Try another search or{' '}
          <button
            type="button"
            className="underline"
            onClick={() => {
              setQuery('')
              setIndustry(null)
              setService(null)
            }}
          >
            clear filters
          </button>
          .
        </p>
      ) : null}
    </div>
  )
}
