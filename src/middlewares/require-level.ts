import { Context, Next } from 'hono';
import { jsonError } from '../helpers/response';
import { ERROR_CODES } from '../helpers/errors';
import { RequestContextUser } from '../types/auth';

export function requireLevel(minimumLevel: number) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as RequestContextUser | undefined;

    if (!user) {
      return jsonError(c, ERROR_CODES.UNAUTHORIZED, 'Authentication required', 401);
    }

    if (user.level < minimumLevel) {
      return jsonError(
        c,
        ERROR_CODES.HIERARCHY_RESTRICTED,
        `Insufficient privilege level. Required minimum level is ${minimumLevel}, but caller has level ${user.level}.`,
        403,
        { requiredLevel: minimumLevel, userLevel: user.level }
      );
    }

    await next();
  };
}
