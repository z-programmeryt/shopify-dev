import { renderBrandImage } from '@/lib/og'
import { getService, services } from '@/data/services'

export const alt = 'Shopify service by Ring Lot Morong'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  return renderBrandImage({ ...size, eyebrow: service?.navLabel ?? 'Service', title: service?.name ?? 'Shopify services', subtitle: service?.headline })
}
