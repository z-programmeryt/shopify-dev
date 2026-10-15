import Link from 'next/link'
import { Notice, PageHero } from '@/components/ui/primitives'
import { articles } from '@/data/articles'
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({ path: '/insights' })

export default function InsightsPage() {
  const inReview = articles.filter((article) => article.status !== 'published').length
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Insights', path: '/insights' }]}
        label="Insights"
        title="Notes on tracking, page builders, product pages and speed."
        intro="Practical explanations for store owners who want to understand why, not just what. No listicles written for search engines."
      />
      <section className="section-y pt-14">
        <div className="container-x">
          {inReview > 0 ? (
            <Notice title="Editorial status" tone="draft">
              {inReview} article{inReview === 1 ? ' is' : 's are'} drafted and awaiting Ring Lot’s review. Drafts are readable but kept out of search results until
              he has checked them.
            </Notice>
          ) : null}
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link href={`/insights/${article.slug}`} data-cursor="explore" className="group grid gap-3 py-8 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-8">
                  <p className="label-mono text-emerald-700">{article.category}</p>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-ink group-hover:text-emerald-700">{article.title}</h2>
                    <p className="mt-2 max-w-2xl text-muted">{article.description}</p>
                  </div>
                  <p className="label-mono text-subtle">
                    {article.readingMinutes} min{article.status !== 'published' ? ' · draft' : ''}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
