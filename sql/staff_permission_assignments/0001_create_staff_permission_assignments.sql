CREATE TABLE IF NOT EXISTS staff_permission_assignments (
  account_id TEXT NOT NULL,
  permission_key TEXT NOT NULL,
  granted_by TEXT NOT NULL,
  granted_at INTEGER NOT NULL,
  reason TEXT NOT NULL,
  PRIMARY KEY (account_id, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_staff_perm_account ON staff_permission_assignments(account_id);
