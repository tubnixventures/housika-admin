import { CurrentUserRecord } from '../types/auth';
import { Env } from '../types/env';
import { localCache } from '../utils/cache';
import { AdminApiError, ERROR_CODES } from '../helpers/errors';

export class AuthClient {
  constructor(private env: Env) {}

  async getCurrentUser(accountId: string, tokenAuthVersion: number): Promise<CurrentUserRecord> {
    const cacheKey = `auth:user:${accountId}`;
    const cached = localCache.get<CurrentUserRecord>(cacheKey);
    if (cached && cached.authVersion === tokenAuthVersion) {
      return cached;
    }

    const row = await this.env.DB_ACCOUNTS.prepare(
      `SELECT a.id, a.email, a.phone_number, a.account_type, a.role, a.level, a.status, a.auth_version, a.country_id,
              p.name, p.display_name
       FROM accounts a
       LEFT JOIN profiles p ON p.account_id = a.id
       WHERE a.id = ?`
    )
      .bind(accountId)
      .first<any>();

    if (!row) {
      throw new AdminApiError(ERROR_CODES.UNAUTHORIZED, 'Account not found in Auth database', 401);
    }

    if (row.status !== 'active') {
      throw new AdminApiError(ERROR_CODES.UNAUTHORIZED, `Account status is '${row.status}'; access denied`, 401);
    }

    if (row.auth_version !== tokenAuthVersion) {
      throw new AdminApiError(ERROR_CODES.TOKEN_REVOKED, 'Session or role updated; token revoked', 401);
    }

    const user: CurrentUserRecord = {
      id: row.id,
      email: row.email,
      phoneNumber: row.phone_number,
      accountType: row.account_type,
      role: row.role,
      level: row.level,
      status: row.status,
      authVersion: row.auth_version,
      countryId: row.country_id,
      name: row.name,
      displayName: row.display_name,
    };

    localCache.set(cacheKey, user, 30);
    return user;
  }

  async checkAuthCheckConstraintAllowsHousika(): Promise<boolean> {
    const status = (this.env as any).__AUTH_CHECK_MIGRATED;
    return status !== false;
  }
}
