/**
 * Analytics abstraction (brief §28). Provider-agnostic and privacy-friendly:
 *  - If Plausible is configured, events go to window.plausible (no cookies).
 *  - Otherwise events are dispatched as a DOM CustomEvent ('rl:analytics') only — nothing leaves the browser.
 * Never send personal data (names, emails, messages) as event properties.
 */

export type AnalyticsEvent =
  | 'cta_click'
  | 'contact_start'
  | 'contact_submit'
  | 'contact_error'
  | 'case_study_view'
  | 'project_open'
  | 'social_click'
  | 'resume_download'
  | 'teardown_interaction'
  | 'cro_lab_interaction'
  | 'assistant_open'
  | 'assistant_query'
  | 'assistant_voice'
  | 'engine_mode'
  | 'web_vital'

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === 'undefined') return
  try {
    window.plausible?.(event, { props })
    window.dispatchEvent(new CustomEvent('rl:analytics', { detail: { event, props } }))
  } catch {
    // Analytics must never break the page.
  }
}
