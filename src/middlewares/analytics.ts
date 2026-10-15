import { Context, Next } from 'hono';
import { analyticsEngine } from '../connectors/analytics-engine';

export async function analyticsMiddleware(c: Context, next: Next) {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  analyticsEngine.writeDataPoint({
    blobs: [c.req.method, c.req.path, String(c.res.status)],
    doubles: [duration],
    indexes: ['admin-api-calls'],
  });
}
