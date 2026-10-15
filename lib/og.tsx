import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Brand image renderer (OG images, banners, covers). One visual language across every surface:
 * deep navy, emerald signal, Instrument Sans + JetBrains Mono, and the stacked Commerce Engine.
 * Satori rules: flexbox only; every multi-child element needs display:flex.
 */

let fontCache: Promise<{ name: string; data: Buffer; weight: 500 | 600 | 400; style: 'normal' | 'italic' }[]> | null = null

function loadFonts() {
  if (!fontCache) {
    const dir = join(process.cwd(), 'assets/fonts')
    fontCache = Promise.all([
      readFile(join(dir, 'InstrumentSans-SemiBold.woff')).then((data) => ({ name: 'Instrument Sans', data, weight: 600 as const, style: 'normal' as const })),
      readFile(join(dir, 'InstrumentSans-Medium.woff')).then((data) => ({ name: 'Instrument Sans', data, weight: 500 as const, style: 'normal' as const })),
      readFile(join(dir, 'JetBrainsMono-Medium.woff')).then((data) => ({ name: 'JetBrains Mono', data, weight: 500 as const, style: 'normal' as const })),
      readFile(join(dir, 'InstrumentSerif-Italic.woff')).then((data) => ({ name: 'Instrument Serif', data, weight: 400 as const, style: 'italic' as const })),
    ])
  }
  return fontCache
}

const NAVY = '#0A1630'
const EMERALD = '#3CC594'

/** Stacked plates — a flat 2D echo of the Commerce Engine (SVG works inside Satori). */
function EngineMark({ size }: { size: number }) {
  const plates = [0, 1, 2, 3, 4, 5]
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 300 315">
      {plates
        .slice()
        .reverse()
        .map((index) => {
          const cy = 60 + index * 38
          return (
            <g key={index}>
              <path d={`M150 ${cy - 42} L270 ${cy} L150 ${cy + 42} L30 ${cy} Z`} fill={index === 0 ? '#18315F' : '#102347'} stroke={index === 0 ? EMERALD : 'rgba(201,207,218,0.35)'} strokeWidth="1.5" />
              {index === 0 ? <rect x="130" y={cy - 10} width="40" height="20" rx="3" fill={EMERALD} transform={`rotate(0 150 ${cy})`} /> : null}
            </g>
          )
        })}
      <path d="M150 60 C 190 120, 110 180, 150 250" fill="none" stroke="#45C2C2" strokeWidth="2" strokeDasharray="4 8" />
      {/* Conversion node drawn last so no plate covers it */}
      <circle cx="150" cy="250" r="13" fill={EMERALD} />
    </svg>
  )
}

export interface BrandImageInput {
  width: number
  height: number
  eyebrow: string
  title: string
  subtitle?: string
  footer?: string
  layout?: 'split' | 'centered' | 'banner' | 'monogram'
  /** Keep content clear of an avatar overlay on the left (LinkedIn banners). */
  avatarSafeLeft?: boolean
}

export async function renderBrandImage({ width, height, eyebrow, title, subtitle, footer = 'ringlotmorong.com', layout = 'split', avatarSafeLeft = false }: BrandImageInput) {
  const fonts = await loadFonts()
  const scale = Math.min(width / 1200, height / 630)
  const grid = `linear-gradient(to right, rgba(201,207,218,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,207,218,0.07) 1px, transparent 1px)`

  if (layout === 'monogram') {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY, backgroundImage: grid, backgroundSize: '40px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: 'Instrument Sans', fontWeight: 600, fontSize: width * 0.36, color: '#fff', letterSpacing: '-0.06em' }}>
            RL
            <div style={{ display: 'flex', width: width * 0.06, height: width * 0.06, borderRadius: 999, background: EMERALD, marginTop: width * 0.04, marginLeft: width * 0.01 }} />
          </div>
        </div>
      ),
      { width, height, fonts },
    )
  }

  const isBanner = layout === 'banner'
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: NAVY,
          backgroundImage: grid,
          backgroundSize: `${Math.round(56 * scale)}px ${Math.round(56 * scale)}px`,
          padding: isBanner
            ? `${Math.round(height * 0.16)}px ${Math.round(width * 0.05)}px ${Math.round(height * 0.16)}px ${Math.round(width * (avatarSafeLeft ? 0.3 : 0.05))}px`
            : `${Math.round(64 * scale)}px ${Math.round(72 * scale)}px`,
          fontFamily: 'Instrument Sans',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingRight: layout === 'split' || isBanner ? 24 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'JetBrains Mono', fontSize: Math.round((isBanner ? 15 : 20) * Math.max(scale, 0.9)), letterSpacing: '0.14em', color: EMERALD, textTransform: 'uppercase' }}>
            <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 999, background: EMERALD }} />
            {eyebrow}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(16 * scale) }}>
            <div style={{ display: 'flex', fontSize: Math.round((isBanner ? (avatarSafeLeft ? 48 : 58) : 66) * scale * (isBanner ? 1.6 : 1)), fontWeight: 600, lineHeight: 1.02, letterSpacing: '-0.035em', maxWidth: width * (avatarSafeLeft ? 0.5 : 0.62) }}>{title}</div>
            {subtitle ? (
              <div style={{ display: 'flex', fontSize: Math.round((isBanner ? 22 : 28) * scale * (isBanner ? 1.5 : 1)), fontWeight: 500, color: '#C9CFDA', lineHeight: 1.35, maxWidth: width * 0.6 }}>{subtitle}</div>
            ) : null}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: Math.round((isBanner ? 16 : 22) * Math.max(scale, 0.9)), color: '#9AA4B5' }}>
            <div style={{ display: 'flex', fontWeight: 600, color: '#fff' }}>Ring Lot Morong</div>
            <div style={{ display: 'flex' }}>·</div>
            <div style={{ display: 'flex' }}>{footer}</div>
          </div>
        </div>
        {layout !== 'centered' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EngineMark size={Math.round(Math.min(height * (isBanner ? 0.95 : 0.78), width * 0.32))} />
          </div>
        ) : null}
      </div>
    ),
    { width, height, fonts },
  )
}
