/**
 * LEAD SYSTEM — schema, deterministic summary and lead record.
 * Server-side only (zod never ships to the browser). The summary never infers or fabricates:
 * anything the visitor did not provide is rendered as "Not provided".
 */
import { z } from 'zod'
import { BUDGETS, BUILDERS, INTENTS, SCOPE_OPTIONS, TIMELINES, TRACKING_OPTIONS, type Intent } from './lead-options'

export { BUDGETS, BUILDERS, INTENTS, SCOPE_OPTIONS, TIMELINES, TRACKING_OPTIONS, type Intent }

export const LEAD_STATUSES = [
  'New',
  'Researching',
  'Qualified',
  'Contacted',
  'Conversation',
  'Proposal',
  'Won',
  'Lost',
  'Nurture',
] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined))

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((value) => (value ? value : undefined))
  .refine((value) => {
    if (!value) return true
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
      return Boolean(url.hostname.includes('.'))
    } catch {
      return false
    }
  }, 'Enter a valid store URL')
  .transform((value) => (value && !/^https?:\/\//i.test(value) ? `https://${value}` : value))

export const leadSchema = z
  .object({
    mode: z.enum(['full', 'quick']).default('full'),
    intent: z.enum(Object.keys(INTENTS) as [Intent, ...Intent[]]).default('other'),
    name: z.string().trim().min(2, 'Please enter your name').max(100),
    email: z.string().trim().toLowerCase().email('Please enter a valid email').max(200),
    company: optionalText(120),
    storeUrl: optionalUrl,
    storeStatus: z.enum(['new', 'existing']).optional(),
    builder: z.enum(Object.keys(BUILDERS) as [keyof typeof BUILDERS, ...(keyof typeof BUILDERS)[]]).optional(),
    pageType: optionalText(80),
    scope: z.array(z.enum(SCOPE_OPTIONS)).max(SCOPE_OPTIONS.length).optional(),
    tracking: z.array(z.enum(TRACKING_OPTIONS)).max(TRACKING_OPTIONS.length).optional(),
    budget: z.enum(Object.keys(BUDGETS) as [keyof typeof BUDGETS, ...(keyof typeof BUDGETS)[]]).optional(),
    timeline: z.enum(Object.keys(TIMELINES) as [keyof typeof TIMELINES, ...(keyof typeof TIMELINES)[]]).optional(),
    message: z.string().trim().min(10, 'Tell me a little more (at least 10 characters)').max(4000),
    consent: z.literal(true, { message: 'Please confirm you agree to be contacted about this request' }),
    /** Honeypot — real visitors never see it. Accepted by the schema so bots get no signal; the route discards filled ones. */
    website: z.string().max(500).optional(),
    /** Client timestamp when the form was first rendered (bot timing check). */
    startedAt: z.number().int().positive().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'full' && (value.intent === 'review' || value.intent === 'cro-tracking') && !value.storeUrl) {
      ctx.addIssue({ code: 'custom', path: ['storeUrl'], message: 'A store URL is needed for this request' })
    }
  })

export type LeadInput = z.input<typeof leadSchema>
export type LeadData = z.output<typeof leadSchema>

export interface LeadRecord {
  id: string
  receivedAt: string
  status: LeadStatus
  source: 'website-contact-form'
  intentLabel: string
  data: Omit<LeadData, 'website' | 'startedAt'>
  summary: string
}

const NP = 'Not provided'

export function summarizeLead(data: LeadData): string {
  const lines = [
    `Intent: ${INTENTS[data.intent]}${data.mode === 'quick' ? ' (quick note)' : ''}`,
    `From: ${data.name}${data.company ? `, ${data.company}` : ''} <${data.email}>`,
    `Store: ${data.storeUrl ?? NP}${data.storeStatus ? ` (${data.storeStatus === 'new' ? 'new store' : 'existing store'})` : ''}`,
  ]
  if (data.intent === 'landing-page') {
    lines.push(`Builder: ${data.builder ? BUILDERS[data.builder] : NP}`)
    lines.push(`Page type: ${data.pageType ?? NP}`)
  }
  if (data.intent === 'development') lines.push(`Scope: ${data.scope?.length ? data.scope.join(', ') : NP}`)
  if (data.intent === 'cro-tracking') lines.push(`Tracking: ${data.tracking?.length ? data.tracking.join(', ') : NP}`)
  lines.push(`Budget: ${data.budget ? BUDGETS[data.budget] : NP}`)
  lines.push(`Timeline: ${data.timeline ? TIMELINES[data.timeline] : NP}`)
  const message = data.message.replace(/\s+/g, ' ').trim()
  lines.push(`Message: ${message.length > 400 ? `${message.slice(0, 397)}…` : message}`)
  return lines.join('\n')
}

export function createLeadRecord(data: LeadData, id: string, now = new Date()): LeadRecord {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { website, startedAt, ...rest } = data
  return {
    id,
    receivedAt: now.toISOString(),
    status: 'New',
    source: 'website-contact-form',
    intentLabel: INTENTS[data.intent],
    data: rest,
    summary: summarizeLead(data),
  }
}

/** Short human-friendly reference shown to the visitor (no personal data). */
export function leadReference(id: string): string {
  return `RL-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}
