/**
 * Device capability tiers for the 3D Commerce Engine (brief §11): HIGH, MEDIUM, LOW, FALLBACK.
 * FALLBACK = SVG engine (no WebGL download at all).
 */
export type EngineTier = 'high' | 'medium' | 'low' | 'fallback'

export interface TierSettings {
  maxDpr: number
  particles: number
  antialias: boolean
  details: boolean
}

export const tierSettings: Record<Exclude<EngineTier, 'fallback'>, TierSettings> = {
  high: { maxDpr: 2, particles: 220, antialias: true, details: true },
  medium: { maxDpr: 1.5, particles: 130, antialias: true, details: true },
  low: { maxDpr: 1, particles: 60, antialias: false, details: false },
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number
  connection?: { saveData?: boolean; effectiveType?: string }
}

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

export function detectTier(): EngineTier {
  if (typeof window === 'undefined') return 'fallback'
  const nav = navigator as NavigatorWithHints
  const stored = window.localStorage.getItem('rl-engine-mode')
  if (stored === '2d') return 'fallback'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'fallback'
  if (nav.connection?.saveData) return 'fallback'
  if (nav.connection?.effectiveType && /(^|-)2g|3g/.test(nav.connection.effectiveType)) return 'fallback'

  const width = window.innerWidth
  const coarse = window.matchMedia('(pointer: coarse)').matches
  // Phones: the SVG engine is lighter, sharper and battery-friendly.
  if (coarse && width < 820) return 'fallback'
  if (!hasWebGL2()) return 'fallback'

  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  if (cores >= 8 && memory >= 8 && width >= 1280) return 'high'
  if (cores >= 4 && memory >= 4) return 'medium'
  return 'low'
}
