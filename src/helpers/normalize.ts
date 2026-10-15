export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const [local, domain] = trimmed.split('@');
  if (!domain) return trimmed;

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const strippedLocal = local.replace(/\./g, '').split('+')[0];
    return `${strippedLocal}@gmail.com`;
  }

  const cleanLocal = local.split('+')[0];
  return `${cleanLocal}@${domain}`;
}

export function normalizePhone(rawPhone: string): string {
  const digits = rawPhone.replace(/[^\d+]/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return `+254${digits.slice(1)}`;
  }
  if (!digits.startsWith('+')) {
    return `+${digits}`;
  }
  return digits;
}
