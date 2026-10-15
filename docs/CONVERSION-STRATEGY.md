# Conversion Strategy

## CTA hierarchy (never competing)

| Level | Label | Destination | Where |
| --- | --- | --- | --- |
| Primary | Start a project | `/contact` | Header, hero, service pages, footer, final CTA |
| Secondary | Explore the work | `/work` | Hero, links hub |
| Contextual | Request a store review | `/contact?intent=review` | Final CTA, services index, Lab |

Service pages deep-link the brief form to the matching branch (`?intent=development|landing-page|cro-tracking`).

## Trust stack

Identity → Expertise → Proof → Process → Evidence → Contact — rendered as a linked strip on the homepage, with each
step backed by a page (About, Services, Proof, Process, Reviews, Contact).

## Intake form (`components/contact/IntakeForm.tsx`)

- **Adaptive branches:** Store development/design (new vs existing store, scope) · Landing/product page (builder, page
  type) · Conversion & tracking (store URL required, tracking stack) · Store review (store URL required) · Other.
- **Quick note** mode: name, email, message only.
- Optional budget range and timeline (the visitor's budget — not a price list).
- Live "Your brief so far" summary; missing items shown as "Not provided".
- Consent checkbox; honeypot + minimum fill time (bots get a silent fake success).
- Confirmation screen: reference (`RL-XXXXXXXX`), next steps, links to work/proof. No response-time promise.
- Failure: if no delivery channel is configured in production, the API returns 503 and the UI offers the verified
  Fiverr fallback — leads are never silently dropped.

## Lead pipeline (`lib/lead.ts`, `lib/lead-delivery.ts`)

Record: id, receivedAt, status, source, intent, data, deterministic summary.
Statuses: **New → Researching → Qualified → Contacted → Conversation → Proposal → Won / Lost / Nurture.**
Delivery: Resend email (`RESEND_API_KEY`, `LEAD_FROM_EMAIL`, `LEAD_TO_EMAIL`) and/or JSON webhook
(`LEAD_WEBHOOK_URL` → Slack/Make/Zapier/CRM). No database — the webhook can feed any CRM later if needed.

## Email templates (`lib/email-templates.ts`)

1. Client confirmation (automatic only if `LEAD_SEND_CONFIRMATION=true` and the sending domain is verified)
2. Internal lead notification (automatic)
3. Proposal follow-up (manual)
4. Project discussion follow-up (manual)
5. Case study follow-up (manual)

Plain, specific, no filler openers, no deceptive subjects; user input HTML-escaped. Nothing is sent in bulk or automatically to third parties.

## Analytics events (`components/analytics/track.ts`)

`cta_click` · `contact_start` · `contact_submit` · `contact_error` · `case_study_view` · `project_open` ·
`social_click` · `resume_download` · `teardown_interaction` · `cro_lab_interaction` · `assistant_open` ·
`assistant_query` · `assistant_voice` · `engine_mode` · `web_vital`. Provider-agnostic; Plausible (cookieless) if
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, otherwise events never leave the browser. No personal data in events.
Booking events are not implemented because no booking tool exists yet.

## Follow-up process (manual, human)

New lead → research store (Researching) → qualify against fit → reply with questions or scope (Contacted) →
call/thread (Conversation) → written scope (Proposal) → Won/Lost; cold-but-relevant → Nurture with a single relevant
case file follow-up — never automated sequences.
