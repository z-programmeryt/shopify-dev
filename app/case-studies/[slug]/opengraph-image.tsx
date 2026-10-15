import { renderBrandImage } from '@/lib/og'
import { caseStudies, getCaseStudy } from '@/data/case-studies'

export const alt = 'Case file by Ring Lot Morong'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  return renderBrandImage({ ...size, eyebrow: study?.status === 'published' ? 'Case study' : 'Case file', title: study?.title ?? 'Case study', subtitle: study?.subtitle })
}
