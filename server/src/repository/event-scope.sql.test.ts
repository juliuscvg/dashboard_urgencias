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
  it('keeps all access read-only', () => {
    expect(`${scope}\n${READMISSION_PRIOR_SQL}`).not.toMatch(/\b(INSERT|UPDATE|DELETE|MERGE|TRUNCATE|DROP|ALTER|CREATE)\b/i);
  });
  it('selects the closest valid prior completed event', () => {
    expect(READMISSION_PRIOR_SQL).toContain('TOP (1)');
    expect(READMISSION_PRIOR_SQL).toContain('P.fechaegr < E.Fechaing');
    expect(READMISSION_PRIOR_SQL).toContain('ORDER BY P.fechaegr DESC');
  });
});
