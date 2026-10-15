import { Context } from 'hono';
import { generateAuditId } from './ids';
import { nowEpochSeconds } from './time';
import { redactSensitive } from './redact';
import { AdminApiError, ERROR_CODES } from './errors';
import { RequestContextUser } from '../types/auth';

export async function writeAdminAudit(
  c: Context,
  action: string,
  targetType: string,
  targetId: string,
  payload?: unknown,
  isHighRisk: boolean = false
): Promise<void> {
  const user = c.get('user') as RequestContextUser | undefined;
  const traceId = (c.get('traceId') as string) || 'unknown';
  const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || '127.0.0.1';
  const userAgent = c.req.header('user-agent') || 'unknown';
  const db = (c.env as any)?.ADMIN_AUDIT_D1;

  if (!db) return;

  const id = generateAuditId();
  const timestamp = nowEpochSeconds();
  const redacted = payload ? JSON.stringify(redactSensitive(payload)) : null;

  try {
    await db
      .prepare(
        `INSERT INTO admin_audit_events (id, timestamp, actor_id, actor_email, actor_role, actor_level, action, target_type, target_id, payload_redacted, trace_id, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        timestamp,
        user?.id || 'system',
        user?.email || 'system@housika.com',
        user?.role || 'system',
        user?.level || 0,
        action,
        targetType,
        targetId,
        redacted,
        traceId,
        ip,
        userAgent
      )
      .run();
  } catch (err: any) {
    if (isHighRisk) {
      throw new AdminApiError(
        ERROR_CODES.AUDIT_WRITE_FAILED,
        `High-risk mutation aborted because audit log could not be written: ${err.message}`,
        500
      );
    }
  }
}
