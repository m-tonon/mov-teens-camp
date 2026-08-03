/** EBD age: optional, max 2 digits (0–99). */
export const EBD_MAX_AGE = 99;

export function sanitizeAgeDigitsInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 2);
}

export function parseOptionalAge(value: unknown): number | undefined {
  if (value === '' || value === undefined || value === null) {
    return undefined;
  }
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isInteger(n) || n < 0 || n > EBD_MAX_AGE) {
    return undefined;
  }
  return n;
}
