/**
 * IDENTITY — who Ring Lot Morong is, as an entity.
 * Every field is backed by the truth ledger (claimIds). See docs/IDENTITY-GRAPH.md.
 */

export const identity = {
  name: 'Ring Lot Morong',
  givenName: 'Ring Lot',
  familyName: 'Morong',
  /** Spellings used on verified platforms. Used for entity reconciliation (JSON-LD alternateName). */
  alternateNames: ['Ringlot Morong', 'Ringlot'],
  /** Platform handle(s) that are verified as his. */
  handles: [{ platform: 'Fiverr', handle: 'ringlot465', displayName: 'Ecom R', claimId: 'TL-002' }],
  monogram: 'RL',
  jobTitle: 'Shopify Developer & Designer',
  /** Country only — city is not public (TL-004). */
  countryCode: 'BD',
  countryName: 'Bangladesh',
  languages: [
    { code: 'en', name: 'English' },
    { code: 'bn', name: 'Bengali' },
  ],
  /**
   * Profile photo. No owner-approved photo is available yet, so the site uses the
   * monogram treatment. Supply a real photo (with permission) to replace it.
   */
  photo: null as null | { src: string; alt: string; width: number; height: number },
  claimIds: ['TL-001', 'TL-002', 'TL-003', 'TL-004', 'TL-005'],
} as const

export type Identity = typeof identity
