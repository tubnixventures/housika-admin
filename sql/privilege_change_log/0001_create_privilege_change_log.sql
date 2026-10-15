CREATE TABLE IF NOT EXISTS privilege_change_log (
  id TEXT PRIMARY KEY,
  target_account_id TEXT NOT NULL,
  permission_key TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('grant', 'revoke')),
  performed_by TEXT NOT NULL,
  performed_at INTEGER NOT NULL,
  reason TEXT NOT NULL,
  trace_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_priv_log_target ON privilege_change_log(target_account_id);
CREATE INDEX IF NOT EXISTS idx_priv_log_performed_by ON privilege_change_log(performed_by);
