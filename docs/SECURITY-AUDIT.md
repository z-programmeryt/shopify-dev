# Security Audit

Audit date: 2026-10-15. Scope: application code, headers, API, dependencies, secrets, privacy.

## Headers (`next.config.ts`, all routes)

| Header | Value | Note |
| --- | --- | --- |
| Content-Security-Policy | `default-src 'self'`; `script-src 'self' 'unsafe-inline'` (+ Plausible origin only if configured); `style-src 'self' 'unsafe-inline'`; `img-src 'self' data: blob:`; `font-src 'self'`; `connect-src 'self'`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'self'`; `upgrade-insecure-requests` | Nonce-free by design — see trade-off below |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | Production only |
| X-Frame-Options | `SAMEORIGIN` | Disabled only when `ALLOW_EMBEDDING=true` (sandbox preview) |
| X-Content-Type-Options | `nosniff` | |
| Referrer-Policy | `strict-origin-when-cross-origin` | |
| Permissions-Policy | `camera=(), geolocation=(), payment=(), usb=(), microphone=(self)` | Mic for the opt-in voice assistant only |
| Cross-Origin-Opener-Policy | `same-origin` | |
| X-Robots-Tag | `noindex, nofollow` | Non-production + `/brand` |
| X-Powered-By | removed (`poweredByHeader: false`) | |

**CSP trade-off:** strict nonces force every page to render dynamically (no static generation), which would cost
TTFB/LCP. The site renders no user-generated HTML; the only inline script is a static class toggle and JSON-LD built
from repository data and serialised with `<` escaped. `'unsafe-eval'` is dev-only.

## Contact API (`app/api/contact/route.ts`)

- POST only (GET → 405), `Cache-Control: no-store`.
- Same-origin check on `Origin` (403 otherwise) — CSRF mitigation for a JSON endpoint.
- `Content-Type: application/json` required (415); body ≤ 16 KB (413).
- zod schema with max lengths on every field, enums for choices, URL validation/normalisation.
- Rate limit: 5 requests / 10 min / IP (429 + `Retry-After`). In-memory per instance — adequate for this traffic;
  swap for a shared store (e.g. Upstash/Redis) if abuse appears.
- Bot handling: honeypot + minimum fill time ⇒ silent fake success, nothing delivered.
- Generic error messages; no input reflected into HTML; email templates HTML-escape all user values.
- External calls (Resend, webhook) use 8 s timeouts; delivery errors logged server-side without message bodies.
- Tested in `tests/lead.test.ts` (validation, honeypot, timing, origin, content type, rate limit).

## Secrets

- None committed. `.env*` ignored (except `.env.example` with empty values). Server-only variables are never prefixed
  `NEXT_PUBLIC_`. The only public variables are the site URL and the optional Plausible domain/script.

## Dependencies

- `npm audit --omit=dev`: **0 vulnerabilities** (production dependencies: next, react, react-dom, three,
  @react-three/fiber, pdf-lib, zod).
- Dev-only: 5 "high" advisories, all one transitive chain (`eslint-config-next → @next/eslint-plugin-next → fast-glob →
  micromatch → braces`, GHSA-vfj7-8cjw-p6xm, stack exhaustion on deeply nested glob patterns). No patched `braces`
  release exists yet (≤ 3.0.3 affected); npm's suggested "fix" downgrades eslint-config-next to v14. Risk accepted:
  lint runs locally/CI on trusted repository patterns only. Re-check when a patched release ships.
- Dependency rule applied to every package: necessary? native alternative? bundle cost? maintained? SSR-safe?

## Privacy

No cookies set by the site; no third-party scripts by default; analytics opt-in via env (Plausible, cookieless);
assistant runs locally with explicit mic activation; lead data used only to reply (see `/privacy`).

## Recommendations before launch

1. Configure lead delivery (Resend and/or webhook) and verify the sending domain (SPF/DKIM) before enabling confirmations.
2. Enable Vercel's firewall/Bot protection for `/api/contact` if spam appears.
3. Keep `ALLOW_EMBEDDING` unset in production.
