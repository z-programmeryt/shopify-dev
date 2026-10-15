import { createLeadRecord, leadReference, leadSchema } from '@/lib/lead'
import { deliverLead } from '@/lib/lead-delivery'
import { rateLimit } from '@/lib/rate-limit'
import { contactChannels } from '@/data/site-config'

const MAX_BODY_BYTES = 16_000
const MIN_FILL_MS = 2500
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }

function json(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return (forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim()
}

/** Reject cross-site form posts: the Origin (when present) must match the request host. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ ok: false, error: 'Invalid origin.' }, 403)

  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return json({ ok: false, error: 'Unsupported content type.' }, 415)
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) return json({ ok: false, error: 'Request too large.' }, 413)

  const limit = rateLimit(`contact:${clientIp(request)}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs)
  if (!limit.allowed) {
    return json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      429,
      { 'Retry-After': String(limit.retryAfterSeconds) },
    )
  }

  let raw: unknown
  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: 'Request too large.' }, 413)
    raw = JSON.parse(text)
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400)
  }

  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return json({ ok: false, error: 'Please check the highlighted fields.', fieldErrors }, 422)
  }

  const data = parsed.data
  // Bots: honeypot filled or form submitted implausibly fast. Respond as if accepted, deliver nothing.
  const tooFast = data.startedAt ? Date.now() - data.startedAt < MIN_FILL_MS : false
  if (data.website || tooFast) {
    return json({ ok: true, reference: leadReference(crypto.randomUUID()) })
  }

  const id = crypto.randomUUID()
  const reference = leadReference(id)
  const record = createLeadRecord(data, id)
  const delivery = await deliverLead(record, reference)

  if (!delivery.delivered) {
    return json(
      {
        ok: false,
        error: 'The form could not be delivered right now. Please use the fallback contact option.',
        fallback: { label: contactChannels.fiverr.label, href: contactChannels.fiverr.href },
      },
      503,
    )
  }

  return json({ ok: true, reference })
}

export function GET() {
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' })
}
