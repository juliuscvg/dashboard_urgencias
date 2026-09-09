const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDate(value: string): Date {
  if (!ISO_DATE.test(value)) throw new Error('Fecha inválida');
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error('Fecha inválida');
  }
  return parsed;
}

export function validatePeriod(desde: string, hasta: string): void {
  const start = parseIsoDate(desde);
  const end = parseIsoDate(hasta);
  if (end < start) throw new Error('hasta debe ser igual o posterior a desde');
}

export function defaultPeriod(now = new Date()): { desde: string; hasta: string } {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 29);
  return { desde: start.toISOString().slice(0, 10), hasta: today.toISOString().slice(0, 10) };
}