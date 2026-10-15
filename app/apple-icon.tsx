import { renderBrandImage } from '@/lib/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  return renderBrandImage({ ...size, eyebrow: '', title: '', layout: 'monogram' })
}
