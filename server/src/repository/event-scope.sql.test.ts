import { describe, expect, it } from 'vitest';
import { eventScopeSql, READMISSION_PRIOR_SQL } from './event-scope.sql.js';

describe('canonical SQL scope', () => {
  const scope = eventScopeSql();
  it('uses one canonical event and dynamic active emergency services', () => {
    expect(scope).toContain('GROUP BY id_urgencia');
    expect(scope).toContain('S.codigo_area = 2');
    expect(scope).toContain('S.serv_activo_sn = 1');
    expect(scope).not.toMatch(/centro_siglas\s+IN\s*\(/i);
    expect(scope).toContain('@CodigoServicio IS NULL');
  });
  it('exposes fechaate for URG-ATE-01 without altering identity conflict detection', () => {
    expect(scope).toContain('V.fechaate');
    expect(scope).toContain('MIN(fechaate) END AS fechaate');
    const conflictDefinition = scope.slice(scope.indexOf('THEN 1 ELSE 0 END AS conflicto_nucleo') - 400);
    expect(conflictDefinition).not.toContain('fechaate');
  });
  it('keeps all access read-only', () => {
    expect(`${scope}\n${READMISSION_PRIOR_SQL}`).not.toMatch(/\b(INSERT|UPDATE|DELETE|MERGE|TRUNCATE|DROP|ALTER|CREATE)\b/i);
  });
  it('selects the closest valid prior completed event', () => {
    expect(READMISSION_PRIOR_SQL).toContain('TOP (1)');
    expect(READMISSION_PRIOR_SQL).toContain('P.fechaegr < E.Fechaing');
    expect(READMISSION_PRIOR_SQL).toContain('ORDER BY P.fechaegr DESC');
  });
});
