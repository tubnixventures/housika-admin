import { Context, Next } from 'hono';
import { jsonError } from '../helpers/response';
import { ERROR_CODES } from '../helpers/errors';

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 180;

export async function rateLimitMiddleware(c: Context, next: Next) {
  const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || '127.0.0.1';
  const now = Date.now();
  let bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(ip, bucket);
  }

  bucket.count++;
  const remaining = Math.max(0, MAX_REQUESTS - bucket.count);
  const resetSeconds = Math.ceil((bucket.resetAt - now) / 1000);

  c.header('X-RateLimit-Limit', String(MAX_REQUESTS));
  c.header('X-RateLimit-Remaining', String(remaining));
  c.header('X-RateLimit-Reset', String(resetSeconds));

  if (bucket.count > MAX_REQUESTS) {
    return jsonError(
      c,
      ERROR_CODES.RATE_LIMITED,
      `Rate limit exceeded. Try again in ${resetSeconds} seconds.`,
      429,
      { retryAfter: resetSeconds }
    );
  }

  await next();
}
