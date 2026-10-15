CREATE TABLE IF NOT EXISTS admin_audit_events (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  actor_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  actor_level INTEGER NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  payload_redacted TEXT,
  trace_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_timestamp ON admin_audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_audit_actor ON admin_audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_action ON admin_audit_events(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_trace ON admin_audit_events(trace_id);
