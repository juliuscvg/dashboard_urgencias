import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidencia/VALIDACION_ATENCION_MEDICA_2026-09-11.json'), 'utf8'));
const sqlText = fs.readFileSync(path.join(root, 'scripts/sql/08_validacion_atencion_medica.sql'), 'utf8');
const errors = [];
if (evidence.context?.source !== 'dbo.vUrgencias' || evidence.context?.readOnly !== true) errors.push('Contexto de fuente/read-only inválido');
if (evidence.context?.secretsIncluded !== false || evidence.context?.directIdentifiersIncluded !== false) errors.push('Resguardo incompleto');
if (evidence.metadata?.columna !== 'fechaate' || evidence.metadata?.tipo !== 'datetime' || evidence.metadata?.permite_null !== 'YES') errors.push('Metadato fechaate inesperado');
const expected = { '12m': 159822, '24m': 327400, '36m': 484161 };
for (const [id, universe] of Object.entries(expected)) {
  const window = evidence.windows?.[id];
  const row = window?.resumen;
  if (!row || Number(row.universo) !== universe) errors.push(id + ': universo');
  if (Number(row.con_fechaate) + Number(row.sin_fechaate) !== universe) errors.push(id + ': cobertura no parte U-ING');
  if (Number(row.conflictos_fechaate) !== 0) errors.push(id + ': conflicto fechaate');
  if (Number(row.ing_ate_evaluables) !== Number(row.con_fechaate)) errors.push(id + ': población ingreso-atención');
  if (Number(row.ing_ate_interpretables) + Number(row.ing_ate_invertidos) !== Number(row.ing_ate_evaluables)) errors.push(id + ': partición ingreso-atención');
  if (Number(row.tri_ate_interpretables) + Number(row.tri_ate_invertidos) !== Number(row.tri_ate_evaluables)) errors.push(id + ': partición triage-atención');
  if (Number(row.ate_egr_interpretables) + Number(row.ate_egr_invertidos) !== Number(row.ate_egr_evaluables)) errors.push(id + ': partición atención-egreso');
  if (!Array.isArray(window.centros) || !window.centros.length || !Array.isArray(window.servicios) || !window.servicios.length || !Array.isArray(window.anios) || !window.anios.length) errors.push(id + ': cortes incompletos');
  if (window.fechaateAFechamed?.par !== 'fechaate→fechamed') errors.push(id + ': antecedente AMED ausente');
}
if (Number(evidence.windows['36m'].resumen.ing_ate_invertidos) !== 0) errors.push('Ingreso-atención 36m invertido');
if (Number(evidence.windows['36m'].resumen.tri_ate_invertidos) !== Number(evidence.priorEvidence?.triageAFechaateInvertidos36m)) errors.push('No reconcilia antecedente triage-atención');
if (/\b(INSERT|UPDATE|DELETE|MERGE|DROP|ALTER|CREATE|EXEC(?:UTE)?)\b/i.test(sqlText.replace(/\/\*[\s\S]*?\*\//g, ''))) errors.push('SQL no read-only');
console.log(JSON.stringify({
  windows: Object.keys(expected).length,
  coverage: Object.fromEntries(Object.keys(expected).map((id) => [id, evidence.windows[id].resumen.cobertura_pct])),
  triageAttentionInversions36m: Number(evidence.windows['36m'].resumen.tri_ate_invertidos),
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
