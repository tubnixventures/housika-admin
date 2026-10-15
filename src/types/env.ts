export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta: { changes: number; last_row_id: number } }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
  exec(query: string): Promise<unknown>;
}

export interface Env {
  JWT_ACCESS_SECRET: string;
  AUTH_BASE_URL: string;
  DB_ACCOUNTS: D1Database;
  DB_PROFILES: D1Database;
  DB_COUNTRIES: D1Database;
  ADMIN_BANNERS_D1: D1Database;
  ADMIN_CONTACTS_D1: D1Database;
  ADMIN_VOUCHERS_D1: D1Database;
  ADMIN_PERMISSIONS_D1: D1Database;
  ADMIN_AUDIT_D1: D1Database;
  ADMIN_CLIENT_AUDIT_D1: D1Database;
  COSMOS_ENDPOINT?: string;
  COSMOS_KEY?: string;
  ANALYTICS_DATASET?: string;
  ZEPTOMAIL_API_KEY?: string;
  INFOBIP_API_KEY?: string;
  PAYMENT_WEBHOOK_SECRET?: string;
  BCRYPT_ROUNDS: number;
  ADMIN_FRONTEND_ORIGIN: string;
}
