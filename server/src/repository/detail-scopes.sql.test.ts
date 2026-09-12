import { describe, expect, it } from 'vitest';
import { fetchSummaryBaseSql } from './urgencias.repository.js';
import {
  COMPLETADO, CONFLICTO_NUCLEO, DETAIL_SCOPES, DETAIL_SCOPE_KEYS, detailScopeWhere, HOSPITALIZACION,
  PERMANENCIA_12A24H, PERMANENCIA_24A48H, PERMANENCIA_48A72H, PERMANENCIA_MAYOR_72H, PERMANENCIA_MENOR_12H,
} from './detail-scopes.sql.js';

describe('recortes de detalle', () => {
  it('el universo completo no aplica recorte adicional', () => {
    expect(DETAIL_SCOPES.atenciones.predicate).toBeNull();
    expect(detailScopeWhere('atenciones')).toBe('');
  });

  it('cada recorte acotado produce una cláusula WHERE con su predicado', () => {
    expect(detailScopeWhere('hospitalizacion')).toBe(`WHERE ${HOSPITALIZACION}`);
    expect(detailScopeWhere('permanencia_evaluables')).toBe(`WHERE ${COMPLETADO}`);
    expect(detailScopeWhere('conflicto')).toBe(`WHERE ${CONFLICTO_NUCLEO}`);
  });

  it('cada recorte declara el indicador dueño del que es drill-down', () => {
    for (const key of DETAIL_SCOPE_KEYS) {
      expect(DETAIL_SCOPES[key].indicador).toMatch(/^URG-[A-Z]+-\d{2}$/u);
      expect(DETAIL_SCOPES[key].titulo.length).toBeGreaterThan(0);
    }
  });

  it('no introduce escritura, DDL ni fuentes nuevas', () => {
    for (const key of DETAIL_SCOPE_KEYS) {
      const predicate = DETAIL_SCOPES[key].predicate ?? '';
      expect(predicate).not.toMatch(/\b(INSERT|UPDATE|DELETE|MERGE|TRUNCATE|DROP|ALTER|CREATE|FROM)\b/iu);
    }
  });
});

// Garantía estructural de la reconciliación agregado ↔ detalle: el KPI y su
// detalle no consumen dos copias del predicado, sino la misma constante. Si
// alguien edita una sola de las dos capas, esta prueba falla.
describe('el agregado y su detalle comparten el mismo predicado', () => {
  const summary = fetchSummaryBaseSql();

  it('el resumen usa literalmente las constantes compartidas', () => {
    for (const predicate of [
      COMPLETADO, HOSPITALIZACION, CONFLICTO_NUCLEO,
      PERMANENCIA_MENOR_12H, PERMANENCIA_12A24H, PERMANENCIA_24A48H, PERMANENCIA_48A72H, PERMANENCIA_MAYOR_72H,
    ]) expect(summary).toContain(predicate);
  });

  it('el recorte de cada banda de permanencia es el mismo texto que el conteo del resumen', () => {
    const pairs: Array<[Parameters<typeof detailScopeWhere>[0], string]> = [
      ['permanencia_menor12h', PERMANENCIA_MENOR_12H], ['permanencia_12a24h', PERMANENCIA_12A24H],
      ['permanencia_24a48h', PERMANENCIA_24A48H], ['permanencia_48a72h', PERMANENCIA_48A72H],
      ['permanencia_mayor72h', PERMANENCIA_MAYOR_72H],
    ];
    for (const [scope, predicate] of pairs) {
      expect(detailScopeWhere(scope)).toBe(`WHERE ${predicate}`);
      expect(summary).toContain(`SUM(CASE WHEN ${predicate} THEN CONVERT(bigint, 1) ELSE 0 END)`);
    }
  });

  it('hospitalización comparte numerador entre KPI y detalle', () => {
    expect(summary).toContain(`SUM(CASE WHEN ${HOSPITALIZACION} THEN CONVERT(bigint, 1) ELSE 0 END) AS hospitalizaciones`);
    expect(detailScopeWhere('hospitalizacion')).toBe(`WHERE ${HOSPITALIZACION}`);
  });
});
