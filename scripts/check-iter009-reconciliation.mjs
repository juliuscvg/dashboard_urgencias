import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidencia/RECONCILIACION_ITER009_2026-09-11.json'), 'utf8'));
const repository = fs.readFileSync(path.join(root, 'server/src/repository/urgencias.repository.ts'), 'utf8');
const service = fs.readFileSync(path.join(root, 'server/src/service/urgencias.service.ts'), 'utf8');
const routes = fs.readFileSync(path.join(root, 'server/src/http/routes.ts'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'client/src/App.tsx'), 'utf8');
const errors = [];

if (evidence.summary?.allExact !== true) errors.push('Reconciliación no marcada exacta');
if (evidence.context?.secretsIncluded !== false || evidence.context?.directIdentifiersIncluded !== false) errors.push('Resguardo incompleto');
const result = evidence.results?.['URG-ATE-01'];
if (!result || result.exact !== true || result.exactResumen !== true || result.exactServicios !== true) errors.push('URG-ATE-01 no exacto');

const r = result?.api?.resumen ?? {};
if (r.mismoMinuto + r.de0a30 + r.de31a60 + r.de61a120 + r.de121a240 + r.mayor240 !== r.evaluables) errors.push('ATE-01 bandas no cubren evaluables');
if (r.eventosConAtencion + r.eventosSinAtencion !== r.universoTotal) errors.push('ATE-01 cobertura no cubre universo');
if (r.mayorIgual24h > r.mayor240 || r.mayorIgual7d > r.mayorIgual24h) errors.push('ATE-01 señales de extremo no anidadas');

if (!routes.includes('/urgencias/attention')) errors.push('Ruta HTTP ausente');
for (const token of ['fetchAttention', 'getAttention']) {
  if (!repository.includes(token) && !service.includes(token)) errors.push(`Proyección ausente: ${token}`);
}
for (const label of ['Bandas de tiempo Ingreso → Atención médica', 'Cobertura del hito registrado']) {
  if (!ui.includes(label)) errors.push(`UI ausente: ${label}`);
}
for (const forbidden of ['tiempo de espera', 'oportunidad asistencial', 'inicio clínico real']) {
  if (ui.toLowerCase().includes(forbidden)) errors.push(`Denominación no permitida en UI: ${forbidden}`);
}

console.log(JSON.stringify({ exact: result?.exact, coberturaPct: r.coberturaPct, evaluables: r.evaluables, errors }, null, 2));
if (errors.length) process.exitCode = 1;
