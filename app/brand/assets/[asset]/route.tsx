import { brandAssets, getBrandAsset } from '@/data/brand'
import { renderBrandImage } from '@/lib/og'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return brandAssets.map((asset) => ({ asset: asset.id }))
}

export async function GET(_request: Request, context: { params: Promise<{ asset: string }> }) {
  const { asset: id } = await context.params
  const asset = getBrandAsset(id)
  if (!asset) return new Response('Not found', { status: 404 })
  const image = await renderBrandImage(asset)
  const body = await image.arrayBuffer()
  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="ring-lot-morong-${asset.id}.png"`,
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
