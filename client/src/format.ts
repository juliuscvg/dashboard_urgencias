export const integer = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
export const decimal = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const percent = (value: number | null) => value === null ? '—' : `${decimal.format(value)} %`;
export const metric = (value: number | null, suffix = '') => value === null ? '—' : `${decimal.format(value)}${suffix}`;
export const shortDate = (value: string) => new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
export const dateTime = (value: string | null) => value ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : 'Sin registro';

export function defaultDates(now = new Date()) {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(end); start.setDate(start.getDate() - 29);
  const local = (date: Date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  return { desde: local(start), hasta: local(end) };
}
