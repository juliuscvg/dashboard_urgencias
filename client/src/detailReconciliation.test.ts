import { describe, expect, it } from 'vitest';
import { hasReconciliationMismatch, lastPage, pageRangeLabel } from './detailReconciliation';

describe('reconciliación agregado ↔ detalle (HCG-UX-006)', () => {
  it('no reporta discrepancia cuando el detalle coincide con el agregado', () => {
    expect(hasReconciliationMismatch(354, 354)).toBe(false);
  });

  it('reporta la discrepancia en lugar de ocultarla o corregirla', () => {
    expect(hasReconciliationMismatch(354, 350)).toBe(true);
    expect(hasReconciliationMismatch(0, 4)).toBe(true);
  });

  it('no inventa una discrepancia cuando falta alguno de los dos totales', () => {
    expect(hasReconciliationMismatch(null, 354)).toBe(false);
    expect(hasReconciliationMismatch(undefined, 354)).toBe(false);
    expect(hasReconciliationMismatch(354, null)).toBe(false);
  });
});

describe('paginación del lado servidor (HCG-UX-015)', () => {
  it('describe el rango real de la página cargada', () => {
    expect(pageRangeLabel(1, 25, 354)).toBe('1–25 de 354');
    expect(pageRangeLabel(15, 25, 354)).toBe('351–354 de 354');
    expect(pageRangeLabel(1, 25, 0)).toBe('Sin registros');
  });

  it('calcula la última página sin materializar el universo', () => {
    expect(lastPage(354, 25)).toBe(15);
    expect(lastPage(25, 25)).toBe(1);
    expect(lastPage(0, 25)).toBe(1);
  });
});
