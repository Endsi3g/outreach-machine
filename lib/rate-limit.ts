/**
 * Simple in-memory rate limiter using a token bucket algorithm.
 * For production, replace with Redis-based rate limiting.
 */

interface RateLimitEntry {
  tokens: number
  lastRefill: number
}

const store = new Map<string, RateLimitEntry>()

const DEFAULT_MAX_TOKENS = 10
const DEFAULT_REFILL_RATE = 1 // tokens per second
const DEFAULT_INTERVAL = 1000 // ms

export interface RateLimitConfig {
  maxTokens?: number
  refillRate?: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): { success: boolean; remaining: number } {
  const maxTokens = config.maxTokens ?? DEFAULT_MAX_TOKENS
  const refillRate = config.refillRate ?? DEFAULT_REFILL_RATE

  const now = Date.now()
  let entry = store.get(identifier)

  if (!entry) {
    entry = { tokens: maxTokens - 1, lastRefill: now }
    store.set(identifier, entry)
    return { success: true, remaining: entry.tokens }
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill
  const refill = Math.floor(elapsed / DEFAULT_INTERVAL) * refillRate
  entry.tokens = Math.min(maxTokens, entry.tokens + refill)
  entry.lastRefill = now

  if (entry.tokens <= 0) {
    return { success: false, remaining: 0 }
  }

  entry.tokens -= 1
  return { success: true, remaining: entry.tokens }
}
