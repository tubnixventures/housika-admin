const SENSITIVE_KEYS = new Set([
  'password',
  'password_hash',
  'token',
  'access_token',
  'refresh_token',
  'jwt_access_secret',
  'secret',
  'card_number',
  'cvv',
]);

export function redactSensitive(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redactSensitive);

  const copy: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      copy[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      copy[key] = redactSensitive(val);
    } else {
      copy[key] = val;
    }
  }
  return copy;
}
