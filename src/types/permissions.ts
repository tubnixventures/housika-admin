export const PERMISSION_KEYS = [
  'dashboard.read',
  'analytics.read',
  'staff.read',
  'staff.create',
  'staff.role.assign',
  'staff.suspend',
  'privileges.read',
  'privileges.assign',
  'countries.read',
  'countries.manage',
  'banners.read',
  'banners.manage',
  'contacts.read',
  'contacts.manage',
  'contacts.reply',
  'vouchers.read',
  'vouchers.manage',
  'properties.read',
  'properties.moderate',
  'units.read',
  'units.moderate',
  'bookings.read',
  'bookings.review',
  'payments.read',
  'payments.reconcile',
  'payouts.read',
  'payouts.approve',
  'audit.admin.read',
  'audit.auth.read',
  'audit.client.read',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export interface PermissionCatalogEntry {
  permission_key: PermissionKey;
  module: string;
  description: string;
  minimum_level: number;
}
