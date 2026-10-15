import { Context, Next } from 'hono';

export async function traceMiddleware(c: Context, next: Next) {
  const incoming = c.req.header('x-trace-id');
  const traceId = incoming || `hsk_trc_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  c.set('traceId', traceId);
  await next();
  c.header('x-trace-id', traceId);
}
