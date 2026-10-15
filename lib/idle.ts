/** Run a callback when the browser is idle (falls back to a timeout). Returns a cancel function. */
export function onIdle(callback: () => void, timeout = 2000): () => void {
  if (typeof globalThis.requestIdleCallback === 'function') {
    const id = globalThis.requestIdleCallback(callback, { timeout })
    return () => globalThis.cancelIdleCallback(id)
  }
  const id = setTimeout(callback, Math.min(timeout, 1200))
  return () => clearTimeout(id)
}
