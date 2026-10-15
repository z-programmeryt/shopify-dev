/**
 * Minimal sliding-window rate limiter (in-memory, per server instance).
 * Adequate for a low-traffic contact form. On multi-instance/serverless deployments each instance
 * keeps its own window — for stricter guarantees swap in a shared store (documented in SECURITY-AUDIT.md).
 */

const buckets = new Map<string, number[]>()
const MAX_KEYS = 5000

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const windowStart = now - windowMs
  const hits = (buckets.get(key) ?? []).filter((timestamp) => timestamp > windowStart)

  if (hits.length >= limit) {
    buckets.set(key, hits)
    const retryAfterMs = Math.max(0, (hits[0] ?? now) + windowMs - now)
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) }
  }

  hits.push(now)
  buckets.set(key, hits)

  // Bound memory: drop the oldest keys if the map grows too large.
  if (buckets.size > MAX_KEYS) {
    const overflow = buckets.size - MAX_KEYS
    let removed = 0
    for (const bucketKey of buckets.keys()) {
      buckets.delete(bucketKey)
      if (++removed >= overflow) break
    }
  }

  return { allowed: true, remaining: limit - hits.length, retryAfterSeconds: 0 }
}

export function resetRateLimits() {
  buckets.clear()
}
