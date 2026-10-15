import { Context, Next } from 'hono';
import { jsonError } from '../helpers/response';
import { ERROR_CODES } from '../helpers/errors';
import { PermissionKey } from '../types/permissions';
import { RequestContextUser } from '../types/auth';

export function requirePermission(permissionKey: PermissionKey) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as RequestContextUser | undefined;

    if (!user) {
      return jsonError(c, ERROR_CODES.UNAUTHORIZED, 'Authentication required', 401);
    }

    if (user.role === 'root' || user.permissions.has('*') || user.permissions.has(permissionKey)) {
      return next();
    }

    return jsonError(
      c,
      ERROR_CODES.PERMISSION_DENIED,
      `Permission denied: Missing required permission '${permissionKey}'.`,
      403,
      { requiredPermission: permissionKey }
    );
  };
}
