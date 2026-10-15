'use client'

import { track } from '@/components/analytics/track'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        track('resume_download', { label: 'print' })
        window.print()
      }}
      className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-medium text-ink hover:border-ink"
    >
      Print
    </button>
  )
}
