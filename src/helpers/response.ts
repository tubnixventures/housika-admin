import { Context } from 'hono';
import { ErrorCode } from './errors';

export function jsonSuccess<T>(
  c: Context,
  data: T,
  message: string = 'Operation completed successfully',
  statusCode: 200 | 201 = 200,
  meta?: Record<string, unknown>
) {
  return c.json(
    {
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    },
    statusCode
  );
}

export function jsonError(
  c: Context,
  code: ErrorCode,
  message: string,
  statusCode: number = 400,
  details?: unknown
) {
  const traceId = c.get('traceId') || 'unknown';
  return c.json(
    {
      success: false,
      message,
      error: {
        code,
        ...(details !== undefined ? { details } : {}),
      },
      traceId,
    },
    statusCode as any
  );
}
