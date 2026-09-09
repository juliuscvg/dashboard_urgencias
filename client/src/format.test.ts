import { describe, expect, it } from 'vitest';
import { defaultDates, metric, percent } from './format';

describe('presentation helpers', () => {
  it('keeps missing values explicit', () => {
    expect(metric(null)).toBe('—');
    expect(percent(null)).toBe('—');
  });
  it('uses an inclusive 30-day default window', () => {
    expect(defaultDates(new Date(2026, 8, 8, 12))).toEqual({ desde: '2026-08-10', hasta: '2026-09-08' });
  });
});
