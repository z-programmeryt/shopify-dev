import { beforeEach, describe, expect, it } from 'vitest'
import { createLeadRecord, leadReference, leadSchema, summarizeLead } from '@/lib/lead'
import { resetRateLimits } from '@/lib/rate-limit'
import { POST } from '@/app/api/contact/route'
import { clientConfirmationEmail, escapeHtml, internalLeadEmail } from '@/lib/email-templates'

const base = {
  mode: 'full',
  intent: 'landing-page',
  name: 'Jane Founder',
  email: 'Jane@Example.com',
  message: 'We need a launch page for a new product next month.',
  consent: true,
} as const

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: 'localhost:3000', origin: 'http://localhost:3000', 'x-forwarded-for': '203.0.113.7', ...headers },
    body: JSON.stringify(body),
  })
}

describe('lead schema', () => {
  it('accepts a valid brief and normalises email and store URL', () => {
    const parsed = leadSchema.parse({ ...base, storeUrl: 'mystore.com' })
    expect(parsed.email).toBe('jane@example.com')
    expect(parsed.storeUrl).toBe('https://mystore.com')
  })

  it('requires a store URL for store reviews and tracking work', () => {
    for (const intent of ['review', 'cro-tracking'] as const) {
      const result = leadSchema.safeParse({ ...base, intent })
      expect(result.success).toBe(false)
      expect(result.error?.issues.some((issue) => issue.path[0] === 'storeUrl')).toBe(true)
    }
  })

  it('does not require a store URL for quick notes', () => {
    expect(leadSchema.safeParse({ ...base, mode: 'quick', intent: 'review' }).success).toBe(true)
  })

  it('rejects missing consent and invalid emails', () => {
    expect(leadSchema.safeParse({ ...base, consent: false }).success).toBe(false)
    expect(leadSchema.safeParse({ ...base, email: 'not-an-email' }).success).toBe(false)
  })
})

describe('lead summary never fabricates', () => {
  it('marks missing fields as "Not provided"', () => {
    const summary = summarizeLead(leadSchema.parse(base))
    expect(summary).toContain('Store: Not provided')
    expect(summary).toContain('Builder: Not provided')
    expect(summary).toContain('Budget: Not provided')
    expect(summary).toContain('Timeline: Not provided')
  })

  it('creates a New lead without honeypot/timing fields', () => {
    const record = createLeadRecord(leadSchema.parse({ ...base, website: '', startedAt: 123 }), '0f8f7c4e-1111-2222-3333-444455556666')
    expect(record.status).toBe('New')
    expect(record.data).not.toHaveProperty('website')
    expect(record.data).not.toHaveProperty('startedAt')
    expect(leadReference(record.id)).toMatch(/^RL-[0-9A-F]{8}$/)
  })
})

describe('email templates', () => {
  it('escape user input and avoid banned openers', () => {
    const record = createLeadRecord(leadSchema.parse({ ...base, name: '<script>alert(1)</script> Doe' }), 'abcdef12-0000-0000-0000-000000000000')
    const internal = internalLeadEmail(record, 'RL-ABCDEF12')
    expect(internal.html).not.toContain('<script>')
    expect(escapeHtml('<a href="x">')).toBe('&lt;a href=&quot;x&quot;&gt;')
    const confirmation = clientConfirmationEmail(record, 'RL-ABCDEF12')
    expect(confirmation.text.toLowerCase()).not.toContain('hope this')
    expect(confirmation.subject).toContain('RL-ABCDEF12')
  })
})

describe('POST /api/contact', () => {
  beforeEach(() => {
    resetRateLimits()
    process.env.LEAD_DELIVERY = 'log'
  })

  it('accepts a valid brief and returns a reference', async () => {
    const response = await POST(request({ ...base, startedAt: Date.now() - 10_000 }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.reference).toMatch(/^RL-/)
  })

  it('returns field errors for invalid input', async () => {
    const response = await POST(request({ ...base, email: 'nope' }))
    expect(response.status).toBe(422)
    const data = await response.json()
    expect(data.fieldErrors.email).toBeDefined()
  })

  it('silently discards honeypot and too-fast submissions', async () => {
    const honeypot = await POST(request({ ...base, website: 'http://spam.example', startedAt: Date.now() - 10_000 }))
    expect(honeypot.status).toBe(200)
    const fast = await POST(request({ ...base, startedAt: Date.now() }))
    expect(fast.status).toBe(200)
  })

  it('rejects cross-origin posts and wrong content types', async () => {
    expect((await POST(request(base, { origin: 'https://evil.example' }))).status).toBe(403)
    const wrongType = new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'content-type': 'text/plain', host: 'localhost:3000' }, body: 'hi' })
    expect((await POST(wrongType)).status).toBe(415)
  })

  it('rate limits repeated submissions from one IP', async () => {
    const statuses: number[] = []
    for (let i = 0; i < 6; i++) statuses.push((await POST(request({ ...base, startedAt: Date.now() - 10_000 }))).status)
    expect(statuses.slice(0, 5).every((status) => status === 200)).toBe(true)
    expect(statuses[5]).toBe(429)
  })
})
