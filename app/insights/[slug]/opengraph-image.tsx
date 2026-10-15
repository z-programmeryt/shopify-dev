import { renderBrandImage } from '@/lib/og'
import { articles, getArticle } from '@/data/articles'

export const alt = 'Insight by Ring Lot Morong'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  return renderBrandImage({ ...size, eyebrow: `Insights · ${article?.category ?? ''}`, title: article?.title ?? 'Insights', layout: 'centered' })
}
