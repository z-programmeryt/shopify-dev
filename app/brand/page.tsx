import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/primitives'
import { brandAssets } from '@/data/brand'
import { siteConfig } from '@/data/site-config'

export const metadata: Metadata = {
  title: 'Brand kit',
  robots: { index: false, follow: false },
}

const SWATCHES = [
  ['Navy 900', '#0A1630', 'Primary'],
  ['Navy 950', '#050B1A', 'Depth'],
  ['Emerald 700', '#0B7A57', 'Text accent (AA on white)'],
  ['Emerald 400', '#3CC594', 'Signal on dark'],
  ['Teal 400', '#45C2C2', 'Data flow'],
  ['Paper', '#F7F6F2', 'Base'],
  ['Ink', '#0B1222', 'Text'],
  ['Silver 300', '#C9CFDA', 'Lines on dark'],
] as const

/** Internal brand kit (noindex). Every asset is generated from site tokens and copy. */
export default function BrandPage() {
  const signature = `Ring Lot Morong
Shopify Developer & Designer
${siteConfig.url.replace(/^https?:\/\//, '')} · fiverr.com/ringlot465`
  return (
    <>
      <PageHero crumbs={[{ name: 'Brand kit', path: '/brand' }]} label="Brand kit · internal" title="One visual language, every surface." intro="Assets below are generated from the same tokens and copy as the website. Download, upload, done." />
      <section className="section-y pt-12">
        <div className="container-x space-y-16">
          <div>
            <h2 className="text-h3 text-ink">Colour tokens</h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {SWATCHES.map(([name, hex, role]) => (
                <li key={hex} className="overflow-hidden rounded-lg border border-line bg-white">
                  <div className="h-20" style={{ background: hex }} />
                  <div className="p-3 text-sm">
                    <p className="font-medium text-ink">{name}</p>
                    <p className="font-mono text-xs text-muted">{hex}</p>
                    <p className="text-xs text-subtle">{role}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">Type: Instrument Sans (display + text), JetBrains Mono (labels), Instrument Serif italic (accents). All SIL OFL.</p>
          </div>
          <div>
            <h2 className="text-h3 text-ink">Generated assets</h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {brandAssets.map((asset) => (
                <li key={asset.id} className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/assets/${asset.id}`} alt={`${asset.label} preview`} width={asset.width} height={asset.height} loading="lazy" className="h-auto w-full bg-navy-900" />
                  <div className="flex items-center justify-between gap-4 p-4 text-sm">
                    <div>
                      <p className="font-medium text-ink">{asset.label}</p>
                      <p className="text-muted">
                        {asset.use} · {asset.width}×{asset.height}
                      </p>
                    </div>
                    <a href={`/brand/assets/${asset.id}`} download={`ring-lot-morong-${asset.id}.png`} className="rounded-full border border-line-strong px-3 py-1.5 text-ink hover:border-ink">
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-h3 text-ink">Email signature</h2>
            <pre className="mt-6 overflow-x-auto rounded-lg border border-line bg-white p-5 font-mono text-sm text-ink">{signature}</pre>
            <p className="mt-3 text-sm text-muted">Plain text on purpose: renders everywhere, no tracking pixels, no images to block.</p>
          </div>
        </div>
      </section>
    </>
  )
}
