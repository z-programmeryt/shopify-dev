import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleBody } from '@/components/content/ArticleBody'
import { Breadcrumbs, LinkButton, Notice } from '@/components/ui/primitives'
import { JsonLd } from '@/components/ui/JsonLd'
import { articles, getArticle, isPublished } from '@/data/articles'
import { getService } from '@/data/services'
import { identity } from '@/data/identity'
import { ctas } from '@/data/site-config'
import { buildMetadata } from '@/lib/metadata'
import { articleSchema, graph } from '@/lib/schema'
import { formatDate } from '@/lib/utils'

export const dynamicParams = false

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps<'/insights/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return buildMetadata({
    path: `/insights/${article.slug}`,
    title: article.title,
    description: article.description,
    type: 'article',
    noindex: !isPublished(article),
    publishedTime: article.reviewedOn ?? undefined,
  })
}

export default async function ArticlePage({ params }: PageProps<'/insights/[slug]'>) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  const published = isPublished(article)
  const headings = article.blocks.filter((block): block is Extract<typeof block, { type: 'h2' }> => block.type === 'h2')

  return (
    <>
      <article>
        <header className="border-b border-line">
          <div className="container-x pb-14 pt-10 md:pt-14">
            <Breadcrumbs
              items={[
                { name: 'Insights', path: '/insights' },
                { name: article.title, path: `/insights/${article.slug}` },
              ]}
            />
            <div className="mt-12 max-w-3xl">
              <p className="label-mono text-emerald-700">{article.category}</p>
              <h1 className="text-h1 mt-4 text-ink">{article.title}</h1>
              <p className="text-lead mt-5 text-muted">{article.description}</p>
              <p className="mt-6 text-sm text-muted">
                {published ? (
                  <>
                    By {identity.name} · <time dateTime={article.reviewedOn ?? article.drafted}>{formatDate(article.reviewedOn ?? article.drafted)}</time>
                  </>
                ) : (
                  <>Drafted for {identity.name} · pending his review</>
                )}{' '}
                · {article.readingMinutes} min read
              </p>
            </div>
          </div>
        </header>

        <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="max-w-[44rem]">
            {!published ? (
              <div className="mb-10">
                <Notice title="Draft — editorial review pending" tone="draft">
                  This article was drafted for Ring Lot and has not yet been reviewed by him. It is excluded from search results until it is.
                </Notice>
              </div>
            ) : null}
            <ArticleBody blocks={article.blocks} />
            <div className="mt-14 rounded-xl border border-line bg-white p-6">
              <p className="font-semibold text-ink">Want this handled for your store?</p>
              <p className="mt-1 text-muted">Related services:</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {article.relatedServices.map((serviceSlug) => (
                  <li key={serviceSlug}>
                    <Link href={`/services/${serviceSlug}`} className="rounded-full border border-line px-3 py-1.5 text-sm text-ink hover:border-emerald-600">
                      {getService(serviceSlug)?.name ?? serviceSlug} →
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <LinkButton href={ctas.primary.href} cursor="start" track="cta_click" trackLabel={`article_${article.slug}_start`}>
                  {ctas.primary.label}
                </LinkButton>
              </div>
            </div>
          </div>
          {headings.length > 2 ? (
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-28">
                <p className="label-mono text-subtle">On this page</p>
                <ol className="mt-4 space-y-2.5 border-l border-line pl-4 text-sm">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="text-muted hover:text-ink">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          ) : null}
        </div>
      </article>
      {published ? <JsonLd data={graph(articleSchema(article))} /> : null}
    </>
  )
}
