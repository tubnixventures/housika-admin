import { Context } from 'hono';
import { StaffListQuerySchema } from './schema';
import { parsePagination, paginationMeta } from '../../../helpers/pagination';
import { jsonSuccess } from '../../../helpers/response';
import { RequestContextUser } from '../../../types/auth';

export async function handleListStaff(c: Context) {
  const caller = c.get('user') as RequestContextUser;
  const query = StaffListQuerySchema.parse(c.req.query());
  const pagination = parsePagination(query.page, query.limit);
  const accountsDb = (c.env as any).DB_ACCOUNTS;
  const profilesDb = (c.env as any).DB_PROFILES;

  const allAccounts = (
    await accountsDb
      .prepare("SELECT * FROM accounts WHERE account_type = 'housika'")
      .all<any>()
  ).results;

  const allProfiles = (
    await profilesDb.prepare('SELECT * FROM profiles').all<any>()
  ).results;

  // Filter by caller hierarchy: only level < caller.level (unless caller is root)
  const allowed = allAccounts.filter((acc) => {
    if (caller.level !== 100 && acc.level >= caller.level) return false;
    if (query.role && acc.role !== query.role) return false;
    if (query.status && acc.status !== query.status) return false;
    if (query.search) {
      const q = query.search.toLowerCase();
      return acc.email.toLowerCase().includes(q) || acc.phone_number?.includes(q);
    }
    return true;
  });

  const paged = allowed.slice(pagination.offset, pagination.offset + pagination.limit);
  const sanitized = paged.map((acc) => {
    const prof = allProfiles.find((p) => p.account_id === acc.id);
    return {
      id: acc.id,
      email: acc.email,
      phoneNumber: acc.phone_number,
      accountType: acc.account_type,
      role: acc.role,
      level: acc.level,
      status: acc.status,
      countryId: acc.country_id,
      authVersion: acc.auth_version,
      createdAt: acc.created_at,
      updatedAt: acc.updated_at,
      profile: prof ? {
        id: prof.id,
        name: prof.name,
        displayName: prof.display_name,
        currency: prof.currency,
      } : null,
    };
  });

  return jsonSuccess(c, sanitized, 'Staff accounts retrieved', 200, paginationMeta(allowed.length, pagination));
}
