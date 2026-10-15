/**
 * Monogram mark: two stacked engine plates forming "RL", with a single conversion node.
 * Used in the header, favicon, OG images and brand kit (consistent across surfaces).
 */
export function LogoMark({ className = 'h-8 w-8', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const plate = tone === 'dark' ? '#0A1630' : '#FFFFFF'
  const stroke = tone === 'dark' ? '#0A1630' : '#C9CFDA'
  const glyph = tone === 'dark' ? '#FFFFFF' : '#0A1630'
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="38" height="38" rx="10" fill={plate} stroke={stroke} strokeWidth="1" />
      <path d="M11 12.5h7.2c3 0 5 1.8 5 4.4 0 2.1-1.3 3.6-3.3 4.1l3.7 6.5h-3.6l-3.3-6h-2.6v6H11V12.5Zm3.1 2.6v4h3.8c1.4 0 2.2-.8 2.2-2s-.8-2-2.2-2h-3.8Z" fill={glyph} />
      <path d="M25.5 12.5h3.1v12.8h5.4v2.7h-8.5V12.5Z" fill={glyph} opacity="0.92" />
      <circle cx="31.5" cy="11" r="2.4" fill="#3CC594" />
    </svg>
  )
}

export function Wordmark({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark tone={tone} />
      <span className={`text-[0.98rem] font-semibold tracking-[-0.01em] ${tone === 'dark' ? 'text-ink' : 'text-white'}`}>
        Ring Lot Morong
      </span>
    </span>
  )
}
