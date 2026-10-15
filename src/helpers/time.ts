export function nowEpochSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function toEpochSeconds(dateStr: string | number | Date): number {
  if (typeof dateStr === 'number') {
    return dateStr > 1e11 ? Math.floor(dateStr / 1000) : dateStr;
  }
  return Math.floor(new Date(dateStr).getTime() / 1000);
}
