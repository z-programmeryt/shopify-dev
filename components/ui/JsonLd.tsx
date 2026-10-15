import { serializeJsonLd } from '@/lib/schema'

/** Renders JSON-LD safely ("<" escaped). Only ever fed with static, truthful data from /data. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
