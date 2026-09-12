import { describe, expect, it } from 'vitest';
import { contextLabel, readDashboardView, readFilters, writeContext } from './dashboardView';

const defaults = { desde: '2026-08-01', hasta: '2026-08-31' };

describe('estado de perspectiva (HCG-VIS-002)', () => {
  it('abre en Operación cuando la URL no trae perspectiva o trae una desconocida', () => {
    expect(readDashboardView('')).toBe('operation');
    expect(readDashboardView('?vista=inexistente')).toBe('operation');
  });

  it('reconstruye la perspectiva declarada en la URL', () => {
    expect(readDashboardView('?vista=population')).toBe('population');
    expect(readDashboardView('?vista=performance')).toBe('performance');
  });

  it('persiste perspectiva y filtros juntos, de modo que un enlace compartido reconstruya el contexto', () => {
    const filters = { desde: '2026-08-01', hasta: '2026-08-31', centro: 'JIM', codigoServicio: 246 };
    const search = writeContext(filters, 'performance');
    expect(readDashboardView(search)).toBe('performance');
    expect(readFilters(search, defaults)).toEqual(filters);
  });

  it('cambiar de perspectiva no descarta los filtros vigentes', () => {
    const filters = { desde: '2026-08-01', hasta: '2026-08-31', centro: 'JIM', codigoServicio: 246 };
    const before = readFilters(writeContext(filters, 'operation'), defaults);
    const after = readFilters(writeContext(filters, 'population'), defaults);
    expect(after).toEqual(before);
  });
});

describe('lectura de filtros', () => {
  it('usa los valores por omisión cuando la URL no los declara', () => {
    expect(readFilters('', defaults)).toEqual({ desde: '2026-08-01', hasta: '2026-08-31', centro: undefined, codigoServicio: undefined });
  });

  it('describe el contexto vigente para que el detalle evidencie que lo conserva', () => {
    expect(contextLabel({ desde: '2026-08-01', hasta: '2026-08-31', centro: 'JIM', codigoServicio: 246 }))
      .toBe('2026-08-01 — 2026-08-31 · JIM · Servicio 246');
    expect(contextLabel(defaults)).toBe('2026-08-01 — 2026-08-31 · Todos los centros · Todos los servicios');
  });
});
