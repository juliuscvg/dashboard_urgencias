import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidencia/VALIDACION_MOTIVO_URGENCIA_2026-09-10.json'), 'utf8'));
const validationSql = fs.readFileSync(path.join(root, 'scripts/sql/07_validacion_motivo_urgencia.sql'), 'utf8');
const errors = [];
const expected = { '12m': 159822, '24m': 327400, '36m': 484161 };
if (evidence.context?.source !== 'dbo.vUrgencias') errors.push('Fuente inesperada');
if (evidence.context?.universe !== 'U-ING, un evento por id_urgencia') errors.push('Universo inesperado');
if (evidence.context?.freeTextValuesIncluded !== false || evidence.context?.secretsIncluded !== false || evidence.context?.directIdentifiersIncluded !== false) errors.push('Resguardo incompleto');
if (evidence.columnTypes?.length !== 2 || evidence.columnTypes.some((x) => x.tipo !== 'varchar' || x.max_length !== 60 || x.is_nullable !== true)) errors.push('Metadatos inesperados');
if (/\b(INSERT|UPDATE|DELETE|MERGE|TRUNCATE|DROP|ALTER|CREATE)\b/i.test(validationSql)) errors.push('SQL no read-only');
for (const required of ['dbo.vUrgencias', 'S.codigo_area = 2', 'S.serv_activo_sn = 1', 'GROUP BY id_urgencia']) {
  if (!validationSql.includes(required)) errors.push(`SQL sin ${required}`);
}
for (const [id, universe] of Object.entries(expected)) {
  const sets = evidence.windows?.[id]?.recordsets;
  const summary = sets?.[0]?.[0];
  const categories = sets?.[1];
  const text = sets?.[2]?.[0];
  if (Number(summary?.universo) !== universe) errors.push(`${id}: universo`);
  if (Number(summary?.con_categoria) !== universe || Number(summary?.ninguno) !== 0) errors.push(`${id}: cobertura categoría`);
  if (Number(summary?.solo_texto_libre) !== 0 || Number(summary?.conflictos_categoria) !== 0 || Number(summary?.conflictos_texto_libre) !== 0) errors.push(`${id}: relación/conflictos`);
  if (categories?.length !== 15 || categories.reduce((sum, row) => sum + Number(row.eventos), 0) !== universe) errors.push(`${id}: categorías`);
  if (Number(text?.eventos_con_texto) !== Number(summary?.con_texto_libre)) errors.push(`${id}: texto`);
}
const serialized = JSON.stringify(evidence);
if (serialized.includes('DB_PASSWORD') || serialized.includes('DB_USER')) errors.push('Referencia sensible');
console.log(JSON.stringify({ windows: Object.keys(expected).length, categories36m: evidence.windows['36m'].recordsets[1].length, readOnly: true, freeTextValuesIncluded: evidence.context.freeTextValuesIncluded, errors }, null, 2));
if (errors.length) process.exitCode = 1;
