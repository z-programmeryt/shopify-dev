'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { EngineFallback } from './EngineFallback'
import { detectTier, tierSettings, type EngineTier } from './tiers'
import {
  ENGINE_FOCUS_EVENT,
  ENGINE_PROGRESS_EVENT,
  engineLayers,
  type EngineFocusDetail,
  type EngineProgressDetail,
} from '@/data/engine'
import { features } from '@/data/site-config'
import { track } from '@/components/analytics/track'
import { onIdle } from '@/lib/idle'

const EngineScene = dynamic(() => import('./EngineScene'), { ssr: false })

type Phase = 'connecting' | 'identity' | 'work' | 'experience'
const PHASE_LABEL: Record<Phase, string> = {
  connecting: 'CONNECTING',
  identity: 'IDENTITY',
  work: 'WORK',
  experience: 'EXPERIENCE',
}

/**
 * Orchestrates the Commerce Engine:
 *  1. Renders the SVG engine immediately (never blocks the hero render / LCP).
 *  2. Detects a device tier; on capable devices, after idle + in view, lazy-loads the WebGL scene.
 *  3. Crossfades to 3D once the first frame is drawn; pauses rendering when off-screen.
 *  4. Mirrors layer focus + scroll progress (custom events) into both renderers.
 * The loading motif (CONNECTING → IDENTITY → WORK → EXPERIENCE) is a status line — content is never hidden.
 */
let cachedTier: EngineTier | null = null
const subscribeNoop = () => () => {}
const getClientTier = () => (cachedTier ??= features.engine3d ? detectTier() : 'fallback')
const getServerTier = () => null

export function CommerceEngine({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Hydration-safe client-only value: null on the server and during hydration, detected tier after.
  const detectedTier = useSyncExternalStore(subscribeNoop, getClientTier, getServerTier)
  const [override, setOverride] = useState<EngineTier | null>(null)
  const tier = override ?? detectedTier
  const [idleReady, setIdleReady] = useState(false)
  const [ready3d, setReady3d] = useState(false)
  const [visible, setVisible] = useState(true)
  const [active, setActive] = useState<number | null>(null)
  const [spread, setSpread] = useState(0)
  const focusRef = useRef<number | null>(null)
  const spreadRef = useRef(0)

  const load3d = tier !== null && tier !== 'fallback' && idleReady
  const phase: Phase = tier === null ? 'connecting' : tier === 'fallback' || ready3d ? 'experience' : load3d ? 'work' : 'identity'

  // Wait for idle time before downloading the WebGL chunk (never competes with the hero render).
  useEffect(() => onIdle(() => setIdleReady(true), 2500), [])

  // Visibility → pause rendering off-screen.
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.01 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Focus + progress events from the page.
  useEffect(() => {
    const onFocus = (event: Event) => {
      const { index } = (event as CustomEvent<EngineFocusDetail>).detail
      focusRef.current = index
      setActive(index)
    }
    const onProgress = (event: Event) => {
      const { progress } = (event as CustomEvent<EngineProgressDetail>).detail
      spreadRef.current = progress
      setSpread(Math.round(progress * 20) / 20)
    }
    window.addEventListener(ENGINE_FOCUS_EVENT, onFocus)
    window.addEventListener(ENGINE_PROGRESS_EVENT, onProgress)
    return () => {
      window.removeEventListener(ENGINE_FOCUS_EVENT, onFocus)
      window.removeEventListener(ENGINE_PROGRESS_EVENT, onProgress)
    }
  }, [])

  const toggleMode = () => {
    const to2d = tier !== 'fallback'
    track('engine_mode', { mode: to2d ? '2d' : '3d' })
    if (to2d) {
      window.localStorage.setItem('rl-engine-mode', '2d')
      setOverride('fallback')
      setReady3d(false)
    } else {
      window.localStorage.removeItem('rl-engine-mode')
      cachedTier = null
      const next = detectTier()
      setOverride(next === 'fallback' ? 'low' : next)
      setIdleReady(true)
    }
  }

  const settings = tier && tier !== 'fallback' ? tierSettings[tier] : null
  const activeLayer = active !== null ? engineLayers[active] : null

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`}>
      <div className={`absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-[var(--dur-section)] ${ready3d ? 'opacity-0' : 'opacity-100'}`}>
        <EngineFallback active={active} spread={spread} className="h-full max-h-[620px] w-full" animated={visible} />
      </div>

      {load3d && settings ? (
        <div className={`absolute inset-0 transition-opacity duration-[var(--dur-section)] ${ready3d ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
          <EngineScene
            settings={settings}
            paused={!visible}
            focusRef={focusRef}
            spreadRef={spreadRef}
            onReady={() => setReady3d(true)}
          />
        </div>
      ) : null}

      {/* Status line — loading motif + current layer (text equivalent of the visual). */}
      <div className="pointer-events-none absolute inset-x-5 top-4 flex items-center justify-between">
        <p className="label-mono flex items-center gap-2 text-[0.62rem] text-silver-500" aria-live="polite">
          <span className={`h-1.5 w-1.5 rounded-full ${phase === 'experience' ? 'bg-emerald-400' : 'status-dot bg-teal-400'}`} aria-hidden="true" />
          ENGINE · {PHASE_LABEL[phase]}
          {tier ? <span className="text-silver-500/70"> · {tier === 'fallback' ? '2D' : `3D ${tier.toUpperCase()}`}</span> : null}
        </p>
        {tier ? (
          <button
            type="button"
            onClick={toggleMode}
            className="label-mono pointer-events-auto rounded-full border border-white/15 px-2.5 py-1 text-[0.6rem] text-silver-300 hover:border-emerald-400 hover:text-white"
          >
            {tier === 'fallback' ? 'Try 3D' : 'Use 2D'}
          </button>
        ) : null}
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-4">
        <p className="label-mono text-[0.62rem] text-silver-500">
          {activeLayer ? (
            <>
              <span className="text-emerald-400">{String(activeLayer.index + 1).padStart(2, '0')}</span> {activeLayer.label.toUpperCase()} — {activeLayer.depicts}
            </>
          ) : (
            'DESIGN → DEVELOPMENT → PERFORMANCE → UX → CRO → CONVERSION'
          )}
        </p>
      </div>
    </div>
  )
}
