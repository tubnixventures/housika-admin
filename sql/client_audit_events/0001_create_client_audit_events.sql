CREATE TABLE IF NOT EXISTS client_audit_events (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  account_id TEXT,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_client_audit_timestamp ON client_audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_client_audit_account ON client_audit_events(account_id);
