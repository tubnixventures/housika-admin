CREATE TABLE IF NOT EXISTS vouchers (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  voucher_type TEXT NOT NULL CHECK (voucher_type IN ('percentage', 'fixed_amount', 'free_listing', 'free_booking')),
  value REAL NOT NULL,
  currency TEXT,
  max_uses INTEGER NOT NULL DEFAULT 100,
  used_count INTEGER NOT NULL DEFAULT 0,
  max_uses_per_user INTEGER NOT NULL DEFAULT 1,
  applicable_to TEXT NOT NULL CHECK (applicable_to IN ('listing_fee', 'booking_fee', 'all')),
  country_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'expired', 'archived')),
  starts_at INTEGER,
  ends_at INTEGER,
  metadata TEXT,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);
