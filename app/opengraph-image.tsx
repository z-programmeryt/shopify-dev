import { renderBrandImage } from '@/lib/og'
import { positioning } from '@/data/professional'

export const alt = 'Ring Lot Morong — Shopify developer & designer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return renderBrandImage({ ...size, eyebrow: 'Shopify / eCommerce / CRO', title: 'Ring Lot Morong', subtitle: positioning.promise })
}
