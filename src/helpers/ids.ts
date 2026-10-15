function randomId(len: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : (globalThis as any).crypto;
  const bytes = new Uint8Array(len);
  cryptoObj.getRandomValues(bytes);
  for (let i = 0; i < len; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export function generateAccountId(): string {
  return `acc_${randomId(18)}`;
}

export function generateProfileId(): string {
  return `prof_${randomId(18)}`;
}

export function generateBannerId(): string {
  return `ban_${randomId(18)}`;
}

export function generateVoucherId(): string {
  return `vch_${randomId(18)}`;
}

export function generateContactMessageId(): string {
  return `cnt_${randomId(18)}`;
}

export function generateAuditId(): string {
  return `aud_${randomId(18)}`;
}
