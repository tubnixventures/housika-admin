import { redactSensitive } from '../helpers/redact';

export const logger = {
  info(message: string, meta?: Record<string, unknown>, traceId?: string) {
    const payload = meta ? redactSensitive(meta) : undefined;
    console.log(JSON.stringify({ level: 'INFO', message, meta: payload, traceId, time: new Date().toISOString() }));
  },
  warn(message: string, meta?: Record<string, unknown>, traceId?: string) {
    const payload = meta ? redactSensitive(meta) : undefined;
    console.warn(JSON.stringify({ level: 'WARN', message, meta: payload, traceId, time: new Date().toISOString() }));
  },
  error(message: string, err?: unknown, traceId?: string) {
    const errDetails = err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err;
    console.error(JSON.stringify({ level: 'ERROR', message, error: redactSensitive(errDetails), traceId, time: new Date().toISOString() }));
  },
};
