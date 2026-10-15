/**
 * Lead delivery adapters. No SDKs — plain fetch to keep the dependency surface small.
 *  - Resend REST API (email): RESEND_API_KEY + LEAD_FROM_EMAIL + LEAD_TO_EMAIL
 *  - Generic JSON webhook (Slack/Make/Zapier/CRM): LEAD_WEBHOOK_URL
 *  - Log-only (preview/staging/dev): LEAD_DELIVERY=log, or automatically in development
 * Production with no channel configured returns `delivered: false` so the UI can offer the
 * verified fallback (Fiverr) instead of silently dropping the lead.
 */
import { clientConfirmationEmail, internalLeadEmail, type EmailContent } from './email-templates'
import type { LeadRecord } from './lead'

export interface DeliveryResult {
  delivered: boolean
  channels: string[]
  errors: string[]
}

async function sendResendEmail(to: string, from: string, apiKey: string, email: EmailContent, replyTo?: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject: email.subject, text: email.text, html: email.html, reply_to: replyTo }),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`Resend responded ${response.status}`)
}

export async function deliverLead(lead: LeadRecord, reference: string): Promise<DeliveryResult> {
  const result: DeliveryResult = { delivered: false, channels: [], errors: [] }
  const { RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_TO_EMAIL, LEAD_WEBHOOK_URL, LEAD_SEND_CONFIRMATION, LEAD_DELIVERY } = process.env

  if (RESEND_API_KEY && LEAD_FROM_EMAIL && LEAD_TO_EMAIL) {
    try {
      await sendResendEmail(LEAD_TO_EMAIL, LEAD_FROM_EMAIL, RESEND_API_KEY, internalLeadEmail(lead, reference), lead.data.email)
      result.channels.push('email')
      if (LEAD_SEND_CONFIRMATION === 'true') {
        // Best effort: a failed confirmation must not fail the lead itself.
        await sendResendEmail(lead.data.email, LEAD_FROM_EMAIL, RESEND_API_KEY, clientConfirmationEmail(lead, reference)).catch(
          (error: unknown) => result.errors.push(`confirmation: ${(error as Error).message}`),
        )
      }
    } catch (error) {
      result.errors.push(`email: ${(error as Error).message}`)
    }
  }

  if (LEAD_WEBHOOK_URL) {
    try {
      const response = await fetch(LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, ...lead }),
        signal: AbortSignal.timeout(8000),
      })
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`)
      result.channels.push('webhook')
    } catch (error) {
      result.errors.push(`webhook: ${(error as Error).message}`)
    }
  }

  const logOnly = LEAD_DELIVERY === 'log' || (process.env.NODE_ENV !== 'production' && result.channels.length === 0)
  if (result.channels.length === 0 && logOnly) {
    // Preview/dev only: log the summary (no raw message body beyond the summary) so the flow can be tested.
    console.info(`[lead:${reference}] (log-only delivery)\n${lead.summary}`)
    result.channels.push('log')
  }

  result.delivered = result.channels.length > 0
  if (result.errors.length) console.error(`[lead:${reference}] delivery errors: ${result.errors.join('; ')}`)
  return result
}
