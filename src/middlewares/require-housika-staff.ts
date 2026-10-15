import { Context, Next } from 'hono';
import { jsonError } from '../helpers/response';
import { ERROR_CODES } from '../helpers/errors';
import { RequestContextUser } from '../types/auth';

const VALID_STAFF_ROLES = new Set(['root', 'ceo', 'admin', 'manager', 'customercare']);

export async function requireHousikaStaffMiddleware(c: Context, next: Next) {
  const user = c.get('user') as RequestContextUser | undefined;

  if (!user) {
    return jsonError(c, ERROR_CODES.UNAUTHORIZED, 'Authentication required', 401);
  }

  if (user.accountType === 'company' || user.accountType === 'individual') {
    return jsonError(
      c,
      ERROR_CODES.ACCOUNT_TYPE_FORBIDDEN,
      `Account type '${user.accountType}' is forbidden from accessing the Admin Backend. Only platform staff ('housika') are authorized.`,
      403,
      { receivedAccountType: user.accountType }
    );
  }

  if (user.accountType !== 'housika') {
    return jsonError(
      c,
      ERROR_CODES.ACCOUNT_TYPE_FORBIDDEN,
      `Invalid account type '${user.accountType}'`,
      403
    );
  }

  if (!VALID_STAFF_ROLES.has(user.role)) {
    return jsonError(
      c,
      ERROR_CODES.ROLE_FORBIDDEN,
      `Staff role '${user.role}' is not a recognized Housika administrative role.`,
      403
    );
  }

  if (user.status !== 'active') {
    return jsonError(
      c,
      ERROR_CODES.UNAUTHORIZED,
      `Account status is '${user.status}'. Active status required.`,
      401
    );
  }

  await next();
}
