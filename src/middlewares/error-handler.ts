import { Context } from 'hono';
import { AdminApiError, ERROR_CODES } from '../helpers/errors';
import { jsonError } from '../helpers/response';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, c: Context) {
  const traceId = (c.get('traceId') as string) || 'unknown';
  logger.error(err.message, err, traceId);

  if (err instanceof AdminApiError) {
    return jsonError(c, err.code, err.message, err.statusCode, err.details);
  }

  if (err.name === 'ZodError') {
    return jsonError(c, ERROR_CODES.VALIDATION_ERROR, 'Request payload validation failed', 400, (err as any).issues);
  }

  return jsonError(c, ERROR_CODES.INTERNAL_ERROR, 'An internal error occurred', 500);
}
