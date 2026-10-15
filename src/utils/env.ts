import { Env } from '../types/env';
import { AdminApiError, ERROR_CODES } from '../helpers/errors';

export function validateEnv(env: Partial<Env>): Env {
  const secret = env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new AdminApiError(
      ERROR_CODES.DEPENDENCY_UNAVAILABLE,
      'Startup failure: JWT_ACCESS_SECRET is required.',
      503
    );
  }

  if (process.env.NODE_ENV === 'production' && (secret === 'default_secret' || secret.length < 32)) {
    throw new AdminApiError(
      ERROR_CODES.INTERNAL_ERROR,
      'Production configuration rejected: insecure or default JWT_ACCESS_SECRET detected.',
      500
    );
  }

  return {
    JWT_ACCESS_SECRET: secret,
    AUTH_BASE_URL: env.AUTH_BASE_URL || process.env.AUTH_BASE_URL || 'https://auth.housika.com',
    DB_ACCOUNTS: env.DB_ACCOUNTS!,
    DB_PROFILES: env.DB_PROFILES!,
    DB_COUNTRIES: env.DB_COUNTRIES!,
    ADMIN_BANNERS_D1: env.ADMIN_BANNERS_D1!,
    ADMIN_CONTACTS_D1: env.ADMIN_CONTACTS_D1!,
    ADMIN_VOUCHERS_D1: env.ADMIN_VOUCHERS_D1!,
    ADMIN_PERMISSIONS_D1: env.ADMIN_PERMISSIONS_D1!,
    ADMIN_AUDIT_D1: env.ADMIN_AUDIT_D1!,
    ADMIN_CLIENT_AUDIT_D1: env.ADMIN_CLIENT_AUDIT_D1!,
    COSMOS_ENDPOINT: env.COSMOS_ENDPOINT || process.env.COSMOS_ENDPOINT,
    COSMOS_KEY: env.COSMOS_KEY || process.env.COSMOS_KEY,
    ANALYTICS_DATASET: env.ANALYTICS_DATASET || 'housika_admin_analytics',
    ZEPTOMAIL_API_KEY: env.ZEPTOMAIL_API_KEY || process.env.ZEPTOMAIL_API_KEY,
    INFOBIP_API_KEY: env.INFOBIP_API_KEY || process.env.INFOBIP_API_KEY,
    PAYMENT_WEBHOOK_SECRET: env.PAYMENT_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET,
    BCRYPT_ROUNDS: Number(env.BCRYPT_ROUNDS || process.env.BCRYPT_ROUNDS || 10),
    ADMIN_FRONTEND_ORIGIN: env.ADMIN_FRONTEND_ORIGIN || process.env.ADMIN_FRONTEND_ORIGIN || '*',
  };
}
