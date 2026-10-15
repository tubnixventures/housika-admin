import { Context, Next } from 'hono';
import { verifyHousikaJwt } from '../utils/jwt';
import { AuthClient } from '../connectors/auth-client';
import { jsonError } from '../helpers/response';
import { ERROR_CODES, AdminApiError } from '../helpers/errors';
import { RequestContextUser } from '../types/auth';

export async function authenticateMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return jsonError(c, ERROR_CODES.UNAUTHORIZED, 'Missing Bearer token in Authorization header', 401);
  }

  const token = authHeader.substring(7).trim();
  const secret = (c.env as any)?.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET || 'fallback_secret_32chars_long_min!';

  let claims;
  try {
    claims = await verifyHousikaJwt(token, secret);
  } catch (err: any) {
    const code = err instanceof AdminApiError ? err.code : ERROR_CODES.TOKEN_INVALID;
    return jsonError(c, code, err.message, 401);
  }

  const authClient = new AuthClient(c.env as any);
  let currentUser;
  try {
    currentUser = await authClient.getCurrentUser(claims.sub, claims.authVersion);
  } catch (err: any) {
    const code = err instanceof AdminApiError ? err.code : ERROR_CODES.UNAUTHORIZED;
    return jsonError(c, code, err.message, err.statusCode || 401);
  }

  // Load granted permissions from DB_ADMIN
  const permDb = (c.env as any)?.ADMIN_PERMISSIONS_D1;
  const permissions = new Set<string>();

  if (currentUser.role === 'root') {
    // Root implicitly holds all permissions
    permissions.add('*');
  } else if (permDb) {
    try {
      const rows = (
        await permDb
          .prepare('SELECT permission_key FROM staff_permission_assignments WHERE account_id = ?')
          .bind(currentUser.id)
          .all<{ permission_key: string }>()
      ).results;
      rows.forEach((r) => permissions.add(r.permission_key));
    } catch {
      // If table empty or error, permissions remain default
    }
  }

  const userContext: RequestContextUser = {
    ...currentUser,
    permissions,
  };

  c.set('user', userContext);
  c.set('claims', claims);

  await next();
}
