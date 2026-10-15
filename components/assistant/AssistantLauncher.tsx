'use client'

import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { track } from '@/components/analytics/track'

const AssistantPanel = dynamic(() => import('./AssistantPanel'), {
  ssr: false,
  loading: () => null,
})

/** Tiny always-loaded launcher; the panel + knowledge base load only when opened. */
export function AssistantLauncher() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div data-assistant className="no-print">
      {!open ? (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            setOpen(true)
            track('assistant_open')
          }}
          className="fixed bottom-4 right-4 z-40 sm:bottom-5 sm:right-5 inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900 py-2.5 pl-3 pr-4 text-sm font-medium text-white shadow-lift transition-transform duration-[var(--dur-micro)] hover:-translate-y-0.5"
          aria-haspopup="dialog"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="sm:hidden">Ask</span>
          <span className="hidden sm:inline">Ask Ring Lot</span>
        </button>
      ) : (
        <AssistantPanel
          onClose={() => {
            setOpen(false)
            requestAnimationFrame(() => buttonRef.current?.focus())
          }}
        />
      )}
    </div>
  )
}
