'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  BUDGETS,
  BUILDERS,
  INTENT_HINTS,
  INTENTS,
  SCOPE_OPTIONS,
  TIMELINES,
  TRACKING_OPTIONS,
  isIntent,
  type Intent,
} from '@/lib/lead-options'
import { track } from '@/components/analytics/track'

type Status = 'idle' | 'submitting' | 'success' | 'error'
type Mode = 'full' | 'quick'

interface FormState {
  intent: Intent
  storeStatus: '' | 'new' | 'existing'
  storeUrl: string
  builder: '' | keyof typeof BUILDERS
  pageType: string
  scope: string[]
  tracking: string[]
  budget: '' | keyof typeof BUDGETS
  timeline: '' | keyof typeof TIMELINES
  name: string
  email: string
  company: string
  message: string
  consent: boolean
  website: string
}

const initialState = (intent: Intent): FormState => ({
  intent,
  storeStatus: '',
  storeUrl: '',
  builder: '',
  pageType: '',
  scope: [],
  tracking: [],
  budget: '',
  timeline: '',
  name: '',
  email: '',
  company: '',
  message: '',
  consent: false,
  website: '',
})

const inputClass =
  'w-full rounded-lg border border-line-strong bg-white px-4 py-3 text-ink placeholder:text-subtle transition-colors focus:border-emerald-600 focus:outline-none aria-[invalid=true]:border-red-700'

function Field({ id, label, hint, error, children, optional }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
        {label}
        {optional ? <span className="text-xs font-normal text-subtle">Optional</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ChoiceChips<T extends string>({
  name,
  options,
  value,
  onChange,
  multiple = false,
  legend,
}: {
  name: string
  options: Record<string, string> | readonly string[]
  value: T | T[]
  onChange: (value: T) => void
  multiple?: boolean
  legend: string
}) {
  const entries: [string, string][] = Array.isArray(options) ? options.map((option) => [option, option]) : Object.entries(options)
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {entries.map(([key, label]) => {
          const checked = multiple ? (value as T[]).includes(key as T) : value === key
          return (
            <label
              key={key}
              className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-emerald-500 ${
                checked ? 'border-navy-900 bg-navy-900 text-white' : 'border-line-strong bg-white text-ink hover:border-ink'
              }`}
            >
              <input type={multiple ? 'checkbox' : 'radio'} name={name} value={key} checked={checked} onChange={() => onChange(key as T)} className="sr-only" />
              {label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/**
 * Adaptive intake form (brief §16): branches for development, landing pages, CRO/tracking and
 * store reviews; a quick-note mode; honeypot + timing bot checks; inline server validation; and a
 * confirmation screen with next steps. Nothing is pre-filled or inferred on the visitor's behalf.
 */
export function IntakeForm() {
  const params = useSearchParams()
  const paramIntent = params.get('intent')
  const startIntent: Intent = isIntent(paramIntent) ? paramIntent : 'development'
  const [mode, setMode] = useState<Mode>('full')
  const [state, setState] = useState<FormState>(() => initialState(startIntent))
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [fallback, setFallback] = useState<{ label: string; href: string } | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const startedAt = useRef<number>(0)
  const started = useRef(false)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    if (!started.current) {
      started.current = true
      track('contact_start', { intent: state.intent, mode })
    }
    setState((current) => ({ ...current, [key]: value }))
    if (errors[key as string]) setErrors((current) => ({ ...current, [key as string]: '' }))
  }

  const toggleIn = (key: 'scope' | 'tracking', value: string) =>
    set(key, state[key].includes(value) ? state[key].filter((item) => item !== value) : [...state[key], value])

  const needsUrl = mode === 'full' && (state.intent === 'review' || state.intent === 'cro-tracking')

  const summary = useMemo(() => {
    const rows: [string, string][] = [['Request', mode === 'quick' ? 'Quick note' : INTENTS[state.intent]]]
    if (mode === 'full') {
      if (state.storeUrl) rows.push(['Store', state.storeUrl])
      if (state.storeStatus) rows.push(['Store status', state.storeStatus === 'new' ? 'New store' : 'Existing store'])
      if (state.intent === 'landing-page' && state.builder) rows.push(['Builder', BUILDERS[state.builder]])
      if (state.intent === 'landing-page' && state.pageType) rows.push(['Page', state.pageType])
      if (state.intent === 'development' && state.scope.length) rows.push(['Scope', state.scope.join(', ')])
      if (state.intent === 'cro-tracking' && state.tracking.length) rows.push(['Tracking', state.tracking.join(', ')])
      rows.push(['Budget', state.budget ? BUDGETS[state.budget] : 'Not provided'])
      rows.push(['Timeline', state.timeline ? TIMELINES[state.timeline] : 'Not provided'])
    }
    return rows
  }, [state, mode])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setFormError(null)
    setFallback(null)
    setErrors({})
    const payload =
      mode === 'quick'
        ? { mode, intent: 'other', name: state.name, email: state.email, message: state.message, consent: state.consent, website: state.website, startedAt: startedAt.current }
        : {
            mode,
            intent: state.intent,
            name: state.name,
            email: state.email,
            company: state.company || undefined,
            storeUrl: state.storeUrl || undefined,
            storeStatus: state.storeStatus || undefined,
            builder: state.intent === 'landing-page' ? state.builder || undefined : undefined,
            pageType: state.intent === 'landing-page' ? state.pageType || undefined : undefined,
            scope: state.intent === 'development' && state.scope.length ? state.scope : undefined,
            tracking: state.intent === 'cro-tracking' && state.tracking.length ? state.tracking : undefined,
            budget: state.budget || undefined,
            timeline: state.timeline || undefined,
            message: state.message,
            consent: state.consent,
            website: state.website,
            startedAt: startedAt.current,
          }
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { ok: boolean; reference?: string; error?: string; fieldErrors?: Record<string, string>; fallback?: { label: string; href: string } }
      if (response.ok && data.ok) {
        setReference(data.reference ?? null)
        setStatus('success')
        track('contact_submit', { intent: mode === 'quick' ? 'quick' : state.intent })
        requestAnimationFrame(() => successRef.current?.focus())
        return
      }
      setErrors(data.fieldErrors ?? {})
      setFormError(data.error ?? 'Something went wrong. Please try again.')
      setFallback(data.fallback ?? null)
      setStatus('error')
      track('contact_error', { status: response.status })
    } catch {
      setFormError('The network request failed. Please check your connection and try again.')
      setStatus('error')
      track('contact_error', { status: 0 })
    }
  }

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} className="rounded-xl border border-line bg-white p-8 shadow-card outline-none md:p-10" role="status">
        <p className="label-mono text-emerald-700">Brief received</p>
        <h2 className="text-h2 mt-4 text-ink">Thanks{state.name ? `, ${state.name.split(' ')[0]}` : ''}.</h2>
        {reference ? (
          <p className="mt-3 text-muted">
            Your reference: <span className="font-mono text-ink">{reference}</span>
          </p>
        ) : null}
        <ol className="mt-8 space-y-4">
          {[
            ['Review', state.storeUrl ? 'Ring Lot reads your brief and looks at your store.' : 'Ring Lot reads your brief.'],
            ['Reply', 'You get clarifying questions or a suggested scope by email.'],
            ['Agree', 'Nothing starts until scope, timeline and price are agreed in writing.'],
          ].map(([title, body], index) => (
            <li key={title} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="label-mono pt-1 text-emerald-700">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="block font-semibold text-ink">{title}</span>
                <span className="block text-muted">{body}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link href="/work" className="rounded-full border border-line-strong px-4 py-2 text-ink hover:border-ink">
            Explore the work
          </Link>
          <Link href="/proof" className="rounded-full border border-line-strong px-4 py-2 text-ink hover:border-ink">
            See the proof
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <form onSubmit={onSubmit} noValidate={false} className="space-y-10 rounded-xl border border-line bg-white p-6 shadow-card md:p-8" aria-describedby="form-note">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-mono text-subtle">Project brief</p>
          <div className="inline-flex rounded-full border border-line p-1 text-sm" role="group" aria-label="Form length">
            {(['full', 'quick'] as Mode[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={mode === option}
                onClick={() => setMode(option)}
                className={`rounded-full px-3.5 py-1.5 transition-colors ${mode === option ? 'bg-navy-900 text-white' : 'text-muted hover:text-ink'}`}
              >
                {option === 'full' ? 'Full brief' : 'Quick note'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'full' ? (
          <>
            <fieldset>
              <legend className="text-h3 text-ink">
                <span className="label-mono mr-3 align-middle text-emerald-700">01</span>What do you need?
              </legend>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(Object.keys(INTENTS) as Intent[]).map((intent) => (
                  <label
                    key={intent}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-emerald-500 ${
                      state.intent === intent ? 'border-navy-900 bg-navy-900 text-white' : 'border-line-strong hover:border-ink'
                    }`}
                  >
                    <input type="radio" name="intent" value={intent} checked={state.intent === intent} onChange={() => set('intent', intent)} className="sr-only" />
                    <span className="block font-medium">{INTENTS[intent]}</span>
                    <span className={`mt-1 block text-sm ${state.intent === intent ? 'text-silver-300' : 'text-muted'}`}>{INTENT_HINTS[intent]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="text-h3 text-ink">
                <span className="label-mono mr-3 align-middle text-emerald-700">02</span>About the store
              </legend>
              {state.intent === 'development' ? (
                <ChoiceChips legend="Is this a new or existing store?" name="storeStatus" options={{ new: 'New store', existing: 'Existing store' }} value={state.storeStatus} onChange={(value) => set('storeStatus', value as FormState['storeStatus'])} />
              ) : null}
              {state.intent !== 'other' && !(state.intent === 'development' && state.storeStatus === 'new') ? (
                <Field id="storeUrl" label="Store URL" hint={needsUrl ? 'Needed so the store can be reviewed before replying.' : undefined} optional={!needsUrl} error={errors.storeUrl}>
                  <input
                    id="storeUrl"
                    name="storeUrl"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="yourstore.com"
                    required={needsUrl}
                    value={state.storeUrl}
                    onChange={(event) => set('storeUrl', event.target.value)}
                    aria-invalid={Boolean(errors.storeUrl)}
                    aria-describedby={errors.storeUrl ? 'storeUrl-error' : needsUrl ? 'storeUrl-hint' : undefined}
                    className={inputClass}
                    maxLength={300}
                  />
                </Field>
              ) : null}
              {state.intent === 'development' ? (
                <ChoiceChips legend="What is in scope?" name="scope" multiple options={SCOPE_OPTIONS} value={state.scope} onChange={(value) => toggleIn('scope', value)} />
              ) : null}
              {state.intent === 'landing-page' ? (
                <>
                  <ChoiceChips legend="Which builder?" name="builder" options={BUILDERS} value={state.builder} onChange={(value) => set('builder', value as FormState['builder'])} />
                  <Field id="pageType" label="What kind of page?" optional>
                    <input id="pageType" name="pageType" placeholder="e.g. one-product page for a launch campaign" value={state.pageType} onChange={(event) => set('pageType', event.target.value)} className={inputClass} maxLength={80} />
                  </Field>
                </>
              ) : null}
              {state.intent === 'cro-tracking' ? (
                <ChoiceChips legend="Which tracking is involved?" name="tracking" multiple options={TRACKING_OPTIONS} value={state.tracking} onChange={(value) => toggleIn('tracking', value)} />
              ) : null}
              <div className="grid gap-6 md:grid-cols-2">
                <ChoiceChips legend="Budget range (optional)" name="budget" options={BUDGETS} value={state.budget} onChange={(value) => set('budget', state.budget === value ? '' : (value as FormState['budget']))} />
                <ChoiceChips legend="Timeline (optional)" name="timeline" options={TIMELINES} value={state.timeline} onChange={(value) => set('timeline', state.timeline === value ? '' : (value as FormState['timeline']))} />
              </div>
            </fieldset>
          </>
        ) : null}

        <fieldset className="space-y-6">
          <legend className="text-h3 text-ink">
            {mode === 'full' ? <span className="label-mono mr-3 align-middle text-emerald-700">03</span> : null}
            {mode === 'full' ? 'About you' : 'A quick note'}
          </legend>
          <div className="grid gap-6 md:grid-cols-2">
            <Field id="name" label="Name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={state.name} onChange={(event) => set('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} className={inputClass} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} value={state.email} onChange={(event) => set('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className={inputClass} />
            </Field>
          </div>
          {mode === 'full' ? (
            <Field id="company" label="Company or brand" optional>
              <input id="company" name="company" autoComplete="organization" maxLength={120} value={state.company} onChange={(event) => set('company', event.target.value)} className={inputClass} />
            </Field>
          ) : null}
          <Field
            id="message"
            label={state.intent === 'review' && mode === 'full' ? 'What worries you most about the store?' : 'What is going on?'}
            hint="What you sell, what is not working, any links or deadlines. Rough is fine."
            error={errors.message}
          >
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              value={state.message}
              onChange={(event) => set('message', event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : 'message-hint'}
              className={inputClass}
            />
          </Field>
          {/* Honeypot: hidden from people, tempting for bots. */}
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={state.website} onChange={(event) => set('website', event.target.value)} />
          </div>
          <div>
            <label className="flex items-start gap-3 text-sm text-muted">
              <input type="checkbox" required checked={state.consent} onChange={(event) => set('consent', event.target.checked)} className="mt-1 h-4 w-4 accent-emerald-600" aria-invalid={Boolean(errors.consent)} />
              <span>
                I agree to be contacted about this request. Details are used only to reply — see the{' '}
                <Link href="/privacy" className="underline underline-offset-4">
                  privacy notice
                </Link>
                .
              </span>
            </label>
            {errors.consent ? (
              <p className="mt-1.5 text-sm text-red-700" role="alert">
                {errors.consent}
              </p>
            ) : null}
          </div>
        </fieldset>

        {formError ? (
          <div className="rounded-lg border border-red-700/30 bg-[#fdf2f1] px-4 py-3 text-sm text-ink" role="alert">
            {formError}
            {fallback ? (
              <>
                {' '}
                <a href={fallback.href} target="_blank" rel="noopener" className="font-medium underline">
                  {fallback.label} ↗
                </a>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p id="form-note" className="max-w-sm text-xs text-muted">
            No newsletter, no automated sales sequence. You will get a personal reply.
          </p>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-medium text-white transition-colors hover:bg-navy-700 disabled:cursor-wait disabled:opacity-70"
          >
            {status === 'submitting' ? 'Sending…' : 'Send the brief'} <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-xl border border-line bg-paper-2 p-5">
          <p className="label-mono text-subtle">Your brief so far</p>
          <dl className="mt-4 space-y-3 text-sm">
            {summary.map(([term, value]) => (
              <div key={term}>
                <dt className="text-xs text-muted">{term}</dt>
                <dd className={`mt-0.5 break-words ${value === 'Not provided' ? 'text-subtle' : 'text-ink'}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  )
}
