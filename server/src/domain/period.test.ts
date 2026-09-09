import { describe, expect, it } from 'vitest';
import { defaultPeriod, parseIsoDate, validatePeriod } from './period.js';

describe('period contract', () => {
  it('builds an inclusive 30-calendar-day default period', () => {
    expect(defaultPeriod(new Date('2026-09-08T18:00:00Z'))).toEqual({ desde: '2026-08-10', hasta: '2026-09-08' });
  });
  it('rejects impossible and inverted dates', () => {
    expect(() => parseIsoDate('2026-02-30')).toThrow('Fecha inválida');
    expect(() => validatePeriod('2026-09-08', '2026-09-07')).toThrow();
  });
});
