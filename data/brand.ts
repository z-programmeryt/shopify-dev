/**
 * BRAND ASSET KIT (brief §59) — every asset is generated from the same tokens and copy as the site,
 * so the website stays the visual source of truth. Rendered at /brand/assets/[asset].
 */
import { positioning } from './professional'

export interface BrandAsset {
  id: string
  label: string
  use: string
  width: number
  height: number
  eyebrow: string
  title: string
  subtitle?: string
  layout: 'split' | 'centered' | 'banner' | 'monogram'
  avatarSafeLeft?: boolean
}

export const brandAssets: BrandAsset[] = [
  { id: 'og-image', label: 'Open Graph image', use: 'Link previews (site default)', width: 1200, height: 630, eyebrow: 'Shopify / eCommerce / CRO', title: 'Ring Lot Morong', subtitle: positioning.promise, layout: 'split' },
  { id: 'linkedin-banner', label: 'LinkedIn banner', use: 'LinkedIn profile background (text kept clear of the avatar)', width: 1584, height: 396, eyebrow: 'Shopify developer & designer', title: 'Stores · Landing pages · Tracking', layout: 'banner', avatarSafeLeft: true },
  { id: 'social-banner', label: 'Social banner', use: 'X / YouTube / Fiverr header', width: 1500, height: 500, eyebrow: 'Shopify / eCommerce / CRO', title: 'Design, build and measure.', layout: 'banner' },
  { id: 'avatar', label: 'Avatar treatment', use: 'Profile picture until a photo is approved', width: 800, height: 800, eyebrow: '', title: '', layout: 'monogram' },
  { id: 'project-thumbnail', label: 'Project thumbnail template', use: 'Portfolio and case study covers', width: 1200, height: 750, eyebrow: 'Case file', title: 'Project title goes here', subtitle: 'Industry · Services · Platform', layout: 'split' },
  { id: 'resume-cover', label: 'Résumé cover', use: 'PDF/print cover page', width: 1240, height: 1754, eyebrow: 'Résumé', title: 'Ring Lot Morong', subtitle: positioning.title, layout: 'centered' },
  { id: 'presentation-cover', label: 'Presentation cover', use: 'Proposals and audits', width: 1920, height: 1080, eyebrow: 'Proposal', title: 'Shopify store review', subtitle: 'Prepared by Ring Lot Morong', layout: 'split' },
]

export function getBrandAsset(id: string) {
  return brandAssets.find((asset) => asset.id === id)
}
