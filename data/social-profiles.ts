/**
 * SOCIAL PROFILES — identity graph nodes (docs/IDENTITY-GRAPH.md).
 * Only nodes with `showPublicly: true` render on the site and in JSON-LD `sameAs`.
 * New profiles are added only after the owner supplies the URL and it is verified.
 */

export type NodeStatus = 'verified' | 'candidate' | 'not-found' | 'do-not-use'
export type Cleanup = 'KEEP' | 'UPDATE' | 'REDIRECT' | 'ARCHIVE' | 'INVESTIGATE' | 'DO NOT USE'

export interface IdentityNode {
  id: string
  platform: string
  url: string | null
  username: string | null
  identityConfidence: 'high' | 'medium' | 'low' | 'none'
  status: NodeStatus
  purpose: string
  evidence: string
  lastVerified: string
  brandingConsistency: string
  showPublicly: boolean
  cleanup: Cleanup
  recommendation: string
  claimId: string
}

export const identityNodes: IdentityNode[] = [
  {
    id: 'fiverr',
    platform: 'Fiverr',
    url: 'https://www.fiverr.com/ringlot465',
    username: 'ringlot465',
    identityConfidence: 'high',
    status: 'verified',
    purpose: 'Primary marketplace: services, reviews, portfolio and contact.',
    evidence: 'Bio and gigs self-identify as "RINGLOT"; services match the owner brief (GemPages, PageFly, CRO).',
    lastVerified: '2026-10-15',
    brandingConsistency:
      'Partial — display name "Ecom R" and "RINGLOT" vs website "Ring Lot Morong"; bio contains conflicting numeric claims.',
    showPublicly: true,
    cleanup: 'UPDATE',
    recommendation:
      'Align display name with "Ring Lot Morong", remove conflicting numbers (TL-040…TL-048), link to the website once live.',
    claimId: 'TL-002',
  },
  {
    id: 'website',
    platform: 'Personal website',
    url: 'https://ringlotmorong.com',
    username: null,
    identityConfidence: 'low',
    status: 'candidate',
    purpose: 'Canonical identity hub (this site).',
    evidence: 'Domain registered 2025-08-05 per a public registration feed; ownership not confirmed.',
    lastVerified: '2026-10-15',
    brandingConsistency: 'Will be the reference for name, title and visuals.',
    showPublicly: false,
    cleanup: 'INVESTIGATE',
    recommendation: 'Owner confirms ownership, then this becomes the canonical URL for all profiles.',
    claimId: 'TL-060',
  },
  {
    id: 'github-ringlot',
    platform: 'GitHub',
    url: 'https://github.com/ringlot',
    username: 'ringlot',
    identityConfidence: 'none',
    status: 'do-not-use',
    purpose: '—',
    evidence: 'Created 2017, one "simple-calculator" repo, no name/bio/links. "Ringlot" is also a European surname.',
    lastVerified: '2026-10-15',
    brandingConsistency: 'None.',
    showPublicly: false,
    cleanup: 'DO NOT USE',
    recommendation: 'Do not link or merge. If Ring Lot has a GitHub account, the owner supplies it.',
    claimId: 'TL-061',
  },
  ...(['LinkedIn', 'Behance', 'Upwork', 'Instagram', 'Facebook', 'YouTube'] as const).map(
    (platform): IdentityNode => ({
      id: platform.toLowerCase(),
      platform,
      url: null,
      username: null,
      identityConfidence: 'none',
      status: 'not-found',
      purpose: 'Not established.',
      evidence: 'Searched name and handle variants (Ring Lot Morong, Ringlot, ringlot465, ringlotmorong); nothing attributable found.',
      lastVerified: '2026-10-15',
      brandingConsistency: '—',
      showPublicly: false,
      cleanup: 'INVESTIGATE',
      recommendation:
        platform === 'LinkedIn'
          ? 'High value: create or supply a LinkedIn profile with the same name, title and website link.'
          : 'Owner supplies the URL if a profile exists; otherwise only create it if it will be maintained.',
      claimId: 'TL-062',
    }),
  ),
]

export const publicProfiles = identityNodes.filter((node) => node.showPublicly && node.url)
