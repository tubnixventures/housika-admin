export type AccountType = 'housika' | 'company' | 'individual';

export type HousikaRole = 'root' | 'ceo' | 'admin' | 'manager' | 'customercare';

export const HOUSIKA_ROLE_LEVELS: Record<HousikaRole, number> = {
  root: 100,
  ceo: 90,
  admin: 85,
  manager: 80,
  customercare: 75,
};

export interface AuthTokenClaims {
  sub: string;
  sid?: string;
  countryId?: string;
  accountType: AccountType;
  role: string;
  level: number;
  companyId?: string | null;
  scopeId?: string | null;
  authVersion: number;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  jti?: string;
}

export interface CurrentUserRecord {
  id: string;
  email: string;
  phoneNumber?: string;
  accountType: AccountType;
  role: string;
  level: number;
  status: 'active' | 'pending_verification' | 'suspended';
  authVersion: number;
  countryId: string;
  name?: string;
  displayName?: string;
}

export interface RequestContextUser extends CurrentUserRecord {
  permissions: Set<string>;
}
