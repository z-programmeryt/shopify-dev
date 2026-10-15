/**
 * EMAIL TEMPLATES (brief §20) — plain, specific, no filler openers, no deceptive subjects.
 * 1. Client confirmation (automatic, only if LEAD_SEND_CONFIRMATION=true)
 * 2. Internal lead notification (automatic)
 * 3. Proposal follow-up        (manual — never sent automatically)
 * 4. Project discussion follow-up (manual)
 * 5. Case study follow-up      (manual)
 * Placeholders in [brackets] must be filled by a human before sending manual templates.
 */
import type { LeadRecord } from './lead'
import { siteConfig } from '@/data/site-config'

export interface EmailContent {
  subject: string
  text: string
  html: string
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function wrapHtml(body: string): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f6f2;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0b1222;line-height:1.55"><div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3e6ec;border-radius:12px;padding:28px">${body}<p style="margin-top:28px;padding-top:16px;border-top:1px solid #e3e6ec;font-size:13px;color:#50607a">Ring Lot Morong · Shopify Developer &amp; Designer<br><a href="${siteConfig.url}" style="color:#0b7a57">${siteConfig.url.replace(/^https?:\/\//, '')}</a></p></div></body></html>`
}

function toHtmlParagraphs(text: string): string {
  return text
    .split('\n\n')
    .map((paragraph) => `<p style="margin:0 0 14px">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name

/** 1 — Client confirmation. */
export function clientConfirmationEmail(lead: LeadRecord, reference: string): EmailContent {
  const subject = `Received: your ${lead.intentLabel.toLowerCase()} request (${reference})`
  const text = `Hi ${firstName(lead.data.name)},

Thanks for the brief — it has been received. Your reference is ${reference}.

What happens next:
1. Ring Lot reviews your message${lead.data.storeUrl ? ' and looks at your store' : ''}.
2. You get a reply with clarifying questions or a suggested scope.
3. Nothing starts until scope, timeline and price are agreed in writing.

If you want to add anything, reply to this email.

— Ring Lot Morong`
  return { subject, text, html: wrapHtml(toHtmlParagraphs(text)) }
}

/** 2 — Internal lead notification. */
export function internalLeadEmail(lead: LeadRecord, reference: string): EmailContent {
  const subject = `New lead ${reference}: ${lead.intentLabel}${lead.data.company ? ` — ${lead.data.company}` : ''}`
  const text = `New website lead (${reference})
Status: ${lead.status}
Received: ${lead.receivedAt}

${lead.summary}

Next action: research the store (if provided), then move the lead to "Researching" or "Qualified".`
  return { subject, text, html: wrapHtml(`<pre style="white-space:pre-wrap;font:13px/1.6 ui-monospace,Menlo,monospace">${escapeHtml(text)}</pre>`) }
}

/** 3 — Proposal follow-up (manual). */
export function proposalFollowUpEmail(input: { name: string; proposalTitle: string; keyQuestion: string }): EmailContent {
  const subject = `Proposal: ${input.proposalTitle} — any questions?`
  const text = `Hi ${firstName(input.name)},

Following up on the proposal for ${input.proposalTitle}. If anything in the scope is unclear or should change, tell me and I will revise it.

One thing that would help me finalise it: ${input.keyQuestion}

— Ring Lot`
  return { subject, text, html: wrapHtml(toHtmlParagraphs(text)) }
}

/** 4 — Project discussion follow-up (manual). */
export function discussionFollowUpEmail(input: { name: string; topic: string; agreedPoints: string[]; nextStep: string }): EmailContent {
  const subject = `Notes from our call: ${input.topic}`
  const text = `Hi ${firstName(input.name)},

Notes from our conversation about ${input.topic}:

${input.agreedPoints.map((point) => `- ${point}`).join('\n')}

Next step: ${input.nextStep}

Reply if I missed or misunderstood anything.

— Ring Lot`
  return { subject, text, html: wrapHtml(toHtmlParagraphs(text)) }
}

/** 5 — Case study follow-up (manual). */
export function caseStudyFollowUpEmail(input: { name: string; caseStudyTitle: string; caseStudyUrl: string; relevance: string }): EmailContent {
  const subject = `Related work: ${input.caseStudyTitle}`
  const text = `Hi ${firstName(input.name)},

You mentioned ${input.relevance}. This case file covers a similar problem and shows what was documented about the approach:

${input.caseStudyUrl}

Happy to walk through it if useful.

— Ring Lot`
  return { subject, text, html: wrapHtml(toHtmlParagraphs(text)) }
}
