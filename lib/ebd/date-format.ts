/** ISO `yyyy-MM-dd` → `dd/mm` */
export function formatIsoDayMonthPtBr(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}`;
}

/** ISO `yyyy-MM-dd` → `dd/mm/yyyy` for display (pt-BR). */
export function formatIsoDatePtBr(iso: string): string {
  const dayMonth = formatIsoDayMonthPtBr(iso);
  if (!dayMonth) return '';
  const y = iso.split('-')[0];
  return `${dayMonth}/${y}`;
}

export function isoStringToLocalDate(iso: string): Date | undefined {
  const [ys, ms, ds] = iso.split('-');
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function localDateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
