import { engineLayers } from '@/data/engine'

/**
 * SVG Commerce Engine — the FALLBACK tier and the poster frame shown before WebGL loads.
 * Six isometric plates (Design → Conversion) with layer-specific details and a data flow that
 * ends in a single conversion node. Pure presentational: `active` highlights a layer,
 * `spread` (0–1) separates the plates ("evolves on scroll").
 */
const ISO = 'matrix(0.866 0.357 -0.866 0.357 0 0)'
const W = 170
const H = 70
const DEPTH = 9
const CX = 250

function PlateDetail({ id, active }: { id: string; active: boolean }) {
  const ink = active ? '#7FDDB9' : 'rgba(201,207,218,0.55)'
  const accent = '#3CC594'
  switch (id) {
    case 'design':
      return (
        <g>
          <rect x="-82" y="-82" width="164" height="16" rx="3" fill={ink} opacity="0.55" />
          {[0, 1, 2].map((col) =>
            [0, 1].map((row) => (
              <rect
                key={`${col}-${row}`}
                x={-82 + col * 56}
                y={-54 + row * 62}
                width="48"
                height="54"
                rx="4"
                fill={col === 1 && row === 0 ? accent : ink}
                opacity={col === 1 && row === 0 ? 0.9 : 0.35}
              />
            )),
          )}
        </g>
      )
    case 'development':
      return (
        <g>
          {[150, 96, 128, 70, 142, 110, 84, 132].map((width, line) => (
            <rect key={line} x={-82 + (line % 3 === 1 ? 14 : 0)} y={-78 + line * 20} width={width} height="7" rx="3.5" fill={line === 3 ? accent : ink} opacity={line === 3 ? 0.9 : 0.45} />
          ))}
        </g>
      )
    case 'performance':
      return (
        <g fill="none">
          <circle r="56" stroke={ink} strokeWidth="5" opacity="0.35" />
          <circle r="56" stroke={accent} strokeWidth="5" strokeDasharray="250 352" strokeLinecap="round" transform="rotate(-90)" />
          <path d="M-70 60 L-30 30 L10 44 L52 -6" stroke={ink} strokeWidth="2" opacity="0.7" />
          {[
            [-70, 60],
            [-30, 30],
            [10, 44],
            [52, -6],
          ].map(([cx, cy]) => (
            <circle key={`${cx}`} cx={cx} cy={cy} r="5" fill={accent} />
          ))}
        </g>
      )
    case 'ux':
      return (
        <g>
          <rect x="-82" y="-80" width="100" height="74" rx="6" fill={ink} opacity="0.35" />
          <rect x="26" y="-80" width="56" height="74" rx="6" fill={ink} opacity="0.25" />
          <rect x="-82" y="6" width="164" height="30" rx="6" fill={ink} opacity="0.2" />
          <rect x="-82" y="48" width="96" height="26" rx="13" fill={accent} opacity="0.95" />
        </g>
      )
    case 'cro':
      return (
        <g>
          <rect x="-58" y="-6" width="40" height="70" rx="4" fill={ink} opacity="0.45" />
          <rect x="18" y="-58" width="40" height="122" rx="4" fill={accent} opacity="0.9" />
          <path d="M-70 -70 L66 -86" stroke={ink} strokeWidth="2" strokeDasharray="5 6" opacity="0.7" />
        </g>
      )
    default:
      return (
        <g fill="none">
          <circle r="70" stroke={ink} strokeWidth="1.5" opacity="0.35" />
          <circle r="44" stroke={ink} strokeWidth="1.5" opacity="0.5" />
          <circle r="20" fill={accent} className="engine-pulse" />
        </g>
      )
  }
}

export function EngineFallback({
  active = null,
  spread = 0,
  className = '',
  animated = true,
}: {
  active?: number | null
  spread?: number
  className?: string
  animated?: boolean
}) {
  const gap = 66 + spread * 22
  const top = 96
  const centers = engineLayers.map((layer) => top + layer.index * gap)
  const last = centers[centers.length - 1] ?? 0
  const height = last + H + DEPTH + 40

  return (
    <svg
      viewBox={`0 0 600 ${Math.round(height)}`}
      className={className}
      role="img"
      aria-label="Commerce Engine: six stacked layers — design, development, performance, UX, CRO and conversion — connected by a data flow that ends in one conversion node."
    >
      <defs>
        <linearGradient id="plate-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#18315F" />
          <stop offset="1" stopColor="#0A1630" />
        </linearGradient>
      </defs>

      {/* data flow spine */}
      <path
        d={`M${CX} ${centers[0]} C ${CX + 70} ${centers[1] ?? 0}, ${CX - 70} ${centers[3] ?? 0}, ${CX} ${last}`}
        fill="none"
        stroke="#45C2C2"
        strokeWidth="1.6"
        opacity="0.75"
        className={animated ? 'engine-flow' : undefined}
        strokeDasharray={animated ? undefined : '4 12'}
      />

      {engineLayers
        .slice()
        .reverse()
        .map((layer) => {
          const cy = centers[layer.index] ?? 0
          const isActive = active === layer.index
          const dim = active !== null && !isActive
          return (
            <g
              key={layer.id}
              className="engine-plate"
              style={{ transform: `translate(${isActive ? -14 : 0}px, ${isActive ? -6 : 0}px)`, opacity: dim ? 0.55 : 1 }}
            >
              <g transform={`translate(${CX} ${cy})`}>
                {/* side faces */}
                <path d={`M${-W} 0 L0 ${H} L0 ${H + DEPTH} L${-W} ${DEPTH} Z`} fill="url(#plate-side)" />
                <path d={`M${W} 0 L0 ${H} L0 ${H + DEPTH} L${W} ${DEPTH} Z`} fill="#0D1C3B" />
                {/* top face */}
                <path
                  d={`M0 ${-H} L${W} 0 L0 ${H} L${-W} 0 Z`}
                  fill={isActive ? '#18315F' : '#102347'}
                  stroke={isActive ? '#3CC594' : 'rgba(201,207,218,0.28)'}
                  strokeWidth={isActive ? 1.5 : 1}
                />
                <g transform={ISO}>
                  <PlateDetail id={layer.id} active={isActive} />
                </g>
              </g>
              <g transform={`translate(${CX + W + 18} ${cy + 4})`}>
                <line x1="-14" y1="0" x2="-4" y2="0" stroke={isActive ? '#3CC594' : 'rgba(201,207,218,0.35)'} />
                <text
                  x="0"
                  y="4"
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize="11"
                  letterSpacing="1.6"
                  fill={isActive ? '#7FDDB9' : 'rgba(201,207,218,0.75)'}
                >
                  {String(layer.index + 1).padStart(2, '0')} {layer.label.toUpperCase()}
                </text>
              </g>
            </g>
          )
        })}
    </svg>
  )
}
