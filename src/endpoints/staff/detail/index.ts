import { Context } from 'hono';
import { StaffDetailParamSchema } from './schema';
import { jsonSuccess, jsonError } from '../../../helpers/response';
import { ERROR_CODES } from '../../../helpers/errors';
import { RequestContextUser } from '../../../types/auth';

export async function handleStaffDetail(c: Context) {
  const caller = c.get('user') as RequestContextUser;
  const { id } = StaffDetailParamSchema.parse(c.req.param());
  const accountsDb = (c.env as any).DB_ACCOUNTS;
  const profilesDb = (c.env as any).DB_PROFILES;

  const target = await accountsDb
    .prepare("SELECT * FROM accounts WHERE id = ? AND account_type = 'housika'")
    .bind(id)
    .first<any>();

  if (!target) {
    return jsonError(c, ERROR_CODES.NOT_FOUND, 'Staff account not found', 404);
  }

  // Hierarchy check: caller must dominate target level unless root
  if (caller.level !== 100 && target.level >= caller.level) {
    return jsonError(
      c,
      ERROR_CODES.HIERARCHY_RESTRICTED,
      `Caller level (${caller.level}) cannot view equal or higher level staff account (${target.level})`,
      403
    );
  }

  const profile = await profilesDb
    .prepare('SELECT * FROM profiles WHERE account_id = ?')
    .bind(id)
    .first<any>();

  return jsonSuccess(c, {
    id: target.id,
    email: target.email,
    phoneNumber: target.phone_number,
    accountType: target.account_type,
    role: target.role,
    level: target.level,
    status: target.status,
    countryId: target.country_id,
    authVersion: target.auth_version,
    emailVerifiedAt: target.email_verified_at,
    createdAt: target.created_at,
    updatedAt: target.updated_at,
    profile: profile ? {
      id: profile.id,
      name: profile.name,
      displayName: profile.display_name,
      countryName: profile.country_name,
      currency: profile.currency,
    } : null,
  });
}
