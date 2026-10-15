CREATE TABLE IF NOT EXISTS permission_catalog (
  permission_key TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  description TEXT NOT NULL,
  minimum_level INTEGER NOT NULL DEFAULT 75,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_perm_catalog_module ON permission_catalog(module);
